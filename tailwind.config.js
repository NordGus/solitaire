/** @type {import('tailwindcss').Config} */


export default {
  content: [
    "./html/templates/**/*.gohtml",
    "./client/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    darkMode: "class",
    fontFamily: {
      sans: ["Geist Light", "sans"],
    },
    extend: {
      gridTemplateRows: {
        card: "min-content 1fr"
      }
    },
  },
  plugins: [],
};
