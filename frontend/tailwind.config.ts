import type { Config } from "tailwindcss";

/**
 * Femur design tokens.
 * Tailwind v3.4 is used deliberately: Tailwind v4's native engine requires Node ≥ 20 (see ADR-008).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: { DEFAULT: "#3E9B77", soft: "#A9D9C0" },
        teal: { DEFAULT: "#1B7452", deep: "#0E3F2F" },
        mint: { DEFAULT: "#82D2A8", soft: "#DAF1E4" },
        cream: "#F6FBF8",
        ink: { DEFAULT: "#12302A", soft: "#44605A" },
        mist: "#E9F5EE",
        sand: { DEFAULT: "#B7E57A", deep: "#5E9B2B", soft: "#EEF8DC" },
        line: "rgb(18 48 42 / 0.1)",
        rose: { DEFAULT: "#B5655C", soft: "#F6E3E0" },
        sky: { DEFAULT: "#5B86A6", soft: "#E1EBF3" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      spacing: { "4.5": "1.125rem", "13": "3.25rem" },
      ringWidth: { "3": "3px" },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
