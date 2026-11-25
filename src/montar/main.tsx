import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../montagem/montagem.css";
import { Formulario } from "../montagem/Formulario";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Formulario />
  </StrictMode>,
);
