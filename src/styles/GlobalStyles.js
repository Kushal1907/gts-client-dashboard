// src/styles/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Arial', sans-serif; /* Fallback, ideally use GTS's font */
    line-height: 1.6;
    background-color: #eef2f6; /* Light background for the entire page */
    color: #333;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Align content to top */
    min-height: 100vh;
    padding: 20px 0; /* Add some vertical padding to the root */
  }
`;

export default GlobalStyle;
