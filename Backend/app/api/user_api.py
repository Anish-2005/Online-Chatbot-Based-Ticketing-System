from fastapi import APIRouter
from typing import List, Optional
from ..firebase_setup import db
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime

router = APIRouter()

def to_date_value(value):
    if not value:
        return None
    if isinstance(value, datetime):
        return value.replace(tzinfo=None)
    if hasattr(value, 'to_datetime'):
        return value.to_datetime().replace(tzinfo=None)
    if isinstance(value, float) or isinstance(value, int):
        return datetime.fromtimestamp(value)
    return None

@router.get("/tickets")
def fetch_user_tickets(email: str):
    if not db:
        raise Exception("Firebase not initialized")
        
    payments_ref = db.collection('payments')
    payments_snapshot = payments_ref.where(filter=FieldFilter('email', '==', email)).stream()
    
    tickets = []
    for doc in payments_snapshot:
        p = doc.to_dict()
        p['id'] = doc.id
        if p.get('status') == 'paid':
            dt = to_date_value(p.get('createdAt'))
            if dt:
                p['createdAt'] = dt.timestamp() * 1000
            tickets.append(p)
            
    tickets.sort(key=lambda x: x.get('createdAt', 0), reverse=True)
    return tickets
