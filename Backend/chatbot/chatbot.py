from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
import pytz

# Firebase setup
# Use the credentials file if it exists, otherwise assume it's set in the environment
cred_path = os.path.join(os.path.dirname(__file__), "..", "firebase-credentials.json")
if not firebase_admin._apps:
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback for environments where the file is not present
        firebase_admin.initialize_app()

db = firestore.client()

app = FastAPI()

class DialogflowRequest(BaseModel):
    queryResult: dict

@app.post("/webhook")
async def webhook(request: Request):
    body = await request.json()
    intent_name = body.get("queryResult", {}).get("intent", {}).get("displayName")
    parameters = body.get("queryResult", {}).get("parameters", {})

    if intent_name == "ListShows":
        return await handle_list_shows()
    
    elif intent_name == "BookTicket":
        return await handle_book_ticket(parameters)
    
    elif intent_name == "CheckTicketStatus":
        return await handle_check_status(parameters)

    return {
        "fulfillmentText": "I'm not sure how to help with that. Try asking for available shows!"
    }

async def handle_list_shows():
    shows_ref = db.collection('shows')
    docs = shows_ref.stream()
    
    shows_list = []
    for doc in docs:
        show = doc.to_dict()
        shows_list.append(f"- {show.get('title')} ({show.get('time')} at {show.get('location')})")
    
    if not shows_list:
        return {"fulfillmentText": "Sorry, there are no shows available currently."}
    
    fulfillment_text = "Here are the current shows:\n" + "\n".join(shows_list) + "\n\nWhich one would you like to book?"
    return {"fulfillmentText": fulfillment_text}

async def handle_book_ticket(parameters):
    show_name = parameters.get("show_name")
    num_tickets = int(parameters.get("number_of_tickets", 1))
    email = parameters.get("email")

    if not show_name:
        return {"fulfillmentText": "Which show would you like to book?"}
    
    if not email:
        return {"fulfillmentText": "Could you please provide your email address for the booking?"}

    # Find the show
    shows_ref = db.collection('shows')
    query = shows_ref.where('title', '==', show_name).limit(1).get()
    
    if not query:
        # Try case-insensitive or partial match if possible, but keep it simple for now
        return {"fulfillmentText": f"I couldn't find a show named '{show_name}'. Could you check the name?"}

    show_doc = query[0]
    show_data = show_doc.to_dict()
    show_id = show_doc.id
    available = int(show_data.get('ticketsLeft', 0))

    if available < num_tickets:
        return {"fulfillmentText": f"Sorry, only {available} tickets are left for {show_name}."}

    # Perform Booking (Simplified transaction logic)
    try:
        # In a real app, use a transaction here as in bookings.js
        new_tickets_left = available - num_tickets
        db.collection('shows').document(show_id).update({
            'ticketsLeft': new_tickets_left
        })

        # Create payment/booking record
        booking_ref = db.collection('payments').document()
        ticket_code = f"TKT-{booking_ref.id[:10].upper()}"
        
        booking_ref.set({
            'eventId': show_id,
            'eventTitle': show_name,
            'seatCount': num_tickets,
            'email': email,
            'status': 'paid',
            'ticketCode': ticket_code,
            'createdAt': datetime.now(pytz.utc),
            'amount': int(show_data.get('price', 0)) * num_tickets
        })

        return {
            "fulfillmentText": f"Succesfully booked {num_tickets} tickets for {show_name}! Your ticket code is {ticket_code}. A confirmation has been sent to {email}."
        }
    except Exception as e:
        return {"fulfillmentText": f"Error during booking: {str(e)}"}

async def handle_check_status(parameters):
    email = parameters.get("email")
    if not email:
        return {"fulfillmentText": "Please provide your email to check your bookings."}
    
    bookings_ref = db.collection('payments')
    query = bookings_ref.where('email', '==', email).order_by('createdAt', direction=firestore.Query.DESCENDING).limit(3).get()
    
    if not query:
        return {"fulfillmentText": f"No bookings found for {email}."}
    
    results = []
    for doc in query:
        data = doc.to_dict()
        results.append(f"- {data.get('eventTitle')} ({data.get('seatCount')} tickets): {data.get('ticketCode')}")
    
    fulfillment_text = f"Here are your recent bookings for {email}:\n" + "\n".join(results)
    return {"fulfillmentText": fulfillment_text}