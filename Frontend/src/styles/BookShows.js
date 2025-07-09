import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel'; // Adjust the import path if necessary
import BookingManual from '../pages/BookingManual'; // Adjust the import path if necessary
import AboutMuseum from '../pages/AboutMuseum'; // Import the AboutMuseum component
import BookTicket from './MuseumTicket'; // Import the BookTicket component
import Chatbot from './Chatbot'; // Import the Chatbot component
import './BookShows.css'; // Import CSS file for Bookshows styling
import { FaHome } from 'react-icons/fa'; // Import Home icon
import { VscAccount } from "react-icons/vsc";

const Bookshows = () => {
  const [darkMode, setDarkMode] = useState(false); // State for dark/light mode
  const [selectedSlide, setSelectedSlide] = useState(null); // State for the selected slide
  const [showAboutMuseum, setShowAboutMuseum] = useState(false); // State to control AboutMuseum display
  const navigate = useNavigate(); // Use useNavigate for navigation

  // Function to handle "View Full Booking Manual" click
  const handleViewBookingManual = () => {
    if (selectedSlide) {
      navigate('/booking-manual', { state: { slide: selectedSlide } });
    }
  };

  // Function to handle "Back to Home" click
  const handleBackToDashboard = () => {
    navigate('/home'); // Navigate back to the home page
  };

  // Function to handle "Admin Login" click
  const handleAdminLogin = () => {
    navigate('/admindashboard'); // Navigate to the admin login page
  };

  // Toggle dark mode class on the body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`bookshows-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="button-container">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="toggle-dark-mode-btn"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Back to Home button */}
        <button
          onClick={handleBackToDashboard}
          className="back-to-dashboard-btn"
        >
          <FaHome className="back-to-dashboard-icon" /> Return to Home
        </button>
      </div>

      {/* Chatbot Button */}
      <Chatbot className="chatbot-btn" />

      {/* Admin Login Button */}
      <button
        onClick={handleAdminLogin}
        className="admin-login-btn"
      >
        <VscAccount />
      </button>

      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Book Your Shows
      </motion.h1>

      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="content-container"
      >
        {/* Additional content */}
      </motion.div>

      {/* Carousel Component */}
      <motion.div
        className="carousel-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Carousel onSlideClick={setSelectedSlide} />
      </motion.div>

      {/* Booking Manual Component */}
      {/* Uncomment if needed */}
      {/* <motion.div
        className="booking-manual-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <BookingManual slide={selectedSlide} />
        {selectedSlide && (
          <button
            onClick={handleViewBookingManual}
            className="view-full-manual-btn"
          >
            View Full Booking Manual
          </button>
        )}
      </motion.div> */}

      {/* Book Ticket Section */}
      <motion.div
        className="book-ticket-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <BookTicket />
      </motion.div>

      {/* About Museum Section */}
      <motion.div
        className="about-museum-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <button
          onClick={() => setShowAboutMuseum(!showAboutMuseum)}
          className="toggle-about-museum-btn"
        >
          {showAboutMuseum ? 'Hide About Museum' : 'About the Museum'}
        </button>

        {showAboutMuseum && <AboutMuseum />}
      </motion.div>
    </div>
  );
};

export default Bookshows;
