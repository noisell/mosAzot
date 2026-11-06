import datetime

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs, AsyncSession
from sqlalchemy.orm import DeclarativeBase, mapped_column
from typing import Annotated
from sqlalchemy import String, text, BigInteger

from src.config import DATABASE_URL

engine = create_async_engine(
    url=DATABASE_URL,
    pool_size=1000,
    max_overflow=1000,
    pool_recycle=3600,
    pool_pre_ping=True

)
session_factory = async_sessionmaker(engine, expire_on_commit=False)
str16 = Annotated[str, 16]
str32 = Annotated[str, 32]
str64 = Annotated[str, 64]
str256 = Annotated[str, 256]
str512 = Annotated[str, 512]
str1024 = Annotated[str, 1024]


class Base(AsyncAttrs, DeclarativeBase):
    type_annotation_map = {
        str16: String(16),
        str32: String(32),
        str64: String(64),
        str256: String(256),
        str512: String(512),
        str1024: String(1024),
    }


intPK = Annotated[int, mapped_column(BigInteger, primary_key=True, autoincrement=True)]
time = Annotated[datetime.datetime, mapped_column(server_default=text("TIMEZONE('utc', now())"))]
updated_at = Annotated[datetime.datetime, mapped_column(
    server_default=text("TIMEZONE('utc', now())"),
    onupdate=datetime.datetime.utcnow,
)]
