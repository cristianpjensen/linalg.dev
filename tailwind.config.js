/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        b1: "0 0 0 1px var(--tw-shadow-color)",
        b2: "0 0 0 2px var(--tw-shadow-color)",
      },
      colors: {
        offblack: "#0a0a0a",
        offwhite: "#f6f6f6",
      },
    },
  },
  plugins: [],
};
