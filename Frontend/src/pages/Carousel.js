import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { fetchShows } from '../services/shows';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiMapPin, FiStar } from 'react-icons/fi';
import './Carousel.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomPrevArrow = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1, x: -5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:bg-indigo-600 transition-colors hidden md:flex"
  >
    <FiChevronLeft size={24} />
  </motion.button>
);

const CustomNextArrow = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1, x: 5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:bg-indigo-600 transition-colors hidden md:flex"
  >
    <FiChevronRight size={24} />
  </motion.button>
);

const Carousel = ({ onSlideClick }) => {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [shows, setShows] = useState([]);
  const navigate = useNavigate();
  const sliderRef = React.useRef(null);
  const totalSlides = shows.length;
  const desktopSlides = Math.min(3, Math.max(totalSlides, 1));
  const tabletSlides = Math.min(2, Math.max(totalSlides, 1));
  const mobileSlides = 1;
  const canLoopDesktop = totalSlides > desktopSlides;
  const canScroll = totalSlides > 1;

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await fetchShows();
        // Add some mock data if empty for demo or fallback
        setShows(Array.isArray(data) && data.length > 0 ? data : []);
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!sliderRef.current || totalSlides === 0) return;
    setActiveIndex(0);
    if (typeof sliderRef.current.slickGoTo === 'function') {
      sliderRef.current.slickGoTo(0, true);
    }
  }, [totalSlides]);

  const normalizeIndex = (index) => (totalSlides ? index % totalSlides : 0);
  const enableEmphasis = canLoopDesktop;

  const settings = {
    dots: canScroll,
    infinite: canLoopDesktop,
    speed: 1000,
    cssEase: 'cubic-bezier(0.23, 1, 0.32, 1)',
    slidesToShow: desktopSlides,
    slidesToScroll: 1,
    autoplay: canLoopDesktop,
    autoplaySpeed: 5000,
    arrows: canLoopDesktop,
    centerMode: canLoopDesktop,
    centerPadding: canLoopDesktop ? '0px' : '0px',
    swipeToSlide: canScroll,
    focusOnSelect: canScroll,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: (current, next) => setActiveIndex(normalizeIndex(next)),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: tabletSlides,
          centerMode: totalSlides > tabletSlides,
          infinite: totalSlides > tabletSlides,
          autoplay: totalSlides > tabletSlides,
          arrows: totalSlides > tabletSlides,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: mobileSlides,
          centerMode: totalSlides > mobileSlides,
          infinite: totalSlides > mobileSlides,
          autoplay: totalSlides > mobileSlides,
          centerPadding: totalSlides > mobileSlides ? '20px' : '0px',
          arrows: false,
        }
      }
    ],
    appendDots: dots => (
      <div className="mt-8">
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
    )
  };

  const handleSlideClick = (item) => {
    if (onSlideClick) onSlideClick(item);
    navigate('/booking-manual', { state: { event: item } });
  };

  return (
    <div className={`relative px-2 sm:px-6 ${isDark ? 'dark' : ''}`}>
      <Slider {...settings} ref={sliderRef}>
        {shows.map((item, index) => (
          <div key={item.id || index} className="px-3 py-4 outline-none">
            <motion.div
              animate={{
                scale: enableEmphasis ? (activeIndex === index ? 1 : 0.9) : 1,
                opacity: enableEmphasis ? (activeIndex === index ? 1 : 0.6) : 1,
                y: enableEmphasis ? (activeIndex === index ? 0 : 10) : 0
              }}
              transition={{ duration: 0.6 }}
              onClick={() => handleSlideClick(item)}
              className="relative group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 dark:border-slate-800/50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                {/* Badge */}
                <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                  <FiStar className="text-yellow-400 fill-yellow-400" />
                  Premium Show
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-heading font-black text-white mb-3 line-clamp-1">{item.title}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <FiCalendar className="text-indigo-400" />
                      {item.date} • {item.time}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <FiMapPin className="text-indigo-400" />
                      {item.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-indigo-400">₹{item.price}</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white"
                    >
                      <FiChevronRight size={20} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute -inset-4 bg-indigo-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
