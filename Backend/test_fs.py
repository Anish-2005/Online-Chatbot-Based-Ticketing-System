import firebase_admin
from firebase_admin import credentials, firestore
print('start')
cred = credentials.Certificate('firebase-credentials.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
print('querying')
for d in db.collection('shows').limit(1).stream(timeout=5):
 print('doc', d.id)
print('done')
