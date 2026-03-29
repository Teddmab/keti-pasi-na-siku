import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Semantic design system tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // KaziPay brand palette
        "kp-green": {
          50:  "#E1F5EE",
          100: "#C8F0E4",
          200: "#9FE1CB",
          300: "#5DCAA5",
          400: "#3DB88A",
          500: "#1D9E75",
          600: "#0F9470",
          700: "#0B7A5C",
          800: "#0B4A2E",
          900: "#052E1C",
        },
        "kp-night":   "#1A1A2E",
        "kp-night-2": "#2D2D42",
        "kp-night-3": "#3D3D55",
        "kp-gold":    "#F5C842",
        "kp-gold-d":  "#C49A1A",
        "kp-gold-l":  "#FEF3C7",
        "kp-surface":   "#F7F6F2",
        "kp-surface-2": "#EFEDE8",
        "kp-border":    "#E2DDD6",
        "kp-border-2":  "#D0CBC2",
        "kp-text-1": "#1A1A2E",
        "kp-text-2": "#4A4A5E",
        "kp-text-3": "#888797",
        "kp-white":  "#FFFFFF",
        "kp-error":    "#E24B4A",
        "kp-error-bg": "#FEE2E2",
        "kp-warning":    "#EF9F27",
        "kp-warning-bg": "#FEF3C7",
        "kp-info":    "#378ADD",
        "kp-info-bg": "#EFF6FF",
        "kp-success":    "#1D9E75",
        "kp-success-bg": "#E1F5EE",
        // Network brand colors
        airtel: "#E24B4A",
        orange: "#EF9F27",
        vodacom: "#378ADD",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "kp-sm":  "6px",
        "kp-md":  "10px",
        "kp-lg":  "16px",
        "kp-xl":  "24px",
        "kp-2xl": "32px",
      },
      boxShadow: {
        'kp-sm': '0 1px 3px rgba(26,26,46,0.08), 0 1px 2px rgba(26,26,46,0.04)',
        'kp-md': '0 4px 12px rgba(26,26,46,0.10), 0 2px 4px rgba(26,26,46,0.06)',
        'kp-lg': '0 12px 32px rgba(26,26,46,0.14), 0 4px 8px rgba(26,26,46,0.08)',
        'card': '0 1px 3px rgba(26,26,46,0.08), 0 1px 2px rgba(26,26,46,0.04)',
        'button': '0 4px 12px rgba(11,122,92,0.3)',
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "spring-in": {
          from: { opacity: "0", transform: "scale(0.8)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 250ms ease-out",
        "spring-in": "spring-in 400ms cubic-bezier(0.34,1.56,0.64,1)",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 1500ms linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
