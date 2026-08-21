import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import "./styles/global.css";

import { ThemeProvider } from "./context/ThemeContext";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider>
    <BrowserRouter>
      <CssBaseline />
      <App />
    </BrowserRouter>
    </ThemeProvider>
);