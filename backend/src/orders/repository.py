from datetime import datetime, UTC

from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
import json

from src.admin.schemas import StatsBaseSchema
from src.orders.models import PromoCode, Order, AmountOrder, Delivery, OrderProduct
from src.orders.schemas import PromoCodeSchema, OrderSchema, AmountOrderSchema, DeliverySchema, OrderProductSchema, \
    OrderHistorySchema, ProductsHistorySchema, OrderHistoryAdminSchema, OrderAmountSchema, OrderDeliverySchema
from src.products.models import Product
from src.repository import SQLAlchemyRepository
from src.users.schemas import UserCreateSchema, UserOrderSchema


class PromoCodeRepository(SQLAlchemyRepository[PromoCode, PromoCodeSchema]):
    model = PromoCode
    schema = PromoCodeSchema

    async def check_promo_code(self, name: str | None = None, promo_code_id: int | None = None) -> PromoCodeSchema | None:
        if promo_code_id is None:
            query = select(self.model).where(self.model.name == name.upper())
        else:
            query = select(self.model).where(self.model.id == promo_code_id)
        query_result = await self.session.execute(query)
        promo_code = query_result.scalar_one_or_none()
        return PromoCodeSchema.model_validate(promo_code, from_attributes=True) if promo_code else None

    async def change_count_activation(self, promo_code_id: int) -> None:
        promo_code = await self.check_promo_code(promo_code_id=promo_code_id)
        if promo_code is None or promo_code.count is None or promo_code.count < 1:
            return
        stmt = update(self.model).where(self.model.id == promo_code_id).values(count=(self.model.count - 1))
        await self.session.execute(stmt)



class OrderRepository(SQLAlchemyRepository[Order, OrderSchema]):
    model = Order
    schema = OrderSchema

    async def get_history(self, user_id: int) -> list[OrderHistorySchema]:
        query = select(self.model).where(self.model.user_id == user_id).options(
            selectinload(self.model.amount),
            selectinload(self.model.delivery),
            selectinload(self.model.products).options(
                selectinload(OrderProduct.product)
            ),
        ).order_by(self.model.created_at.desc())
        query_result = await self.session.execute(query)
        orders = query_result.scalars().all()
        result: list[OrderHistorySchema] = []
        for order in orders:
            result.append(OrderHistorySchema(
                id=order.id,
                amount=order.amount.amount,
                address=json.loads(order.delivery.address).get('name'),
                created_at=order.created_at,
                products=[ProductsHistorySchema.model_validate(product, from_attributes=True) for product in order.products]
            ))
        return result

    async def get_all_history(self) -> list[OrderHistoryAdminSchema]:
        query = select(self.model).options(
            selectinload(self.model.amount),
            selectinload(self.model.delivery),
            selectinload(self.model.user),
            selectinload(self.model.products).options(
                selectinload(OrderProduct.product)
            ),
        ).order_by(self.model.created_at.desc())
        query_result = await self.session.execute(query)
        orders = query_result.scalars().all()
        result: list[OrderHistoryAdminSchema] = []
        for order in orders:
            result.append(OrderHistoryAdminSchema(
                id=order.id,
                user=UserOrderSchema.model_validate(order.user, from_attributes=True),
                comment=order.comment,
                amount=OrderAmountSchema.model_validate(order.amount, from_attributes=True),
                delivery=OrderDeliverySchema(
                    address=json.loads(order.delivery.address).get('address'),
                    up_to_level=order.delivery.up_to_level,
                    description=order.delivery.description
                ),
                created_at=order.created_at,
                products=[ProductsHistorySchema.model_validate(product, from_attributes=True) for product in order.products]
            ))
        return result

    async def get_stats(self) -> StatsBaseSchema:
        query = select(self.model)
        query_result = await self.session.execute(query)
        orders = query_result.scalars().all()

        today = 0
        mouth = 0
        all_orders = 0

        date_now = datetime.now(UTC).replace(tzinfo=None, hour=0, minute=0, second=0, microsecond=0)
        date_mouth = date_now.replace(day=1)

        for order in orders:
            all_orders += 1
            if order.created_at >= date_now:
                today += 1
            if order.created_at >= date_mouth:
                mouth += 1
        return StatsBaseSchema(today=today, mouth=mouth, all=all_orders)


class AmountOrderRepository(SQLAlchemyRepository[AmountOrder, AmountOrderSchema]):
    model = AmountOrder
    schema = AmountOrderSchema


class DeliveryRepository(SQLAlchemyRepository[Delivery, DeliverySchema]):
    model = Delivery
    schema = DeliverySchema


class OrderProductRepository(SQLAlchemyRepository[OrderProduct, OrderProductSchema]):
    model = OrderProduct
    schema = OrderProductSchema