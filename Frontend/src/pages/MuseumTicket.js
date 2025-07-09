import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MuseumTicket.css';
import img1 from '../images/Museum-Ticket.webp';

const MuseumTicket = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Define the event data
    const event = {
      image: img1,
      title: 'Museum Exhibition',
      date: '2024-09-15',
      location: 'Museum Hall 1',
      price: '$20'
    };
    
    navigate('/booking-manual', { state: { event } });
  };

  return (
    <div className="book-ticket-container">
      <div className="image-section">
        <img src={img1} alt="Museum" className="museum-image" />
      </div>
      <div className="details-section">
        <h2>Book Your Ticket</h2>
        <p>
          Visit [Museum Name] and experience our unique collection of art, history, and interactive exhibits. Secure your tickets now and be part of this incredible journey through time and culture.
        </p>
        <button className="book-ticket-btn" onClick={handleBookNow}>Book Now</button>
      </div>
    </div>
  );
};

export default MuseumTicket;
