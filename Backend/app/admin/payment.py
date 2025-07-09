

import razorpay
client = razorpay.Client(auth=(key_id, key_secret))

data ={
  "amount": 50000,
  "currency": "INR",
  "receipt": "kimochi#69",
  "notes": [],
}
order = client.order.create(data=data)
#client.payment.fetch(paymentId)
print(order)