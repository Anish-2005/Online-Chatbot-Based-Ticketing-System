import axios from 'axios';

const MAILER_API_URL = process.env.REACT_APP_MAILER_URL || 'http://localhost:4001/api/send-ticket';

export const sendTicketEmail = async ({
  to,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  selectedSeats,
  seatCount,
  amount,
  ticketCode,
  qrData,
}) => {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;

  const payload = {
    to,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    selectedSeats,
    seatCount,
    amount,
    ticketCode,
    qrImageUrl,
  };

  const response = await axios.post(MAILER_API_URL, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
};
