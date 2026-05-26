/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  prefix: 'core-',
  theme: {
    extend: {
      colors: {
        page: {
          light: "#f4f3fc",
          dark: "#0b0a14"
        },
        card: {
          light: "#ffffff",
          dark: "#15132b"
        },
        cardAlt: {
          light: "#fafafe",
          dark: "#1a1730"
        },
        borderBase: {
          light: "rgba(99,102,241,0.1)",
          dark: "rgba(255,255,255,0.06)"
        },
        textPrimary: {
          light: "#1a1830",
          dark: "#eceaf8"
        },
        textMuted: {
          light: "#7874a3",
          dark: "#7b77a8"
        },
        inputBg: {
          light: "#edeaf9",
          dark: "#1f1d38"
        },
        navHover: {
          light: "rgba(99,102,241,0.07)",
          dark: "rgba(99,102,241,0.12)"
        }
      },
      fontFamily: {
        roboto: ['Roboto'],
      }
    },
  },
  plugins: [],
}
