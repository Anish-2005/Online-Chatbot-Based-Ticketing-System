from bson import ObjectId
from pydantic import BaseModel
from datetime import datetime

class Booking(BaseModel):
    id: ObjectId
    user_id: ObjectId
    show_id: ObjectId
    booked_at: datetime
    tickets: int
