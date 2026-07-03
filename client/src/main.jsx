import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// client/src/main.jsx
import tracker from "../../sdk/src/index.js";
tracker.init({ endpoint: "http://localhost:3001/api/v1", autotrack: true });
import { ThemeProvider } from "./context/ThemeContext";
createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
