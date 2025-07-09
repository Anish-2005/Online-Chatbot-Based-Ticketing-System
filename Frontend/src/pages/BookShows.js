import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';
import AboutMuseum from './AboutMuseum';
import Chatbot from './Chatbot';
import './BookShows.css';

const Bookshows = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [showAboutMuseum, setShowAboutMuseum] = useState(false);
  const navigate = useNavigate();

  // Function to handle "View Full Booking Manual" click
  const handleViewBookingManual = () => {
    if (selectedSlide) {
      navigate('/booking-manual', { state: { event: selectedSlide } });
    }
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
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="toggle-dark-mode-btn"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Chatbot Button */}
      <Chatbot className="chatbot-btn" darkMode={darkMode} />

      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Book Your Shows
      </motion.h1>

      {/* Carousel Component */}
      <motion.div
        className="carousel-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Carousel isDarkMode={darkMode} onSlideClick={setSelectedSlide} />
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
