from pydantic import BaseModel
from datetime import datetime

class RoomCreate(BaseModel):
    name:str
    date:datetime
    location:str
    
class RoomResponse(BaseModel):
    id: int
    slug: str
    name: str
    date:datetime
    location:str
    background_image_url:str|None
    background_image_public_id:str|None
    
    