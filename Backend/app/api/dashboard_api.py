from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import pytz
from ..firebase_setup import db
from google.cloud.firestore_v1.base_query import FieldFilter

router = APIRouter()

def as_number(value, fallback=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return fallback

def to_date_value(value):
    if not value:
        return None
    # If it's a firestore timestamp
    if hasattr(value, 'timestamp'):
        return value.timestamp()
    if hasattr(value, 'to_datetime'):
        return value.to_datetime().replace(tzinfo=None)
    if isinstance(value, float) or isinstance(value, int):
        return datetime.fromtimestamp(value)
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value.replace('Z', '+00:00')).replace(tzinfo=None)
        except:
            try:
                # MM/DD/YYYY or similar
                if '/' in value:
                    parts = value.split('/')
                    return datetime(int(parts[2]), int(parts[1]), int(parts[0]))
            except:
                pass
    if isinstance(value, datetime):
        return value.replace(tzinfo=None)
    return None

def start_of_today():
    now = datetime.now()
    return now.replace(hour=0, minute=0, second=0, microsecond=0)

def month_key(date_val: datetime):
    return f"{date_val.year}-{str(date_val.month).zfill(2)}"

def month_label(key: str):
    year, month = map(int, key.split('-'))
    d = datetime(year, month, 1)
    return d.strftime('%b %Y')

def get_raw_admin_data():
    if db is None:
        raise Exception("Firebase not initialized")
        
    shows_ref = db.collection('shows')
    payments_ref = db.collection('payments')
    
    shows_snapshot = shows_ref.stream()
    payments_snapshot = payments_ref.where(filter=FieldFilter('status', '==', 'paid')).stream()
    
    shows = []
    for doc in shows_snapshot:
        data = doc.to_dict()
        data['id'] = doc.id
        shows.append(data)
        
    payment_rows = []
    for doc in payments_snapshot:
        p = doc.to_dict()
        p['id'] = doc.id
        
        # Convert created At
        created_at_dt = to_date_value(p.get('createdAt'))
        
        p['createdAtDate'] = created_at_dt
        p['amountValue'] = as_number(p.get('amount'), 0.0)
        p['seatCountValue'] = max(as_number(p.get('seatCount'), 0.0), 0.0)
        payment_rows.append(p)
        
    shows_with_derived = []
    for show in shows:
        booked_seats = show.get('bookedSeats', [])
        if not isinstance(booked_seats, list):
            booked_seats = []
        booked_seats = [int(s) for s in booked_seats if str(s).isdigit() and int(s) > 0]
        
        configured_seats_raw = show.get('totalSeats', show.get('available_seats'))
        configured_seats = as_number(configured_seats_raw, 0)
        tickets_left = max(as_number(show.get('ticketsLeft'), 0), 0)
        total_seats = configured_seats if configured_seats > 0 else max(tickets_left + len(booked_seats), 0)
        
        sold_seats = len(booked_seats)
        occupancy_rate = (sold_seats / total_seats * 100) if total_seats > 0 else 0
        show_date = to_date_value(show.get('date'))
        created_at = to_date_value(show.get('createdAt'))
        
        show['totalSeats'] = total_seats
        show['soldSeats'] = sold_seats
        show['ticketsLeft'] = tickets_left
        show['occupancyRate'] = occupancy_rate
        show['showDate'] = show_date
        show['createdAtDate'] = created_at
        shows_with_derived.append(show)
        
    return payment_rows, shows_with_derived

