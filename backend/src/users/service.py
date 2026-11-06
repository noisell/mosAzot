from fastapi import HTTPException

from src.schemas import SuccessResponse, OnlyIdInBody
from src.unit_of_work import UnitOfWork
from src.users.schemas import UserCreateSchema, UserFullSchema, AddressCreateSchema, AddressSchema, \
    AddressDeleteResponseSchema, UserUpdateSchema, BasketMoreSchema, BasketCreateSchema, ChangeBasketProductSchema


# noinspection PyArgumentList
class  UserService:

    @classmethod
    async def create_user(cls, uow: UnitOfWork, data: UserCreateSchema) -> SuccessResponse:
        async with uow:
            await uow.user.add(data.model_dump())
            await uow.commit()
            return SuccessResponse(success=True)


    @classmethod
    async def get_user(cls, uow: UnitOfWork, user_id: int) -> UserFullSchema:
        async with uow:
            result = await uow.user.get_user_full_info(user_id)
        if result is None:
            raise HTTPException(status_code=404, detail="User not found")
        return result

    @classmethod
    async def update_user(cls, uow: UnitOfWork, user_id: int, data: UserUpdateSchema) -> None:
        async with uow:
            await uow.user.update(item_id=user_id, for_user_id=False, **data.model_dump())
            await uow.commit()

    @classmethod
    async def create_address(cls, uow: UnitOfWork, data: AddressCreateSchema, user_id: int) -> AddressSchema:
        data_dict = data.model_dump()
        data_dict["user_id"] = user_id
        async with uow:
            address_id = await uow.address.add_and_return_id(data_dict)
            if address_id is None:
                raise HTTPException(status_code=400, detail="Адрес не создан, произошла ошибка.")
            await uow.user.update(item_id=user_id, selected_address_id=address_id)
            await uow.commit()
        data_dict["id"] = address_id
        return AddressSchema.model_validate(data_dict)

    @classmethod
    async def change_default_address(cls, uow: UnitOfWork, user_id: int, address_id: int) -> None:
        async with uow:
            await uow.user.update(item_id=user_id, selected_address_id=address_id)
            await uow.commit()

    @classmethod
    async def change_full_address(cls, uow: UnitOfWork, data: AddressSchema) -> None:
        data_dict = data.model_dump()
        del data_dict["id"]
        async with uow:
            await uow.address.update(item_id=data.id, **data_dict)
            await uow.commit()

    @classmethod
    async def delete_address(cls, uow: UnitOfWork, user_id: int, address_id: int) -> AddressDeleteResponseSchema:
        async with uow:
            await uow.address.delete(item_id=address_id)
            user_info = await uow.user.get_user_full_info(user_id=user_id)
            selected_address_id = user_info.selected_address_id
            if selected_address_id == address_id:
                if len(user_info.addresses) > 0:
                    new_selected_address_id = user_info.addresses[0].id
                else:
                    new_selected_address_id = None
            else:
                new_selected_address_id = selected_address_id
            await uow.user.update(item_id=user_id, selected_address_id=new_selected_address_id)
            await uow.commit()
        return AddressDeleteResponseSchema(new_selected_address_id=new_selected_address_id)

    @classmethod
    async def get_basket_products(cls, uow: UnitOfWork, user_id: int) -> list[BasketMoreSchema]:
        async with uow:
            return await uow.basket.get_basket_products(user_id=user_id)

    @classmethod
    async def add_basket_product(cls, uow: UnitOfWork, user_id: int, data: BasketCreateSchema) -> BasketMoreSchema:
        async with uow:
            result = await uow.basket.add_basket_product(user_id=user_id, product_id=data.product_id, trade=data.trade)
            await uow.commit()
        if result is None:
            raise HTTPException(status_code=404, detail="Basket product not found")
        return result

    @classmethod
    async def change_count_product_basket(cls, uow: UnitOfWork, data: ChangeBasketProductSchema) -> None:
        async with uow:
            await uow.basket.change_count_product_basket(basket_product_id=data.id, change=data.change)
            await uow.commit()

    @classmethod
    async def delete_basket_product(cls, uow: UnitOfWork, basket_product_id: int) -> None:
        async with uow:
            deleted = await uow.basket.delete(item_id=basket_product_id)
            await uow.commit()
        if deleted:
            return
        raise HTTPException(status_code=404, detail="Basket product not found")

    @classmethod
    async def get_all_users_ids(cls) -> list[int]:
        async with UnitOfWork() as uow:
            return await uow.user.get_all_users_ids()
