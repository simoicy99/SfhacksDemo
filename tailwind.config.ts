import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.92" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(5%, -8%) scale(1.05)" },
          "50%": { transform: "translate(-5%, 5%) scale(0.98)" },
          "75%": { transform: "translate(8%, 3%) scale(1.02)" },
        },
        "blob-1": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(4%, -6%) scale(1.06)" },
          "66%": { transform: "translate(-4%, 4%) scale(0.97)" },
        },
        "blob-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-6%, 3%) scale(1.04)" },
          "66%": { transform: "translate(3%, -5%) scale(0.99)" },
        },
        "blob-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(5%, 5%) scale(1.03)" },
          "66%": { transform: "translate(-3%, -4%) scale(0.98)" },
        },
        "blob-4": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-4%, -6%) scale(1.05)" },
          "66%": { transform: "translate(6%, 2%) scale(0.96)" },
        },
        "grid-fade": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(6px, -8px)" },
          "50%": { transform: "translate(-4px, 6px)" },
          "75%": { transform: "translate(8px, 4px)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 12s ease-in-out infinite",
        "blob-1": "blob-1 18s ease-in-out infinite",
        "blob-2": "blob-2 22s ease-in-out infinite",
        "blob-3": "blob-3 20s ease-in-out infinite",
        "blob-4": "blob-4 24s ease-in-out infinite",
        "grid-fade": "grid-fade 8s ease-in-out infinite",
        float: "float 15s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
