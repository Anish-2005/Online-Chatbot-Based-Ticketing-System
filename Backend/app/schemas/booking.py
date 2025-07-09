from pydantic import BaseModel
from datetime import datetime

class BookingCreate(BaseModel):
    user_id: str
    show_id: str
    tickets: int

class BookingResponse(BaseModel):
    id: str
    user_id: str
    show_id: str
    booked_at: datetime
    tickets: int
