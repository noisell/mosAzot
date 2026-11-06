from abc import ABC, abstractmethod
from typing import Type, Optional, Any

from pydantic import BaseModel
from sqlalchemy import insert, select, update, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import Base

class AbstractRepository(ABC):
    @abstractmethod
    async def add(self, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def add_and_return_id(self, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def get_by_id(self, item_id: int):
        raise NotImplementedError

    @abstractmethod
    async def get_by_user_id(self, user_id: int):
        raise NotImplementedError

    @abstractmethod
    async def update(self, item_id: int, **kwargs):
        raise NotImplementedError

    @abstractmethod
    async def delete(self, item_id: int):
        raise NotImplementedError


class SQLAlchemyRepository[Model: Base, Schema: BaseModel](AbstractRepository, ABC):
    model: Type[Model] = None
    schema: Type[Schema] = None

    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_and_return_id(self, data: dict[str, Any]) -> Optional[int]:
        stmt = insert(self.model).values(**data).returning(self.model.id)
        try:
            res = await self.session.execute(stmt)
            return res.scalar_one()
        except IntegrityError:
            return None

    async def add(self, data: dict[str, Any]) -> bool:
        stmt = insert(self.model).values(**data)
        try:
            await self.session.execute(stmt)
            return True
        except IntegrityError:
            return False


    async def get_by_id(self, item_id: int) -> Schema | None:
        query = select(self.model).where(item_id == self.model.id)
        try:
            query_result = await self.session.execute(query)
        except IntegrityError:
            return None
        result = query_result.scalar_one_or_none()
        return self.schema.model_validate(result, from_attributes=True) if result else None


    async def get_by_user_id(self, user_id: int) -> Schema | None:
        query = select(self.model).where(user_id == self.model.user_id)
        try:
            query_result = await self.session.execute(query)
        except IntegrityError:
            return None
        result = query_result.scalar_one_or_none()
        return self.schema.model_validate(result, from_attributes=True) if result else None



    async def update(self, item_id: int, for_user_id: bool = False, **kwargs: Any) -> bool:
        if for_user_id:
            stmt = update(self.model).where(item_id == self.model.user_id).values(**kwargs)
        else:
            stmt = update(self.model).where(item_id == self.model.id).values(**kwargs)
        try:
            await self.session.execute(stmt)
            return True
        except IntegrityError:
            return False

    async def delete(self, item_id: int) -> bool:
        stmt = delete(self.model).where(item_id == self.model.id)
        try:
            await self.session.execute(stmt)
            return True
        except IntegrityError:
            return False

    async def get_all[S: Type[BaseModel]](self, limit: int | None = None, offset: int = 0, sort: bool = False, schema: Type[S] = None) -> list[S]:
        s: Type[S] = schema if schema is not None else self.schema
        if limit:
            query = select(self.model).offset(offset).limit(limit)
        else:
            query = select(self.model)
        if sort:
            query = query.order_by(self.model.created_at.asc())
        query_result = await self.session.execute(query)
        result = query_result.scalars().all()
        return [s.model_validate(res, from_attributes=True) for res in result]