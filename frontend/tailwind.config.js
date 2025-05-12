// tailwind.config.js
const { heroui } = require("@heroui/react");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          light: "rgba(51, 51, 51, 0.05)",
          dark: "rgba(51, 51, 51, 0.1)",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        disabledOpacity: "0.3", // opacity-[0.3]
        radius: {},
        borderWidth: {},
      },
      themes: {
        light: {},
        dark: {},
      },
    }),
  ],
};
