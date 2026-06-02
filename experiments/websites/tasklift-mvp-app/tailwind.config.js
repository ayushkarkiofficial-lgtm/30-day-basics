/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        muted: "#5b6864",
        line: "#d9ded8",
        accent: "#1f6f5b",
        canvas: "#f7f8f5",
      },
      boxShadow: {
        panel: "0 18px 45px rgba(23, 33, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
