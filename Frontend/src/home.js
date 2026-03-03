import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './home.css';
import { VscAccount } from 'react-icons/vsc';
import { FaTicketAlt, FaClock, FaShieldAlt, FaHeadset } from 'react-icons/fa';

// src/pages/Home.js
function Home() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admindashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: FaTicketAlt,
      title: 'Easy Booking',
      description: 'Book tickets in seconds with our intuitive interface'
    },
    {
      icon: FaClock,
      title: 'Real-time Updates',
      description: 'Get instant notifications about shows and bookings'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payment',
      description: 'Your transactions are protected with latest security'
    },
    {
      icon: FaHeadset,
      title: 'AI Chatbot Support',
      description: 'Get help anytime with our intelligent chatbot'
    },
  ];

  return (
    <div className="landing-wrapper">
      {/* Admin Login Button - Repositioned */}
      <motion.button
        onClick={handleAdminLogin}
        className="admin-login-btn"
        whileHover={{ scale: 1.1, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.95 }}
        title="Admin Login"
      >
        <VscAccount />
      </motion.button>

      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Discover Extraordinary Experiences
            </h1>
            <p className="hero-subtitle">
              Book museum tickets and shows seamlessly with AI-powered support. 
              Your gateway to unforgettable cultural moments.
            </p>
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(108, 92, 231, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bookshows')}
            >
              Explore Shows
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-image"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="image-placeholder">
              <svg viewBox="0 0 400 300" className="hero-svg">
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6C5CE7" />
                    <stop offset="100%" stopColor="#A29BFE" />
                  </linearGradient>
                  <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00B894" />
                    <stop offset="100%" stopColor="#55EFC4" />
                  </linearGradient>
                </defs>
                {/* Theater/Museum building shape */}
                <rect x="50" y="60" width="300" height="200" fill="url(#heroGrad)" rx="10" />
                {/* Doors */}
                <rect x="80" y="100" width="40" height="120" fill="#2D3436" rx="2" />
                <rect x="140" y="100" width="40" height="120" fill="#2D3436" rx="2" />
                <rect x="200" y="100" width="40" height="120" fill="#2D3436" rx="2" />
                <rect x="260" y="100" width="40" height="120" fill="#2D3436" rx="2" />
                {/* Windows */}
                <circle cx="100" cy="70" r="8" fill="#FFE66D" />
                <circle cx="160" cy="70" r="8" fill="#FFE66D" />
                <circle cx="220" cy="70" r="8" fill="#FFE66D" />
                <circle cx="280" cy="70" r="8" fill="#FFE66D" />
                {/* Ticket in foreground */}
                <g transform="translate(20, 150)">
                  <rect width="60" height="90" fill="url(#ticketGrad)" rx="4" stroke="#00B894" strokeWidth="2" />
                  <text x="30" y="40" textAnchor="middle" fill="#2D3436" fontSize="16" fontWeight="bold">ADMIT</text>
                  <text x="30" y="60" textAnchor="middle" fill="#2D3436" fontSize="12">ONE</text>
                </g>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span></span>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="features-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="features-header">
          <h2>Why Choose Us</h2>
          <p>Experience booking like never before</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ translateY: -10, boxShadow: '0 20px 40px rgba(108, 92, 231, 0.2)' }}
            >
              <div className="feature-icon">
                <feature.icon />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="cta-content">
          <h2>Ready to Book Your Next Experience?</h2>
          <p>Join thousands of satisfied visitors who discovered amazing shows</p>
          <motion.button
            className="cta-button secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/bookshows')}
          >
            Start Booking Now
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <p>Your premier destination for museum and cultural events</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => navigate('/bookshows')}>Book Tickets</button></li>
              <li><button onClick={() => navigate('/events')}>Events</button></li>
              <li><button onClick={() => navigate('/login')}>Login</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <p>24/7 AI Chatbot Support</p>
            <p>contact@chatticket.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ChatTicket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
