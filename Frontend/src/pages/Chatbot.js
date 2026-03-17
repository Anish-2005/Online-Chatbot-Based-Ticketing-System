import { useEffect } from 'react';
import { processChatbotBooking, getMyPaidTickets } from '../services/bookings';
import { fetchShows } from '../services/shows';

/**
 * Chatbot Logic Component
 * This component manages the logic for the floating Dialogflow messenger
 * which is globally defined in index.html.
 */
const Chatbot = () => {
  useEffect(() => {
    // Find the global messenger (defined in index.html)
    const dfMessenger = document.querySelector('df-messenger');
    
    if (!dfMessenger) {
      console.warn("Dialogflow Messenger not found in HTML.");
      return;
    }

    const showShowsInChat = async () => {
      try {
        const shows = await fetchShows();
        const availableShows = shows ? shows.filter(s => Number(s.ticketsLeft || 0) > 0) : [];
        
        if (availableShows.length > 0) {
          let message = "Welcome! Here are the shows available today:\\n\\n";
          availableShows.forEach(show => {
            message += `🎭 **${show.title}**\\n`;
            message += `🎟️ ${show.ticketsLeft} tickets left - ₹${show.price_int || show.price}\\n`;
            message += `📅 ${show.time} @ ${show.location || "Main Hall"}\\n\\n`;
          });
          message += "Which one would you like to book?";
          
          setTimeout(() => {
            if (dfMessenger.renderCustomText) {
              dfMessenger.renderCustomText(message);
            }
          }, 500);
        } else {
          dfMessenger.renderCustomText("Welcome! No shows are currently scheduled. Please check back later!");
        }
      } catch (error) {
        console.error("Proactive fetch failed:", error);
      }
    };

    const handleResponse = async (event) => {
      const response = event.detail.response;
      if (response && response.queryResult && response.queryResult.fulfillmentMessages) {
        const customPayload = response.queryResult.fulfillmentMessages.find(m => m.payload);
        
        if (customPayload && customPayload.payload.action === 'BOOK_TICKET') {
          const { show_name, number_of_tickets, email } = customPayload.payload.parameters;
          try {
            const result = await processChatbotBooking({
              eventTitle: show_name,
              seatCount: parseInt(number_of_tickets),
              email: email
            });
            dfMessenger.renderCustomText(`Success! Your tickets for **${show_name}** are booked.\\n\\nTicket Code: **${result.ticketCode}**\\n\\nEnjoy the show!`);
          } catch (error) {
            dfMessenger.renderCustomText(`Booking failed: ${error.message}`);
          }
        }

        if (customPayload && customPayload.payload.action === 'CHECK_STATUS') {
          const { email } = customPayload.payload.parameters;
          try {
            const tickets = await getMyPaidTickets(email);
            if (!tickets || tickets.length === 0) {
              dfMessenger.renderCustomText(`No bookings found for ${email}.`);
            } else {
              const list = tickets.slice(0, 3).map(t => `✅ ${t.eventTitle}: **${t.ticketCode}**`).join('\\n');
              dfMessenger.renderCustomText(`Your recent bookings:\\n${list}`);
            }
          } catch (error) {
            dfMessenger.renderCustomText(`Failed to check status: ${error.message}`);
          }
        }
      }
    };

    // Attach listeners
    dfMessenger.addEventListener('df-messenger-response-received', handleResponse);
    dfMessenger.addEventListener('df-messenger-chat-opened', showShowsInChat);
    
    return () => {
      dfMessenger.removeEventListener('df-messenger-response-received', handleResponse);
      dfMessenger.removeEventListener('df-messenger-chat-opened', showShowsInChat);
    };
  }, []);

  // Returning null as requested - only the floating chatbot should be visible.
  return null;
};

export default Chatbot;
