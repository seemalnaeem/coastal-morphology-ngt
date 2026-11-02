/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // A sober slate and teal palette, calm for a data dashboard.
        brand: {
          50: "#f0f6f8",
          100: "#d9e8ec",
          500: "#2a7f8c",
          600: "#226a75",
          700: "#1b545d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
