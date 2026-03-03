import os
import firebase_admin
from firebase_admin import credentials, firestore

db = None

def init_firebase():
    global db
    if db is not None:
        return db
        
    try:
        # Check for service account key
        key_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "firebase-credentials.json")
        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("Firebase Admin SDK initialized successfully.")
        else:
            print(f"WARNING: Firebase credentials not found at {key_path}. Database functions will fail.")
    except Exception as e:
        print(f"Firebase initialization error: {e}")
        
    return db

# Auto-initialize
init_firebase()
