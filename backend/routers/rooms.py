from fastapi import APIRouter, Depends,Form,UploadFile,File,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from schemas.room import RoomCreate, RoomResponse
from models import Room
from services.cloudinary_service import upload_image_background
from datetime import datetime

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("", response_model=RoomResponse)
async def create_room(
    name:str = Form(...),
    date:datetime = Form(...),
    location:str = Form(...),
    background:UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    if background:
        file_bytes = await background.read()
        result = await upload_image_background(file_bytes)
        print(f'this is result:{result}')
        bg_url = result["url"]
        bg_public_id = result["public_id"]
    
    db_room = Room(
        name=name,
        date = date,
        location= location,
        background_image_url=bg_url,
        background_image_public_id=bg_public_id,
        owner_id=1,
    )
    db.add(db_room)
    await db.commit()
    await db.refresh(db_room)
    return db_room

@router.get("/{slug}",response_model=RoomResponse)
async def get_room(
    slug: str,
    db:AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Room).where(Room.slug == slug)
    )
    room = result.scalar_one_or_none()
    
    if not room:
         raise HTTPException(status_code=404, detail="Room not found")
    
    return room