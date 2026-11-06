from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

from src.auth.router import router as auth_router
from src.products.router import router as product_router
from src.users.router import router as user_router
from src.orders.router import router as order_router
from src.admin.router import router as admin_router

from src.config import REDIS_HOST, REDIS_PORT


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    redis = aioredis.from_url(f"redis://{REDIS_HOST}:{REDIS_PORT}")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield


app = FastAPI(
    title="MosAzot",
    version="0.1",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:8001", "http://localhost:3001", "https://two-market.ru", "https://mosazot-app.ru", "https://admin.mosazot-app.ru"],
    allow_methods=["GET", "POST", "PATCH", "OPTIONS", "DELETE", "PUT"],
    allow_headers=['Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials', 'Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Cookie', 'Set-Cookie'],

)

app.include_router(auth_router)
app.include_router(product_router)
app.include_router(user_router)
app.include_router(order_router)
app.include_router(admin_router)