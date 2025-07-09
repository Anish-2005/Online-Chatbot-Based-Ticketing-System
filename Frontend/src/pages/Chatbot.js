import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import img1 from '../images/Favicon1.ico.png';

const Chatbot = ({ darkMode }) => {
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
        script.onload = () => setIsScriptLoaded(true); // Mark as loaded when script is fully loaded
      } else {
        setIsScriptLoaded(true); // Mark as loaded if script already exists
      }
    }

    return () => {
      // No need to remove the script on unmount, as it will cause reloading issues if remounted
    };
  }, [isScriptLoaded]);

  return (
    <>
      {/* Dialogflow Chatbot Button */}
      <div className="chatbot-container">
        {isScriptLoaded && (
          <df-messenger
            intent="WELCOME"
            chat-title="Chatticket"
            chat-icon="https://www.pngkit.com/png/full/502-5023267_itpalooza-is-a-not-for-profit-community-driven.png"
            agent-id="f869a013-1615-48d8-a6fb-c732a3460178"
            language-code="en"
            class={darkMode ? 'dark-theme' : 'light-theme'}
          ></df-messenger>
        )}
      </div>
    </>
  );
};

export default Chatbot;
