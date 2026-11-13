/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"DM Sans"', "Arial", "sans-serif"] },
      colors: { ink: "#080d19", panel: "#111a2b", indigo: { DEFAULT: "#7775ff" }, gold: "#e8bd70" },
    },
  },
  plugins: [],
};
