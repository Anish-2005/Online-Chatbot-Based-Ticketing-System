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

    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(nextTheme);
      return;
    }

    if (isAnimatingRef.current) {
      return;
    }

    const x = typeof eventOrPoint?.clientX === 'number'
      ? eventOrPoint.clientX
      : typeof eventOrPoint?.x === 'number'
        ? eventOrPoint.x
        : window.innerWidth / 2;

    const y = typeof eventOrPoint?.clientY === 'number'
      ? eventOrPoint.clientY
      : typeof eventOrPoint?.y === 'number'
        ? eventOrPoint.y
        : window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    isAnimatingRef.current = true;

    // Fallback if View Transitions API is not supported
    if (!document.startViewTransition) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;

      if (nextTheme === 'dark') {
        htmlElement.classList.add('dark');
        bodyElement.classList.add('dark');
        bodyElement.classList.remove('light');
      } else {
        htmlElement.classList.remove('dark');
        bodyElement.classList.add('light');
        bodyElement.classList.remove('dark');
      }

      htmlElement.setAttribute('data-theme', nextTheme);
      bodyElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      localStorage.setItem(LEGACY_THEME_STORAGE_KEY, nextTheme);
      setTheme(nextTheme);
      isAnimatingRef.current = false;
      return;
    }

    // This creates what feels like an authentic circle expanding and revealing the NEW theme underneath natively!
    const transition = document.startViewTransition(() => {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;

      if (nextTheme === 'dark') {
        htmlElement.classList.add('dark');
        bodyElement.classList.add('dark');
        bodyElement.classList.remove('light');
      } else {
        htmlElement.classList.remove('dark');
        bodyElement.classList.add('light');
        bodyElement.classList.remove('dark');
      }

      htmlElement.setAttribute('data-theme', nextTheme);
      bodyElement.setAttribute('data-theme', nextTheme);

      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      localStorage.setItem(LEGACY_THEME_STORAGE_KEY, nextTheme);

      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      // Clean, native, layout-revealing circular animation
      document.documentElement.animate(
        {
          clipPath: nextTheme === 'dark' ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: nextTheme === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
        }
      );
    });

    transition.finished.finally(() => {
      isAnimatingRef.current = false;
    });
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
