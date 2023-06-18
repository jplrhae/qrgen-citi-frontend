import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#f5f5f5",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
    },
  },
});

export default theme;
