# SkillSwap – Frontend

SkillSwap is a skill-barter platform where users connect, match based on skills, and schedule meetings to exchange knowledge.

This repository contains the frontend application, built with React, providing a modern and interactive interface for managing profiles, sending requests, and joining scheduled meetings.

---

## 🌐 Live Demo
👉 https://skillswap-client-yv4s.vercel.app

---

## 🧠 What This Frontend Does

- 🔐 User registration and login  
- 👤 Profile creation and editing  
- 🔍 Browse and search other users  
- 🤝 Send and receive match requests  
- ✅ Accept or reject requests  
- 📅 View upcoming meetings  
- ⏳ Countdown timer for sessions  
- 🎥 Join video calls directly from dashboard  
- 🌙 Clean dark-themed UI for better UX  

---

## ⚙️ Tech Stack

- **React.js** – UI library  
- **React Router** – Routing  
- **Tailwind CSS** – Styling  
- **Axios** – API communication  
- **Framer Motion** – Animations  

---

## 🔑 Core Features

### 🔐 Authentication UI
- Secure login and signup flows  
- Session handled via HTTP-only cookies (backend)  
- Protected routes for authenticated users  

---

### 📊 Dashboard

After login, users can:
- View their profile  
- Browse other users  
- Search and filter profiles  
- Send match requests  

---

### 👤 Profile Management

Users can:
- Add skills they offer  
- Add skills they want to learn  
- Set multiple availability slots  
- Update experience and location  

---

### 🤝 Match Requests

Users can:
- View incoming requests  
- Accept or reject matches  
- Automatically schedule meetings based on overlapping availability  

---

### 📅 Upcoming Meetings

Users can:
- View scheduled sessions  
- See real-time countdown timers  
- Join meetings at the scheduled time  
- Access Jitsi video call links  

---

## 🏗️ Project Structure


src/
│── components/
│── pages/
│── context/
│── api/
│── utils/
│── App.js
│── index.js



## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/skillswap-frontend.git
cd skillswap-frontend
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the root directory:

REACT_APP_BACKEND_URL=https://skillswap-server-1-hn4n.onrender.com/api
4. Run the application
npm start

---

⚠️ Notes
Backend is deployed on Render
Authentication uses cookie-based JWT
Works best in standard browser mode
(Incognito may block cookies due to cross-site policies)
💡 Future Improvements
Real-time chat between users
Notifications system
Enhanced matching algorithm
Better mobile responsiveness
👨‍💻 Author

---
Naman Pandit
GitHub: https://github.com/Pandit2508

🧾 License

This project is licensed under the MIT License.
