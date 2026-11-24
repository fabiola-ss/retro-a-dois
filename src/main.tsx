import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./retro.css";
import { RetroADois } from "./RetroPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RetroADois />
  </StrictMode>,
);
