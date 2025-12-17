import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#c9a87c",
          dark: "#b89668",
        },
        "bg-light": "#faf9f7",
        "text-primary": "#3d3d3d",
      },
    },
  },
} satisfies Config
