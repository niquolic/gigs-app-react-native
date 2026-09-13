/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Palette reprise du front Angular (menu.component.scss / login.component.scss)
        primary: "#007bff",
        "primary-dark": "#0056b3",
        accent: "#8BADF5",
        dark: "#333333",
        danger: "#f20202",
        spotify: "#1DB954",
      },
    },
  },
  plugins: [],
};
