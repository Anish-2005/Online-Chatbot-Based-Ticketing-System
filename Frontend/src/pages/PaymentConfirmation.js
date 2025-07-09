import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, selectedSeats, seatCount } = location.state || {};
  const [email, setEmail] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const pricePerTicket = parseFloat(event.price.replace(/[^0-9.-]+/g, '')) || 0;
  const totalPrice = pricePerTicket * seatCount;

  // Email validation function
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  // Handle email input change and validate email
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    validateEmail(emailValue);
  };

  const handlePayment = () => {
    if (emailError || !email) {
      setPopupMessage('Please correct the errors before proceeding.');
      return;
    }

    setIsPaymentProcessing(true);
    setPopupMessage('');

    const paymentData = {
      eventId: event.id, // Assuming event has an id property
      selectedSeats,
      seatCount,
      email,
      amount: pricePerTicket * seatCount,
    };

    fetch('https://fastapi-deploy-app.onrender.com/ticket_booking/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
      .then(async (response) => {
        const data = await response.json(); // Parse JSON response
        if (response.ok) {
          setPopupMessage('Payment successful! Ticket details will be sent to your email.');
          setTimeout(() => {
            navigate('/bookshows', { state: { event, selectedSeats, seatCount } });
          }, 15000); // Delay navigation to allow user to see the popup
        } else {
          console.error('Payment error details:', data);
          const errorMessage = data.detail ? JSON.stringify(data.detail) : 'Unknown error occurred.';
          setPopupMessage(`Payment failed: ${errorMessage}`);
        }
      })
      .catch((error) => {
        console.error('Error processing payment:', error);
        setPopupMessage(`An error occurred during payment: ${error.message || error}`);
      })
      .finally(() => {
        setIsPaymentProcessing(false);
      });
  };

  return (
    <div className={`payment-confirmation-page ${document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode'}`}>
      <motion.h1
        className="heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        Payment Confirmation for {event.title}
      </motion.h1>

      <motion.div
        className={`payment-details ${document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode'}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p><strong>Seats Selected:</strong> {selectedSeats.join(', ')}</p>
        <p><strong>Total Tickets:</strong> {seatCount}</p>
        <p><strong>Price per Ticket:</strong> ₹ {pricePerTicket}</p>
        <p><strong>Total Amount:</strong> ₹ {totalPrice}</p>

        <div className="contact-info">
          <label htmlFor="email">Email Address:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>

        <motion.button
          onClick={handlePayment}
          className="confirm-payment-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isPaymentProcessing || emailError || !email}
        >
          {isPaymentProcessing ? 'Processing Payment...' : 'Confirm Payment'}
        </motion.button>

        {popupMessage && (
          <div className="popup-message">
            {popupMessage}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentConfirmation;
