"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * useSpeechRecognition — Custom React hook for real-time speech-to-text.
 *
 * Uses the Web Speech API (webkitSpeechRecognition / SpeechRecognition).
 * Provides continuous listening with interim + final results.
 *
 * Returns:
 *   isListening    — boolean, whether the mic is active
 *   isSupported    — boolean, whether the browser supports speech recognition
 *   transcript     — string, accumulated final transcript
 *   interimText    — string, current interim (in-progress) text
 *   startListening — function to begin recognition
 *   stopListening  — function to stop recognition
 *   clearTranscript— function to reset all text
 *   error          — string | null, last error message
 */
export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState(null);

  // Ref to hold the recognition instance across renders
  const recognitionRef = useRef(null);
  // Ref to track accumulated final text (avoids stale closure issues)
  const transcriptRef = useRef("");

  // Initialize recognition on mount
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // ── Handle results ──
    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalChunk += text.trim() + " ";
        } else {
          interim += text;
        }
      }

      // Append any final text to the accumulated transcript
      if (finalChunk) {
        transcriptRef.current += finalChunk;
        setTranscript(transcriptRef.current);
      }

      setInterimText(interim);
    };

    // ── Auto-restart on unexpected end (keeps listening active) ──
    recognition.onend = () => {
      // If still supposed to be listening, restart
      if (recognitionRef.current?._shouldListen) {
        try {
          recognition.start();
        } catch {
          // Already started — ignore
        }
      } else {
        setIsListening(false);
      }
    };

    // ── Error handling ──
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);

      if (e.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone permissions.");
        setIsListening(false);
        recognition._shouldListen = false;
      } else if (e.error === "no-speech") {
        // Silence — not a fatal error, recognition will auto-restart
      } else {
        setError(`Speech error: ${e.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition._shouldListen = false;
      try {
        recognition.stop();
      } catch {
        // Not started — ignore
      }
    };
  }, []);

  // ── Start listening ──
  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Reset state for a fresh session
    transcriptRef.current = "";
    setTranscript("");
    setInterimText("");
    setError(null);

    recognition._shouldListen = true;
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      // Already started — ignore
    }
  }, []);

  // ── Stop listening ──
  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition._shouldListen = false;
    setIsListening(false);
    setInterimText("");

    try {
      recognition.stop();
    } catch {
      // Not started — ignore
    }
  }, []);

  // ── Clear all text ──
  const clearTranscript = useCallback(() => {
    transcriptRef.current = "";
    setTranscript("");
    setInterimText("");
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimText,
    startListening,
    stopListening,
    clearTranscript,
    error,
  };
}
