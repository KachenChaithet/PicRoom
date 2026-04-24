from pydantic import BaseModel
from datetime import datetime


class ImageCreate(BaseModel):
    filename: str
    cloudinary_url: str
    cloudinary_public_id: str
    status: str
    room_id: int
    username: str


class ImageResponse(ImageCreate):
    id: int
    uploaded_at: datetime
