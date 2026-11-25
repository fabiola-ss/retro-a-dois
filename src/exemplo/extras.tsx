/* Capítulos extras da Retrô: linha do tempo, antes e depois, top 5, quiz,
   prêmios, recados, vales de raspadinha, pergunta final e o cartão de resumo
   para compartilhar. */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Download, Heart, Share2, Trophy, X } from "lucide-react";

import { Ilustracao, Polaroid } from "./arte";
import { RETRO } from "./dados";

export const reduz = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------- como tudo começou ------------------------- */

export function Comeco() {
  return (
    <>
      <p className="rx-kicker rx-a">Antes de 2026</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Como tudo começou
      </h2>
      <ol className="rx-linha rx-a" style={{ "--d": 2 } as CSSProperties}>
        {RETRO.comeco.map((m, k) => (
          <li key={m.titulo}>
            <span className="rx-linha__data">{m.data}</span>
            <Polaroid cena={m.cena} rot={k % 2 ? 3 : -3} />
            <b>{m.titulo}</b>
            <span>{m.texto}</span>
          </li>
        ))}
      </ol>
      <p className="rx-dica rx-a" style={{ "--d": 3 } as CSSProperties}>
        Arraste para o lado →
      </p>
    </>
  );
}

/* --------------------------- antes e depois --------------------------- */

