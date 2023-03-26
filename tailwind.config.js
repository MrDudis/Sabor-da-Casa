/** @type {import("tailwindcss").Config} */

module.exports = {
  content: [
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        august: ["August July", "sans-serif"],
        lgc: ["Louis George Cafe", "sans-serif"],
        sinoreta: ["Sinoreta", "sans-serif"]
      }
    },
  },
  plugins: [],
}
