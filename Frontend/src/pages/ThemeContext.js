import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

// Create the Theme Context
export const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'app-theme';
const LEGACY_THEME_STORAGE_KEY = 'theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme =
    localStorage.getItem(THEME_STORAGE_KEY) ||
    localStorage.getItem(LEGACY_THEME_STORAGE_KEY);

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return 'light';
};

// Create a ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const isAnimatingRef = useRef(false);

  // Apply theme to document whenever it changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(LEGACY_THEME_STORAGE_KEY, theme);
    
    // Apply to document root
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      bodyElement.classList.add('dark');
      bodyElement.classList.remove('light');
    } else {
      htmlElement.classList.remove('dark');
      bodyElement.classList.add('light');
      bodyElement.classList.remove('dark');
    }

    htmlElement.setAttribute('data-theme', theme);
    bodyElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleStorageSync = (event) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== LEGACY_THEME_STORAGE_KEY) {
        return;
      }

      const nextTheme = event.newValue;
      if (nextTheme === 'dark' || nextTheme === 'light') {
        setTheme(nextTheme);
      }
    };

    window.addEventListener('storage', handleStorageSync);

    return () => {
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  const toggleTheme = (eventOrPoint) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      setTheme(nextTheme);
      return;
    }

    if (isAnimatingRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const x = typeof eventOrPoint?.clientX === 'number'
      ? eventOrPoint.clientX
      : typeof eventOrPoint?.x === 'number'
      ? eventOrPoint.x
      : viewportWidth / 2;

    const y = typeof eventOrPoint?.clientY === 'number'
      ? eventOrPoint.clientY
      : typeof eventOrPoint?.y === 'number'
      ? eventOrPoint.y
      : viewportHeight / 2;

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.willChange = 'clip-path, opacity';
    overlay.style.background = nextTheme === 'dark'
      ? 'radial-gradient(circle at 30% 20%, #334155 0%, #0f172a 60%, #020617 100%)'
      : 'radial-gradient(circle at 30% 20%, #ffffff 0%, #f8fafc 55%, #e2e8f0 100%)';
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;

    document.body.appendChild(overlay);
    isAnimatingRef.current = true;

    const animation = overlay.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 0.98 },
        { clipPath: `circle(${maxRadius + 40}px at ${x}px ${y}px)`, opacity: 1 },
      ],
      {
        duration: 620,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    window.setTimeout(() => {
      setTheme(nextTheme);
    }, 220);

    animation.onfinish = () => {
      overlay.remove();
      isAnimatingRef.current = false;
    };

    animation.oncancel = () => {
      overlay.remove();
      isAnimatingRef.current = false;
      setTheme(nextTheme);
    };
  };

  const setLightTheme = () => {
    setTheme('light');
  };

  const setDarkTheme = () => {
    setTheme('dark');
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        setLightTheme, 
        setDarkTheme, 
        isDark 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the Theme Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
