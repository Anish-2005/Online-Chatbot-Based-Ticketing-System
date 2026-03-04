import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import './Chatbot.css';


const Chatbot = () => {
  const { isDark } = useTheme();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already added
    if (!isScriptLoaded) {
      const scriptExists = document.querySelector('script[src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"]');

      if (!scriptExists) {
        // Dynamically load the Dialogflow script only if it hasn't been loaded
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => setIsScriptLoaded(true);
      } else {
        setIsScriptLoaded(true);
      }
    }

    return () => {
      // No need to remove the script on unmount
    };
  }, [isScriptLoaded]);

  return (
    <div className="chatbot-container" style={{ zIndex: 2147483647 }}>
      {isScriptLoaded && (
        <df-messenger
          intent="WELCOME"
          chat-title="ChatTicket Concierge"
          chat-icon="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
          agent-id="f869a013-1615-48d8-a6fb-c732a3460178"
          language-code="en"
          className={isDark ? 'dark-theme' : ''}
        ></df-messenger>
      )}
    </div>
  );
};

export default Chatbot;
