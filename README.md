# Aegis Intel: Deepfake & Misinformation Forensic Engine

## 📖 Project Overview
Aegis Intel is a comprehensive forensic engine designed to detect deepfakes, AI-generated propaganda, and misinformation. Built to address the challenges of digital deception during high-stakes situations (such as conflicts), it bridges the gap between automated AI detection and nuanced human context. 

When AI models encounter "Forensic Uncertainty," the platform leverages a secure "Citizen Review" feed where users can provide factual evidence. A BERT-based NLP model then analyzes the community consensus to generate a definitive, reliable sentiment report.

## 🎥 Demo Video & Presentation Slides
> **[Google Drive Link - Demo Video & PPT Slides](https://drive.google.com/drive/folders/1oW6XCvbEKXFdtFNMaroQxto0dmQ8xaKc?usp=sharing)**
> *Note: This Google Drive folder contains both the project demo video and the presentation slides.*

## 💻 Technologies Used
* **Frontend:** React.js, Vite, Vanilla CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Machine Learning / AI:** Python, Hugging Face API (BERT Model)
* **Authentication:** JWT (JSON Web Tokens)

## ⚙️ Setup Instructions

To run this project locally, you will need to start three separate servers (Frontend, Backend, and ML Service).

### 1. Prerequisites
* Node.js (v16+)
* Python (v3.8+)
* MongoDB Atlas Cluster (or local MongoDB)

### 2. Backend Setup (Node.js)
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory with:
```env
PORT=5005
MONGODB_URI=your_mongodb_connection_string
```
Start the server:
```bash
node server.js
```

### 3. Frontend Setup (React/Vite)
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```

### 4. ML Service Setup (Python)
```bash
cd ml_service
pip install -r requirements.txt
```
Create a `.env` file in the `ml_service/` directory with:
```env
HUGGING_FACE_TOKEN=your_huggingface_api_token
```
Start the Python server:
```bash
python app.py
```

## 🤝 Stakeholders & Access Control
* **Citizens (Users):** Can submit suspicious links/text and provide forensic evidence to community notes.
* **System (AI):** Aggregates and verifies data using BERT sentiment analysis.

*Project built for SE COMP FSD Submission 2025-2026.*