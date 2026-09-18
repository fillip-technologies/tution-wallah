/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#B92124",
        secondary: "#303841",
        tertiary:"#64748b",
        bordercolor: "#d1d1d1",
      },
    },
  },
  plugins: [],
};
