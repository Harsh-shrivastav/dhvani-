import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "Dhvani — Real-Time AI Captioning & Sign Language",
  description:
    "Real-time speech-to-text captioning with AI simplification and Indian Sign Language video playback. Making every voice visible.",
  keywords: [
    "captioning",
    "sign language",
    "accessibility",
    "speech recognition",
    "AI",
    "deaf",
    "ISL",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${atkinson.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
