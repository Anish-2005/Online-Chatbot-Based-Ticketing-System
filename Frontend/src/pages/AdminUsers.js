// import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/Sidebar';
// import { motion } from 'framer-motion';
// import './AdminUsers.css'; // Import your CSS file for AdminUsers

// const AdminUsers = () => {
//   const [users_info, setUsers] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/users_info');
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setUsers(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const toggleDarkMode = () => {
//     const newDarkMode = !isDarkMode;
//     setIsDarkMode(newDarkMode);
//     document.body.classList.toggle('dark-mode', newDarkMode);
//   };

//   return (
//     <div className="flex">
//       <Sidebar role="admin" />
//       <motion.div
//         className={`flex-1 p-8 ml-64 ${isDarkMode ? 'dark-mode' : ''}`}
//         initial={{ opacity: 0, x: 50 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5, ease: 'easeOut' }}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-light-purple' : 'text-black'}`}>
//             User Management
//           </h1>
//           <button
//             onClick={toggleDarkMode}
//             className={`py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out ${
//               isDarkMode
//                 ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}
//           >
//             {isDarkMode ? 'Light Mode' : 'Dark Mode'}
//           </button>
//         </div>

//         <div className="bg-white shadow-lg rounded-lg p-8 overflow-x-auto">
//           <table className="min-w-full text-left">
//             <thead>
//               <tr>
//                 <th className="border-b px-4 py-2">ID</th>
//                 <th className="border-b px-4 py-2">Name</th>
//                 <th className="border-b px-4 py-2">Email</th>
//                 <th className="border-b px-4 py-2">Role</th>
//                 <th className="border-b px-4 py-2">Status</th>
//                 <th className="border-b px-4 py-2">Last Login</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users_info.map(user => (
//                 <motion.tr
//                   key={user.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, ease: 'easeOut' }}
//                   className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
//                 >
//                   <td className="border-b px-4 py-2">{user.id}</td>
//                   <td className="border-b px-4 py-2">{user.name}</td>
//                   <td className="border-b px-4 py-2">{user.email}</td>
//                   <td className="border-b px-4 py-2">{user.role}</td>
//                   <td className={`border-b px-4 py-2 ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
//                     {user.status}
//                   </td>
//                   <td className="border-b px-4 py-2">{user.lastLogin}</td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default AdminUsers;
