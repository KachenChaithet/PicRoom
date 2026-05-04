from pydantic import BaseModel

class GuestAuth(BaseModel):
    name: str

class GuestResponse(BaseModel):
    id: str
    name: str
    room_id: int