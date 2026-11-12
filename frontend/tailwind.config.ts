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
        sage: { DEFAULT: "#6B9799", soft: "#A9C6C4" },
        teal: { DEFAULT: "#415F66", deep: "#2E464C" },
        mint: { DEFAULT: "#83B1A0", soft: "#D5E7DF" },
        cream: "#F5F5F2",
        ink: { DEFAULT: "#25383B", soft: "#52676A" },
        mist: "#EDF3F0",
        sand: { DEFAULT: "#D6A77A", deep: "#B98657", soft: "#F4E6D7" },
        line: "rgb(37 56 59 / 0.1)",
        rose: { DEFAULT: "#B5655C", soft: "#F6E3E0" },
        sky: { DEFAULT: "#5B86A6", soft: "#E1EBF3" },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
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
