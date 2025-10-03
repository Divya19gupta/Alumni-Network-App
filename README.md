# OLIVEHUB

OLIVEHUB is a modern **Alumni Network Application** designed to connect users, facilitate professional networking, and enhance engagement with AI-powered content moderation. Users can create profiles, post content, interact with peers, and manage their professional presence seamlessly.

---

## 🚀 Features

### User Authentication & Profile Management
- **Signup & Login:** Users can create a new account by entering username, name, email, and password.  
- **Profile Editing:** Update personal information and upload or change profile pictures.  
- **Resume Management:** Download your resume in a professional format to share within the alumni network.

### Social Dashboard
- **Create Posts:** Users can post updates, announcements, or professional insights.  
- **AI-Powered Content Moderation:** Posts are analyzed in real-time using **Google Gemini API**, ensuring safe and appropriate content. Harmful posts are flagged automatically. *(AI Integration: Moderation system leveraging natural language understanding, embeddings, and prompt-engineering for robust content safety.)*  
- **Post Interactions:** Like, unlike, and delete posts easily.  
- **Discover Users:** Explore and connect with other alumni in the network.  

### Additional Features
- **Logout & Session Management:** Securely logout and login across sessions.  
- **Next.js Store Integration:** Global state management for smooth user experience and real-time updates.  
- **Responsive UI:** Built with **Material-UI (MUI)** for modern, intuitive interfaces.  

---

## 💡 How It Works

### Frontend
- Built using **Next.js + React.js**, providing SSR and fast client-side interactions.  
- **MUI components** for elegant styling and interactive elements.  
- Global state managed with **Next.js store concept** for seamless user experience.  

### Backend
- **Express.js** handles all API requests and CRUD operations.  
- **MongoDB + Mongoose** stores user data, posts, and interactions.  
- **Gemini API** integrated for AI-driven post moderation:
  - Analyzes post content in real-time.
  - Flags inappropriate or harmful content automatically.
  - Enhances safety and trust in the alumni network.

### AI Integration
- **Google Gemini API** for natural language understanding and content moderation.  
- **Prompt-engineering & JSON parsing** ensure strict classification of posts: hate speech, harassment, sexual content, violence, self-harm.  
- Highlights your experience with **AI SaaS, API integration, and intelligent automation**.

---

## ⚡ Tech Stack

**Frontend:**  
- Next.js  
- React.js  
- Material-UI (MUI)  
- Next.js store concept for global state  

**Backend:**  
- Express.js  
- MongoDB + Mongoose  
- REST API creation & integration  

**AI Integration:**  
- Google Gemini API (AI moderation, content safety, natural language understanding)  

---

## 📌 Installation

```bash
# Clone the repository
git clone <repo-url>
cd OLIVEHUB

# Backend setup
cd backend
npm install

# Add environment variables in .env
echo "GEMINI_API_KEY=<your_google_gemini_api_key>" >> .env
echo "MONGO_URL=<your_mongodb_connection_string>" >> .env
echo "PORT=9090" >> .env

# Run backend
nodemon index.js

# Frontend setup
cd ../frontend
npm install
npm run dev

---

## 🔗 References

- Apna College tutorials
- ChatGPT for AI prompt design & integration
- Official documentation of Next.js, Express.js, MongoDB, and MUI
- Google Gemini API documentation
- Deployment through Vercel and Render

---

## 🌐 Live Demo

Access the application: `[<insert link here>](https://alumni-network-app-t6l9.vercel.app/)`

---

## 🎯 Summary

OLIVEHUB showcases **full-stack development** skills with **AI-powered SaaS integration** for content moderation. By combining social networking features with real-time AI moderation using Google Gemini, it provides a **safe, professional, and interactive alumni platform**. This project highlights expertise in **frontend development, backend API creation, database management, state management, and AI integration**.



