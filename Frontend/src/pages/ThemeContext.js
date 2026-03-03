import React, { createContext, useState, useEffect, useContext } from 'react';

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

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
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
