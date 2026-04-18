"use client";

/**
 * ControlPanel — Start/Stop listening toggle + Clear button.
 * 
 * Props (all optional, wired in Step 3):
 *   isListening   — boolean state
 *   onToggle      — callback for start/stop
 *   onClear       — callback to clear transcripts
 */

export default function ControlPanel({
  isListening = false,
  onToggle = () => {},
  onClear = () => {},
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
      {/* Primary toggle button */}
      <button
        onClick={onToggle}
        className={`
          relative text-lg px-8 py-3.5 rounded-xl font-bold cursor-pointer
          transition-all duration-300 w-full sm:w-auto
          shadow-lg hover:-translate-y-0.5 active:translate-y-0
          ${
            isListening
              ? "bg-red-500 hover:bg-red-400 text-white shadow-red-500/30"
              : "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] hover:from-[#8b5cf6] hover:to-[#a78bfa] text-white shadow-indigo-500/30"
          }
        `}
      >
        {/* Pulse ring when listening */}
        {isListening && (
          <span className="absolute inset-0 rounded-xl animate-listen-pulse" />
        )}
        <span className="relative flex items-center justify-center gap-2">
          {isListening ? (
            <>
              <span className="inline-block w-3 h-3 rounded-full bg-white animate-pulse" />
              Stop Listening
            </>
          ) : (
            <>
              🎤 Start Listening
            </>
          )}
        </span>
      </button>

      {/* Clear button */}
      <button
        onClick={onClear}
        className="text-sm px-5 py-2.5 rounded-lg border border-[var(--border-subtle)]
                   bg-[var(--bg-elevated)] text-[var(--text-primary)]
                   hover:bg-[var(--bg-surface)] hover:border-[var(--border-hover)]
                   transition-all duration-200 cursor-pointer w-full sm:w-auto"
      >
        🧹 Clear Slate
      </button>
    </div>
  );
}
