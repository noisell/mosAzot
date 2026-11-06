from fastapi import APIRouter, Query

from src.dependencies import UOWDepends, responses
from src.products.schemas import ProductSchema, ProductBalloonSchema
from src.products.service import ProductService
from fastapi_cache.decorator import cache

router = APIRouter(
    prefix="/product",
    tags=["Products"]
)


@router.get("/others", name="Получение товаров", responses=responses(401))
@cache(expire=3600)
async def get_products(uow: UOWDepends) -> list[ProductSchema]:
    return await ProductService().get_all_products(uow=uow)


@router.get("/balloon", name="Получение закисей азота", responses=responses(401))
@cache(expire=3600)
async def get_products_balloon(uow: UOWDepends) -> list[ProductBalloonSchema]:
    return await ProductService().get_all_products_balloon(uow=uow)