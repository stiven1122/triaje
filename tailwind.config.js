/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"Instrument Sans"', "system-ui", "sans-serif"] },
      colors: {
        // Colores institucionales CUAC - Azul Rey, Amarillo, Blanco
        cuac: {
          // Azul Rey institucional
          blue: {
            DEFAULT: "#003399",
            50: "#e6f0ff",
            100: "#b3d1ff",
            200: "#80b3ff",
            300: "#4d94ff",
            400: "#1a75ff",
            500: "#003399",
            600: "#002966",
            700: "#001f33",
            800: "#001422",
            900: "#000a11",
          },
          // Amarillo institucional
          yellow: {
            DEFAULT: "#FFD700",
            50: "#fffbe6",
            100: "#fff5b3",
            200: "#ffeb80",
            300: "#ffe14d",
            400: "#ffd71a",
            500: "#FFD700",
            600: "#ccac00",
            700: "#998100",
            800: "#665600",
            900: "#332b00",
          },
          // Blanco institucional
          white: {
            DEFAULT: "#FFFFFF",
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
          },
        },
        // Mantener referencia antigua para compatibilidad
        ink: { 900: "#000a11", 800: "#001422", 700: "#001f33", 300: "#4d94ff" },
        paper: "#fafafa",
        signal: { DEFAULT: "#FFD700", soft: "#fffbe6" },
      },
    },
  },
  plugins: [],
};
