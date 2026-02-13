import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1117",
        surface: { DEFAULT: "#1A1D27", 2: "#232733" },
        border: { DEFAULT: "#2E3340", accent: "#3D4255" },
        text: { DEFAULT: "#E8E9ED", muted: "#9499AD", dim: "#6B7089" },
        accent: { DEFAULT: "#4F8CFF", glow: "rgba(79,140,255,0.15)" },
        gc: {
          green: "#34D399",
          "green-dim": "rgba(52,211,153,0.12)",
          amber: "#FBBF24",
          "amber-dim": "rgba(251,191,36,0.12)",
          red: "#F87171",
          "red-dim": "rgba(248,113,113,0.12)",
          purple: "#A78BFA",
          "purple-dim": "rgba(167,139,250,0.12)",
          cyan: "#22D3EE",
          "cyan-dim": "rgba(34,211,238,0.12)",
          orange: "#FB923C",
          "orange-dim": "rgba(251,146,60,0.12)",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Fraunces", "serif"],
      },
      borderRadius: {
        gc: "10px",
        "gc-sm": "6px",
      },
    },
  },
  plugins: [],
};

export default config;
