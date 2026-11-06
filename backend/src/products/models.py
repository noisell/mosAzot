from enum import Enum

from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base, intPK, str512, str32, str256
from src.orders.models import OrderProduct
from src.users.models import Basket


class Product(Base):
    __tablename__ = 'product'
    id: Mapped[intPK]
    name: Mapped[str256]  # Название товара
    price: Mapped[float]  # Цена товара
    old_price: Mapped[float | None] = mapped_column(server_default=None)  # Стара цена товара для скидки
    price_trade: Mapped[float | None] = mapped_column(server_default=None)  # Цена обмена
    size: Mapped[str32]  # Объем или любая другая единица измерения
    image: Mapped[str512]  # Картинка
    hit: Mapped[bool] = mapped_column(server_default="false")  # Имеет ли плашку "ХИТ"
    balloon: Mapped[bool] = mapped_column(server_default="false")  # Это закись азота?
    active: Mapped[bool] = mapped_column(server_default="true")  # Активен?
    description: Mapped[str512]

    basket_products: Mapped[list["Basket"]] = relationship(back_populates="product")
    order_products: Mapped[list["OrderProduct"]] = relationship(back_populates="product")

