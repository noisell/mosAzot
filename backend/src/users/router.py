from typing import Annotated

from fastapi import APIRouter, Depends, Body
from starlette.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT

from src.dependencies import responses, UOWDepends, get_current_user
from src.schemas import SuccessResponse, TokenPayload, OnlyIdInBody
from src.users.schemas import UserSchema, UserCreateSchema, UserFullSchema, AddressCreateSchema, AddressSchema, \
    AddressDeleteResponseSchema, UserUpdateSchema, BasketMoreSchema, BasketCreateSchema, ChangeBasketProductSchema
from src.users.service import UserService

router = APIRouter(
    prefix="/user",
    tags=["Users"]
)

@router.post(path="", name="Create User", status_code=HTTP_201_CREATED, responses=responses({400: "Such a user already exists"}))
async def create_user(uow: UOWDepends, data: UserCreateSchema) -> SuccessResponse:
    return await UserService().create_user(uow=uow, data=data)


@router.get(path="", name="Информация о пользователе", responses=responses({404: "User not found"}, 401))
async def get_user(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> UserFullSchema:
    return await UserService().get_user(uow=uow, user_id=user.user_id)


@router.patch(path="", name="Обновление данных о пользователе", status_code=HTTP_204_NO_CONTENT, responses=responses(401))
async def update_user(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: UserUpdateSchema) -> None:
    await UserService().update_user(uow=uow, user_id=user.user_id, data=data)


@router.post(path="/address", name="Добавление адреса", status_code=HTTP_201_CREATED, responses=responses(401))
async def create_address(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: AddressCreateSchema) -> AddressSchema:
    return await UserService().create_address(uow=uow, data=data, user_id=user.user_id)

@router.patch(path="/address/default", name="Изменение адреса по умолчанию", status_code=HTTP_204_NO_CONTENT, responses=responses(401))
async def change_default_address(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: OnlyIdInBody) -> None:
    await UserService().change_default_address(uow=uow, user_id=user.user_id, address_id=data.id)


@router.put(path="/address", name="Обновление всего адреса", status_code=HTTP_204_NO_CONTENT, responses=responses(401))
async def change_full_address(uow: UOWDepends, _: Annotated[TokenPayload, Depends(get_current_user)], data: AddressSchema) -> None:
    await UserService().change_full_address(uow=uow, data=data)


@router.post(path="/address/delete", name="Удаление адреса", responses=responses(401))
async def delete_address(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: OnlyIdInBody) -> AddressDeleteResponseSchema:
    return await UserService().delete_address(uow=uow, user_id=user.user_id, address_id=data.id)


@router.get(path="/basket", name="Получение продуктов из корзины", responses=responses(401))
async def get_basket_products(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)]) -> list[BasketMoreSchema]:
    return await UserService().get_basket_products(uow=uow, user_id=user.user_id)


@router.post(path="/basket", name="Добавление продукта в корзину", responses=responses(401, 404))
async def add_basket_product(uow: UOWDepends, user: Annotated[TokenPayload, Depends(get_current_user)], data: BasketCreateSchema = Body()) -> BasketMoreSchema:
    return await UserService().add_basket_product(uow=uow, user_id=user.user_id, data=data)


@router.patch(path="/basket", name="Изменение кол-ва товара", status_code=HTTP_204_NO_CONTENT, responses=responses(401))
async def change_basket_product_count(uow: UOWDepends, _: Annotated[TokenPayload, Depends(get_current_user)], data: ChangeBasketProductSchema) -> None:
    await UserService().change_count_product_basket(uow=uow, data=data)


@router.delete(path="/basket", name="Удаление товара из корзины", status_code=HTTP_204_NO_CONTENT, responses=responses(401, 404))
async def delete_basket_product(uow: UOWDepends, _: Annotated[TokenPayload, Depends(get_current_user)], basket_product_id: int) -> None:
    await UserService().delete_basket_product(uow=uow, basket_product_id=basket_product_id)