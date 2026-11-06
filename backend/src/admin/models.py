from enum import Enum

from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base, intPK

class SystemDataNames(Enum):
    price_in_MKAD = "price_in_MKAD"
    price_out_MKAD = "price_out_MKAD"
    price_up_to_level = "price_up_to_level"
    min_order_amount = "min_order_amount"


class SystemData(Base):
    __tablename__ = 'system_data'
    id: Mapped[intPK]
    name: Mapped[SystemDataNames]
    value: Mapped[str]


class Admin(Base):
    __tablename__ = 'admin'
    id: Mapped[int] = mapped_column(BigInteger, ForeignKey('user.id'), primary_key=True, autoincrement=False)
    level: Mapped[int] = mapped_column(server_default='1')
    password: Mapped[str]
    salt: Mapped[str]
