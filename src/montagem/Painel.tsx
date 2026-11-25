/* Painel da Retrô a Dois: ver os pedidos, revisar, aprovar e enviar. */

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Eye,
  LogOut,
  QrCode,
  RefreshCw,
  Send,
} from "lucide-react";
import QRCode from "qrcode";

import {
  entrar,
  listarPedidos,
  logada,
  modoTeste,
  mudarStatus,
  sair,
  type Pedido,
  type Status,
} from "./backend";
import { SITE } from "./config";

const NOME_PLANO: Record<string, string> = {
  basica: "Básica",
  completa: "Completa",
  inesquecivel: "Inesquecível",
};
const NOME_STATUS: Record<Status, string> = {
  novo: "Novo",
  pronto: "Aprovado",
  enviado: "Enviado",
};

const linkDa = (p: Pedido) => `${SITE}/r/?id=${p.slug}`;
/* no modo de teste os pedidos só existem neste navegador, então o link é local */
const linkLocal = (p: Pedido) => (modoTeste ? `../r/?id=${p.slug}` : linkDa(p));

function whatsapp(p: Pedido) {
  const d = p.dados as { para?: string };
  const msg =
    `Oi, ${p.cliente_nome}! A Retrô de vocês ficou pronta ❤\n\n` +
    `Aqui está o link para entregar para ${d.para ?? "o seu amor"}:\n${linkDa(p)}\n\n` +
    `Dica: abra no celular, com o som ligado. Se quiser algum ajuste, é só responder aqui.`;
  const numero = p.cliente_whatsapp.replace(/\D/g, "");
  const comDdi = numero.length <= 11 ? `55${numero}` : numero;
  return `https://wa.me/${comDdi}?text=${encodeURIComponent(msg)}`;
}

async function baixarConvite(p: Pedido) {
  const d = p.dados as { de: string; para: string };
  const W = 1200;
  const H = 1700;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  await document.fonts?.ready;
  ctx.fillStyle = "#FBF6EF";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#D7263D";
  ctx.fillRect(0, 0, W, 420);
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFD23F";
  ctx.font = "600 44px Outfit, sans-serif";
  ctx.fillText("Uma Retrô a Dois", W / 2, 150);
  ctx.fillStyle = "#FBF6EF";
  ctx.font = "700 110px Outfit, sans-serif";
  ctx.fillText(`Para ${d.para}`, W / 2, 290);
  ctx.font = "500 46px Outfit, sans-serif";
  ctx.fillText(`com amor, ${d.de}`, W / 2, 365);
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, linkDa(p), {
    width: 640,
    margin: 1,
    color: { dark: "#1C1416", light: "#FFFFFF" },
  });
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(W / 2 - 360, 520, 720, 720);
  ctx.drawImage(qr, W / 2 - 320, 560);
  ctx.fillStyle = "#1C1416";
  ctx.font = "600 52px Outfit, sans-serif";
  ctx.fillText("Aponte a câmera do celular", W / 2, 1370);
  ctx.font = "400 40px Outfit, sans-serif";
  ctx.fillStyle = "#4D3F3B";
  ctx.fillText("e abra com o som ligado", W / 2, 1430);
  ctx.fillStyle = "#D7263D";
  ctx.font = "600 38px Outfit, sans-serif";
  ctx.fillText("Retrô a Dois", W / 2, 1600);
  const a = document.createElement("a");
  a.href = c.toDataURL("image/png");
  a.download = `convite-${p.slug}.png`;
  a.click();
}

function Login({ onEntrou }: { onEntrou: () => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  return (
    <form
      className="mf-login"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await entrar(email, senha);
          onEntrou();
        } catch {
          setErro("E-mail ou senha incorretos.");
        }
      }}
    >
      <h1>Painel da Retrô a Dois</h1>
      <label className="mf-campo">
        <span className="mf-rotulo">E-mail</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
      </label>
      <label className="mf-campo">
        <span className="mf-rotulo">Senha</span>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      {erro && <p className="mf-erro">{erro}</p>}
      <button className="mf-btn" type="submit">
        Entrar
      </button>
    </form>
  );
}

