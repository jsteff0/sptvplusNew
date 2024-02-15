import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
    },
    screens: {
      'tablet': '475px',
      'mtablet': '675px',
      'smltp': "768px",
      'laptop': '1280px',
    },
  },

  plugins: [],
} satisfies Config;
