import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1F3A8A", accent: "#059669" }
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" }
    }
  },
  plugins: []
};
export default config;
