from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.room import RoomCreate, RoomResponse
from models import Room

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", response_model=RoomResponse)
async def create_room(room: RoomCreate, db: AsyncSession = Depends(get_db)):
    db_room = Room(**room.model_dump(), owner_id=1)
    db.add(db_room)
    await db.commit()
    await db.refresh(db_room)
    return db_room
