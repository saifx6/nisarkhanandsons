import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          hover: "var(--bg-hover)",
        },
        accent: {
          DEFAULT: "var(--accent-primary)",
          primary: "var(--accent-primary)",
          dim: "var(--accent-dim)",
          glow: "var(--accent-glow)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: "var(--border)",
        borderAccent: "var(--border-accent)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        
        // Map shadcn variables to our custom css
        border_default: "var(--border)",
        input: "var(--bg-elevated)",
        ring: "var(--accent-primary)",
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--accent-primary)",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "transparent",
          foreground: "var(--accent-primary)",
        },
        destructive: {
          DEFAULT: "var(--danger)",
          foreground: "var(--text-primary)",
        },
        muted: {
          DEFAULT: "var(--bg-elevated)",
          foreground: "var(--text-muted)",
        },
        accent_bg: {
          DEFAULT: "var(--bg-hover)",
          foreground: "var(--text-primary)",
        },
        popover: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
        card: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--text-primary)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