export function Painel() {
  const [entrou, setEntrou] = useState<boolean | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<Status | "todos">("todos");
  const [aviso, setAviso] = useState("");

  const carregar = async () => {
    try {
      setPedidos(await listarPedidos());
    } catch {
      setAviso("Não foi possível carregar os pedidos.");
    }
  };

  useEffect(() => {
    logada().then(setEntrou);
  }, []);
  useEffect(() => {
    if (entrou) void carregar();
  }, [entrou]);

  const status = async (p: Pedido, s: Status) => {
    await mudarStatus(p.slug, s);
    await carregar();
  };

  if (entrou === null) return null;
  if (!entrou)
    return (
      <div className="mf">
        <Login onEntrou={() => setEntrou(true)} />
      </div>
    );

  const lista = pedidos.filter(
    (p) => filtro === "todos" || p.status === filtro,
  );
  const conta = (s: Status) => pedidos.filter((p) => p.status === s).length;

  return (
    <div className="mf mf--painel">
      <header className="mf-topo">
        <span className="mf-logo">Painel · Retrô a Dois</span>
        <div className="mf-topo__acoes">
          <button
            type="button"
            className="mf-btn mf-btn--leve"
            onClick={carregar}
            aria-label="Atualizar"
          >
            <RefreshCw size={16} />
          </button>
          {!modoTeste && (
            <button
              type="button"
              className="mf-btn mf-btn--leve"
              onClick={() => sair().then(() => setEntrou(false))}
            >
              <LogOut size={16} /> Sair
            </button>
          )}
        </div>
      </header>
      {modoTeste && (
        <p className="mf-teste">
          Modo de teste: mostrando os pedidos feitos neste navegador.
        </p>
      )}

      <div className="mf-filtros">
        {(["todos", "novo", "pronto", "enviado"] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={filtro === s ? "on" : ""}
            onClick={() => setFiltro(s)}
          >
            {s === "todos"
              ? `Todos (${pedidos.length})`
              : `${NOME_STATUS[s]} (${conta(s)})`}
          </button>
        ))}
      </div>

      {aviso && <p className="mf-erro">{aviso}</p>}
      {!lista.length && <p className="mf-vazio">Nenhum pedido aqui ainda.</p>}

      <ul className="mf-pedidos">
        {lista.map((p) => {
          const d = p.dados as {
            de: string;
            para: string;
            fotoFavorita?: string;
          };
          const extras =
            (p.dados as { extras?: { pet?: boolean; pedido?: boolean } })
              .extras ?? {};
          return (
            <li key={p.slug} className="mf-pedido">
              <div className="mf-pedido__topo">
                <b>
                  {d.de} &amp; {d.para}
                </b>
                <span className={`mf-status ${p.status}`}>
                  {NOME_STATUS[p.status]}
                </span>
              </div>
              <p className="mf-pedido__email">
                {p.cliente_email || "sem e-mail"}
              </p>
              <p className="mf-pedido__info">
                Plano {NOME_PLANO[p.plano] ?? p.plano} ·{" "}
                {new Date(p.criado_em).toLocaleString("pt-BR")} ·{" "}
                {p.cliente_whatsapp}
              </p>
              {(extras.pet || extras.pedido) && (
                <p className="mf-pedido__extras">
                  {extras.pet && <span>Extra: Retrô do pet</span>}
                  {extras.pedido && <span>Extra: pedido especial</span>}
                </p>
              )}
              {p.status === "novo" && (
                <p className="mf-pedido__aviso">
                  Antes de aprovar, confira na Kiwify se este e-mail pagou o
                  plano {NOME_PLANO[p.plano]}.
                </p>
              )}
              <div className="mf-pedido__acoes">
                <a
                  className="mf-btn mf-btn--leve"
                  href={linkLocal(p)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Eye size={16} /> Revisar
                </a>
                {p.status === "novo" && (
                  <button
                    type="button"
                    className="mf-btn"
                    onClick={() => status(p, "pronto")}
                  >
                    <Check size={16} /> Aprovar
                  </button>
                )}
                {p.status !== "novo" && (
                  <a
                    className="mf-btn"
                    href={whatsapp(p)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => void status(p, "enviado")}
                  >
                    <Send size={16} /> Enviar no WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  className="mf-btn mf-btn--leve"
                  onClick={() =>
                    navigator.clipboard
                      ?.writeText(linkDa(p))
                      .then(() => setAviso("Link copiado."))
                  }
                >
                  <Copy size={16} /> Copiar link
                </button>
                {p.plano === "inesquecivel" && (
                  <button
                    type="button"
                    className="mf-btn mf-btn--leve"
                    onClick={() => void baixarConvite(p)}
                  >
                    <QrCode size={16} /> Convite com QR
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
