from datetime import datetime
from enum import Enum

from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base, intPK, str512, time, str256


class PaymentType(Enum):
    courier = "courier"  # Оплата курьеру
    online = "online"  # Оплата на сайте


class Order(Base):
    __tablename__ = 'order'
    id: Mapped[intPK]
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("user.id", ondelete="CASCADE"))
    comment: Mapped[str512]  # Комментарий к заказу
    created_at: Mapped[time]  # Дата создания

    user: Mapped["User"] = relationship(back_populates="orders")
    products: Mapped[list["OrderProduct"]] = relationship(back_populates="order")
    delivery: Mapped["Delivery"] = relationship(back_populates="order")
    amount: Mapped["AmountOrder"] = relationship(back_populates="order")


class AmountOrder(Base):
    __tablename__ = 'amount_order'
    id: Mapped[intPK]
    order_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Order.id, ondelete="CASCADE"))
    amount: Mapped[float]  # Общая сумма заказа
    discount_amount: Mapped[float]  # Общая сумма скидки
    delivery_price: Mapped[float]  # Стоимость доставки (Дублирование для удобства выборки)
    payment_type: Mapped[PaymentType] = mapped_column(server_default="courier")  # Тип оплаты

    order: Mapped["Order"] = relationship(back_populates="amount")


class Delivery(Base):
    __tablename__ = 'delivery'
    id: Mapped[intPK]
    order_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Order.id, ondelete="CASCADE"))
    address: Mapped[str]  # Адрес в формате JSON
    up_to_level: Mapped[bool]  # Нужен ли подъем на этаж?
    delivery_price: Mapped[float]  # Стоимость доставки (Дублируется в AmountOrder)
    description: Mapped[str256 | None] = mapped_column(server_default=None)  # Опционально дополнительные данные

    order: Mapped["Order"] = relationship(back_populates="delivery")


class OrderProduct(Base):
    __tablename__ = 'order_product'
    id: Mapped[intPK]
    order_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Order.id, ondelete="CASCADE"))  # Заказ
    product_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("product.id", ondelete="CASCADE"))  # Товар
    price: Mapped[float]  # Цена единицы товара
    trade: Mapped[bool | None] = mapped_column(server_default=None)  # Цена обмена
    count: Mapped[int]  # Количество

    order: Mapped["Order"] = relationship(back_populates="products")
    product: Mapped["Product"] = relationship(back_populates="order_products")


class PromoCode(Base):
    __tablename__ = 'promo_code'
    id: Mapped[intPK]
    name: Mapped[str256]  # Промокод
    amount: Mapped[int]  # Сумма скидки
    count: Mapped[int | None] = mapped_column(BigInteger, server_default=None)
    date: Mapped[datetime | None] = mapped_column(server_default=None)
