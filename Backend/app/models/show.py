from bson import ObjectId
from pydantic import BaseModel
from datetime import datetime

class Show(BaseModel):
    id: ObjectId
    title: str
    description: str
    available_seats: int
    show_time: datetime
