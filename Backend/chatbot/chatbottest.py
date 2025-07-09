from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import pytz

app = FastAPI()

class ShowResponse(BaseModel):
    id: str
    title: str
    description: str
    available_seats: int
    show_time: datetime

# Hardcoded test data
test_show = ShowResponse(
    id="1",
    title="Morning Show",
    description="A great show at 9 am.",
    available_seats=25,
    show_time=datetime.strptime("9 am", "%I %p").replace(tzinfo=pytz.UTC)
)

@app.post("/reserve_tickets/")
async def reserve_tickets(response: dict):
    # Extract time and ticket number from the response
    time_str = response["queryResult"]["parameters"]["time"]
    num_tickets = response["queryResult"]["parameters"]["ticket"]

    # Convert the time string to a datetime object
    try:
        requested_show_time = datetime.strptime(time_str, "%I %p").replace(tzinfo=pytz.UTC)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid time format provided.")

    # Check if the requested show time matches the hardcoded test data
    if requested_show_time != test_show.show_time:
        raise HTTPException(status_code=404, detail="No show found at the specified time.")

    # Check if the number of available seats is sufficient
    if test_show.available_seats < num_tickets:
        raise HTTPException(status_code=400, detail="Not enough tickets available.")

    # If everything is okay, reduce the number of available seats
    test_show.available_seats -= num_tickets

    return {"fulfillmentText": f"Your {num_tickets} tickets are reserved for the {time_str} show."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