@router.get("/dashboard")
def fetch_admin_dashboard_data():
    payment_rows, shows_with_derived = get_raw_admin_data()
    
    today_start = start_of_today()
    tomorrow_start = today_start + timedelta(days=1)
    
    todays_payments = [p for p in payment_rows if p.get('createdAtDate') and today_start <= p['createdAtDate'] < tomorrow_start]
    
    total_revenue = sum(p['amountValue'] for p in payment_rows)
    total_tickets_sold = sum(p['seatCountValue'] for p in payment_rows)
    today_revenue = sum(p['amountValue'] for p in todays_payments)
    bookings_today = len(todays_payments)
    
    total_capacity = sum(s['totalSeats'] for s in shows_with_derived)
    total_booked_seats = sum(s['soldSeats'] for s in shows_with_derived)
    conversion_rate = (total_booked_seats / total_capacity * 100) if total_capacity > 0 else 0
    
    unique_users = set()
    for p in payment_rows:
        if p.get('email'): unique_users.add(str(p['email']).lower())
    for s in shows_with_derived:
        if s.get('adminEmail'): unique_users.add(str(s['adminEmail']).lower())
        
    now = datetime.now()
    now_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    upcoming_shows = sum(1 for s in shows_with_derived if s.get('showDate') and s['showDate'] >= now_start)
    
    # Top shows
    sorted_shows = sorted(shows_with_derived, key=lambda x: x['soldSeats'], reverse=True)[:5]
    top_shows = []
    for s in sorted_shows:
        top_shows.append({
            "id": s['id'],
            "title": s.get('title', 'Untitled Show'),
            "soldSeats": s['soldSeats'],
            "totalSeats": s['totalSeats'],
            "occupancyRate": s['occupancyRate'],
            "ticketsLeft": s['ticketsLeft'],
            "date": s.get('date', 'TBA')
        })
        
    # Activity
    activity_list = []
    for p in payment_rows:
        activity_list.append({
            "id": f"payment-{p['id']}",
            "type": "payment",
            "status": "success",
            "action": "Payment received",
            "user": p.get('email', 'Unknown customer'),
            "details": f"{p.get('eventTitle', 'Show booking')} • {p['seatCountValue']} ticket(s)",
            "amount": p['amountValue'],
            "timestamp": p.get('createdAtDate')
        })
        
    for s in shows_with_derived:
        if s.get('createdAtDate'):
            activity_list.append({
                "id": f"show-{s['id']}",
                "type": "show",
                "status": "info",
                "action": "Show published",
                "user": s.get('adminEmail', 'Admin'),
                "details": s.get('title', 'Untitled show'),
                "amount": None,
                "timestamp": s['createdAtDate']
            })
            
    # Filter valid timestamps and sort
    valid_activity = [a for a in activity_list if a['timestamp'] is not None]
    valid_activity.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # Convert timestamps back to ISO strings for JSON serialization
    for a in valid_activity:
        if a['timestamp']:
            a['timestamp'] = a['timestamp'].timestamp() * 1000 # Send as JS milliseconds
            
    recent_activity = valid_activity[:8]
    
    return {
        "kpis": {
            "totalRevenue": total_revenue,
            "activeUsers": len(unique_users),
            "bookingsToday": bookings_today,
            "conversionRate": conversion_rate,
            "totalTicketsSold": total_tickets_sold,
            "totalShows": len(shows_with_derived),
            "todayRevenue": today_revenue,
            "upcomingShows": upcoming_shows
        },
        "topShows": top_shows,
        "recentActivity": recent_activity
    }

@router.get("/analytics")
def fetch_admin_analytics_data():
    payment_rows, shows_with_derived = get_raw_admin_data()
    # Kpis are returned in dashboard, we'll recompute quickly
    
    today = start_of_today()
    day_buckets = []
    for offset in range(6, -1, -1):
        day_start = today - timedelta(days=offset)
        day_end = day_start + timedelta(days=1)
        
        day_payments = [p for p in payment_rows if p.get('createdAtDate') and day_start <= p['createdAtDate'] < day_end]
        
        day_buckets.append({
            "name": day_start.strftime("%a"),
            "bookings": len(day_payments),
            "revenue": sum(p['amountValue'] for p in day_payments),
            "tickets": sum(p['seatCountValue'] for p in day_payments)
        })
        
    show_performance = sorted(shows_with_derived, key=lambda x: x['soldSeats'], reverse=True)[:8]
    perf_list = []
    for s in show_performance:
        perf_list.append({
            "name": s.get('title', 'Untitled'),
            "sold": s['soldSeats'],
            "left": s['ticketsLeft'],
            "occupancy": round(s['occupancyRate'], 1)
        })
        
    revenue_by_show = {}
    for p in payment_rows:
        key = p.get('eventTitle', 'Unknown show')
        if key not in revenue_by_show:
            revenue_by_show[key] = {"name": key, "earnings": 0, "tickets": 0, "bookings": 0}
        revenue_by_show[key]['earnings'] += p['amountValue']
        revenue_by_show[key]['tickets'] += p['seatCountValue']
        revenue_by_show[key]['bookings'] += 1
        
    financial_breakdown = sorted(revenue_by_show.values(), key=lambda x: x['earnings'], reverse=True)[:8]
    
    return {
        "bookingTrend": day_buckets,
        "showPerformance": perf_list,
        "financialBreakdown": financial_breakdown
    }

@router.get("/earnings")
def fetch_total_earnings():
    payment_rows, _ = get_raw_admin_data()
    
    total_revenue = sum(p['amountValue'] for p in payment_rows)
    total_bookings = len(payment_rows)
    total_tickets = sum(p['seatCountValue'] for p in payment_rows)
    
    category_buckets = {}
    for p in payment_rows:
        cat = p.get('eventTitle', 'Unknown Show')
        if cat not in category_buckets:
            category_buckets[cat] = {"key": cat, "name": cat, "value": 0}
        category_buckets[cat]['value'] += p['amountValue']
        
    categories = sorted(category_buckets.values(), key=lambda x: x['value'], reverse=True)[:8]
    
    monthly_buckets = {}
    for p in payment_rows:
        if not p.get('createdAtDate'): continue
        k = month_key(p['createdAtDate'])
        if k not in monthly_buckets:
            monthly_buckets[k] = {"key": k, "month": month_label(k), "revenue": 0, "bookings": 0}
        monthly_buckets[k]['revenue'] += p['amountValue']
        monthly_buckets[k]['bookings'] += 1
        
    monthly_revenue = sorted(monthly_buckets.values(), key=lambda x: x['key'])[-6:]
    
    return {
        "summary": {
            "totalRevenue": total_revenue,
            "totalBookings": total_bookings,
            "totalTickets": total_tickets,
            "averageOrderValue": (total_revenue / total_bookings) if total_bookings > 0 else 0
        },
        "categories": categories,
        "monthlyRevenue": monthly_revenue
    }
