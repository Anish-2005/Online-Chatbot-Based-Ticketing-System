require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = Number(process.env.MAILER_PORT || 4001);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const buildTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });
  }

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

  const senderEmail = process.env.GMAIL_USER || process.env.SMTP_USER;
  const fromAddress = process.env.SMTP_FROM || `ChatTicket Booking <${senderEmail}>`;
  const seatsText = Array.isArray(selectedSeats) && selectedSeats.length > 0
    ? selectedSeats.join(', ')
    : 'Not provided';

  const mailHtml = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(90deg, #7c3aed, #ec4899); padding: 20px; color: #ffffff;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="mailLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#5B21B6"/>
                <stop offset="100%" stop-color="#DB2777"/>
              </linearGradient>
            </defs>
            <rect x="52" y="52" width="408" height="408" rx="104" fill="url(#mailLogoGradient)"/>
            <path d="M138 188c0-22.1 17.9-40 40-40h156c22.1 0 40 17.9 40 40v70c0 22.1-17.9 40-40 40h-70l-37 40a8 8 0 0 1-14-5.4V298h-35c-22.1 0-40-17.9-40-40v-70z" fill="#FFFFFF"/>
            <rect x="182" y="202" width="148" height="62" rx="14" fill="#0F172A"/>
            <circle cx="198" cy="233" r="6" fill="#fff"/>
            <circle cx="314" cy="233" r="6" fill="#fff"/>
            <path d="M214 220c0-7.7 6.3-14 14-14h31v9h-28a5 5 0 0 0-5 5v18a5 5 0 0 0 5 5h28v9h-31c-7.7 0-14-6.3-14-14v-18z" fill="#C4B5FD"/>
            <path d="M241 211h42v8h-30v9h25v8h-25v16h-12v-41z" fill="#F9A8D4"/>
          </svg>
          <div style="font-weight: 700; font-size: 15px; letter-spacing: 0.2px;">ChatTicket Booking</div>
        </div>
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
