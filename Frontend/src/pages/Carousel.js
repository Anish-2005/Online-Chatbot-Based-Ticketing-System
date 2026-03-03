import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { fetchShows } from '../services/shows';
import './Carousel.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomPrevArrow = ({ className, onClick }) => (
  <button
    type="button"
    className={`${className} carousel-3d-arrow carousel-3d-arrow-prev`}
    onClick={onClick}
    aria-label="Previous show"
  />
);

const CustomNextArrow = ({ className, onClick }) => (
  <button
    type="button"
    className={`${className} carousel-3d-arrow carousel-3d-arrow-next`}
    onClick={onClick}
    aria-label="Next show"
  />
);

const Carousel = ({ onSlideClick }) => {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [shows, setShows] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const navigate = useNavigate();

  const totalShows = shows.length;
  const visibleSlides = Math.max(1, Math.min(slidesToShow, totalShows || 1));
  const shouldLoop = totalShows > visibleSlides;

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await fetchShows();
        setShows(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth <= 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: shouldLoop,
    speed: 800,
    cssEase: 'cubic-bezier(0.22, 1, 0.36, 1)',
    slidesToShow: visibleSlides,
    slidesToScroll: 1,
    autoplay: shouldLoop,
    autoplaySpeed: 2300,
    pauseOnHover: true,
    arrows: totalShows > 1,
    centerMode: totalShows > 1,
    centerPadding: '0px',
    initialSlide: 0,
    swipeToSlide: true,
    draggable: true,
    focusOnSelect: true,
    afterChange: (next) => {
      setActiveIndex(next);
    },
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  const getSlideStateClass = (index) => {
    if (totalShows <= 1) return 'is-active';

    const rightDistance = (index - activeIndex + totalShows) % totalShows;
    const leftDistance = (activeIndex - index + totalShows) % totalShows;

    if (rightDistance === 0) return 'is-active';
    if (rightDistance === 1) return 'is-next';
    if (leftDistance === 1) return 'is-prev';
    if (rightDistance === 2) return 'is-next-2';
    if (leftDistance === 2) return 'is-prev-2';
    return 'is-far';
  };

  const handleSlideClick = (item) => {
    if (onSlideClick) {
      onSlideClick(item);
    }

    navigate('/booking-manual', { state: { event: item } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`carousel-3d-container ${isDark ? 'dark-mode' : ''}`}
    >
      <h2 className="carousel-3d-title">Trending Shows</h2>

      <Slider {...settings} className="carousel-3d-track">
        {shows.map((item, index) => (
          <div
            key={item.id || item._id || `${item.title}-${index}`}
            className={`carousel-3d-slide ${getSlideStateClass(index)}`}
            onClick={() => handleSlideClick(item)}
          >
            <img src={item.image} alt={item.title} className="carousel-3d-image" />
            <div className="carousel-3d-overlay">
              <h3 className="carousel-3d-slide-title">{item.title}</h3>
              <p className="carousel-3d-meta">{item.date} • {item.time}</p>
              <p className="carousel-3d-meta">{item.location}</p>
              <p className="carousel-3d-price">{item.price}</p>
            </div>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
};

export default Carousel;
