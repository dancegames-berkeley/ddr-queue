/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
