# test_connection.py
import asyncio
from sqlalchemy import text
from database import engine

async def test():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT version()"))
        print("✅ เชื่อมต่อสำเร็จ:", result.scalar())

asyncio.run(test())