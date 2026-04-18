"use client";

export default function VideoPlayer() {
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
        <span className="text-xs text-[var(--text-secondary)] opacity-60">ISL</span>
      </div>

      {/* Video area */}
      <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[350px] p-6">
        {/* Video element — hidden until playback starts (Step 5) */}
        <video
          id="videoPlayer"
          width="100%"
          height="300"
          preload="none"
          muted
          playsInline
          className="hidden max-w-[400px] rounded-lg"
        >
          Your browser does not support the video tag.
        </video>

        {/* Placeholder status */}
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
          <p className="text-[var(--color-primary-light)] text-base font-medium">
            Sign language videos will appear here…
          </p>
          <p className="text-[var(--text-secondary)] text-xs">
            Start speaking to see ISL translations
          </p>
        </div>
      </div>
    </div>
  );
}
