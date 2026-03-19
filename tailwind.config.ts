import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1294DD",
        "primary-dark": "#0e76b0",
        dark: "#111827",
        black: "#000000",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
export default config;
