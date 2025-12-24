import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Booking.css';

const GeneralTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};

  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [seatCount, setSeatCount] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event) {
      fetchTickets();
    } else {
      navigate('/booking-manual');
    }
  }, [event, navigate]);

  const fetchTickets = () => {
    fetch(`https://online-chatbot-based-ticketing-system-4whh.onrender.com/ticket_booking?event_id=66dcec58fea7a83d2186c52f`)
      .then(response => response.json())
      .then(data => setTicketsLeft(data.ticketsLeft))
      .catch(error => console.error('Error fetching tickets:', error));
  };

  const handleConfirmBooking = () => {
    // Validation checks
    if (seatCount === 0) {
      setError('Booking Failed: Number of tickets cannot be zero.');
      return;
    }

    const data = {
      eventId: '66dcec58fea7a83d2186c52f',
      ticketsBought: seatCount
    };

    fetch('https://online-chatbot-based-ticketing-system-4whh.onrender.com/ticket_booking/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTicketsLeft(data.ticketsLeft);
          setError(null); // Clear any previous error message
          navigate('/paymentconfirmation', { state: { event, seatCount } });
        } else {
          setError('Booking Failed');
        }
      })
      .catch(error => {
        console.error('Error booking tickets:', error);
        setError('Booking Failed');
      });
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  return (
    <div className={`booking-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button
        className={`dark-mode-toggle ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={handleToggleDarkMode}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <motion.h1
        className="heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        Booking for {event.title}
      </motion.h1>

      <motion.div
        className="booking-details"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Price per Ticket:</strong> {event.price}</p>
        <p><strong>Tickets Left:</strong> {ticketsLeft}</p>

        <div className="ticket-selection">
          <label htmlFor="seatCount">
            Number of Tickets:
          </label>
          <input
            id="seatCount"
            type="number"
            value={seatCount}
            min="1"
            max={ticketsLeft}
            onChange={(e) => setSeatCount(Number(e.target.value))}
          />
        </div>

        <motion.button
          onClick={handleConfirmBooking}
          className="confirm-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Confirm Booking
        </motion.button>

        {error && (
          <p className="error-message" style={{ color: 'red' }}>
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default GeneralTicket;
