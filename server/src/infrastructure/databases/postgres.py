from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import text
from config import settings

# Base cho Alembic migrations
Base = declarative_base()

# Tạo async engine
engine = create_async_engine(settings.DATABASE_URL, echo=True)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False 
)

# Hàm test connection
async def test_connection():
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("ket noi thanh cong", result.scalar())
    except Exception as e:
        print("ket noi that bai", e)