# Nexlectra - AI-Powered Classroom Companion 🎓✨

Nexlectra is a next-generation educational platform built to bridge the gap between lecturers and students using advanced Generative AI. By leveraging Google's Genkit and Gemini AI, Nexlectra transforms raw lecture audio into structured study notes, flashcards, and dynamic quizzes, creating a truly interactive learning environment.

## 🚀 Features

### For Lecturers
- **AI Audio Processing**: Upload lecture audio files (MP3/WAV) and let the AI automatically transcribe the entire session.
- **Smart Material Generation**: The AI automatically synthesizes the transcript into structured Revision Notes, Key Takeaways, and Flashcards.
- **Cloud Library**: Manage all your generated lecture materials in a beautiful, dynamic Firestore-backed library.

### For Students
- **Interactive Study Hub**: Access processed lectures in a sleek UI with sliding drawers for AI Notes and Flashcards.
- **Dynamic AI Quizzes**: Generate 5-question mock tests on-the-fly based on specific subjects using Gemini.
- **AI Doubt Assistant**: A built-in chatbot tutor that contextualizes your questions based on the specific lecture material you are studying.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS & Shadcn UI (Radix Primitives)
- **AI & Logic**: Google Genkit & `@google/generative-ai` (Gemini 2.0 Flash Lite & 2.5 Flash)
- **Backend**: Firebase (Auth, Firestore, Cloud Storage)
- **Mobile**: Capacitor (Native Android/iOS Build Support)

## 📱 Getting Started (Web & Mobile)

### 1. Prerequisites
Ensure you have Node.js (v20+) installed. You will also need a Firebase project with Authentication, Firestore, and Storage enabled.

### 2. Environment Variables
Create a `.env` file in the root directory and add your Firebase and Gemini credentials:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run the Web App
```bash
npm install
npm run dev
```
Visit `http://localhost:9002` to view the application.

### 4. Build for Native Android (Capacitor)
Nexlectra is mobile-first. To build the native Android application:
```bash
npm run build
npx cap sync android
```
Open the `android` folder in Android Studio and hit Run to test on an emulator or physical device.

---
*Built with passion using Antigravity, Genkit, and Next.js.*
