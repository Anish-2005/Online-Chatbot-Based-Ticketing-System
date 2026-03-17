import { useEffect } from 'react';
import { processChatbotBooking, getMyPaidTickets } from '../services/bookings';
import { fetchShows } from '../services/shows';

const Chatbot = () => {
  useEffect(() => {
    const dfMessenger = document.querySelector('df-messenger');
    if (!dfMessenger) return;

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
          
          setTimeout(() => {
            dfMessenger.renderCustomText(message);
          }, 200);
        } else {
          dfMessenger.renderCustomText("Welcome! No shows are currently scheduled. Please check back later!");
        }
      } catch (error) {
        console.error("Proactive fetch failed:", error);
      }
    };

    const handleResponse = async (event) => {
      console.log("Dialogflow Event Received:", event.detail);
      const queryResult = event.detail.response?.queryResult;
      
      // Fallback: If no custom action is found but user said "shows"
      const queryText = queryResult?.queryText?.toLowerCase();
      if (queryText === 'shows' || queryText === 'list' || queryText === 'list shows') {
        console.log("Keywords detected, listing shows...");
        await listAvailableShows();
      }

      if (queryResult && queryResult.fulfillmentMessages) {
        const customPayload = queryResult.fulfillmentMessages.find(m => m.payload);
        
        if (customPayload && customPayload.payload) {
          const { action, parameters } = customPayload.payload;
          console.log("Action detected:", action);

          if (action === 'LIST_SHOWS') {
            await listAvailableShows();
          }

          if (action === 'BOOK_TICKET') {
            const { show_name, number_of_tickets, email } = parameters;
            try {
              const result = await processChatbotBooking({
                eventTitle: show_name,
                seatCount: parseInt(number_of_tickets),
                email: email
              });
              dfMessenger.renderCustomText(`✅ SUCCESS!\n\nYour tickets for ${show_name} are reserved.\n\nTicket Code: ${result.ticketCode}\n\nA confirmation was sent to ${email}.`);
            } catch (error) {
              dfMessenger.renderCustomText(`❌ Booking failed: ${error.message}`);
            }
          }

          if (action === 'CHECK_STATUS') {
            const { email } = parameters;
            try {
              const tickets = await getMyPaidTickets(email);
              if (!tickets || tickets.length === 0) {
                dfMessenger.renderCustomText(`No bookings found for ${email}.`);
              } else {
                const list = tickets.slice(0, 3).map(t => `🎫 ${t.eventTitle}: ${t.ticketCode}`).join('\n');
                dfMessenger.renderCustomText(`🔎 Your recent bookings:\n${list}`);
              }
            } catch (error) {
              dfMessenger.renderCustomText(`⚠️ Failed to check status: ${error.message}`);
            }
          }
        }
      }
    };

    dfMessenger.addEventListener('df-messenger-response-received', handleResponse);
    dfMessenger.addEventListener('df-messenger-chat-opened', listAvailableShows);
    
    return () => {
      dfMessenger.removeEventListener('df-messenger-response-received', handleResponse);
      dfMessenger.removeEventListener('df-messenger-chat-opened', listAvailableShows);
    };
  }, []);

  return null;
};

export default Chatbot;
