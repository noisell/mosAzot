from starlette.exceptions import HTTPException
from starlette.status import HTTP_404_NOT_FOUND

from src.products.schemas import ProductSchema, ProductBalloonSchema
from src.unit_of_work import UnitOfWork


class ProductService:

    @classmethod
    async def get_all_products(cls, uow: UnitOfWork, active: bool | None = True) -> list[ProductSchema]:
        async with uow:
            return await uow.product.get_products(active=active)

    @classmethod
    async def get_all_products_balloon(cls, uow: UnitOfWork, active: bool | None = True) -> list[ProductBalloonSchema]:
        async with uow:
            return await uow.product.get_products_balloon(active=active)

