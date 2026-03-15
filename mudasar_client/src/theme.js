//color design tokens
export const colorTokens = (mode) => {
  if (mode === "dark") {
    return {
      grey: {
        100: "#ff0000",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414",
      },
      primary: {
        100: "#d0d1d5",
        200: "#a1a4ab",
        300: "#727681",
        400: "#1F2a40",
        500: "#141b2d",
        600: "#101624",
        700: "#0c101b",
        800: "#080b12",
        900: "#040509",
      },
      indigo: {
        100: "#e3dcfe",
        200: "#c7b9fc",
        300: "#ac97fb",
        400: "#9074f9",
        500: "#7451f8",
        600: "#5d41c6",
        700: "#463195",
        800: "#2e2063",
        900: "#171032",
      },
      greenAccent: {
        100: "#dbf5ee",
        200: "#b7ebde",
        300: "#94e2cd",
        400: "#70d8bd",
        500: "#4cceac",
        600: "#3da58a",
        700: "#2e7c67",
        800: "#1e5245",
        900: "#0f2922",
      },
      redAccent: {
        100: "#f8dcdb",
        200: "#f1b9b7",
        300: "#e99592",
        400: "#e2726e",
        500: "#db4f4a",
        600: "#af3f3b",
        700: "#832f2c",
        800: "#58201e",
        900: "#2c100f",
      },
      blueAccent: {
        100: "#e1e2fe",
        200: "#c3c6fd",
        300: "#a4a9fc",
        400: "#868dfb",
        500: "#6870fa",
        600: "#535ac8",
        700: "#3e4396",
        800: "#2a2d64",
        900: "#151632",
      },
    };
  } else {
    return {
      grey: {
        100: "#141414",
        200: "#292929",
        300: "#3d3d3d",
        400: "#525252",
        500: "#666666",
        600: "#858585",
        700: "#a3a3a3",
        800: "#c2c2c2",
        900: "#e0e0e0",
      },
      primary: {
        100: "#040509",
        200: "#080b12",
        300: "#0c101b",
        400: "#f2f0f0",
        500: "#141b2d",
        600: "#434957",
        700: "#727681",
        800: "#a1a4ab",
        900: "#d0d1d5",
      },
      indigo: {
        100: "#171032",
        200: "#2e2063",
        300: "#463195",
        400: "#5d41c6",
        500: "#7451f8",
        600: "#9074f9",
        700: "#ac97fb",
        800: "#c7b9fc",
        900: "#e3dcfe",
      },
      greenAccent: {
        100: "#0f2922",
        200: "#1e5245",
        300: "#2e7c67",
        400: "#3da58a",
        500: "#4cceac",
        600: "#70d8bd",
        700: "#94e2cd",
        800: "#b7ebde",
        900: "#dbf5ee",
      },
      redAccent: {
        100: "#2c100f",
        200: "#58201e",
        300: "#832f2c",
        400: "#af3f3b",
        500: "#db4f4a",
        600: "#e2726e",
        700: "#e99592",
        800: "#f1b9b7",
        900: "#f8dcdb",
      },
      blueAccent: {
        100: "#151632",
        200: "#2a2d64",
        300: "#3e4396",
        400: "#535ac8",
        500: "#6870fa",
        600: "#868dfb",
        700: "#a4a9fc",
        800: "#c3c6fd",
        900: "#e1e2fe",
      },
    };
  }
};


//mui theme settings
export const themeSettings = (mode) => {
  const colors = colorTokens(mode);
  const darkColors = {
    primary: {
      main: "#777",
      light: colors.grey[100],
      dark: colors.grey[100],
    },
    secondary: {
      main: "#303134",
      light: colors.grey[500],
      dark: colors.grey[800],
      contrastText: colors.grey[300]
    },
    tertiary: {
      main: "#3b3c3f"
    },
    background: {
      main: "#202124"
    },
    neutral: {
      dark: colors.grey[700],
      main: colors.grey[500],
      light: colors.grey[100],
    },
    admin: {
      main: "#00ff00",
      light: "#00ff00",
      dark: "#00ff00"
    },
    // background: {
    //   default: colors.primary[500],
    // },
  };
  const lightColors = {
    primary: {
      main: "#025feb",
      light: "#025feb",
      dark: "#025feb",
      // dark: "#a737ed",
      
    },
    secondary: {
      main: colors.greenAccent[500],
      contrastText: "#fff"
    },
    neutral: {
      dark: colors.grey[700],
      main: colors.grey[500],
      light: colors.grey[100],
    },
    error: {
      main: "#ff0000"
    },
   
    admin: {
      main: "#00ff00",
      light: "#00ff00",
      dark: "#00ff00"
    }, 
    tertiary: {
      main: "#3b3c3f"
    },
    background: {
      main: "#fff"
    },
  };

  return {
    palette: {
      mode: mode,
      name: "name",
      
      ...(mode === "dark" ? darkColors : lightColors),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    // components: {
    //   MuiOutlinedInput: {
    //     styleOverrides: {
    //       input: {
    //         '&:-webkit-autofill': {
    //           '-webkit-box-shadow': '0 0 0 100px #000 inset',
    //           '-webkit-text-fill-color': '#fff'
    //         }
    //       },
    //     },
    //   },
    // },
  };
};
 

