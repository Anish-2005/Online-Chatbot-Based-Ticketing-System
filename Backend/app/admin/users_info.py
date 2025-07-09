from fastapi import FastAPI, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List
from bson import ObjectId

from database import get_database
from schemas.user import UserCreate, UserResponse
from schemas.booking import BookingCreate, BookingResponse
from schemas.show import ShowCreate, ShowResponse

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello"}


# User Routes
@app.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate, db=Depends(get_database)):
    user_dict = user.model_dump()
    result = await db["users"].insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    return user_dict

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db=Depends(get_database)):
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user

# Booking Routes
@app.post("/bookings/", response_model=BookingResponse)
async def create_booking(booking: BookingCreate, db=Depends(get_database)):
    booking_dict = booking.model_dump()
    result = await db["bookings"].insert_one(booking_dict)
    booking_dict["_id"] = str(result.inserted_id)
    return booking_dict

@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str, db=Depends(get_database)):
    booking = await db["bookings"].find_one({"_id": ObjectId(booking_id)})
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking["_id"] = str(booking["_id"])
    return booking

# Show Routes
@app.post("/shows/", response_model=ShowResponse)
async def create_show(show: ShowCreate, db=Depends(get_database)):
    show_dict = show.model_dump()
    result = await db["shows"].insert_one(show_dict)
    show_dict["_id"] = str(result.inserted_id)
    return show_dict

@app.get("/shows/{show_id}", response_model=ShowResponse)
async def get_show(show_id: str, db=Depends(get_database)):
    show = await db["shows"].find_one({"_id": ObjectId(show_id)})
    if show is None:
        raise HTTPException(status_code=404, detail="Show not found")
    show["_id"] = str(show["_id"])
    return show
