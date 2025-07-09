// import React from 'react';
// import { motion } from 'framer-motion';
// import './BookingManual.css'; // Import your CSS for additional styling

// const BookingManual = ({ slide }) => {
//   if (!slide) {
//     return <div className="booking-manual">Please select an event from the carousel.</div>;
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="booking-manual"
//     >
//       <h2 className="booking-manual-title">Booking Details</h2>
//       <div className="booking-manual-content">
//         <img src={slide.image} alt={slide.title} className="booking-manual-image" />
//         <div className="booking-manual-info">
//           <h3 className="booking-manual-event-title">{slide.title}</h3>
//           <p><strong>Date:</strong> {slide.date}</p>
//           <p><strong>Location:</strong> {slide.location}</p>
//           <p><strong>Price:</strong> {slide.price}</p>
//           <p><strong>Tickets Left:</strong> 50</p> {/* Add dynamic data here if available */}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default BookingManual;
