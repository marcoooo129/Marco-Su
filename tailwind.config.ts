import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Mono"', "monospace"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      colors: {
        accent: "#21A35C",
      },
    },
  },
  plugins: [],
};

export default config;