export function AntesDepois({ on }: { on: boolean }) {
  const a = RETRO.antesDepois;
  const [pos, setPos] = useState(50);
  const mexeu = useRef(false);

  /* sozinho, a barra passeia uma vez para mostrar que dá para arrastar */
  useEffect(() => {
    if (!on || reduz()) return;
    let raf = 0;
    const t0 = performance.now() + 800;
    const passo = (agora: number) => {
      if (mexeu.current) return;
      const t = (agora - t0) / 2600;
      if (t >= 0) setPos(50 + Math.sin(Math.min(t, 1) * Math.PI * 2) * 30);
      if (t < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return (
    <>
      <p className="rx-kicker rx-a">Antes e depois</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        {a.antes.legenda} → {a.depois.legenda}
      </h2>
      <div className="rx-ad rx-a" style={{ "--d": 2 } as CSSProperties}>
        <div className="rx-ad__img">
          <Ilustracao cena={a.depois.cena} />
        </div>
        <div
          className="rx-ad__img rx-ad__antes"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Ilustracao cena={a.antes.cena} />
        </div>
        <span
          className="rx-ad__linha"
          style={{ left: `${pos}%` }}
          aria-hidden="true"
        >
          <i />
        </span>
        <span className="rx-ad__tag" aria-hidden="true">
          {a.antes.legenda}
        </span>
        <span className="rx-ad__tag dir" aria-hidden="true">
          {a.depois.legenda}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => {
            mexeu.current = true;
            setPos(Number(e.target.value));
          }}
          aria-label={`Comparar ${a.antes.legenda} e ${a.depois.legenda}`}
        />
      </div>
      <p className="rx-texto rx-a" style={{ "--d": 3 } as CSSProperties}>
        {a.frase}
      </p>
    </>
  );
}

/* -------------------------------- top 5 -------------------------------- */

export function Top5({ on }: { on: boolean }) {
  const t = RETRO.top5;
  const max = Math.max(...t.itens.map((i) => i.vezes));
  return (
    <>
      <p className="rx-kicker rx-a">Top 5 de {RETRO.ano}</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        {t.titulo}
      </h2>
      <ol className={`rx-top${on ? " enche" : ""}`}>
        {t.itens.map((i, k) => (
          <li
            key={i.nome}
            className="rx-a"
            style={
              {
                "--d": k + 2,
                "--w": `${(i.vezes / max) * 100}%`,
              } as CSSProperties
            }
          >
            <span className="rx-top__pos">{k + 1}</span>
            <span className="rx-top__nome">
              {i.nome}
              <small>{i.vezes.toLocaleString("pt-BR")} vezes</small>
            </span>
            <span className="rx-top__barra" aria-hidden="true">
              <i />
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}

/* -------------------------------- quiz -------------------------------- */

export function Quiz({ auto }: { auto: boolean }) {
  const q = RETRO.quiz;
  const [i, setI] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const fim = i >= q.length;
  const atual = q[Math.min(i, q.length - 1)]!;

  const responder = (nome: string) => {
    if (escolha) return;
    setEscolha(nome);
    if (nome === atual.resposta) setAcertos((v) => v + 1);
  };
  const proxima = () => {
    setEscolha(null);
    setI((v) => v + 1);
  };

  /* no modo "assistir sozinho", o quiz responde sozinho */
  useEffect(() => {
    if (!auto || fim) return;
    const t = window.setTimeout(
      () => (escolha ? proxima() : responder(atual.resposta)),
      escolha ? 2200 : 1400,
    );
    return () => window.clearTimeout(t);
  });

  return (
    <>
      <p className="rx-kicker rx-a">Quiz do casal</p>
      {!fim ? (
        <div
          className="rx-quiz rx-a"
          style={{ "--d": 1 } as CSSProperties}
          key={i}
        >
          <span className="rx-quiz__n">
            Pergunta {i + 1} de {q.length}
          </span>
          <h2 className="rx-titulo">{atual.pergunta}</h2>
          <div className="rx-quiz__opcoes">
            {[RETRO.de, RETRO.para].map((nome) => {
              const certo = escolha && nome === atual.resposta;
              const errado = escolha === nome && nome !== atual.resposta;
              return (
                <button
                  key={nome}
                  type="button"
                  className={`rx-quiz__op${certo ? " certo" : ""}${errado ? " errado" : ""}`}
                  onClick={() => responder(nome)}
                  disabled={!!escolha}
                >
                  {nome}
                  {certo && <Check size={20} />}
                  {errado && <X size={20} />}
                </button>
              );
            })}
          </div>
          <div
            className={`rx-quiz__piada${escolha ? " mostra" : ""}`}
            aria-live="polite"
          >
            {escolha && (
              <>
                <b>
                  {escolha === atual.resposta
                    ? "Acertou!"
                    : `Foi ${atual.resposta === RETRO.de ? "a" : "o"} ${atual.resposta}.`}
                </b>
                {atual.piada}
              </>
            )}
          </div>
          {escolha && (
            <button type="button" className="rx-btn" onClick={proxima}>
              {i + 1 < q.length ? "Próxima pergunta" : "Ver resultado"}
            </button>
          )}
        </div>
      ) : (
        <div className="rx-quiz rx-quiz--fim">
          <h2 className="rx-titulo">
            {acertos} de {q.length}
          </h2>
          <p className="rx-texto">
            {acertos === q.length
              ? "Gabaritou. Conhece esse casal de cor."
              : acertos >= q.length / 2
                ? "Nada mal. Mas ainda tem muito para descobrir em 2027."
                : "Hmm. Vocês precisam de mais cafés de domingo."}
          </p>
          <button
            type="button"
            className="rx-btn rx-btn--claro"
            onClick={() => {
              setI(0);
              setAcertos(0);
              setEscolha(null);
            }}
          >
            Jogar de novo
          </button>
        </div>
      )}
    </>
  );
}

/* ------------------------------- prêmios ------------------------------- */

export function Premios({ on, auto }: { on: boolean; auto: boolean }) {
  const [abertos, setAbertos] = useState<Set<number>>(() => new Set());
  const abrir = (k: number) => setAbertos((s) => new Set(s).add(k));

  useEffect(() => {
    if (!on || !auto) return;
    const ts = RETRO.premios.map((_, k) =>
      window.setTimeout(() => abrir(k), 900 + k * 900),
    );
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [on, auto]);

  return (
    <>
      <p className="rx-kicker rx-a">Prêmios do ano</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        E o troféu vai para…
      </h2>
      <div className="rx-premios">
        {RETRO.premios.map((p, k) => {
          const aberto = abertos.has(k);
          return (
            <button
              key={p.categoria}
              type="button"
              className={`rx-premio rx-a${aberto ? " aberto" : ""}`}
              style={{ "--d": k + 2 } as CSSProperties}
              onClick={() => abrir(k)}
              aria-label={
                aberto
                  ? `${p.categoria}: ${p.vencedor}`
                  : `Abrir o prêmio de ${p.categoria}`
              }
            >
              <Trophy size={26} className="rx-premio__trofeu" />
              <span className="rx-premio__cat">{p.categoria}</span>
              <span className="rx-premio__venc">
                {aberto ? p.vencedor : "Toque para abrir"}
              </span>
              {aberto && <small>{p.motivo}</small>}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------- recados ------------------------------- */

export function Recados() {
  return (
    <>
      <p className="rx-kicker rx-a">Recados de quem ama vocês</p>
      <div className="rx-recados">
        {RETRO.recados.map((r, k) => (
          <figure
            key={r.de}
            className="rx-recado rx-a"
            style={
              {
                "--d": k * 2 + 1,
                "--r": `${[-2, 1.5, -1][k]}deg`,
              } as CSSProperties
            }
          >
            <blockquote>{r.texto}</blockquote>
            <figcaption>
              <span className="rx-recado__ini" aria-hidden="true">
                {r.de[0]}
              </span>
              <span>
                <b>{r.de}</b>
                {r.quem}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

/* --------------------------- vales de raspadinha --------------------------- */

function Raspadinha({
  titulo,
  detalhe,
  auto,
}: {
  titulo: string;
  detalhe: string;
  auto: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [revelado, setRevelado] = useState(false);
  const desenhando = useRef(false);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.max(1, r.width * dpr);
    c.height = Math.max(1, r.height * dpr);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#C9B8A8";
    ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = "#B5A392";
    for (let y = 6; y < r.height; y += 12)
      for (let x = (y / 6) % 2 ? 6 : 0; x < r.width; x += 14)
        ctx.fillRect(x, y, 3, 3);
    ctx.fillStyle = "#4D3F3B";
    ctx.font = "600 15px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("raspe aqui", r.width / 2, r.height / 2 + 5);
  }, []);

  useEffect(() => {
    if (auto && !revelado) {
      const t = window.setTimeout(() => setRevelado(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, [auto, revelado]);

  const raspar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!desenhando.current || revelado) return;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const r = c.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 20, 0, Math.PI * 2);
    ctx.fill();
    /* revela quando passou de ~45% raspado */
    const dados = ctx.getImageData(0, 0, c.width, c.height).data;
    let vazio = 0;
    for (let k = 3; k < dados.length; k += 64) if (dados[k] === 0) vazio++;
    if (vazio / (dados.length / 64) > 0.45) setRevelado(true);
  };

  return (
    <div className={`rx-vale${revelado ? " revelado" : ""}`}>
      <div className="rx-vale__premio">
        <small>Vale</small>
        <b>{titulo}</b>
        <span>{detalhe}</span>
      </div>
      <canvas
        ref={canvas}
        className="rx-vale__capa"
        aria-hidden="true"
        onPointerDown={(e) => {
          desenhando.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          raspar(e);
        }}
        onPointerMove={raspar}
        onPointerUp={() => (desenhando.current = false)}
      />
      {!revelado && (
        <button
          type="button"
          className="rx-vale__btn"
          onClick={() => setRevelado(true)}
        >
          Revelar vale
        </button>
      )}
    </div>
  );
}

export function Vales({ auto }: { auto: boolean }) {
  return (
    <>
      <p className="rx-kicker rx-a">Um presente dentro do presente</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Raspe os seus vales
      </h2>
      <div className="rx-vales rx-a" style={{ "--d": 2 } as CSSProperties}>
        {RETRO.vales.map((v) => (
          <Raspadinha
            key={v.titulo}
            titulo={v.titulo}
            detalhe={v.detalhe}
            auto={auto}
          />
        ))}
      </div>
      <p className="rx-dica rx-a" style={{ "--d": 3 } as CSSProperties}>
        Válidos o ano inteiro. Sem data de validade para o carinho.
      </p>
    </>
  );
}

/* ---------------------------- pergunta final ---------------------------- */

export function Pergunta({ pedido, auto }: { pedido: boolean; auto: boolean }) {
  const p = RETRO.pergunta;
  const [sim, setSim] = useState(false);
  const [fuga, setFuga] = useState({ x: 0, y: 0, n: 0 });

  /* o "Não" foge sempre para baixo, longe dos botões de "sim" */
  const foge = () =>
    setFuga((f) => ({
      x: (Math.random() - 0.5) * 200,
      y: 50 + Math.random() * 90,
      n: f.n + 1,
    }));

  useEffect(() => {
    if (!auto || sim) return;
    const t = window.setTimeout(() => setSim(true), 2600);
    return () => window.clearTimeout(t);
  }, [auto, sim]);

  return (
    <>
      <p className="rx-kicker rx-a">Uma última pergunta</p>
      <h2
        className="rx-titulo rx-pergunta rx-a"
        style={{ "--d": 1 } as CSSProperties}
      >
        {pedido ? p.pedido : p.texto}
      </h2>
      {!sim ? (
        <div
          className="rx-respostas rx-a"
          style={{ "--d": 2 } as CSSProperties}
        >
          <button type="button" className="rx-btn" onClick={() => setSim(true)}>
            Sim
          </button>
          <button type="button" className="rx-btn" onClick={() => setSim(true)}>
            Com certeza
          </button>
          <button
            type="button"
            className="rx-btn rx-btn--fantasma rx-nao"
            style={{ transform: `translate(${fuga.x}px, ${fuga.y}px)` }}
            onPointerEnter={foge}
            onPointerDown={(e) => {
              e.preventDefault();
              foge();
            }}
            onClick={foge}
          >
            {fuga.n > 2 ? "Não (desiste)" : "Não"}
          </button>
        </div>
      ) : (
        <div className="rx-sim" aria-live="polite">
          <p className="rx-mao">{p.resposta}</p>
          <div className="rx-chuva" aria-hidden="true">
            {Array.from({ length: 26 }, (_, k) => (
              <Heart
                key={k}
                size={14 + (k % 4) * 6}
                fill="currentColor"
                strokeWidth={0}
                style={{ "--k": k } as CSSProperties}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------- cartão para compartilhar ------------------------- */

async function gerarCartao(): Promise<Blob | null> {
  await document.fonts?.ready;
  const W = 1080;
  const H = 1920;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#D7263D";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#FFD23F";
  ctx.beginPath();
  ctx.arc(W - 80, 160, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FBF6EF";
  ctx.font = "500 46px Outfit, sans-serif";
  ctx.fillText(`${RETRO.ano} foi o ano de`, 90, 330);
  ctx.font = "700 150px Outfit, sans-serif";
  ctx.fillText(RETRO.de, 90, 500);
  ctx.fillText(`& ${RETRO.para}`, 90, 650);

  /* quebra o texto em linhas que cabem na largura */
  const linhas = (texto: string, largura: number) => {
    const palavras = texto.split(" ");
    const out: string[] = [];
    let atual = "";
    for (const p of palavras) {
      const teste = atual ? `${atual} ${p}` : p;
      if (ctx.measureText(teste).width > largura && atual) {
        out.push(atual);
        atual = p;
      } else atual = teste;
    }
    if (atual) out.push(atual);
    return out;
  };

  const nums = RETRO.numeros.slice(0, 4);
  nums.forEach((n, k) => {
    const x = 90 + (k % 2) * 460;
    const y = 820 + Math.floor(k / 2) * 300;
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(x, y, 420, 260, 36);
    ctx.fill();
    ctx.fillStyle = "#FBF6EF";
    ctx.font = "700 96px Outfit, sans-serif";
    ctx.fillText(n.valor.toLocaleString("pt-BR"), x + 36, y + 125);
    ctx.font = "500 32px Outfit, sans-serif";
    linhas(n.rotulo, 350)
      .slice(0, 2)
      .forEach((l, li) => ctx.fillText(l, x + 36, y + 182 + li * 40));
  });

  ctx.fillStyle = "#FFD23F";
  ctx.font = "600 40px Outfit, sans-serif";
  ctx.fillText("A música do ano", 90, 1490);
  ctx.fillStyle = "#FBF6EF";
  ctx.font = "700 64px Outfit, sans-serif";
  ctx.fillText(RETRO.musica.titulo, 90, 1570);

  ctx.font = "600 40px Outfit, sans-serif";
  ctx.fillText("Retrô a Dois", 90, 1800);
  ctx.font = "400 32px Outfit, sans-serif";
  ctx.fillStyle = "rgba(251,246,239,0.8)";
  ctx.fillText("a retrospectiva do casal", 90, 1845);

  return new Promise((ok) => c.toBlob((b) => ok(b), "image/png"));
}

export function Compartilhar() {
  const [estado, setEstado] = useState<"" | "gerando" | "baixado">("");
  const acao = async () => {
    setEstado("gerando");
    const blob = await gerarCartao();
    if (!blob) return setEstado("");
    const arquivo = new File(
      [blob],
      `retro-${RETRO.de}-e-${RETRO.para}.png`.toLowerCase(),
      { type: "image/png" },
    );
    const nav = navigator as Navigator & {
      canShare?: (d: ShareData) => boolean;
    };
    if (nav.canShare?.({ files: [arquivo] })) {
      try {
        await nav.share({ files: [arquivo], title: "Nossa Retrô" });
        return setEstado("");
      } catch {
        /* a pessoa cancelou: cai no download */
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = arquivo.name;
    a.click();
    URL.revokeObjectURL(url);
    setEstado("baixado");
  };
  return (
    <button
      type="button"
      className="rx-btn rx-btn--amarelo"
      onClick={acao}
      disabled={estado === "gerando"}
    >
      {estado === "baixado" ? <Download size={16} /> : <Share2 size={16} />}
      {estado === "gerando"
        ? "Gerando…"
        : estado === "baixado"
          ? "Imagem salva"
          : "Compartilhar nos stories"}
    </button>
  );
}
