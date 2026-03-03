import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import './BookingManualPage.css';
import { FaHome } from 'react-icons/fa';

const BookingManualPage = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Access the event data from location state
  const { event } = location.state || {};

  // Navigate back to home
  const handleBackToHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    if (!event) {
      console.warn('No event data received');
    }
  }, [event]);

  return (
    <div className={`booking-manual-page ${isDark ? 'dark' : 'light'}`}>
      {!event ? (
        <div className="no-show-selected">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No Show Selected
          </motion.h1>
          <p className="mt-4">Please go back to the dashboard and select a show from the carousel.</p>
        </div>
      ) : (
        <motion.div
          className={`movie-box ${isDark ? 'dark' : ''}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        >
          <img src={event.image} alt={event.title} className="movie-image" />
          <div className="movie-details">
            <h1 className={`movie-title ${isDark ? 'dark' : ''}`}>{event.title}</h1>
            <p className={`movie-info ${isDark ? 'dark' : ''}`}><strong>Date:</strong> {event.date}</p>
            <p className={`movie-info ${isDark ? 'dark' : ''}`}><strong>Location:</strong> {event.location}</p>
            <p className={`movie-info ${isDark ? 'dark' : ''}`}><strong>Price:</strong> {event.price}</p>
            <p className={`movie-description ${isDark ? 'dark' : ''}`}>
              Enjoy the detailed view of this event. You can book tickets, view more details, and much more here.
            </p>
          </div>
        </motion.div>
      )}

      <div className="action-buttons">
        <motion.button
          className={`book-tickets-button ${isDark ? 'dark' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/booking', { state: { event } })}
        >
          Book Tickets
        </motion.button>
      </div>
    </div>
  );
};

export default BookingManualPage;
