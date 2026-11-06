from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from src.products.schemas import ProductForBasketSchema


class UserCreateSchema(BaseModel):
    id: int = Field(description="User Telegram ID", title="")
    username: str | None = Field(description="Username", title="", max_length=256)
    first_name: str = Field(description="User First Name", title="", max_length=64)
    avatar_url: str | None = Field(description="Avatar URL", title="", max_length=512)


class UserSchema(UserCreateSchema):
    phone_number: int | None = Field(description="Phone Number", title="")
    banned: bool = Field(description="Banned User", title="", default=False)
    selected_address_id: int | None = Field(description="Selected address ID", title="")
    created_at: datetime = Field(description="Creation Date", title="")


class UserOrderSchema(UserCreateSchema):
    phone_number: int | None = Field(description="Phone Number", title="")


class UserUpdateSchema(BaseModel):
    first_name: str = Field(description="User First Name", title="", max_length=64)
    phone_number: int | None = Field(description="Phone Number", title="")


class UserUpdateAdminSchema(UserUpdateSchema):
    id: int = Field(description="User Telegram ID", title="")
    banned: bool = Field(description="Banned User", title="", default=False)


class AddressCreateSchema(BaseModel):
    name: str = Field(description="Name", title="", max_length=32)
    address: str = Field(description="Address", title="", max_length=256)
    entrance: str | None = Field(description="Entrance", title="", max_length=256)
    flat: str | None = Field(description="Flat", title="", max_length=256)
    level: str | None = Field(description="Level", title="", max_length=256)
    door_phone: str | None = Field(description="Door Phone", title="", max_length=256)

class AddressSchema(AddressCreateSchema):
    id: int = Field(description="Address ID", title="")


class UserFullSchema(UserSchema):
    addresses: list[AddressSchema] = Field(description="Addresses", title="")


class AddressDeleteResponseSchema(BaseModel):
    new_selected_address_id: int | None = Field(description="Новый адрес по умолчанию", title="")


class BasketCreateSchema(BaseModel):
    product_id: int = Field(description="Product ID", title="")
    trade: bool | None = Field(description="Trade Balloon", title="")


class OrderRepeatSchema(BaseModel):
    product_id: int = Field(description="Product ID", title="")
    count: int = Field(description="Count", title="")


class BasketSchema(BasketCreateSchema):
    id: int = Field(description="Product Basket ID", title="")
    user_id: int = Field(description="User Telegram ID", title="")
    count: int = Field(description="Count Products", title="")
    trade: bool | None = Field(description="Trade Balloon", title="")


class BasketMoreSchema(BaseModel):
    id: int = Field(description="Product Basket ID", title="")
    count: int = Field(description="Count Products", title="")
    product: ProductForBasketSchema = Field(description="Product Data", title="")
    trade: bool | None = Field(description="Trade Balloon", title="")


class ChangeBasketProductValue(Enum):
    plus = "plus"
    minus = "minus"

class ChangeBasketProductSchema(BaseModel):
    change: ChangeBasketProductValue = Field(description="Прибавить или убавить кол-во", title="")
    id: int = Field(description="Product Basket ID", title="")
