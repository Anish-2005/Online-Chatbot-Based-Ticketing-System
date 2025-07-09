from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import pytz

# MongoDB setup
client = MongoClient("MONGODB-URI")
db = client["ticketing"]
shows_collection = db["shows"]

app = FastAPI()

@app.post("/reserve_tickets/")
async def reserve_tickets(response: dict):
    num_tickets = response["queryResult"]["parameters"]["ticket"]


    if show["available_seats"] < num_tickets:
        raise HTTPException(status_code=400, detail="Not enough tickets available.")

    
    shows_collection.update_one(
        {"_id": show["_id"]},
        {"$inc": {"available_seats": -num_tickets}}
    )

    return {"fulfillmentText": f"Your {num_tickets} tickets are reserved for the {time_str} show."}

@app.post("/adafawebhook")
async def webhook(request: Request, body: DialogflowRequest):
    # Extract the intent name
    intent_name = body.queryResult.get("intent", {}).get("displayName")

    # Logic for handling 'ReserveTicket' intent
    if intent_name == "ReserveTicket":
        parameters = body.queryResult.get("parameters", {})
        number_of_tickets = parameters.get("number_of_tickets")
        show_time = parameters.get("show_time")
        show_name = parameters.get("show_name")

        fulfillment_text = (f"Webhook received! You requested {number_of_tickets} tickets "
                            f"for the show '{show_name}' at {show_time}.")

    # Logic for handling 'Text_ticket' intent
    elif intent_name == "Text_ticket":
        parameters = body.queryResult.get("parameters", {})
        ticket = parameters.get("ticket")

        fulfillment_text = f"Webhook received! You requested ticket information: {ticket}."

    # Default fallback if intent is not recognized
    else:
        fulfillment_text = "Webhook received, but intent not recognized."

    # Return the fulfillment response to Dialogflow
    return {
        "fulfillmentText": fulfillment_text
    }