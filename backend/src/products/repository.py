from sqlalchemy import update, select, func, delete
from sqlalchemy.orm import selectinload

from src.repository import SQLAlchemyRepository
from src.products.models import Product
from src.products.schemas import ProductBaseSchema, ProductSchema, ProductBalloonSchema


class ProductRepository(SQLAlchemyRepository[Product, ProductBaseSchema]):
    model = Product
    schema = ProductBaseSchema

    async def get_products(self, active: bool | None = True) -> list[ProductSchema]:
        query = select(self.model).where(self.model.balloon == False)
        if active is True:
            query = query.where(self.model.active == True)
        elif active is False:
            query = query.where(self.model.active == False)
        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [ProductSchema.model_validate(product, from_attributes=True) for product in products]

    async def get_products_admin(self) -> list[ProductBaseSchema]:
        query = select(self.model)
        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [ProductBaseSchema.model_validate(product, from_attributes=True) for product in products]

    async def get_products_balloon(self, active: bool | None = True) -> list[ProductBalloonSchema]:
        query = select(self.model).where(self.model.balloon == True)
        if active is True:
            query = query.where(self.model.active == True)
        elif active is False:
            query = query.where(self.model.active == False)
        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [ProductBalloonSchema.model_validate(product, from_attributes=True) for product in products]

    async def get_products_by_ids(self, products: list[int]) -> list[ProductBaseSchema]:
        query = select(self.model).where(self.model.id.in_(products))
        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [ProductBaseSchema.model_validate(i, from_attributes=True) for i in products]