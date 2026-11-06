import asyncio
import logging

from bot.config import bot, dp
from bot.handlers.system import router as system_router


async def main():
    dp.include_router(system_router)
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass