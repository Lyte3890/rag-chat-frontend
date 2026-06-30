# 🤖 Engineering RAG Copilot - UI Frontend

An enterprise-grade, minimalist React frontend designed to interface with an industrial Retrieval-Augmented Generation (RAG) backend. This project provides a seamless chat interface for engineers to query complex technical manuals, upload PDFs for on-the-fly vectorization, and verify AI responses via explicit source citations.

> 🌐 **Live Demo:** You can test the full capabilities of this RAG Copilot directly on my personal website: [skuriatin.com](https://skuriatin.com).

## 🏗️ Architecture Overview

The frontend is built with a strict focus on UX/UI performance and seamless backend integration:

1.  **Client Layer:** A highly responsive React SPA built with Vite. Features smooth, mathematical animations (`cubic-bezier`) and dynamic Dark/Light modes.
2.  **Session Management Layer:** Implements pure client-side persistence using `localStorage` to maintain multiple chat threads and session histories without requiring a dedicated database.
3.  **API Integration Layer:** Asynchronous communication bridge handling `FormData` for PDF uploads and parsing JSON responses containing LLM inferences and ChromaDB source citations.

---

## 🛠️ Tech Stack
* **Core:** React 18, Vite, JavaScript (ES6+)
* **Styling:** Tailwind CSS v3 (with Dark Mode class strategy)
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
* **Persistence:** Browser LocalStorage API

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed on your local machine.

### 2. Installation
Clone the repository and install the required dependencies:
```
git clone <your-repo-url>
cd rag-chat-frontend
npm install
```
3. Environment Setup
Create a ```.env``` file in the root directory and configure your FastAPI backend URL:
```
VITE_API_BASE_URL=[https://api.your-backend-domain.com](https://api.your-backend-domain.com)
```
4. Run Development Server
Start the Vite development server:
```
npm run dev
```
Access the UI at ```http://localhost:5173```.

###🔌 Backend Integration (FastAPI / ChromaDB)
To connect this UI to a real RAG backend:

Ensure your FastAPI server has CORS enabled for this frontend's domain.

Implement the ```/upload``` endpoint to handle ```.pdf``` files via ```multipart/form-data```.

Implement the ```/chat``` endpoint to return JSON payloads containing the LLM ```text``` and an array of ```sources``` (doc name and page number).

```
.
├── public/
│   └── favicon.png          # Custom MS Logo / UI Assets
├── src/
│   ├── App.jsx              # Main Chat UI, Animations, and Session Logic
│   ├── index.css            # Tailwind directives and base styles
│   └── main.jsx             # React entry point
├── .env                     # API configuration (ignored in git)
├── tailwind.config.js       # Tailwind & Dark Mode configuration
├── package.json             # Dependencies and scripts
└── LICENSE                  # MIT License
```