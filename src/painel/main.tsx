import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../montagem/montagem.css";
import { Painel } from "../montagem/Painel";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Painel />
  </StrictMode>,
);
