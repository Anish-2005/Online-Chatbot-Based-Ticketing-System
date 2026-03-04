import os
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request as GoogleRequest
from app.api.dashboard_api import get_rest_access_token, fetch_collection_rest, get_raw_admin_data

if __name__ == "__main__":
    print("Fetching dashboard data via REST...")
    try:
        payment_rows, shows = get_raw_admin_data()
        print(f"Success! Found {len(payment_rows)} payments and {len(shows)} shows.")
    except Exception as e:
        print("Error:", e)
