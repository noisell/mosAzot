from pydantic import BaseModel, Field

from src.admin.models import SystemDataNames

class SystemDataCreateSchema(BaseModel):
    name: SystemDataNames = Field(description="System data name", title="")
    value: str = Field(description="System data value", title="")

class SystemDataSchema(SystemDataCreateSchema):
    id: int = Field(description="System data id", title="")


class AdminScheme(BaseModel):
    id: int = Field(description="id", title="")
    level: int = Field(description="Уровень", title="")
    password: str = Field(description="Пароль", title="")
    salt: str = Field(description="Соль", title="")


class SimpleAdminScheme(BaseModel):
    user_id: int = Field(description="id в Telegram", title="")
    level: int = Field(description="Уровень. Число от 1 до 3. 1 - оператор, 2 - старший, 3 - владелец.", title="")


class SimpleTrueAdminScheme(BaseModel):
    id: int = Field(description="id в Telegram", title="")
    level: int = Field(description="Уровень. Число от 1 до 3. 1 - оператор, 2 - старший, 3 - владелец.", title="")


class UpdateSystemDataSchema(BaseModel):
    price_in_MKAD: int = Field(description="price_in_MKAD", title="")
    price_out_MKAD: int = Field(description="price_out_MKAD", title="")
    price_up_to_level: int = Field(description="price_up_to_level", title="")
    min_order_amount: int = Field(description="min_order_amount", title="")


class ChangeProductImageSchema(BaseModel):
    product_id: int = Field(description="product id", title="")
    image: str = Field(description="New image path", title="", max_length=512)


class ChangeProductSchema(BaseModel):
    product_id: int
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    price_trade: float | None = Field(description="Price trade of the product", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    hit: bool = Field(description="Hit of the product", title="")
    active: bool = Field(description="Active of the product", title="")
    description: str = Field(description="Description of the product", title="")


class StatsBaseSchema(BaseModel):
    today: int | float = Field(description="today", title="")
    mouth: int | float = Field(description="mouth", title="")
    all: int | float = Field(description="all", title="")


class StatsOtherSchema(BaseModel):
    count: int = Field(description="count", title="")
    percent: int | float = Field(description="percent", title="")


class StatsBaseOtherSchema(StatsBaseSchema):
    count: int = Field(description="count", title="")
    percent: int | float = Field(description="percent", title="")
    count_basket: int = Field(description="count", title="")
    percent_basket: int | float = Field(description="percent", title="")


class StatsSchema(BaseModel):
    orders: StatsBaseSchema
    users: StatsBaseSchema
    users_order: StatsOtherSchema
    users_basket: StatsOtherSchema