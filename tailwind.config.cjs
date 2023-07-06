/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      custom: ["Poppins", "sans-serif", "ui-sans-serif", "system-ui"],
    },
    extend: {
      colors: {
        primary: {
          200: "#FFFAF6",
          300: "#FFCA0F",
          400: "#F1965B",
          500: "#F97561",
          DEFAULT: "#F97561",
        },
        gray: {
          300: "#F2F0EF",
          400: "#D0CCCC",
          500: "#817D7D",
          600: "#493D3C",
          700: "#2C2524",
          DEFAULT: "#D0CCCC",
        },
        secondary: {
          200: "#EEFCFF",
          400: "#4195AF",
          DEFAULT: "#4195AF",
        },
      },
      fontSize: {
        "2xl": "3rem",
        xl: "2rem",
        lg: "1.5rem",
        md: "1.25rem",
        base: "1.125rem",
        sm: "1rem",
        xs: "0.875rem",
        DEFAULT: "1.125rem",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "20px",
      },
      animation: {
        blink: "blink 1.4s infinite both",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) ",
        fadein: "fadein 340ms linear",
        fadeout: "fadeout 340ms ease-in",
        infiniteScroll: "infiniteScroll 60s linear infinite",
      },
      keyframes: {
        infiniteScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-220%)" },
        },
        blink: {
          "0%": { opacity: "0.2" },
          "20%": { opacity: "1" },
          "100%": { opacity: "0.2" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        fadein: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeout: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const lineClampUtilities = {
        // Usage: truncate-[3]
        ...Array.from(Array(10).keys()).reduce((acc, val) => {
          const lineClamp = val + 1;
          const className = `.truncate-${lineClamp}`;

          return {
            ...acc,
            [className]: {
              overflow: "hidden",
              display: "-webkit-box",
              "-webkit-line-clamp": String(lineClamp),
              "-webkit-box-orient": "vertical",
            },
          };
        }, {}),
      };

      addUtilities(lineClampUtilities, ["responsive", "hover"]);
    },
  ],
};

module.exports = config;
