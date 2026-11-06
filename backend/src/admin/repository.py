from sqlalchemy import select, or_, delete, update

from src.admin.models import SystemData, SystemDataNames, Admin
from src.admin.schemas import SystemDataSchema, SystemDataCreateSchema, AdminScheme, SimpleTrueAdminScheme
from src.repository import SQLAlchemyRepository


class SystemDataRepository(SQLAlchemyRepository[SystemData, SystemDataSchema]):
    model = SystemData
    schema = SystemDataSchema


    async def get_data_for_orders(self) -> list[SystemDataCreateSchema]:
        query = select(self.model).where(
            or_(
                self.model.name == SystemDataNames.price_in_MKAD.value,
                self.model.name == SystemDataNames.price_out_MKAD.value,
                self.model.name == SystemDataNames.price_up_to_level.value,
                self.model.name == SystemDataNames.min_order_amount.value,
            )
        )
        query_result = await self.session.execute(query)
        data_for_orders = query_result.scalars().all()
        return [SystemDataCreateSchema.model_validate(i, from_attributes=True) for i in data_for_orders]

    async def update_system_data(self, name: SystemDataNames, value: str) -> None:
        stmt = update(self.model).where(self.model.name == name.value).values(value=value)
        await self.session.execute(stmt)


class AdminRepository(SQLAlchemyRepository[Admin, AdminScheme]):
    model = Admin
    scheme = AdminScheme

    async def get_info(self, user_id: int) -> AdminScheme | None:
        query = select(self.model).where(self.model.id == user_id)
        query_data = await self.session.execute(query)
        admin = query_data.scalar()
        return AdminScheme.model_validate(admin, from_attributes=True) if admin else None

    async def delete_admin(self, user_id: int) -> None:
        stmt = delete(self.model).where(self.model.id == user_id)
        await self.session.execute(stmt)