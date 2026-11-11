import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "ui";
import "./docs.css";
import "./theme.css";
import { App } from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
