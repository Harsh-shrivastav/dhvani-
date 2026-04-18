"use client";

import Navbar from "@/components/Navbar";
import ControlPanel from "@/components/ControlPanel";
import CaptionBox from "@/components/CaptionBox";
import VideoPlayer from "@/components/VideoPlayer";

export default function Home() {
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

          {/* ─── Controls ─── */}
          <section className="w-full mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <ControlPanel />
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
              placeholder="Your raw speech text will appear here…"
              actions={
                <button
                  className="text-xs px-3 py-1.5 rounded-md border border-[var(--border-subtle)]
                             bg-[var(--bg-surface)] text-[var(--text-secondary)]
                             hover:text-[var(--color-primary-light)] hover:border-[var(--border-hover)]
                             transition-all duration-200 cursor-pointer"
                >
                  Re-Simplify
                </button>
              }
            />

            {/* Deaf-friendly simplified caption */}
            <CaptionBox
              id="simple-text-output"
              title="Deaf-Friendly Caption"
              icon="💬"
              editable={false}
              placeholder="Simplified text will appear here…"
            />

            {/* Sign language video player */}
            <VideoPlayer />
          </section>
        </div>
      </main>
    </>
  );
}
