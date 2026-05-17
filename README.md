# 🌌 NexusAI — AI-Native Intelligence Hub

NexusAI is a premium, cyber-themed, and highly automated MERN platform designed as an intelligence dashboard for artificial intelligence news and tool directories. It features immersive styling, live news integrations, user gamification, and robust bookmarking systems.

---

### 🌐 Live Production Deployment
*   **Frontend Client**: [https://nexusai-mern.vercel.app](https://nexusai-mern.vercel.app)
*   **Backend Server API**: [https://server-gamma-opal-34.vercel.app/api/health](https://server-gamma-opal-34.vercel.app/api/health)

---

## 🚀 Key Features

*   **⚡ Cyberpunk & Glassmorphic UI/UX**: An interface crafted with custom CSS variables (`--neon-cyan`, `--neon-purple`, `--neon-green`), dynamic scale tap states, and professional layout designs with smooth custom page transitions.
*   **📊 Dynamic Neural Stats (XP)**: Live rule-based gamification that tracks operator engagement. XP is calculated deterministically on the server as `Bookmarks × 5` and dynamically updates the interface on bookmark actions in real-time.
*   **⏱️ Automated AI News & Tools Cron**: 
    *   **News Updater**: Lives-syncs and fetches latest AI news from **TechCrunch AI**, **VentureBeat AI**, and **Wired AI** every 6 hours.
    *   **Tools Seeder**: Daily inserts next-gen upcoming AI tools (such as *Suno, Devin, Tome, Character.ai*, etc.) to keep the directory growing.
    *   *Optimized to run asynchronously immediately upon server startup and thereafter follows scheduled intervals.*
*   **📂 Saved Signals (Bookmarking)**: Persistent bookmarking for both AI News and AI Tools, perfectly integrated into a single hub (`Bookmarks.jsx`) and verified dynamically on mount.
*   **📱 Fully Responsive**: Custom mobile sidebar drawer navigation and page navigation scroll-to-top automation to ensure perfect scrolling layouts.

---

## 🛠️ Technology Stack

*   **Frontend**: React, React Router v6, TailwindCSS, Framer Motion, Lucide Icons, Axios.
*   **Backend**: Node.js, Express.js, Node-Cron, RSS-Parser.
*   **Database**: MongoDB Atlas.
*   **Security**: JSON Web Tokens (JWT), BcryptJS Password Hashing.

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas Connection String

### 1. Clone & Configure Server
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Install dependencies and start development server:
```bash
cd server
npm install
npm run dev
```

### 2. Configure Client
Install dependencies and run the React frontend:
```bash
cd client
npm install
npm start
```
The application will boot up at `http://localhost:3000`.

---

## 📁 Repository Structure

```
NexusAI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI elements (Cards, Inputs, Buttons)
│   │   ├── context/        # Auth and global states
│   │   ├── pages/          # News, Tools, Bookmarks, Dashboard, Profile
│   │   └── services/       # API call handlers
├── server/                 # Express backend
│   ├── controllers/        # Logical controllers (Bookmarks, XP, News, Tools)
│   ├── models/             # Mongoose schemas (User, Post, AiTool, Bookmark)
│   ├── routes/             # REST API routes
│   └── services/           # News & Tools Cron automation
```

---

## 🛡️ Security Note
This repository includes a strict `.gitignore` setup preventing local configuration keys (`.env`) and dependency trees (`node_modules`) from being committed to public repositories.

---

Created by **Pratham** 🚀
