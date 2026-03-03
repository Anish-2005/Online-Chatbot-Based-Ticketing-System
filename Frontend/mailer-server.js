require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = Number(process.env.MAILER_PORT || 4001);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const portNumber = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Missing SMTP configuration. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS.');
  }

  const secure = process.env.SMTP_SECURE === 'true' || portNumber === 465;

  return nodemailer.createTransport({
    host,
    port: portNumber,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'ticket-mailer' });
});

app.post('/api/send-ticket', async (req, res) => {
  const {
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
  } = req.body || {};

  if (!to || !eventTitle || !ticketCode || !qrImageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: to, eventTitle, ticketCode, qrImageUrl.',
    });
  }

  let transporter;
  try {
    transporter = buildTransporter();
  } catch (configError) {
    return res.status(500).json({ success: false, message: configError.message });
  }

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const seatsText = Array.isArray(selectedSeats) && selectedSeats.length > 0
    ? selectedSeats.join(', ')
    : 'Not provided';

  const mailHtml = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(90deg, #7c3aed, #ec4899); padding: 20px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 22px;">Your Museum Ticket</h2>
        <p style="margin: 8px 0 0 0; opacity: 0.95;">Payment confirmed successfully.</p>
      </div>
      <div style="padding: 20px; color: #111827;">
        <p style="margin: 0 0 12px 0;"><strong>Event:</strong> ${eventTitle}</p>
        <p style="margin: 0 0 12px 0;"><strong>Date:</strong> ${eventDate || 'TBA'}</p>
        <p style="margin: 0 0 12px 0;"><strong>Time:</strong> ${eventTime || 'TBA'}</p>
        <p style="margin: 0 0 12px 0;"><strong>Location:</strong> ${eventLocation || 'TBA'}</p>
        <p style="margin: 0 0 12px 0;"><strong>Ticket Code:</strong> ${ticketCode}</p>
        <p style="margin: 0 0 12px 0;"><strong>Seats:</strong> ${seatsText}</p>
        <p style="margin: 0 0 12px 0;"><strong>Tickets:</strong> ${seatCount || 0}</p>
        <p style="margin: 0 0 16px 0;"><strong>Amount Paid:</strong> ₹ ${Number(amount || 0).toFixed(2)}</p>
        <div style="display: inline-block; border: 1px solid #d1d5db; padding: 10px; border-radius: 10px; background: #ffffff;">
          <img src="${qrImageUrl}" alt="Ticket QR" width="180" height="180" style="display:block;" />
        </div>
        <p style="margin: 16px 0 0 0; font-size: 13px; color: #6b7280;">Please show this QR at entry.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `Your Ticket - ${eventTitle}`,
      html: mailHtml,
    });

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
    });
  } catch (mailError) {
    return res.status(500).json({
      success: false,
      message: mailError.message || 'Failed to send ticket email.',
    });
  }
});

app.listen(port, () => {
  console.log(`Ticket mailer running on http://localhost:${port}`);
});
