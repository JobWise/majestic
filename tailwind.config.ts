import type { Config } from "tailwindcss";

import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

require("tailwindcss/plugin");

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx,jsx,js}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    scale: {
      "0": "0",
      "25": ".25",
      "50": ".5",
      "75": ".75",
      "90": ".9",
      "95": ".95",
      "100": "1",
      "105": "1.05",
      "110": "1.1",
      "125": "1.25",
      "150": "1.5",
      "200": "2",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      slate: colors.slate,
      stone: colors.stone,
      black: colors.black,
      white: colors.white,
      cyan: colors.cyan,
      violet: colors.violet,
      gray: {
        ...colors.slate,
        25: "#FCFCFD",
      },
      green: {
        ...colors.emerald,
        25: "#F4FFFA",
      },
      blue: {
        ...colors.blue,
        25: "#F5FAFF",
      },
      indigo: {
        ...colors.indigo,
        25: "#F5F8FF",
      },
      purple: {
        ...colors.indigo,
        25: "#F5F8FF",
      },
      yellow: {
        ...colors.amber,
        25: "#FFFCF5",
      },
      red: {
        ...colors.rose,
        25: "#FFF5F6",
      },
      pink: {
        ...colors.pink,
        25: "#FEF6FB",
      },
      fuchsia: colors.fuchsia,
      sky: colors.sky,
      orange: colors.orange,
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      height: {
        screen: "100dvh",
      },
      minHeight: {
        screen: "100dvh",
      },
      keyframes: {
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(1px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-2px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(2px, 0, 0)",
          },
        },
        shine: {
          "0%": { left: "-100px" },
          "20%": { left: "100%" },
          "100%": { left: "100%" },
        },
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
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
        shine: "shine 3s infinite linear",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        xs: "0px 1px 2px rgba(16, 24, 40, 0.05)",
      },
      fontFamily: {
        sans: ["'Inter'", ...defaultTheme.fontFamily.sans],
        poppins: ["'Poppins'", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        container: "1440px",
      },
      fontSize: {
        xs: ["12px", "18px"],
        sm: ["14px", "20px"],
        md: ["16px", "24px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "30px"],
        "display-xs": ["24px", "32px"],
        "display-sm": ["30px", "38px"],
        "display-md": [
          "36px",
          {
            lineHeight: "44px",
            letterSpacing: "-0.025em",
          },
        ],
        "display-lg": [
          "48px",
          {
            lineHeight: "60px",
            letterSpacing: "-0.025em",
          },
        ],
        "display-xl": [
          "60px",
          {
            lineHeight: "72px",
            letterSpacing: "-0.025em",
          },
        ],
        "display-h1": [
          "64px",
          {
            lineHeight: "72px",
            letterSpacing: "-2.56px",
          },
        ],
        "display-h1-sm": [
          "40px",
          {
            lineHeight: "54px",
            letterSpacing: "-2.56px",
          },
        ],
        "display-2xl": [
          "72px",
          {
            lineHeight: "90px",
            letterSpacing: "-0.025em",
          },
        ],
        "page-heading": [
          "24px",
          {
            lineHeight: "28px",
            letterSpacing: "-4%",
          },
        ],
        "section-heading": [
          "20px",
          {
            lineHeight: "100%",
            letterSpacing: "-4%",
          },
        ],
        "section-heading-sm": [
          "16px",
          {
            lineHeight: "100%",
            letterSpacing: "-4%",
          },
        ],
        title: [
          "28px",
          {
            lineHeight: "100%",
            letterSpacing: "-4%",
          },
        ],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
  ],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(slate|stone|black|white|gray|green|blue|indigo|purple|yellow|red|pink|fuchsia|sky|orange)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
} satisfies Config;
