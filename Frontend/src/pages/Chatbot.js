import { useEffect } from 'react';
import { processChatbotBooking, getMyPaidTickets } from '../services/bookings';
import { fetchShows } from '../services/shows';

const Chatbot = () => {
  useEffect(() => {
    const dfMessenger = document.querySelector('df-messenger');
    if (!dfMessenger) return;

    // FORCING SIDEBAR ON DESKTOP
    const forceSidebar = () => {
      if (window.innerWidth >= 992) {
        // Core expanding attributes
        dfMessenger.setAttribute('expand', 'true');
        dfMessenger.classList.add('is-sidebar');

        // Target the internal shadow DOM directly
        const shadow = dfMessenger.shadowRoot;
        if (shadow) {
          const wrapper = shadow.querySelector('.df-messenger-wrapper');
          const button = shadow.querySelector('.df-messenger-button');
          const chatWindow = shadow.querySelector('.df-messenger-chat-window');

          if (wrapper) wrapper.style.height = '100vh';
          if (button) button.style.display = 'none';
          
          if (chatWindow) {
            chatWindow.style.position = 'fixed';
            chatWindow.style.top = '0';
            chatWindow.style.right = '0';
            chatWindow.style.height = '100vh';
            chatWindow.style.width = '450px';
            chatWindow.style.borderRadius = '0';
            chatWindow.style.boxShadow = 'none';
          }
        }
      } else {
        dfMessenger.removeAttribute('expand');
        dfMessenger.classList.remove('is-sidebar');
        
        const shadow = dfMessenger.shadowRoot;
        if (shadow) {
          const button = shadow.querySelector('.df-messenger-button');
          if (button) button.style.display = 'block';
        }
      }
    };

    // Use a mutation observer to wait for Dialogflow to initialize its shadow DOM
    const observer = new MutationObserver(forceSidebar);
    observer.observe(dfMessenger, { attributes: true, childList: true, subtree: true });

    // Initial check
    forceSidebar();
    
    // Also check when window resizes
    window.addEventListener('resize', forceSidebar);

    const listAvailableShows = async () => {
      try {
        const shows = await fetchShows();
        const availableShows = shows ? shows.filter(s => Number(s.ticketsLeft || 0) > 0) : [];
        if (availableShows.length > 0) {
          let message = "🏛️ LIVE MUSEUM SCHEDULE\n\n";
          message += "The following shows are currently active in our live database:\n\n";
          availableShows.forEach(show => {
            message += `🔹 ${show.title.toUpperCase()}\n`;
            message += `🎟️ ${show.ticketsLeft} seats left · ₹${show.price_int || show.price}\n`;
            message += `🕒 ${show.time} @ ${show.location || "Main Hall"}\n\n`;
          });
          message += "Which live show would you like to book?";
          setTimeout(() => { dfMessenger.renderCustomText(message); }, 500);
        }
      } catch (error) {
        console.error("Proactive fetch failed:", error);
      }
    };

    const handleResponse = async (event) => {
      const queryResult = event.detail.response?.queryResult;
      const queryText = queryResult?.queryText?.toLowerCase();
      if (queryText === 'shows' || queryText === 'list' || queryText === 'list shows') {
        await listAvailableShows();
      }
      if (queryResult && queryResult.fulfillmentMessages) {
        const customPayload = queryResult.fulfillmentMessages.find(m => m.payload);
        if (customPayload && customPayload.payload) {
          const { action, parameters } = customPayload.payload;
          if (action === 'LIST_SHOWS') await listAvailableShows();
          if (action === 'BOOK_TICKET') {
            const { show_name, number_of_tickets, email } = parameters;
            try {
              const result = await processChatbotBooking({ eventTitle: show_name, seatCount: parseInt(number_of_tickets), email: email });
              dfMessenger.renderCustomText(`✅ SUCCESS!\n\nYour tickets for ${show_name} are reserved.\n\nTicket Code: ${result.ticketCode}\n\nA confirmation was sent to ${email}.`);
            } catch (error) { dfMessenger.renderCustomText(`❌ Booking failed: ${error.message}`); }
          }
          if (action === 'CHECK_STATUS') {
            const { email } = parameters;
            try {
              const tickets = await getMyPaidTickets(email);
              if (!tickets || tickets.length === 0) dfMessenger.renderCustomText(`No bookings found for ${email}.`);
              else {
                const list = tickets.slice(0, 3).map(t => `🎫 ${t.eventTitle}: ${t.ticketCode}`).join('\n');
                dfMessenger.renderCustomText(`🔎 Your recent bookings:\n${list}`);
              }
            } catch (error) { dfMessenger.renderCustomText(`⚠️ Failed to check status: ${error.message}`); }
          }
        }
      }
    };

    dfMessenger.addEventListener('df-messenger-response-received', handleResponse);
    dfMessenger.addEventListener('df-messenger-chat-opened', listAvailableShows);
    
    return () => {
      dfMessenger.removeEventListener('df-messenger-response-received', handleResponse);
      dfMessenger.removeEventListener('df-messenger-chat-opened', listAvailableShows);
      window.removeEventListener('resize', forceSidebar);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default Chatbot;
