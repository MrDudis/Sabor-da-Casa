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
      },
      screens: {
        "2xs": "340px",
        "xs": "420px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      backgroundSize: {
        "500": "500px 500px",
      }
    },
  },
  plugins: [],
}
