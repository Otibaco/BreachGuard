/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        "bg-canvas": "#0B0F17",
        "bg-surface": "#070B12",
        "bg-card": "#0E1524",
        "bg-card-hover": "#131E32",
        "bg-input": "#0D1524",
        "bg-elevated": "#1E293B",
        "bg-darker": "#070A0F",
        "bg-hero-from": "#101B2E",
        "bg-hero-via": "#0C111C",

        // Text
        "text-primary": "#F8FAFC",
        "text-secondary": "#F1F5F9",
        "text-muted": "#94A3B8",
        "text-subtle": "#64748B",
        "text-dim": "#475569",
        "text-light": "#CBD5E1",

        // Brand (cyan)
        "brand-cyan": "#38BDF8",
        "brand-primary": "#0EA5E9",
        "brand-hover": "#0284C7",
        "brand-dark": "#0369A1",

        // Threat / critical (red)
        critical: "#DC2626",
        "critical-high": "#EF4444",
        "critical-light": "#F87171",
        "critical-text": "#FCA5A5",
        "critical-bg": "#450A0A",
        "critical-border": "#991B1B",

        // Threat / warning (amber)
        warning: "#FBBF24",
        "warning-amber": "#F59E0B",
        "warning-text": "#FDE68A",
        "warning-bg": "#78350F",
        "warning-border": "#B45309",

        // Threat / clean (emerald)
        clean: "#10B981",
        "clean-light": "#34D399",
        "clean-accent": "#4ADE80",
        "clean-text": "#A7F3D0",
        "clean-bg": "#064E3B",
        "clean-border": "#059669",
        "clean-surface": "#0A261D",

        // Borders
        "border-subtle": "rgba(255,255,255,0.08)",
        "border-medium": "rgba(255,255,255,0.15)",
        "border-strong": "rgba(255,255,255,0.25)",
        "border-hover": "#334155",

        "celebration-pink": "#F472B6",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
