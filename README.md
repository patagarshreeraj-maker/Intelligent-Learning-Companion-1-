# 🤖 AI StudyMate — Intelligent Learning Companion

AI StudyMate is an AI-powered learning platform designed to help students study smarter through personalized tutoring, document analysis, quizzes, flashcards, viva practice, and AI-generated study plans.

You can access :-https://intelligent-learning-companion.ai.studio

## 🏷️ Project Badges

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-06B6D4?logo=tailwindcss\&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Key Features

### 🤖 AI Voice & Chat Tutor

* Interactive AI study assistant
* Ask questions using text or voice
* Step-by-step explanations
* Subject-focused learning assistance
* Follow-up questions and contextual conversations

### 🎤 Oral Viva Practice

* AI-generated viva questions
* Practice answering questions orally
* AI-based answer evaluation
* Feedback and improvement suggestions
* Difficulty-based viva sessions

### 📄 PDF Studio

* Upload and analyze PDF documents
* Extract text from study materials
* Generate summaries and explanations
* Ask questions based on uploaded documents
* Convert study material into learning resources

### 👁️ Gemini Vision OCR Reader

* Read scanned/image-based PDFs
* Extract text using Gemini Vision
* Analyze diagrams and images
* Convert difficult study material into understandable explanations

### 🎴 Spaced-Repetition Flashcards

* Automatically generate flashcards from study material
* Deck-based organization
* Question and answer format
* Spaced-repetition learning workflow
* Review difficult cards more frequently

### 📝 AI Quiz Generator

* Generate quizzes from topics or uploaded documents
* Multiple-choice questions
* Different difficulty levels
* Instant answer checking
* AI-generated explanations

### 📑 University Question Paper Generator

* Generate formal university-style question papers
* Custom subject and topic selection
* Difficulty configuration
* Different question types
* Useful for exam preparation

### 📊 Weak Topic Detector

* Analyze quiz and practice performance
* Identify weak subjects and topics
* Detect knowledge gaps
* Provide personalized improvement suggestions

### 📈 Knowledge Gap Analytics

* Track learning performance
* Monitor quiz scores
* Identify strong and weak areas
* Provide AI-powered learning insights

### 📅 Smart 30-Day AI Study Planner

* Generate personalized 30-day study plans
* Based on subjects, available time, and goals
* Daily learning tasks
* Revision scheduling
* Practice and assessment sessions

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React Frontend        │
│                             │
│  TypeScript + Tailwind CSS  │
│  Chat • PDF • Quiz • Viva   │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               ▼
┌─────────────────────────────┐
│      Express Backend        │
│                             │
│     /api/ai/* Proxy         │
│   Request Validation        │
│   Gemini API Integration     │
└──────────────┬──────────────┘
               │
               │ Gemini API
               ▼
┌─────────────────────────────┐
│     Google Gemini API       │
│                             │
│  Chat • Vision • OCR        │
│  Quiz • Flashcards • Viva   │
└─────────────────────────────┘
```

### 🔄 AI Model Fallback

The backend can be designed to support multiple Gemini models:

```text
User Request
     │
     ▼
Express API Proxy
     │
     ▼
Primary Gemini Model
     │
     ├── Success ──► Return Response
     │
     └── Failure / Quota
              │
              ▼
       Fallback Gemini Model
              │
              ▼
        Return Response
```

This helps improve reliability when a particular model reaches its quota or becomes temporarily unavailable.

---

# 🔌 API Endpoints

All AI requests are handled through the Express backend using `/api/ai/*` routes.

| Method | Endpoint                 | Purpose                             |
| ------ | ------------------------ | ----------------------------------- |
| POST   | `/api/ai/chat`           | AI tutor chat                       |
| POST   | `/api/ai/voice`          | Voice-based tutoring                |
| POST   | `/api/ai/viva`           | Generate viva questions             |
| POST   | `/api/ai/viva/evaluate`  | Evaluate viva answers               |
| POST   | `/api/ai/pdf`            | Analyze PDF content                 |
| POST   | `/api/ai/ocr`            | OCR for scanned documents           |
| POST   | `/api/ai/flashcards`     | Generate flashcards                 |
| POST   | `/api/ai/quiz`           | Generate quizzes                    |
| POST   | `/api/ai/question-paper` | Generate university question papers |
| POST   | `/api/ai/analyze`        | Analyze learning performance        |
| POST   | `/api/ai/weak-topics`    | Detect weak topics                  |
| POST   | `/api/ai/study-plan`     | Generate 30-day study plan          |

> **Note:** Update the endpoint names above to exactly match the routes implemented in your backend.

---

# 🚀 Quick Start

## 1. Clone the Repository

```bash
git clone https://github.com/patagarshreeraj-maker/Your-Intelligent-Learning-Companion.git
cd Your-Intelligent-Learning-Companion
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Never upload your API key to GitHub.

Add this to `.gitignore`:

```gitignore
node_modules/
.env
dist/
build/
*.log
```

## 4. Start Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 📦 Production Build

Build the frontend:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Make sure your production environment contains the required environment variables.

---

# 🐳 Docker Deployment

Example `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
```

The application can be deployed using container-compatible platforms such as:

* Google Cloud Run
* Railway
* Docker-compatible hosting
* Other Node.js hosting platforms

---

# 📁 Project Structure

```text
Your-Intelligent-Learning-Companion/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── App.tsx
│
├── server/
│   ├── routes/
│   ├── services/
│   └── index.ts
│
├── public/
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── Dockerfile
└── README.md
```

> Adjust the directory structure to match your actual project files.

---

# 🛠️ Troubleshooting

## ❌ API Error 429 — Quota Exceeded

If you receive:

```text
429 Too Many Requests
```

Possible causes:

* Gemini API quota has been exceeded
* Too many requests were sent in a short period
* The selected model has reached its usage limit

### Possible solutions

* Check your Gemini API usage and quota
* Reduce unnecessary API requests
* Add retry handling
* Implement model fallback
* Use appropriate Gemini models for different tasks

---

## 📄 Scanned PDF Is Not Reading

Normal PDF text extraction may not work correctly with scanned documents because the PDF contains images instead of selectable text.

Use the OCR pipeline:

```text
Scanned PDF
     ↓
Extract PDF Pages
     ↓
Convert Pages to Images
     ↓
Gemini Vision / OCR
     ↓
Extract Text
     ↓
AI Analysis
```

---

# 🔐 Security

Never expose your Gemini API key in frontend code.

❌ Avoid:

```typescript
const API_KEY = "your-secret-api-key";
```

✅ Use the Express backend as a secure proxy:

```text
React Frontend
      ↓
Express Backend
      ↓
Gemini API
```

Store secrets in environment variables:

```env
GEMINI_API_KEY=your_secret_key
```

---

# 🌟 Future Enhancements

Planned improvements include:

* 🎙️ Real-time AI voice conversation
* 🧠 Adaptive learning system
* 📚 Subject-wise AI tutors
* 🔍 Semantic search across study materials
* 📝 AI assignment assistant
* 📊 Advanced student analytics dashboard
* 🏆 Gamification and achievement system
* 👥 Collaborative study rooms
* 🔔 Smart revision reminders
* 📱 Mobile application
* 🌐 Offline/low-connectivity learning support
* 🔐 User authentication and cloud synchronization

---

# 📜 License

This project is licensed under the **MIT License**.

---

## 💡 Project Vision

**AI StudyMate** aims to become an intelligent personal learning companion that understands a student's learning materials, identifies knowledge gaps, creates personalized study plans, and provides continuous AI-powered academic support.

> **Learn smarter. Practice better. Improve faster. 🚀**
