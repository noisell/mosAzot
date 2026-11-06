from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field

from src.orders.models import PaymentType
from src.products.schemas import ProductForHistorySchema
from src.users.schemas import AddressCreateSchema, UserOrderSchema


class PromoCodeCreateSchema(BaseModel):
    name: str = Field(description="name", title="", max_length=256)
    amount: int = Field(description="amount", title="")  # Сумма скидки
    count: int | None = Field(None, description="count activation", title="")
    date: datetime | None = Field(None, description="date end", title="")


class PromoCodeSchema(PromoCodeCreateSchema):
    id: int = Field(description="id", title="")


class PromoCodeSimpleSchema(BaseModel):
    id: int = Field(description="id", title="")
    name: str = Field(description="name", title="", max_length=256)
    amount: int = Field(description="amount", title="")


class CheckPromoCodeResponse(BaseModel):
    success: bool = Field(description="Можно ли активировать промокод?", title="")
    data: PromoCodeSimpleSchema | str = Field(description="Данные о промокоде, если его можно активировать, если нет, то описание почему нельзя", title="")


class DeliveryTypeEnum(Enum):
    in_MKAD = "in_MKAD"
    out_MKAD = "out_MKAD"

class OrderCreateSchema(BaseModel):
    comment: str = Field(description="Комментарий к заказу", title="", max_length=512)
    up_to_level: bool = Field(description="Необходим ли подъем на этаж?", title="")
    delivery_type: DeliveryTypeEnum = Field(description="Тип доставки", title="")
    promo_code: str = Field(description="Промокод", title="")
    first_name: str = Field(description="Имя заказчика", title="", max_length=64)
    phone_number: int = Field(description="Номер телефона 10 символов", title="")
    address: AddressCreateSchema | None = Field(description="Адрес доставки", title="")
    products: list[int] | None = Field(None, description="Id товаров для заказа", title="")
    trade: bool | None = Field(None, description="Trade balloon", title="")


class OrderSchema(BaseModel):
    id: int = Field(description="id", title="")
    user_id: int = Field(description="User Id", title="")
    comment: str = Field(description="Comment", title="", max_length=512)
    created_at: datetime = Field(description="Created at", title="")


class AmountOrderCreateSchema(BaseModel):
    order_id: int = Field(description="Order id", title="")
    amount: float = Field(description="Сумма заказа", title="")
    discount_amount: float = Field(description="Общая сумма скидки", title="")
    delivery_price: float = Field(description="Общая сумма доставки", title="")
    payment_type: PaymentType = Field(PaymentType.courier, description="Тип оплаты", title="")  # Тип оплаты

class AmountOrderSchema(AmountOrderCreateSchema):
    id: int = Field(description="id", title="")


class DeliveryCreateSchema(BaseModel):
    order_id: int = Field(description="Order id", title="")
    address: str = Field(description="Адрес в формате JSON", title="")
    up_to_level: bool = Field(description="Нужен ли подъем на этаж?", title="")
    delivery_price: float = Field(description="Общая сумма доставки", title="")
    description: str | None = Field(description="Дополнительные данные", title="", max_length=256)


class DeliverySchema(DeliveryCreateSchema):
    id: int = Field(description="id", title="")


class OrderProductCreateSchema(BaseModel):
    order_id: int = Field(description="Order id", title="")
    product_id: int = Field(description="Product id", title="")
    price: float = Field(description="Цена единицы товара", title="")
    count: int = Field(description="Кол-во товара", title="")

class OrderProductSchema(OrderProductCreateSchema):
    id: int = Field(description="id", title="")


class ProductsHistorySchema(BaseModel):
    price: float = Field(description="Price of the product", title="")
    trade: bool | None = Field(description="Был обмен", title="")
    count: int = Field(description="Count of products", title="")
    product: ProductForHistorySchema = Field(description="Данные товара", title="")


class OrderHistorySchema(BaseModel):
    id: int = Field(description="Номер заказа", title="")
    amount: float | int = Field(description="Сумма заказа", title="")
    address: str = Field(description="Адрес заказа", title="")
    created_at: datetime = Field(description="Created at", title="")
    products: list[ProductsHistorySchema] = Field(description="Товары в заказе", title="")


class OrderDeliverySchema(BaseModel):
    address: str
    up_to_level: bool
    description: str


class OrderAmountSchema(BaseModel):
    amount: float
    discount_amount: float
    delivery_price: float


class OrderHistoryAdminSchema(BaseModel):
    id: int = Field(description="Номер заказа", title="")
    comment: str = Field(description="Комментарий", title="")
    created_at: datetime = Field(description="Created at", title="")
    user: UserOrderSchema = Field(description="Информация о пользователе", title="")
    delivery: OrderDeliverySchema = Field(description="Информация о доставке", title="")
    amount: OrderAmountSchema = Field(description="Информация о суммах", title="")
    products: list[ProductsHistorySchema] = Field(description="Товары в заказе", title="")

