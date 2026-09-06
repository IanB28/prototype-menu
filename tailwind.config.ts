import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#25231f",
        cream: "#f7f4ee",
        espresso: "#6e4b3a",
        sage: "#78846c",
        line: "#e6e0d6"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        soft: "0 14px 40px rgba(56, 44, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
