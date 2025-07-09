import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Booking.css';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};
  console.log("Event", event);
  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
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
    fetch(`https://fastapi-deploy-app.onrender.com/ticket_booking?event_id=${event.id}`)
      .then(response => response.json())
      .then(data => setTicketsLeft(data.ticketsLeft))
      .catch(error => console.error('Error fetching tickets:', error));
  };

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats(prevSeats =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter(seat => seat !== seatNumber)
        : [...prevSeats, seatNumber]
    );
  };

  const handleConfirmBooking = () => {
    // Validation checks
    if (selectedSeats.length === 0 || seatCount === 0) {
      setError('Booking Failed: No seats selected.');
      return;
    }

    // Navigate to payment confirmation without updating tickets
    navigate('/paymentconfirmation', { state: { event, selectedSeats, seatCount } });
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
          initial={{opacity: 0, scale: 0.9}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.6, ease: 'easeOut'}}
      >
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Price per Ticket:</strong> {event.price}</p>
        <p><strong>Tickets Left:</strong> {ticketsLeft}</p>

        <div className="seat-selection">
          <h2>Select Your Seats</h2>
          <div className="seats">
            {[...Array(50)].map((_, index) => (
                <motion.button
                    key={index}
                    className={`seat-button ${selectedSeats.includes(index + 1) ? 'selected' : ''}`}
                    onClick={() => handleSeatSelection(index + 1)}
                    disabled={selectedSeats.length >= seatCount}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.95}}
                >
                  {index + 1}
                </motion.button>
            ))}
          </div>
        </div>

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
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
        >
          Confirm Booking
        </motion.button>

        {error && (
            <p className="error-message" style={{color: 'red'}}>
              {error}
            </p>
        )}
      </motion.div>
    </div>
  );
};

export default Booking;
