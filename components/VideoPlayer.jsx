"use client";

import { useState, useEffect, useRef } from "react";

export default function VideoPlayer({ textToPlay = "" }) {
  const videoRef = useRef(null);
  
  // Player state
  const [status, setStatus] = useState("idle"); // idle, playing, finished, error
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playedWordsCount, setPlayedWordsCount] = useState(0);

  // 1. Process new text into the queue
  useEffect(() => {
    if (!textToPlay) {
      setQueue([]);
      setCurrentIndex(0);
      setPlayedWordsCount(0);
      setStatus("idle");
      return;
    }

    // Extract raw words
    const words = textToPlay
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);

    // If text was cleared or is shorter (e.g. user hit Clear), reset
    let count = playedWordsCount;
    if (words.length < count) {
      count = 0;
      setCurrentIndex(0);
      setQueue([]);
    }

    // Identify only the newly added words
    const newWords = words.slice(count);
    if (newWords.length === 0) return;

    // Convert to queue items (TitleCase for the asset filename)
    const newItems = newWords.map((word) => {
      const titleCase = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      return { word: titleCase, src: `/assets/${titleCase}.mp4` };
    });

    setQueue((prev) => [...prev, ...newItems]);
    setPlayedWordsCount(words.length);

    // Auto-start if we were idle or finished
    setStatus((prev) => (prev === "idle" || prev === "finished" ? "playing" : prev));
  }, [textToPlay, playedWordsCount]);

  // 2. Playback engine
  useEffect(() => {
    if (status !== "playing" || queue.length === 0) return;

    if (currentIndex >= queue.length) {
      setStatus("finished");
      return;
    }

    const currentItem = queue[currentIndex];
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.src = currentItem.src;
    videoEl.muted = true; // Required for autoplay without interaction

    // Setup event handlers
    videoEl.onloadeddata = () => {
      videoEl.play().catch((e) => {
        console.warn(`Play error: ${currentItem.word}`, e.message);
        setCurrentIndex((prev) => prev + 1); // Skip to next
      });
    };

    videoEl.onerror = () => {
      console.warn(`Video not found: ${currentItem.word}`);
      setCurrentIndex((prev) => prev + 1); // Skip if missing
    };

    videoEl.onended = () => {
      setCurrentIndex((prev) => prev + 1); // Play next
    };

    videoEl.load();

    return () => {
      // Cleanup handlers on unmount or re-render
      videoEl.onloadeddata = null;
      videoEl.onerror = null;
      videoEl.onended = null;
    };
  }, [currentIndex, queue, status]);

  const isVisible = status === "playing" && currentIndex < queue.length;
  const currentWord = queue[currentIndex]?.word || "";
  return (
    <div
      className="w-full bg-[#1e1e2f] rounded-2xl border border-[var(--border-subtle)]
                 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
                 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
          <span className="text-lg">🤟</span>
          Sign Language
        </h2>
        <span className="text-xs text-[var(--text-secondary)] opacity-60">
          {isVisible ? `Playing: ${currentWord}` : "ISL"}
        </span>
      </div>

      {/* Video area */}
      <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[350px] p-6 relative">
        <video
          ref={videoRef}
          id="videoPlayer"
          width="100%"
          height="300"
          preload="none"
          muted
          playsInline
          className={`max-w-[400px] rounded-lg ${isVisible ? "block" : "hidden"}`}
        >
          Your browser does not support the video tag.
        </video>

        {/* Placeholder status */}
        {!isVisible && (
          <div id="sign-language-status" className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-10 h-10 text-[var(--color-primary-light)] opacity-50"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            {status === "finished" ? (
              <>
                <p className="text-[var(--color-primary-light)] text-base font-medium">
                  Sequence Finished
                </p>
                <p className="text-[var(--text-secondary)] text-xs">
                  Continue speaking...
                </p>
              </>
            ) : (
              <>
                <p className="text-[var(--color-primary-light)] text-base font-medium">
                  Sign language videos will appear here…
                </p>
                <p className="text-[var(--text-secondary)] text-xs">
                  Start speaking to see ISL translations
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
