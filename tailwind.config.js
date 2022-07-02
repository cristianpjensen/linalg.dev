/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "b1": "0 0 0 1px var(--tw-shadow-color)",
        "b2": "0 0 0 2px var(--tw-shadow-color)",
      }
    },
  },
  plugins: [],
}
