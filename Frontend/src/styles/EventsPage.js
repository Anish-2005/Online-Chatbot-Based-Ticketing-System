import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css'; // Import the CSS file
import Carousel from '../pages/Carousel';

const latestShows = [
   {
    id: 1,
    image: 'https://cdn-az.allevents.in/events5/banners/feab92d0b89ca33637fda294def2f37398a44674f2ca310e4dc0b8bf41040f86-rimg-w1200-h628-dc461c17-gmir?v=1725029822',
    title: 'Sunburn Arena Ft. Alan Walker',
    date: 'September 27, 2024',
    location: 'Biswa Bangla Mela Prangan',
    price: '₹1499 onwards',
  },
  {
    id: 2,
    image: 'https://m.media-amazon.com/images/M/MV5BMTA1NmUxYzItZmVmNy00YmQxLTk4Y2UtZjVkMWUwMWQ5N2IxXkEyXkFqcGc@._V1_.jpg',
    title: 'Stree 2: Sarkate Ka Aatank',
    date: 'October 2024',
    location: 'Major cinemas in Kolkata',
    price: '₹350 onwards',
  },
  {
    id: 3,
    image: 'https://b.zmtcdn.com/data/zomaland/ce3d83319751c17bbdd80954619f05d71721029953.png',
    title: 'Ghar X Helly Shah',
    date: '15th September',
    location: 'Kolkata',
    price: '₹499 onwards',
  },
  {
    id: 4,
    image: 'https://b.zmtcdn.com/data/zomaland/d639b7e07000b40558843f407cc1ece81723781534.jpeg?fit=around%7C600%3A600',
    title: 'Guru Randhawa - Moon Rise Tour',
    date: '23rd November',
    location: 'Kolkata',
    price: '₹499 onwards',
  },
  {
    id: 5,
    image: 'https://cdn-az.allevents.in/events5/banners/feab92d0b89ca33637fda294def2f37398a44674f2ca310e4dc0b8bf41040f86-rimg-w1200-h628-dc461c17-gmir?v=1725029822',
    title: 'Sunburn Arena Ft. Alan Walker',
    date: 'September 27, 2024',
    location: 'Biswa Bangla Mela Prangan',
    price: '₹1499 onwards',
  },
  {
    id: 6,
    image: 'https://m.media-amazon.com/images/M/MV5BMTA1NmUxYzItZmVmNy00YmQxLTk4Y2UtZjVkMWUwMWQ5N2IxXkEyXkFqcGc@._V1_.jpg',
    title: 'Stree 2: Sarkate Ka Aatank',
    date: 'October 2024',
    location: 'Major cinemas in Kolkata',
    price: '₹350 onwards',
  },
  {
    id: 7,
    image: 'https://b.zmtcdn.com/data/zomaland/ce3d83319751c17bbdd80954619f05d71721029953.png',
    title: 'Ghar X Helly Shah',
    date: '15th September',
    location: 'Kolkata',
    price: '₹499 onwards',
  },
  {
    id: 8,
    image: 'https://b.zmtcdn.com/data/zomaland/d639b7e07000b40558843f407cc1ece81723781534.jpeg?fit=around%7C600%3A600',
    title: 'Guru Randhawa - Moon Rise Tour',
    date: '23rd November',
    location: 'Kolkata',
    price: '₹499 onwards',
  },
  {
    id: 9,
    image: 'https://cdn-az.allevents.in/events5/banners/feab92d0b89ca33637fda294def2f37398a44674f2ca310e4dc0b8bf41040f86-rimg-w1200-h628-dc461c17-gmir?v=1725029822',
    title: 'Sunburn Arena Ft. Alan Walker',
    date: 'September 27, 2024',
    location: 'Biswa Bangla Mela Prangan',
    price: '₹1499 onwards',
  },
];

const EventsPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply the correct theme based on darkMode state
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const onSlideClick = (show) => {
    alert(`You clicked on ${show.title}`);
  };

  return (
    <div className={`events-page ${darkMode ? 'dark' : ''}`}>
      {/* Dark Mode Toggle */}
      <motion.button
        className="dark-mode-toggle"
        onClick={() => setDarkMode(!darkMode)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </motion.button>

      <motion.button
        className="back-button"
        onClick={() => navigate('/user')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to User Dashboard
      </motion.button>

      <motion.h1
        className="events-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Events
      </motion.h1>

      <motion.div
        className="carousel-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Carousel onSlideClick={onSlideClick} />
      </motion.div>

      <div className="shows-container">
        {latestShows.map((show) => (
          <motion.div
            key={show.id}
            className="show-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSlideClick(show)}
          >
            <img src={show.image} alt={show.title} className="show-image" />
            <div className="show-info">
              <h3 className="show-title">{show.title}</h3>
              <p className="show-date">{show.date}</p>
              <p className="show-location">{show.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
