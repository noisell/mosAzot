from datetime import datetime, UTC
import json

from starlette.exceptions import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from bot.handlers.system import send_order_in_chat
from src.admin.models import SystemDataNames
from src.admin.schemas import SystemDataCreateSchema
from src.orders.models import PaymentType
from src.orders.schemas import CheckPromoCodeResponse, PromoCodeSimpleSchema, OrderCreateSchema, DeliveryTypeEnum, \
    OrderHistorySchema
from src.unit_of_work import UnitOfWork
from src.users.schemas import OrderRepeatSchema


class OrderService:

    @classmethod
    async def check_promo_code(cls, uow: UnitOfWork, name: str) -> CheckPromoCodeResponse:
        async with uow:
            promo_code_data = await uow.promo_code.check_promo_code(name)
            if not promo_code_data:
                return CheckPromoCodeResponse(success=False, data="Промокод не найден")
            if promo_code_data.count is None and promo_code_data.date is None:
                return CheckPromoCodeResponse(success=False, data="Создание промокода не закончено")
            data_now = datetime.now(UTC).replace(tzinfo=None)
            if promo_code_data.count is not None:
                if promo_code_data.count > 0:
                    if promo_code_data.date is not None:
                        if data_now < promo_code_data.date:
                            return CheckPromoCodeResponse(
                                success=True, data=PromoCodeSimpleSchema(
                                    id=promo_code_data.id, name=promo_code_data.name, amount=promo_code_data.amount
                                )
                            )
                        else:
                            return CheckPromoCodeResponse(success=False, data="Срок действия промокода истек")
                    else:
                        return CheckPromoCodeResponse(
                            success=True, data=PromoCodeSimpleSchema(
                                id=promo_code_data.id, name=promo_code_data.name, amount=promo_code_data.amount
                            )
                        )
                else:
                    return CheckPromoCodeResponse(success=False, data="Промокод закончился")
            else:
                if data_now < promo_code_data.date:
                    return CheckPromoCodeResponse(
                        success=True, data=PromoCodeSimpleSchema(
                            id=promo_code_data.id, name=promo_code_data.name, amount=promo_code_data.amount
                        )
                    )
                else:
                    return CheckPromoCodeResponse(success=False, data="Срок действия промокода истек")

    @classmethod
    async def get_data_for_orders(cls, uow: UnitOfWork) -> list[SystemDataCreateSchema]:
        async with uow:
            return await uow.system_data.get_data_for_orders()


    @classmethod
    async def create_order(cls, uow: UnitOfWork, user_id: int, data: OrderCreateSchema) -> bool:
        amount = 0
        delivery_price = 0
        discount_amount = 0
        promo_code_id = 0
        async with uow:
            if data.promo_code:
                promo_code_data = await uow.promo_code.check_promo_code(name=data.promo_code)
                if not promo_code_data:
                    raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Промокод не найден")
                if promo_code_data.count is None and promo_code_data.date is None:
                    raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Создание промокода не закончено")
                data_now = datetime.now(UTC).replace(tzinfo=None)
                if promo_code_data.count is not None:
                    if promo_code_data.count > 0:
                        if promo_code_data.date is not None:
                            if data_now < promo_code_data.date:
                                promo_code_data_ = CheckPromoCodeResponse(
                                    success=True, data=PromoCodeSimpleSchema(
                                        id=promo_code_data.id, name=promo_code_data.name, amount=promo_code_data.amount
                                    )
                                )
                            else:
                                promo_code_data_ = CheckPromoCodeResponse(success=False, data="Срок действия промокода истек")
                        else:
                            promo_code_data_ = CheckPromoCodeResponse(
                                success=True, data=PromoCodeSimpleSchema(
                                    id=promo_code_data.id, name=promo_code_data.name, amount=promo_code_data.amount
                                )
                            )
                    else:
                        promo_code_data_ = CheckPromoCodeResponse(success=False, data="Промокод закончился")
                else:
                    if data_now < promo_code_data.date:
                        promo_code_data_ = CheckPromoCodeResponse(
                            success=True, data=PromoCodeSimpleSchema(
                                id=promo_code_data.id, name=promo_code_data.name, amount=promo_code_data.amount
                            )
                        )
                    else:
                        promo_code_data_ = CheckPromoCodeResponse(success=False, data="Срок действия промокода истек")
                if promo_code_data_.success:
                    promo_code_id = promo_code_data_.data.id
                    discount_amount += promo_code_data_.data.amount
                    amount -= promo_code_data_.data.amount
                else:
                    raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=promo_code_data_.data)
            data_for_orders = await uow.system_data.get_data_for_orders()
            for data_for_order in data_for_orders:
                if data_for_order.name == SystemDataNames.price_in_MKAD and data.delivery_type == DeliveryTypeEnum.in_MKAD:
                    delivery_price += int(data_for_order.value)
                elif data_for_order.name == SystemDataNames.price_out_MKAD and data.delivery_type == DeliveryTypeEnum.out_MKAD:
                    delivery_price += int(data_for_order.value)
                elif data_for_order.name == SystemDataNames.price_up_to_level and data.up_to_level is True:
                    delivery_price += int(data_for_order.value)
            amount += delivery_price
            products = await uow.basket.get_basket_products(user_id=user_id) if data.products is None else await uow.product.get_products_by_ids(data.products)
            if len(products) < 1:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="В корзине нет товаров")
            for product in products:
                if data.products is None:
                    if not product.product.active:
                        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Уберите товары, которых нет в наличии")
                    if product.trade:
                        amount += product.product.price_trade * product.count
                    else:
                        amount += product.product.price * product.count
                else:
                    if not product.active:
                        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Уберите товары, которых нет в наличии")
                    if data.trade:
                        amount += product.price_trade
                    else:
                        amount += product.price
            for data_for_order in data_for_orders:
                if data_for_order.name == SystemDataNames.min_order_amount:
                    if amount < int(data_for_order.value):
                        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"Минимальная сумма заказа {data_for_order.value}₽")

            order_id = await uow.order.add_and_return_id({"user_id": user_id, "comment": data.comment})
            if not order_id:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Не удалось создать заказ")
            amount_order = await uow.amount_order.add({"order_id": order_id, "amount": amount, "discount_amount": discount_amount, "delivery_price": delivery_price, "payment_type": PaymentType.courier})
            if not amount_order:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Не удалось составить стоимость заказа")
            delivery = await uow.delivery.add({"order_id": order_id, "up_to_level": data.up_to_level, "delivery_price": delivery_price, "address": json.dumps(data.address.model_dump() if data.address else {}) , "description": data.promo_code})
            if not delivery:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Не удалось добавить данные о доставке")
            products_formated_for_telegram: list[str] = []
            if data.products is None:
                for basket_product in products:
                    await uow.order_product.add({"order_id": order_id, "product_id": basket_product.product.id, "price": basket_product.product.price if basket_product.trade is not True else basket_product.product.price_trade, "count": basket_product.count, "trade": basket_product.trade})
                    products_formated_for_telegram.append(f"{basket_product.product.name if not basket_product.product.balloon else "Пищевая закись азота"} - {basket_product.product.size} • {basket_product.count} шт • {"Обмен • " if basket_product.trade is True else "Покупка • " if basket_product.trade is False else ""} <b>{basket_product.product.price if basket_product.trade is not True else basket_product.product.price_trade}₽</b>")
                await uow.basket.delete_all(user_id=user_id)
            else:
                for product in products:
                    await uow.order_product.add({"order_id": order_id, "product_id": product.id, "price": product.price if data.trade is not True else product.price_trade, "count": 1, "trade": data.trade})
                    products_formated_for_telegram.append(f"{product.name if not product.balloon else "Пищевая закись азота"} - {product.size} • 1 шт • {"Обмен • " if data.trade is True else "Покупка • " if data.trade is False else ""} <b>{product.price if data.trade is not True else product.price_trade}₽</b>")
            if promo_code_id:
                await uow.promo_code.change_count_activation(promo_code_id=promo_code_id)

            await uow.user.update(item_id=user_id, phone_number=data.phone_number)
            user = await uow.user.get_by_id(item_id=user_id)
            await uow.commit()

        # Отправить заказ в чат
        await send_order_in_chat(
            user_id=user_id,
            username=user.username,
            first_name=data.first_name,
            phone_number=data.phone_number,
            comment=data.comment,
            address=data.address.address,
            entrance=data.address.entrance,
            flat=data.address.flat,
            level=data.address.level,
            door_phone=data.address.door_phone,
            delivery_price=delivery_price,
            amount_final=amount,
            products=products_formated_for_telegram,
            used_promo_code=bool(promo_code_id),
            up_to_level=data.up_to_level,
            delivery_in_mkad=data.delivery_type == DeliveryTypeEnum.in_MKAD
        )

        return True


    @classmethod
    async def get_history(cls, uow: UnitOfWork, user_id: int) -> list[OrderHistorySchema]:
        async with uow:
            return await uow.order.get_history(user_id=user_id)

    @classmethod
    async def order_repeat(cls, uow: UnitOfWork, user_id: int, data: list[OrderRepeatSchema]) -> None:
        async with uow:
            await uow.basket.delete_all(user_id=user_id)
            for product in data:
                prd = await uow.product.get_by_id(product.product_id)
                if prd:
                    await uow.basket.add({"user_id": user_id, "product_id": product.product_id, "count": product.count, "trade": None if not prd.balloon else False})
            await uow.commit()