/* A Retrô de cada casal: /r/?id=<código>. Carrega os dados e mostra a experiência. */
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "../exemplo/retro.css";
import { usarRetro, type Retro } from "../exemplo/dados";
import { RetroExemplo } from "../exemplo/Retro";
import { lerRetro, resolverArquivos } from "../montagem/backend";
import { reviverRetro } from "../montagem/montar";

function PaginaRetro() {
  const [estado, setEstado] = useState<"carregando" | "pronta" | "nada">(
    "carregando",
  );
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("id") ?? "";
    (async () => {
      const p = id ? await lerRetro(id) : null;
      if (!p) return setEstado("nada");
      const dados = reviverRetro(await resolverArquivos(p.dados as Retro));
      usarRetro(dados);
      document.title = `${dados.de} & ${dados.para} · Retrô a Dois`;
      setEstado("pronta");
    })().catch(() => setEstado("nada"));
  }, []);

  if (estado === "pronta") return <RetroExemplo />;
  return (
    <div className="rx-aviso">
      {estado === "carregando" ? (
        <p>Preparando a sua Retrô…</p>
      ) : (
        <>
          <p>Essa Retrô ainda não está pronta ou o link está incompleto.</p>
          <a className="rx-btn" href="../">
            Conhecer a Retrô a Dois
          </a>
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PaginaRetro />
  </StrictMode>,
);
