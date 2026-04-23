from pydantic import BaseModel
from datetime import datetime

class RoomCreate(BaseModel):
    name:str
    date:datetime
    location:str
    
class RoomResponse(BaseModel):
    id:int
    name:str
    date:datetime
    location:str
    created_at:datetime
    
    