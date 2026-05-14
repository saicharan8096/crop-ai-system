import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@fontsource/poppins";
import "./global.css";
import "./index.css";
import "./i18n";

// Global reset styles
const style = document.createElement("style");
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #f9fafb; font-family: Inter, system-ui, -apple-system, sans-serif; }
  p { margin: 0 0 0.75rem; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
