import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Theme Context
export const ThemeContext = createContext();

// Create a ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app-theme');
      return savedTheme || 'light';
    }
    return 'light';
  });

  // Apply theme to document whenever it changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('app-theme', theme);
    
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
  }, [theme]);

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
