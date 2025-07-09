# 🎫 Online Chatbot-Based Ticketing System

[![SIH 2024](https://img.shields.io/badge/SIH-2024-blue.svg)](https://sih.gov.in/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.112.2-009688.svg?style=flat&logo=FastAPI)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3.1-20232A.svg?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-4ea94b.svg?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Dialogflow](https://img.shields.io/badge/Dialogflow-Integration-orange.svg)](https://cloud.google.com/dialogflow)

An intelligent museum ticketing system that revolutionizes the visitor experience through AI-powered chatbot interactions and comprehensive analytics. Developed for Smart India Hackathon 2024 Internal Competition (September 2024).

![Chatbot Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen.svg)

## 🏆 Project Overview

This project was developed as part of our **Smart India Hackathon Internal Competition** in **September 2024**. The system addresses the challenge of modernizing museum ticketing systems by providing an intelligent, user-friendly platform that combines AI-powered chatbot assistance with robust analytics for better operational insights.

### 🎯 Problem Statement
Traditional museum ticketing systems often lack:
- Interactive user assistance
- Real-time availability information
- Comprehensive analytics for management
- Modern, intuitive user interfaces
- Automated booking confirmation systems

### 💡 Solution
Our **Online Chatbot-Based Ticketing System** provides:
- **AI-Powered Chatbot**: Dialogflow integration for natural language ticket booking
- **Real-time Analytics**: Comprehensive dashboard for admins with earning insights
- **Modern UI/UX**: React-based responsive frontend with dark/light themes
- **Automated Notifications**: Email confirmations for successful bookings
- **Multi-role Access**: Separate interfaces for users and administrators

## 🌟 Key Features

### 🤖 Intelligent Chatbot
- **Natural Language Processing** via Google Dialogflow
- **Interactive Ticket Booking** through conversational interface
- **Real-time Availability** checking and seat reservation
- **Multi-language Support** for diverse user base

### 👤 User Management
- **Secure Authentication** system
- **User Dashboard** with booking history
- **Profile Management** with customizable settings
- **Theme Toggle** (Dark/Light mode)

### 🔧 Admin Panel
- **Comprehensive Analytics** with visual charts
- **Revenue Tracking** and financial insights
- **User Management** with detailed user information
- **Show Management** for scheduling events
- **Real-time Monitoring** of system performance

### 📊 Analytics & Reporting
- **PowerBI Integration** for advanced analytics
- **Revenue Visualization** with interactive charts
- **Booking Trends** analysis
- **Performance Metrics** tracking

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React.js)    │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • User Interface│    │ • API Endpoints │    │ • User Data     │
│ • Admin Panel   │    │ • Business Logic│    │ • Booking Info  │
│ • Chatbot UI    │    │ • Email Service │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┼─────────────────┐
                                 │                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   Dialogflow    │    │     Email       │
                    │   (Chatbot)     │    │   Service       │
                    │                 │    │   (SMTP)        │
                    └─────────────────┘    └─────────────────┘
```

## 🚀 Technology Stack

### Frontend
- **React.js 18.3.1** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **PowerBI Client** - Business intelligence integration
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI 0.112.2** - High-performance Python web framework
- **MongoDB** - NoSQL database with Motor async driver
- **Pydantic** - Data validation and serialization
- **Python-dotenv** - Environment variable management
- **Uvicorn** - ASGI server implementation

### AI & Integration
- **Google Dialogflow** - Natural language understanding
- **SMTP Email Service** - Automated notifications
- **PowerBI** - Advanced analytics and reporting

### Deployment
- **Vercel** - Frontend and API deployment
- **MongoDB Atlas** - Cloud database hosting

## 📁 Project Structure

```
Online-Chatbot-Based-Ticketing-System/
├── 📁 Backend/
│   ├── 📁 app/
│   │   ├── 🐍 main.py           # FastAPI application entry point
│   │   ├── 🗄️ database.py       # MongoDB connection and collections
│   │   ├── 📄 model.py          # Pydantic data models
│   │   ├── ➕ insert.py         # Data insertion utilities
│   │   ├── 📁 admin/            # Admin-specific endpoints
│   │   ├── 📁 models/           # Database models
│   │   └── 📁 schemas/          # API schemas
│   └── 📁 chatbot/
│       ├── 🤖 chatbot.py        # Dialogflow webhook handler
│       └── 🧪 chatbottest.py    # Chatbot testing utilities
├── 📁 Frontend/
│   ├── 📄 package.json          # Dependencies and scripts
│   ├── 🎨 tailwind.config.js    # Tailwind CSS configuration
│   ├── 📁 public/               # Static assets
│   └── 📁 src/
│       ├── 📄 App.js            # Main React application
│       ├── 🏠 home.js           # Landing page component
│       ├── 📁 components/       # Reusable UI components
│       ├── 📁 pages/            # Page components
│       ├── 📁 images/           # Image assets
│       └── 📁 styles/           # CSS stylesheets
├── 📄 requirements.txt          # Python dependencies
├── 🚀 vercel.json              # Deployment configuration
└── 📖 README.md                # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** instance
- **Google Cloud Account** (for Dialogflow)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Online-Chatbot-Based-Ticketing-System.git
cd Online-Chatbot-Based-Ticketing-System
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Set up environment variables
# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# EMAIL_PASSWORD=your_email_app_password
# SENDER_EMAIL=your_sender_email

# Run the backend server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Dialogflow Setup
1. Create a new project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Dialogflow API
3. Create a new Dialogflow agent
4. Configure webhook URL pointing to your backend
5. Train the agent with museum-specific intents

## 🎮 Usage Guide

### For Users
1. **Browse Events**: View available museum shows and exhibitions
2. **Chat with Bot**: Use the integrated chatbot for quick bookings
3. **Manual Booking**: Use the traditional booking interface
4. **View Dashboard**: Check your booking history and profile
5. **Receive Confirmations**: Get email notifications for successful bookings

### For Administrators
1. **Analytics Dashboard**: Monitor booking trends and revenue
2. **User Management**: View and manage registered users
3. **Show Management**: Create and manage museum events
4. **Financial Reports**: Access detailed earning reports
5. **System Monitoring**: Track system performance and usage

## 🔧 API Endpoints

### Authentication
- `POST /login` - User authentication
- `POST /register` - User registration

### Booking Management
- `GET /shows` - Retrieve available shows
- `POST /book-ticket` - Book tickets
- `GET /user-bookings/{user_id}` - Get user bookings

### Admin Operations
- `GET /admin/analytics` - Get system analytics
- `GET /admin/users` - Retrieve all users
- `POST /admin/shows` - Create new shows
- `GET /admin/earnings` - Financial reports

### Chatbot Integration
- `POST /chatbot/webhook` - Dialogflow webhook
- `POST /reserve_tickets` - Reserve tickets via chatbot

## 📊 Analytics Features

### User Analytics
- **Booking Patterns**: Track peak booking times
- **Popular Shows**: Identify trending events
- **User Demographics**: Age and preference analysis

### Financial Analytics
- **Revenue Tracking**: Daily, weekly, monthly reports
- **Profit Margins**: Calculate operational profits
- **Payment Analytics**: Transaction success rates

### Operational Analytics
- **System Performance**: Response times and uptime
- **User Engagement**: Chatbot interaction rates
- **Conversion Rates**: Booking completion statistics

## 🎨 UI/UX Features

### Design Elements
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: User preference toggle
- **Accessibility**: WCAG compliant interface
- **Modern Animations**: Smooth transitions with Framer Motion

### User Experience
- **Intuitive Navigation**: Clear user flow
- **Interactive Elements**: Engaging UI components
- **Real-time Updates**: Live data synchronization
- **Error Handling**: User-friendly error messages

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Pydantic model validation
- **CORS Protection**: Controlled cross-origin requests
- **Data Encryption**: Secure password hashing
- **Email Verification**: Automated confirmation system

## 🚀 Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root directory
vercel --prod
```

### Manual Deployment
1. **Frontend**: Build and deploy to any static hosting service
2. **Backend**: Deploy to any Python hosting platform (Heroku, Railway, etc.)
3. **Database**: Use MongoDB Atlas for cloud hosting
4. **Environment Variables**: Configure all required env vars in production

## 🤝 Team & Acknowledgments

This project was developed by our team for the **Smart India Hackathon 2024 Internal Competition** held in **September 2024**.

### Technologies & Services Used
- **Google Dialogflow** - For AI chatbot capabilities
- **MongoDB Atlas** - Cloud database hosting
- **Vercel** - Deployment and hosting
- **PowerBI** - Advanced analytics integration
- **EmailJS/SMTP** - Email notification service

## 📈 Future Enhancements

### Planned Features
- **Mobile App**: React Native mobile application
- **Multi-language**: Extended language support
- **AR Integration**: Augmented reality museum previews
- **AI Recommendations**: Personalized show suggestions
- **Social Integration**: Social media sharing capabilities
- **Loyalty Program**: User reward system

### Technical Improvements
- **Microservices**: Break down monolithic structure
- **Real-time Chat**: WebSocket integration
- **Advanced Analytics**: Machine learning insights
- **Performance Optimization**: Caching and CDN integration
- **Testing Suite**: Comprehensive automated testing

## 🐛 Known Issues & Limitations

- **Dialogflow Rate Limits**: May need quota management for high traffic
- **Email Service**: Dependency on SMTP service availability
- **Mobile Responsiveness**: Some admin panel components need optimization
- **Browser Compatibility**: Limited testing on older browsers



## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for Smart India Hackathon 2024**

*Revolutionizing museum experiences through AI-powered ticketing solutions*

</div>

## 🏅 Project Achievements

- ✅ **Functional AI Chatbot** - Successfully integrated Dialogflow
- ✅ **Complete User Journey** - From registration to booking confirmation
- ✅ **Admin Analytics** - Comprehensive dashboard with insights
- ✅ **Responsive Design** - Works across all devices
- ✅ **Email Integration** - Automated booking confirmations
- ✅ **Real-time Updates** - Live availability and booking status
- ✅ **Security Implementation** - Secure authentication and data handling

---

