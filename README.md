# Vaani: Real-Time AI Captioning & Sign Language Assistance 🤟

Vaani is a Next.js web application built for accessibility. It provides real-time, continuous speech-to-text transcription, utilizes Gemini AI to translate complex English into simplified, deaf-friendly captions, and automatically translates those simplified words into sequential Indian Sign Language (ISL) videos.

## ✨ Features

- **Continuous Speech Recognition:** Uses the Web Speech API to provide real-time, zero-latency transcription that automatically handles pauses and restarts.
- **AI Simplification:** Integrates `gemini-2.0-flash` via Next.js Edge API routes to simplify 10th-grade English into 5th-grade vocabulary.
- **Progressive Streaming:** Streams AI responses back to the client word-by-word to eliminate loading delays and provide a ChatGPT-like feel.
- **Dynamic ISL Video Engine:** Parses the streaming AI output to automatically queue and play the corresponding `.mp4` sign language videos.
- **Fingerspelling Fallback:** If a spoken word does not exist in the video dictionary, the engine dynamically breaks the word down and plays the individual A-Z letter videos seamlessly.
- **Long Conversation Support:** The UI auto-scrolls to the bottom automatically and only sends delta word updates to the AI, ensuring the browser and API never get overwhelmed during long conversations.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS (Dark Mode by default)
- **AI:** Google Generative AI SDK (`@google/generative-ai`)
- **Speech Engine:** Native Browser Web Speech API (`webkitSpeechRecognition`)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.17 or later
- A valid Gemini API Key
- Google Chrome or Microsoft Edge (required for Web Speech API support)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add your Gemini key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/app`: Next.js 16 App Router pages and layout
- `/app/api/simplify`: Next.js Edge API route for Gemini AI integration
- `/components`: Modular React components (`Navbar`, `ControlPanel`, `CaptionBox`, `VideoPlayer`)
- `/hooks`: Custom React hooks (`useSpeechRecognition`)
- `/public/assets`: 151 individual `.mp4` Indian Sign Language videos (A-Z and common words)

## 🎨 Design System

Vaani uses a scalable, modern design system built with Tailwind CSS. It features a violet/indigo gradient theme with glassmorphism touches and smooth micro-animations. Legacy UI styling was converted directly into CSS variables inside `globals.css` to easily support future light/dark mode iterations.
