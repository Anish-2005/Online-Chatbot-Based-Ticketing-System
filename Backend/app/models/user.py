from bson import ObjectId
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: ObjectId
    name: str
    email: EmailStr
    password: str
