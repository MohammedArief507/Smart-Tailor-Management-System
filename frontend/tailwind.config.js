/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#50C2C9",
          dark: "#3AA6AD",
          light: "#DCF3F4",
        },
        background: "#F0F4F3",
        card: "#E6E6E6",
        success: "#22C55E",
        danger: "#EF4444",
        textmain: "#1F2937",
      },
      borderRadius: {
        card: "18px",
        btn: "16px",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 14px rgba(31, 41, 55, 0.08)",
        softer: "0 2px 8px rgba(31, 41, 55, 0.06)",
      },
      maxWidth: {
        app: "430px",
      },
    },
  },
  plugins: [],
};
