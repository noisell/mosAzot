from datetime import datetime, UTC

from sqlalchemy import update, select, func, insert, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from src.admin.schemas import StatsBaseOtherSchema
from src.repository import SQLAlchemyRepository
from src.users.models import User, Address, Basket
from src.users.schemas import UserSchema, UserFullSchema, AddressSchema, BasketSchema, BasketMoreSchema, \
    ChangeBasketProductValue


class UserRepository(SQLAlchemyRepository[User, UserSchema]):
    model = User
    schema = UserSchema

    async def get_user_full_info(self, user_id: int) -> UserFullSchema | None:
        query = select(self.model).where(self.model.id == user_id).options(selectinload(self.model.addresses))
        query_result = await self.session.execute(query)
        result = query_result.scalar()
        return UserFullSchema.model_validate(result, from_attributes=True) if result else None

    async def get_stats(self) -> StatsBaseOtherSchema:
        query = select(self.model).options(selectinload(self.model.orders), selectinload(self.model.basket_products))
        query_result = await self.session.execute(query)
        users = query_result.scalars().all()

        today = 0
        mouth = 0
        count = 0
        count_basket = 0
        all_users = 0

        date_now = datetime.now(UTC).replace(tzinfo=None, hour=0, minute=0, second=0, microsecond=0)
        date_mouth = date_now.replace(day=1)
        for user in users:
            all_users += 1
            if user.created_at >= date_now:
                today += 1
            if user.created_at >= date_mouth:
                mouth += 1
            if len(user.orders) > 0:
                count += 1
            if len(user.basket_products) > 0:
                count_basket += 1
        return StatsBaseOtherSchema(
            today=today, mouth=mouth, all=all_users, count=count, percent=round((count * 100 / all_users), 2), count_basket=count_basket, percent_basket=round((count_basket * 100 / all_users), 2)
        )

    async def get_all_users_ids(self) -> list[int]:
        query = select(self.model.id).where(self.model.banned == False)
        query_result = await self.session.execute(query)
        users = query_result.scalars().all()
        return [user_id for user_id in users]



class AddressRepository(SQLAlchemyRepository[Address, AddressSchema]):
    model = Address
    schema = AddressSchema


class BasketRepository(SQLAlchemyRepository[Basket, BasketSchema]):
    model = Basket
    schema = BasketSchema

    async def get_basket_products(self, user_id: int) -> list[BasketMoreSchema]:
        query = select(self.model).where(self.model.user_id == user_id).options(selectinload(self.model.product))
        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [BasketMoreSchema.model_validate(i, from_attributes=True) for i in products]

    async def add_basket_product(self, user_id: int, product_id: int, trade: bool | None = None) -> BasketMoreSchema | None:
        stmt = insert(self.model).values(user_id=user_id, product_id=product_id, trade=trade).returning(self.model).options(selectinload(self.model.product))
        try:
            stmt_result = await self.session.execute(stmt)
            result = stmt_result.scalar()
        except IntegrityError:
            return None
        return BasketMoreSchema.model_validate(result, from_attributes=True) if result else None

    async def change_count_product_basket(self, basket_product_id: int, change: ChangeBasketProductValue) -> None:
        stmt = update(self.model).where(self.model.id == basket_product_id).values(count=(self.model.count + 1) if change == ChangeBasketProductValue.plus else (self.model.count - 1))
        await self.session.execute(stmt)

    async def delete_all(self, user_id: int) -> None:
        stmt = delete(self.model).where(self.model.user_id == user_id)
        await self.session.execute(stmt)


