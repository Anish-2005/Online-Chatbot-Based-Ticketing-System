# 🎫 Online Chatbot-Based Ticketing System

<div align="center">
  <img src="./Frontend/public/favicon.ico" alt="Project Logo" width="80">
  
  ### 🏛️ SIH-2024 Internal Hackathon REPO
  **Problem Statement Number: SIH1648**
  
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.112.2-009688?logo=fastapi&logoColor=white)](#)
  [![React](https://img.shields.io/badge/React-18.3.1-20232A?logo=react&logoColor=61DAFB)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-4ea94b?logo=mongodb&logoColor=white)](#)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)](#)
</div>

---

## 📖 Overview
An intelligent museum ticketing ecosystem that revolutionizes visitor experiences through **AI-powered chatbot interactions** and **comprehensive analytics**. This project was conceptualized and developed for the **Smart India Hackathon 2024 Internal Competition**.

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **🤖 AI Chatbot** | Dialogflow-integrated bot for natural language ticket booking. |
| **📊 Admin Dashboard** | Real-time analytics and revenue tracking via PowerBI integration. |
| **📧 Auto-Notifications** | Automated SMTP email confirmations for every successful booking. |
| **🌓 Modern UI** | Responsive React frontend with seamless Dark/Light theme toggle. |
| **🔐 Secure Auth** | Robust JWT-based authentication for both users and administrators. |

## 🛠️ Tech Stack

- **Frontend**: React.js 18, Tailwind CSS, Framer Motion, Recharts
- **Backend**: FastAPI (Python), MongoDB (Motor Async Driver)
- **Integrations**: Google Dialogflow (NLP), PowerBI (Analytics), SMTP (Email)
- **Deployment**: Vercel (Frontend/API), MongoDB Atlas (Database)

## 📂 Project Structure

```bash
├── Backend/          # FastAPI server, Database models, Chatbot logic
├── Frontend/         # React application, components, and styles
├── requirements.txt  # Python dependencies
└── vercel.json       # Deployment configuration
```

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd Backend
python -m venv venv
# Windows: venv\Scripts\activate | macOS/Linux: source venv/bin/activate
pip install -r ../requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm start
```

## 🏆 SIH-2024 Achievements
- ✅ **Functional AI Chatbot** successfully integrated with Dialogflow.
- ✅ **Complete User Journey** from registration to automated booking confirmation.
- ✅ **Admin Insights** powered by real-time analytics data.
- ✅ **Responsive & Secure** architecture ready for deployment.

---
<div align="center">
  Built with ❤️ for <b>Smart India Hackathon 2024</b>
</div>

