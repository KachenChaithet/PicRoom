from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.image import ImageResponse, ImageCreate
from database import get_db

router = APIRouter(prefix="/image", tags=["image"])


@router.post("/upload", response_model=ImageResponse)
async def create_image(image: ImageCreate, db: AsyncSession = Depends(get_db)):
    files: list[UploadFile] = File(...)
