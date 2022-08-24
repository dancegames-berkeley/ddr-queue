/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        wendy: ["Wendy", "mono"],
        misolight: ["Miso\\ Light", "sans-serif"]
      }
    },
  },
  plugins: [],
}
