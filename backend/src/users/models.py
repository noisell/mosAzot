from typing import Optional

from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base, time, intPK, str64, str512, str32, str256


class User(Base):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=False)
    username: Mapped[str256 | None]
    first_name: Mapped[str64]  # Имя
    phone_number: Mapped[int | None] = mapped_column(BigInteger, server_default=None)  # Номер телефона
    avatar_url: Mapped[str512 | None]  # Ссылка на аватар
    banned: Mapped[bool] = mapped_column(server_default="false")
    selected_address_id: Mapped[int | None] = mapped_column(BigInteger, server_default=None)
    created_at: Mapped[time]  # Дата создания аккаунта ##

    basket_products: Mapped[list["Basket"]] = relationship(back_populates="user")
    orders: Mapped[list["Order"]] = relationship(back_populates="user")
    addresses: Mapped[list["Address"]] = relationship(back_populates="user")


class Address(Base):
    __tablename__ = 'address'
    id: Mapped[intPK]
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(User.id, ondelete="CASCADE"))
    name: Mapped[str32 | None] = mapped_column(server_default=None)  # Название адреса
    address: Mapped[str256 | None] = mapped_column(server_default=None)  # Адрес
    entrance: Mapped[str256 | None] = mapped_column(server_default=None)  # Подъезд
    flat: Mapped[str256 | None] = mapped_column(server_default=None)  # Квартира или офис
    level: Mapped[str256 | None] = mapped_column(server_default=None)  # Этаж
    door_phone: Mapped[str256 | None] = mapped_column(server_default=None)  # Домофон

    user: Mapped["User"] = relationship(back_populates="addresses")


class Basket(Base):
    __tablename__ = 'basket'
    id: Mapped[intPK]
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(User.id, ondelete="CASCADE"))
    product_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("product.id", ondelete="CASCADE"))  # Товар
    count: Mapped[int] = mapped_column(server_default="1")  # Количество
    trade: Mapped[bool | None] = mapped_column(server_default=None)

    user: Mapped["User"] = relationship(back_populates="basket_products")
    product: Mapped["Product"] = relationship(back_populates="basket_products")


