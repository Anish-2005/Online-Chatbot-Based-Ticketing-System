from pydantic import BaseModel
from datetime import datetime

class ShowCreate(BaseModel):
    title: str
    description: str
    available_seats: int
    show_time: datetime

class ShowResponse(BaseModel):
    id: str
    title: str
    description: str
    available_seats: int
    show_time: datetime
