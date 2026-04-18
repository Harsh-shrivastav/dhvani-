"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.body.classList.add("light-mode");
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("light-mode");
    const light = document.body.classList.contains("light-mode");
    setIsLight(light);
    localStorage.setItem("theme", light ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-3.5 bg-[var(--bg-nav)] shadow-[var(--shadow-nav)] transition-colors duration-300">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="w-6 h-6"
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
        <span className="text-[var(--color-primary-light)] font-bold text-xl tracking-tight">
          Vaani
        </span>
      </div>

      {/* Right side nav */}
      <div className="flex items-center gap-3 md:gap-5">
        <a
          href="#features"
          className="hidden md:inline text-[var(--text-primary)] hover:text-[var(--color-primary-light)] transition-colors text-sm"
        >
          Features
        </a>
        <a
          href="#about"
          className="hidden md:inline text-[var(--text-primary)] hover:text-[var(--color-primary-light)] transition-colors text-sm"
        >
          About
        </a>
        <a
          href="#"
          className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
        >
          Get Started
        </a>
        <button
          onClick={toggleTheme}
          className="text-[var(--color-primary-lighter)] text-xl cursor-pointer hover:scale-110 hover:rotate-[20deg] transition-transform duration-300 bg-transparent border-none"
          title="Toggle Theme"
        >
          {isLight ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
