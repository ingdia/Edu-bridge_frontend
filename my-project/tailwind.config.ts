// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand - Professional Blue
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF", // ← Main brand color
          900: "#1E3A8A",
        },
        // Secondary - Professional Green
        secondary: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669", // ← Main accent
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        // Neutral Backgrounds
        background: {
          default: "#F8FAFC", // Main page background
          surface: "#FFFFFF", // Cards, modals
          elevated: "#F1F5F9", // Hover states, subtle sections
        },
        // Text Colors
        text: {
          primary: "#1E293B", // Main body text
          secondary: "#64748B", // Secondary text
          muted: "#94A3B8", // Disabled/hint text
          inverse: "#FFFFFF", // Text on dark backgrounds
        },
        // Borders
        border: {
          light: "#E2E8F0",
          DEFAULT: "#CBD5E1",
          dark: "#94A3B8",
        },
        // Status Colors (solid, no gradients)
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
          dark: "#14532D",
        },
        error: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
          dark: "#7F1D1D",
        },
        warning: {
          DEFAULT: "#D97706",
          light: "#FEF3C7",
          dark: "#78350F",
        },
        info: {
          DEFAULT: "#0284C7",
          light: "#E0F2FE",
          dark: "#0C4A6E",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        cardHover: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        card: "0.75rem",
        button: "0.5rem",
      },
    },
  },
  plugins: [],
};
export default config;