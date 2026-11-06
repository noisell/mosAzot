from typing import Annotated
from fastapi import APIRouter, Depends, Query
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from src.admin.schemas import SystemDataCreateSchema
from src.dependencies import responses, UOWDepends, get_current_user
from src.orders.schemas import OrderCreateSchema, OrderHistorySchema
from src.orders.service import OrderService
from src.schemas import TokenPayload
from src.users.schemas import OrderRepeatSchema
from fastapi_cache.decorator import cache

router = APIRouter(
    prefix="/order",
    tags=["Orders"]
)

@router.get("/promoCode", name="Проверка промокода", responses=responses(401))
async def promo_code_check(uow: UOWDepends, _: Annotated[TokenPayload, Depends(get_current_user)], name: str = Query(max_length=265)):
    return await OrderService().check_promo_code(uow=uow, name=name)


@router.get(path="/dataForOrders", name="Получение полезных данных для заказа", responses=responses(401))
@cache(expire=3600)
async def get_data_for_orders(uow: UOWDepends) -> list[SystemDataCreateSchema]:
    return await OrderService().get_data_for_orders(uow=uow)


@router.post(path="", name="Создание заказа", status_code=HTTP_201_CREATED, responses=responses(401, 400))
async def create_order(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: OrderCreateSchema) -> bool:
    return await OrderService().create_order(uow=uow, user_id=user.user_id, data=data)


@router.get(path="/history", name="История заказов", responses=responses(401))
async def get_history(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> list[OrderHistorySchema]:
    return await OrderService().get_history(uow=uow, user_id=user.user_id)


@router.post(path="/repeat", name="Повтор заказа", status_code=HTTP_204_NO_CONTENT, responses=responses(401, 404))
async def order_repeat(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: list[OrderRepeatSchema]) -> None:
    await OrderService().order_repeat(uow=uow, user_id=user.user_id, data=data)