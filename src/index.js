// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store"; // Note the curly braces
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// Material-UI imports
import "@fontsource/roboto/300.css"; // Roboto font for Material-UI
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline"; // Provides a clean slate for MUI styles
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  // You can customize your theme here
  palette: {
    primary: {
      main: "#1976d2", // Example primary color
    },
    secondary: {
      main: "#dc004e", // Example secondary color
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Wrap your App with ThemeProvider and CssBaseline */}
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Applies base CSS styles */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
