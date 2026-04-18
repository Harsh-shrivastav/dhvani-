"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import ControlPanel from "@/components/ControlPanel";
import CaptionBox from "@/components/CaptionBox";
import VideoPlayer from "@/components/VideoPlayer";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

export default function Home() {
  const {
    isListening,
    isSupported,
    transcript,
    interimText,
    startListening,
    stopListening,
    clearTranscript,
    error,
  } = useSpeechRecognition();

  // Local state for the editable raw text box
  // (initialized from transcript, but user can edit freely)
  const [rawText, setRawText] = useState("");

  // State for simplified text from Gemini API
  const [simplifiedText, setSimplifiedText] = useState("");
  const [isSimplifying, setIsSimplifying] = useState(false);
  
  // Track how much of the transcript we've already processed to avoid re-sending the whole history
  const processedLengthRef = useRef(0);

  // Sync transcript into raw text when new final results arrive
  // We show: accumulated transcript + current interim text
  const displayRawText = rawText || transcript;
  const liveRawText = interimText
    ? displayRawText + interimText
    : displayRawText;

  // Handle toggle
  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setRawText(""); // fresh session
      setSimplifiedText("");
      startListening();
    }
  };

  // Handle clear
  const handleClear = () => {
    clearTranscript();
    setRawText("");
    setSimplifiedText("");
    processedLengthRef.current = 0;
  };

  // Gemini API call
  const handleSimplify = async (textToSimplify, append = true) => {
    if (!textToSimplify || textToSimplify.trim().length === 0) return;
    setIsSimplifying(true);
    try {
      const res = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSimplify }),
      });
      if (res.ok) {
        if (!append) {
          setSimplifiedText(""); // Clear first if replacing
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let isFirstChunk = true;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          
          setSimplifiedText((prev) => {
            let textToAppend = chunk;
            if (append && isFirstChunk && prev && !prev.endsWith(" ")) {
              textToAppend = " " + chunk;
            }
            isFirstChunk = false;
            return prev + textToAppend;
          });
        }
      }
    } catch (err) {
      console.error("Simplification error:", err);
    } finally {
      setIsSimplifying(false);
    }
  };

  // Auto-simplify when final transcript updates
  useEffect(() => {
    if (!transcript) {
      processedLengthRef.current = 0;
      return;
    }
    
    // Only send the newly spoken words to the AI, not the entire history
    if (transcript.length > processedLengthRef.current) {
      const newChunk = transcript.slice(processedLengthRef.current);
      processedLengthRef.current = transcript.length;
      handleSimplify(newChunk, true);
    }
  }, [transcript]);

  // Manual Re-Simplify
  const handleReSimplify = () => {
    const textToProcess = rawText || transcript;
    processedLengthRef.current = textToProcess.length; // reset tracker
    handleSimplify(textToProcess, false);
  };

  // When user manually edits the raw text box
  const handleRawTextChange = (value) => {
    setRawText(value);
  };

  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Main content — offset for fixed navbar */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-12 px-4 md:px-8 bg-[var(--bg-body)] min-h-screen">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">

          {/* ─── Hero header ─── */}
          <header className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold gradient-text inline-flex items-center gap-4 mb-3">
              {/* CC icon */}
              <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full"
                >
                  <rect
                    x="2" y="4" width="20" height="16" rx="2" ry="2"
                    stroke="#a78bfa" strokeWidth="2"
                  />
                  <line
                    x1="7" y1="10" x2="17" y2="10"
                    stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"
                  />
                  <line
                    x1="7" y1="14" x2="14" y2="14"
                    stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"
                  />
                </svg>
              </span>
              Dhvani
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Real-time AI captioning with sign language assistance.
            </p>
          </header>

          {/* ─── Browser support warning ─── */}
          {!isSupported && (
            <div className="w-full max-w-lg mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              ⚠️ Speech recognition is not supported in this browser. Please use Chrome or Edge.
            </div>
          )}

          {/* ─── Error banner ─── */}
          {error && (
            <div className="w-full max-w-lg mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* ─── Listening indicator ─── */}
          {isListening && (
            <div className="mb-4 flex items-center gap-2 text-[var(--color-primary-light)] text-sm animate-pulse">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
              Listening… speak clearly into your microphone
            </div>
          )}

          {/* ─── Controls ─── */}
          <section className="w-full mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <ControlPanel
              isListening={isListening}
              onToggle={handleToggle}
              onClear={handleClear}
            />
          </section>

          {/* ─── Caption panels + Video player ─── */}
          <section
            className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Raw transcription (editable) */}
            <CaptionBox
              id="raw-text-output"
              title="Raw Transcription"
              icon="✏️"
              editable={true}
              content={liveRawText}
              onChange={handleRawTextChange}
              placeholder="Your raw speech text will appear here…"
              actions={
                <button
                  onClick={handleReSimplify}
                  disabled={isSimplifying}
                  className="text-xs px-3 py-1.5 rounded-md border border-[var(--border-subtle)]
                             bg-[var(--bg-surface)] text-[var(--text-secondary)]
                             hover:text-[var(--color-primary-light)] hover:border-[var(--border-hover)]
                             transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {isSimplifying ? "Processing..." : "Re-Simplify"}
                </button>
              }
            />

            {/* Deaf-friendly simplified caption */}
            <CaptionBox
              id="simple-text-output"
              title="Deaf-Friendly Caption"
              icon="💬"
              editable={false}
              content={isSimplifying ? "Processing..." : (simplifiedText || (isListening && !transcript ? "🎧 Listening…" : ""))}
              placeholder="Simplified text will appear here…"
            />

            {/* Sign language video player */}
            <VideoPlayer textToPlay={simplifiedText} />
          </section>
        </div>
      </main>
    </>
  );
}
