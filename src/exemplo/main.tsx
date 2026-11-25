import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./retro.css";
import { RetroExemplo } from "./Retro";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RetroExemplo />
  </StrictMode>,
);
