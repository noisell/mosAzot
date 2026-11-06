from fastapi import HTTPException
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from bot.handlers.system import create_admin
from src.admin.models import SystemDataNames
from src.admin.schemas import SimpleAdminScheme, UpdateSystemDataSchema, ChangeProductImageSchema, ChangeProductSchema, \
    StatsSchema, StatsBaseSchema, StatsOtherSchema
from src.auth.service import generate_password
from src.orders.schemas import PromoCodeSchema, PromoCodeCreateSchema, OrderSchema, OrderHistoryAdminSchema
from src.products.schemas import ProductCreateSchema, ProductBaseSchema
from src.schemas import StatusScheme
from src.unit_of_work import UnitOfWork
from src.users.schemas import UserSchema, UserUpdateAdminSchema


class AdminService:

    @classmethod
    async def create_admin(cls, uow: UnitOfWork, data: SimpleAdminScheme) -> StatusScheme:
        async with uow:
            user = await uow.user.get_by_id(item_id=data.user_id)
            if not user:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Пользователь не найден")
            password, salt, hashed_password = generate_password()
            send = await create_admin(user_id=data.user_id, login=data.user_id, password=password)
            if send is not True:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"Пользователь заблокировал бота. {send}")
            await uow.admin.add({"id": data.user_id, "level": data.level, "password": hashed_password, "salt": salt})
            await uow.commit()
        return StatusScheme(success=True)


    @classmethod
    async def get_all_users(cls, uow: UnitOfWork) -> list[UserSchema]:
        async with uow:
            return await uow.user.get_all(schema=UserSchema)


    @classmethod
    async def update_user(cls, uow: UnitOfWork, data: UserUpdateAdminSchema) -> None:
        async with uow:
            await uow.user.update(item_id=data.id, first_name=data.first_name, phone_number=data.phone_number, banned=data.banned)
            await uow.commit()

    @classmethod
    async def update_system_data(cls, uow: UnitOfWork, data: UpdateSystemDataSchema) -> None:
        async with uow:
            await uow.system_data.update_system_data(name=SystemDataNames.price_in_MKAD, value=str(data.price_in_MKAD))
            await uow.system_data.update_system_data(name=SystemDataNames.price_out_MKAD, value=str(data.price_out_MKAD))
            await uow.system_data.update_system_data(name=SystemDataNames.price_up_to_level, value=str(data.price_up_to_level))
            await uow.system_data.update_system_data(name=SystemDataNames.min_order_amount, value=str(data.min_order_amount))
            await uow.commit()

    @classmethod
    async def get_all_products(cls, uow: UnitOfWork) ->  list[ProductBaseSchema]:
        async with uow:
            return await uow.product.get_products_admin()

    @classmethod
    async def change_product_image(cls, uow: UnitOfWork, data: ChangeProductImageSchema) -> None:
        async with uow:
            await uow.product.update(item_id=data.product_id, image=data.image)
            await uow.commit()

    @classmethod
    async def change_product(cls, uow: UnitOfWork, data: ChangeProductSchema) -> None:
        async with uow:
            await uow.product.update(
                item_id=data.product_id,
                name=data.name,
                price=data.price,
                old_price=data.old_price,
                price_trade=data.price_trade,
                size=data.size,
                hit=data.hit,
                active=data.active,
                description=data.description
            )
            await uow.commit()

    @classmethod
    async def create_product(cls, uow: UnitOfWork, data: ProductCreateSchema) -> ProductBaseSchema:
        data_dict = data.model_dump()
        async with uow:
            product_id = await uow.product.add_and_return_id(data_dict)
            await uow.commit()
        return ProductBaseSchema.model_validate({**data_dict, "id": product_id})

    @classmethod
    async def delete_product(cls, uow: UnitOfWork, product_id: int) -> None:
        async with uow:
            await uow.product.delete(product_id)
            await uow.commit()

    @classmethod
    async def get_all_promo_codes(cls, uow: UnitOfWork) -> list[PromoCodeSchema]:
        async with uow:
            return await uow.promo_code.get_all(schema=PromoCodeSchema)

    @classmethod
    async def create_promo_code(cls, uow: UnitOfWork, data: PromoCodeCreateSchema) -> int:
        async with uow:
            promo_code_id = await uow.promo_code.add_and_return_id(data.model_dump())
            await uow.commit()
        return promo_code_id

    @classmethod
    async def delete_promo_code(cls, uow: UnitOfWork, promo_code_id: int) -> None:
        async with uow:
            await uow.promo_code.delete(promo_code_id)
            await uow.commit()

    @classmethod
    async def get_all_orders(cls, uow: UnitOfWork) -> list[OrderHistoryAdminSchema]:
        async with uow:
            return await uow.order.get_all_history()

    @classmethod
    async def get_stats(cls, uow: UnitOfWork) -> StatsSchema:
        async with uow:
            user_stats = await uow.user.get_stats()
            order_stats = await uow.order.get_stats()

        return StatsSchema(
            orders=order_stats,
            users=StatsBaseSchema(today=user_stats.today, mouth=user_stats.mouth, all=user_stats.all),
            users_order=StatsOtherSchema(count=user_stats.count, percent=user_stats.percent),
            users_basket=StatsOtherSchema(count=user_stats.count_basket, percent=user_stats.percent_basket)
        )