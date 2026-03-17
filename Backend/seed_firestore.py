import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Firebase setup
cred_path = os.path.join(os.path.dirname(__file__), "..", "firebase-credentials.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def seed_shows():
    with open('SAMPLE_SHOWS.json', 'r') as f:
        data = json.load(f)
        shows = data.get('shows', [])
        
    for show in shows:
        show_id = show.pop('id', None)
        if show_id:
            db.collection('shows').document(show_id).set(show, merge=True)
            print(f"Seeded show: {show['title']}")

if __name__ == "__main__":
    seed_shows()
