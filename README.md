# SkillSwap – Frontend

SkillSwap is a skill-barter platform where users connect, match based on skills, and schedule meetings to exchange knowledge.

This repository contains the **frontend application**, built with React, providing a modern and interactive interface for managing profiles, sending requests, and joining scheduled meetings.

---

## 🌐 Live Demo
👉 https://skillswap-client-yv4s.vercel.app

---

## 🧠 Features

- 🔐 User authentication (login/signup)
- 👤 Profile creation and management
- 🔍 Browse and search users
- 🤝 Send, accept, and reject match requests
- 📅 Schedule and view meetings
- ⏳ Real-time countdown timers
- 🎥 Join video calls (Jitsi integration)
- 🌙 Modern dark-themed UI

---

## ⚙️ Tech Stack

- **React.js**
- **React Router**
- **Tailwind CSS**
- **Axios**
- **Framer Motion**

---

## 🔑 Core Modules

### 🔐 Authentication
- Secure login and signup
- Cookie-based JWT authentication
- Protected routes

### 📊 Dashboard
- View profile
- Browse users
- Search and filter
- Send requests

### 👤 Profile Management
- Add offered skills
- Add learning interests
- Set availability
- Update experience & location

### 🤝 Match System
- View incoming requests
- Accept/reject matches
- Auto scheduling based on availability

### 📅 Meetings
- View scheduled sessions
- Countdown timers
- Join via video links

---

## 🏗️ Project Structure

```bash
src/
├── components/
├── pages/
├── context/
├── api/
├── utils/
├── App.js
└── index.js

⚙️ Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/Pandit2508/skillswap-client.git
cd skillswap-client
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Copy `.env.example` to `.env` and adjust as needed:
```bash
cp .env.example .env
```

4. Run the application
```bash
npm start
```

⚠️ Notes
- Backend is deployed on Render
- Uses HTTP-only cookie authentication
- Incognito mode may block cookies due to browser policies

💡 Future Improvements
- Real-time chat
- Notifications system
- Improved matching algorithm (weighted scoring, not just first overlap)
- Better mobile responsiveness
👨‍💻 Author

Naman Pandit
GitHub: https://github.com/Pandit2508

🧾 License

This project is licensed under the MIT License.
