from fastapi import APIRouter,Depends,HTTPException
from schemas.guests import GuestResponse,GuestAuth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Room,Guest


router = APIRouter(prefix="/guest", tags=["guest"])

@router.post("/{room_slug}/auth",response_model=GuestResponse)
async def guest_auth(
    room_slug:str,
    body:GuestAuth,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Room).where(Room.slug == room_slug))
    room = result.scalars().first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    guest = Guest(
        name=body.name,
        room_id=room.id
    )
    db.add(guest)
    await db.commit()
    await db.refresh(guest)
    
    return guest

@router.patch("/{guest_id}")
async def update_guest(
    guest_id:str,
    body:GuestAuth,
    db:AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Guest).where(Guest.id == guest_id))
    guest = result.scalar_one_or_none()
    if not guest:
        raise HTTPException(status_code=404, detail="Room not found")
    guest.name = body.name
    await db.commit()
    return guest    
    
    