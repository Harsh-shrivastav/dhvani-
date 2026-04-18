"use client";

/**
 * CaptionBox — A reusable panel that displays either:
 *   • An editable textarea (for raw transcription)
 *   • A read-only div (for simplified / deaf-friendly output)
 *
 * Props (all optional, filled in later steps):
 *   title       — header label
 *   icon        — emoji or element
 *   editable    — if true renders a <textarea>
 *   content     — current text value
 *   placeholder — placeholder text
 *   actions     — optional React node rendered in header (e.g. button)
 */

export default function CaptionBox({
  title = "Caption",
  icon = "📝",
  editable = false,
  content = "",
  placeholder = "",
  actions = null,
  id,
}) {
  return (
    <div
      className="flex-1 min-w-0 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)]
                 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
                 hover:-translate-y-1 hover:border-[var(--border-hover)]
                 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
          <span className="text-base">{icon}</span>
          {title}
        </h2>
        {actions && <div>{actions}</div>}
      </div>

      {/* Content area */}
      {editable ? (
        <textarea
          id={id}
          className="flex-1 w-full p-5 text-[1.1rem] leading-[1.7] text-[var(--text-bright)]
                     bg-[var(--bg-surface)] border-none resize-none outline-none
                     placeholder:text-[var(--text-secondary)] placeholder:opacity-50
                     focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-shadow min-h-[200px] md:min-h-[220px]"
          placeholder={placeholder}
          defaultValue={content}
        />
      ) : (
        <div
          id={id}
          className="flex-1 p-5 text-[1.1rem] leading-[1.7] text-[var(--text-bright)]
                     whitespace-pre-wrap break-words min-h-[200px] md:min-h-[220px]"
        >
          {content || (
            <span className="text-[var(--text-secondary)] opacity-50 italic">
              {placeholder}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
