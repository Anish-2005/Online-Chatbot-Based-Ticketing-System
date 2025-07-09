// src/components/Navbar.js
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="navbar"
    >
      <ul className="navbar-list">
        {/* Booking Manual */}
        <li className="navbar-item">
          <NavLink
            to="/booking-manual"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
          >
            Booking Manual
          </NavLink>
        </li>

        {/* Events */}
        <li className="navbar-item">
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
          >
            Events
          </NavLink>
        </li>

        {/* My Shows */}
        <li className="navbar-item">
          <NavLink
            to="/my-shows"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
          >
            My Shows
          </NavLink>
        </li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
