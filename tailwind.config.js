const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1300px",
      "2xl": "1650px",
    },
    container: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1175px",
      "2xl": "1470px",
    },
    boxShadow: {
      xs: "0px 4px 4px rgba(0, 0, 0, 0.05)",
      lg: "0px 4px 12px rgba(0, 0, 0, 0.12)",
      DEFAULT: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    fontFamily: {
      sans: [
        "Public Sans",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
    extend: {
      colors: {
        primary: "#07038C",
        secondary: "#7CCEF2",
        bratislavaRed: "#F23005",
        fontBlack: "#333333",
        error: "#DC2626",
        warning: "#F59E0B",
        success: "#2ecc71",
        blueish: "#D0ECF8",
        redish: "#E46054",
      },
      borderWidth: {
        3: "3px",
      },
      container: {
        padding: {
          DEFAULT: "2rem",
          xs: "2rem",
          sm: "1rem",
          md: "1rem",
          lg: "1rem",
          xl: "1rem",
          "2xl": "1rem",
        },
      },
      flex: {
        "1/2": 0.5,
      },
      width: {
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
        18: "4.5rem",
      },
      height: {
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
        18: "4.5rem",
      },
      minHeight: {
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
        "1/2vh": "50vh",
      },
      minWidth: {
        "1/10": "10%",
        "2/10": "20%",
        "3/10": "30%",
        "4/10": "40%",
        "5/10": "50%",
        "6/10": "60%",
        "7/10": "70%",
        "8/10": "80%",
        "9/10": "90%",
      },
      gridTemplateRows: {
        12: "repeat(12, minmax(0, 1fr))",
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
      },
      gridRow: {
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
      },
      zIndex: {
        selectLabel: "30",
        modalBackdrop: "51",
        modal: "52",
        datepickerBackdrop: "53",
        datepicker: "54",
        toast: "55",
      },
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "100%",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          "@screen xs": {
            maxWidth: "380px",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          "@screen sm": {
            maxWidth: "640px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
          "@screen md": {
            maxWidth: "768px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
          "@screen lg": {
            maxWidth: "1024px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
          "@screen xl": {
            maxWidth: "1175px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
          "@screen 2xl": {
            maxWidth: "1470px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        },
      });
    },
  ],
};
