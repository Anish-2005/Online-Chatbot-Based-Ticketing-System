import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './home.css';
import { VscAccount } from 'react-icons/vsc'; // Import the Admin Icon

// src/pages/Home.js
function Home() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admindashboard');
  };

  return (
    
    <motion.section
      className="landing-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Admin Login Button */}
      <button
        onClick={handleAdminLogin}
        className="admin-login-btn"
      >
        <VscAccount />
      </button>

      <div className="landing-content">
        <motion.h1
          className="landing-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Welcome to ChatTicket
        </motion.h1>
        <motion.p
          className="landing-subtitle"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          Your one-stop solution for online ticketing with seamless chatbot support.
        </motion.p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/bookshows')}
        >
          Get Started
        </motion.button>
      </div>
      <motion.div
        className="landing-image"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
      >
        <img
          src="https://www.cm.com/cdn/web/en/hero/caic-productpage-herov3.png"
          alt="ChatTicket Landing"
        />
      </motion.div>
    </motion.section>
  );
}

export default Home;
