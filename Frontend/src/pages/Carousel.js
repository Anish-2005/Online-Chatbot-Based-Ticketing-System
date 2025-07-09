import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const CustomPrevArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{
      ...style,
      display: 'block',
      background: 'gray', // Change arrow background color
      borderRadius: '50%', // Make it circular
      zIndex: 5 // Ensure the arrow is visible above other elements
    }}
    onClick={onClick}
  />
);

const CustomNextArrow = ({ className, style, onClick }) => (
  <div
    className={className}
    style={{
      ...style,
      display: 'block',
      background: 'gray', // Change arrow background color
      borderRadius: '50%',
      zIndex: 5
    }}
    onClick={onClick}
  />
);

const Carousel = ({ isDarkMode, onSlideClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shows, setSlides] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(3); // Default for larger screens
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('https://fastapi-deploy-app.onrender.com/shows');
        if (!response.ok) {
          throw new Error('Error fetching slides');
        }
        const data = await response.json();
        setSlides(data);
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    // Update the slidesToShow based on screen width
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSlidesToShow(1); // Show only 1 slide on smaller screens
      } else {
        setSlidesToShow(3); // Default for larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set the initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1700,
    arrows: true,
    centerMode: true,
    centerPadding: '0',
    initialSlide: 5,
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
    prevArrow: <CustomPrevArrow />,  // Apply custom arrow for previous
    nextArrow: <CustomNextArrow />  // Apply custom arrow for next
  };

  const handleSlideClick = (item) => {
    onSlideClick(item);
    navigate('/booking-manual', { state: { event: item } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`carousel-container ${isDarkMode ? 'dark-mode' : ''}`}
    >
      <h2
        className="carousel-title"
        style={{
          color: isDarkMode ? '#ffffff' : '#333333', // White in dark mode, dark gray in light mode
        }}
      >
        Featured Events
      </h2>
      <Slider {...settings} className="carousel-slider">
        {shows.map((item, index) => (
          <div
            key={item.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : 'inactive'}`}
            onClick={() => handleSlideClick(item)}
          >
            <img src={item.image} alt={item.title} className="carousel-image" />
            <div className="carousel-content">
              <h3 className="carousel-slide-title">{item.title}</h3>
              <p>{item.date}</p>
              <p>{item.time}</p>
              <p>{item.location}</p>
              <p>{item.price}</p>
            </div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
};

export default Carousel;
