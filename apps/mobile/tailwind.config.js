/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Fond "nuit de concert" : bleu-nuit profond plutôt qu'un blanc plat.
        night: {
          950: "#080B14", // fond le plus profond (écrans plein écran, headers)
          900: "#0B1120", // fond de base
          800: "#131B2E", // surfaces / cartes
          700: "#1B2540", // surfaces surélevées, bordures internes
          600: "#2A3555", // bordures, séparateurs
        },
        // Indigo électrique - esprit éclairage de scène.
        indigo: {
          400: "#8B93FF",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        // Doré chaud - clin d'œil au ticket de concert, utilisé pour les prix.
        gold: {
          300: "#FBD489",
          400: "#F5B942",
          500: "#E8A426",
        },
        ink: {
          DEFAULT: "#F3F5FA", // texte principal, blanc légèrement bleuté
          muted: "#98A2BE", // texte secondaire
          faint: "#5D6889", // texte tertiaire / placeholders
        },
        danger: "#F2545B",
        success: "#34D399",
      },
      fontFamily: {
        display: ["Sora_700Bold"],
        "display-semibold": ["Sora_600SemiBold"],
        "display-medium": ["Sora_500Medium"],
      },
    },
  },
  plugins: [],
};
