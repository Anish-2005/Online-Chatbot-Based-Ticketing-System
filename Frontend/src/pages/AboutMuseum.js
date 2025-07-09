import React from 'react';
import { motion } from 'framer-motion';
import './AboutMuseum.css'; // Import the CSS file for styling
import img1 from '../images/education-museum.jpeg';
import img2 from '../images/exhibition-museum.jpeg';
import img3 from '../images/museum-interactive.jpg';
import img4 from '../images/specialevents-museum.webp';

const AboutMuseum = () => {
  return (
    <div className="about-museum-container">
      <motion.div
        className="intro-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Welcome to [Museum Name]</h1>
        <p>
          At [Museum Name], we are dedicated to preserving and showcasing our rich cultural and historical heritage. Our museum is a vibrant space where art, history, and innovation come together to offer a unique and engaging experience for visitors of all ages.
        </p>
      </motion.div>

      <motion.div
        className="mission-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Our Mission</h2>
        <p>
          Our mission is to inspire and educate through our diverse collections, interactive exhibits, and educational programs. We aim to provide a space where history comes alive, where art ignites curiosity, and where learning is an adventure.
        </p>
      </motion.div>

      <motion.div
        className="features-section"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>What We Offer</h2>
        <ul>
          <li>
            <img src={img1} alt="Diverse Exhibits" className="feature-image" />
            <p className="feature-text">Diverse Exhibits: From ancient artifacts to contemporary art, our exhibits cover a wide range of themes and periods.</p>
          </li>
          <li>
            <img src={img2} alt="Interactive Experiences" className="feature-image" />
            <p className="feature-text">Interactive Experiences: Hands-on activities and interactive displays that allow visitors to engage with the exhibits in a meaningful way.</p>
          </li>
          <li>
            <img src={img3} alt="Educational Programs" className="feature-image" />
            <p className="feature-text">Educational Programs: Programs designed to enhance learning and provide deeper insights into our exhibits and collections.</p>
          </li>
          <li>
            <img src={img4} alt="Special Events" className="feature-image" />
            <p className="feature-text">Special Events: Exciting opportunities to engage with experts and experience our museum in new ways.</p>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AboutMuseum;
