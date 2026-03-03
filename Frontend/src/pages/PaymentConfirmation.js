import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { processShowPayment } from '../services/bookings';
import { sendTicketEmail } from '../services/mailer';

const PaymentConfirmation = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { event, selectedSeats = [], seatCount = 0 } = location.state || {};
  const [email, setEmail] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('info');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [retryEmailPayload, setRetryEmailPayload] = useState(null);
  const pricePerTicket = parseFloat((event?.price || '').toString().replace(/[^0-9.-]+/g, '')) || 0;
  const totalPrice = pricePerTicket * seatCount;

  useEffect(() => {
    if (!event) {
      setPopupMessage('No event data found. Please select a show first.');
    }
  }, [event]);

  // Email validation function
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  // Handle email input change and validate email
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    validateEmail(emailValue);
  };

  const handlePayment = async () => {
    if (emailError || !email || !event?.id || seatCount <= 0) {
      setPopupType('error');
      setPopupMessage('Please correct the errors before proceeding.');
      return;
    }

    if (paymentCompleted) {
      setPopupType('info');
      setPopupMessage('Payment is already confirmed. Use Retry Email if you did not receive your ticket email.');
      return;
    }

    setIsPaymentProcessing(true);
    setPopupMessage('');

    try {
      const paymentResult = await processShowPayment({
        eventId: event.id,
        selectedSeats,
        seatCount,
        email,
        amount: pricePerTicket * seatCount,
        eventTitle: event.title,
      });

      setPaymentCompleted(true);

      const emailPayload = {
        to: email,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        selectedSeats,
        seatCount,
        amount: pricePerTicket * seatCount,
        ticketCode: paymentResult.ticketCode,
        qrData: paymentResult.qrData,
      };

      try {
        await sendTicketEmail(emailPayload);
        setRetryEmailPayload(null);
        setPopupType('success');
        setPopupMessage(`Payment successful! Ticket mailed to ${email}.`);
        setTimeout(() => {
          navigate('/bookshows', { state: { event, selectedSeats, seatCount } });
        }, 2500);
      } catch (mailError) {
        console.error('Ticket email sending failed:', mailError);
        setRetryEmailPayload(emailPayload);
        setPopupType('error');
        setPopupMessage('Payment successful, but ticket email failed. Click Retry Email to send the ticket again.');
      }
    } catch (paymentError) {
      console.error('Error processing payment:', paymentError);
      setPopupType('error');
      setPopupMessage(`Payment failed: ${paymentError.message || 'Unknown error occurred.'}`);
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleRetryEmail = async () => {
    if (!retryEmailPayload) {
      return;
    }

    setIsRetryingEmail(true);
    try {
      await sendTicketEmail(retryEmailPayload);
      setRetryEmailPayload(null);
      setPopupType('success');
      setPopupMessage(`Ticket mailed to ${retryEmailPayload.to}.`);
      setTimeout(() => {
        navigate('/bookshows', { state: { event, selectedSeats, seatCount } });
      }, 2000);
    } catch (retryError) {
      console.error('Retry email failed:', retryError);
      setPopupType('error');
      setPopupMessage('Retry failed. Please check mailer service and try again.');
    } finally {
      setIsRetryingEmail(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-white'}`} />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <motion.button
              onClick={() => navigate('/booking', { state: { event } })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
            >
              ← Back to Booking
            </motion.button>

            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </motion.button>
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className={`text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.15] bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 ${isDark ? 'dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent' : 'bg-clip-text text-transparent'}`}>
              Payment Confirmation
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {event?.title || 'Selected Event'}
              </span>
            </h1>
            <p className={`mt-4 max-w-3xl text-base sm:text-lg font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Verify your booking details and complete payment securely.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {!event ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`rounded-3xl border p-8 text-center shadow-xl ${isDark ? 'border-purple-700/30 bg-gray-800/50' : 'border-purple-200 bg-white'}`}
          >
            <h2 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>No Booking Data Found</h2>
            <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Please select seats first before opening payment confirmation.
            </p>
            <button
              type="button"
              onClick={() => navigate('/bookshows')}
              className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-700"
            >
              Go to Book Shows
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`rounded-3xl border p-6 shadow-2xl sm:p-8 ${isDark ? 'border-purple-700/30 bg-gray-800/60' : 'border-purple-200 bg-white'}`}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Seats Selected</p>
                <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedSeats.join(', ') || 'None'}</p>
              </div>
              <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Total Tickets</p>
                <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{seatCount}</p>
              </div>
              <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Price / Ticket</p>
                <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>₹ {pricePerTicket}</p>
              </div>
              <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Total Amount</p>
                <p className={`mt-1 text-sm font-extrabold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>₹ {totalPrice}</p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="email"
                className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                placeholder="you@example.com"
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:ring-purple-500' : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-purple-400'}`}
              />
              {emailError && (
                <p className={`mt-2 text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>{emailError}</p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <motion.button
                onClick={handlePayment}
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={{ scale: isPaymentProcessing || paymentCompleted || emailError || !email ? 1 : 1.03 }}
                whileTap={{ scale: isPaymentProcessing || paymentCompleted || emailError || !email ? 1 : 0.95 }}
                disabled={isPaymentProcessing || paymentCompleted || emailError || !email}
              >
                {isPaymentProcessing ? 'Processing Payment...' : paymentCompleted ? 'Payment Confirmed' : 'Confirm Payment'}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate('/booking', { state: { event } })}
                className={`inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              >
                Edit Seats
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {popupMessage && (
        <div className="fixed inset-x-4 bottom-6 z-30 mx-auto max-w-xl">
          <div className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${popupType === 'success' ? (isDark ? 'border-emerald-500/40 bg-emerald-900/30 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700') : popupType === 'info' ? (isDark ? 'border-blue-500/40 bg-blue-900/30 text-blue-200' : 'border-blue-200 bg-blue-50 text-blue-700') : (isDark ? 'border-red-500/40 bg-red-900/30 text-red-200' : 'border-red-200 bg-red-50 text-red-700')}`}>
            <div className="flex items-center justify-between gap-3">
              <span>{popupMessage}</span>
              {paymentCompleted && retryEmailPayload && (
                <button
                  type="button"
                  onClick={handleRetryEmail}
                  disabled={isRetryingEmail}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${isDark ? 'bg-red-800 text-red-100 hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  {isRetryingEmail ? 'Retrying...' : 'Retry Email'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;
