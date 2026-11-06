import json

from aiogram import Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, LabeledPrice, Message

from bot.config import ADMIN_URL, bot, SITE_URL, CHAT_ID
from src.users.service import UserService

router = Router()

async def create_admin(user_id: int, login: str | int, password: str):
    message = ("👑 <b>Вам выдан доступ к админ панели</b>\n\n"
               f"Ваш логин: <code>{login}</code>\n"
               f"Ваш пароль: <code>{password}</code>\n\n"
               f"Ссылка для входа - {ADMIN_URL}")
    try:
        await bot.send_message(chat_id=user_id, text=message)
        return True
    except Exception as e:
        return f"Ошибка: {e}"


@router.message(Command('start'))
async def start(message: Message, state: FSMContext):
    await state.clear()
    await message.answer(
            text="Добро пожаловать",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text=f"Открыть", web_app=WebAppInfo(url=SITE_URL))]
            ]),
        )


async def send_order_in_chat(
        user_id: int,
        username: str | None,
        first_name: str,
        phone_number: int,
        comment: str,

        address: str,
        entrance: str,
        flat: str,
        level: str,
        door_phone: str,
        up_to_level: bool,
        delivery_in_mkad: bool,

        delivery_price: float,
        amount_final: float,
        products: list[str],
        used_promo_code: bool = False


):
    await bot.send_message(
        chat_id=CHAT_ID,
        text="🔔 <b>Поступил новый заказ</b>\n\n"
             
             f"<b>ID:</b> <code>{user_id}</code>\n"
             f"<b>Username:</b> @{username}\n"
             f"<b>Имя:</b> {first_name}\n"
             f"<b>Телефон:</b> +7{phone_number}\n\n"
             
             f"<b>Адрес:</b> {address if address else "Не указан"}\n"
             f"<b>Подъезд:</b> {entrance if entrance else "Не указан"}\n"
             f"<b>Квартира:</b> {flat if flat else "Не указана"}\n"
             f"<b>Этаж:</b> {level if level else "Не указан"}\n"
             f"<b>Домофон:</b> {door_phone if door_phone else "Не указан"}\n"
             f"<b>Подъем на этаж:</b> {'Нужен' if up_to_level else 'НЕ нужен'}\n"
             f"<b>Доставка:</b> {'В пределах МКАД' if delivery_in_mkad else 'ЗА пределы МКАД'}\n\n"
             
             f"🛒 <b>Товары</b>\n"
             f"<blockquote expandable>{''.join([f'{product}\n' for product in products])}</blockquote>\n"
             f"<b>ИТОГО:</b> <b>{amount_final}₽</b> (Доставка: {delivery_price}₽)\n"
             f"{'<code>* Применялся промокод *</code>\n\n' if used_promo_code else '\n'}"
             f"{f'<b>Комментарий к заказу:</b>\n<blockquote expandable>{comment}</blockquote>' if comment else ''}",
    )


class SendAllState(StatesGroup):
    message = State()


@router.message(Command('send_all_AsMH2nKfOs8xKSL12AjnLmKO'))
async def send_all(message: Message, state: FSMContext):
    await state.clear()
    await message.answer("Напишите сообщение для рассылки")
    await state.set_state(SendAllState.message)


@router.message(SendAllState.message)
async def send_all_message(message: Message, state: FSMContext):
    await message.answer("⌛ Рассылка запущенна...")
    count = 0
    error = 0
    users_ids = await UserService().get_all_users_ids()
    for user_id in users_ids:
        try:
            await message.copy_to(user_id)
            count += 1
        except:
            error += 1
    await message.answer(f"✅ <b>Рассылка успешно завершена!</b>\n\n"
                         f"Получили сообщение: <b>{count} чел</b>\n"
                         f"Не удалось отправить: <b>{error} чел</b>")
    await state.clear()
