/* A Retrô completa de exemplo: uma experiência em capítulos, do envelope
   fechado aos créditos finais. Desliza para cima para avançar. */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowUp,
  ExternalLink,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";

import { CasalG, Ilustracao, Polaroid } from "./arte";
import { RETRO } from "./dados";
import {
  AntesDepois,
  Comeco,
  Compartilhar,
  Pergunta,
  Premios,
  Quiz,
  Recados,
  Top5,
  Vales,
} from "./extras";
import { criarTrilha } from "./trilha";

const reduz = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */

type Plano = "Completa" | "Inesquecível" | null;

/* tempo de cada capítulo no modo "assistir sozinho" (ms) */
const DURACAO: Record<string, number> = {
  "rx-abertura": 6000,
  "rx-comeco": 9000,
  "rx-carta": 16000,
  "rx-frase": 8500,
  "rx-quiz": 15000,
  "rx-premios": 7000,
  "rx-recados": 9000,
  "rx-vales": 6000,
  "rx-pergunta": 6500,
};

export function RetroExemplo() {
  const scroller = useRef<HTMLDivElement>(null);
  const trilha = useRef(criarTrilha());
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const [vistos, setVistos] = useState<Set<number>>(() => new Set([0]));
  const [som, setSom] = useState(false);
  const [auto, setAuto] = useState(false);
  const pedido =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("pedido");

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const k = Number((e.target as HTMLElement).dataset.k);
          setAtivo(k);
          setVistos((v) => (v.has(k) ? v : new Set(v).add(k)));
        }
      },
      { root: el, threshold: 0.55 },
    );
    el.querySelectorAll(".rx-ch").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  useEffect(() => () => trilha.current.desligar(), []);

  const irPara = (k: number) => {
    const el = scroller.current;
    const alvo = el?.querySelector<HTMLElement>(`.rx-ch[data-k="${k}"]`);
    if (el && alvo)
      el.scrollTo({
        top: alvo.offsetTop,
        behavior: reduz() ? "auto" : "smooth",
      });
  };

  const abrir = () => {
    setAberto(true);
    trilha.current.ligar();
    setSom(true);
    window.setTimeout(() => irPara(1), reduz() ? 0 : 1300);
  };

  const alternarSom = () => {
    if (som) trilha.current.desligar();
    else trilha.current.ligar();
    setSom(!som);
  };

  const capitulos: {
    classe: string;
    plano: Plano;
    conteudo: (on: boolean) => ReactNode;
  }[] = [
    {
      classe: "rx-envelope",
      plano: null,
      conteudo: () => <Envelope aberto={aberto} onAbrir={abrir} />,
    },
    {
      classe: "rx-abertura",
      plano: null,
      conteudo: (on) => <Abertura on={on} />,
    },
    { classe: "rx-comeco", plano: "Completa", conteudo: () => <Comeco /> },
    {
      classe: "rx-numeros",
      plano: null,
      conteudo: (on) => <Numeros on={on} />,
    },
    {
      classe: "rx-musica",
      plano: null,
      conteudo: (on) => <Musica on={on} tocando={som} />,
    },
    { classe: "rx-lugar", plano: null, conteudo: (on) => <Lugar on={on} /> },
    {
      classe: "rx-antesdepois",
      plano: "Completa",
      conteudo: (on) => <AntesDepois on={on} />,
    },
    {
      classe: "rx-mes",
      plano: "Completa",
      conteudo: (on) => <MesFeliz on={on} />,
    },
    {
      classe: "rx-caos",
      plano: "Completa",
      conteudo: (on) => <Caos on={on} />,
    },
    { classe: "rx-frase", plano: null, conteudo: (on) => <Frase on={on} /> },
    { classe: "rx-top", plano: "Completa", conteudo: (on) => <Top5 on={on} /> },
    {
      classe: "rx-quiz-ch",
      plano: "Completa",
      conteudo: () => <Quiz auto={auto} />,
    },
    {
      classe: "rx-premios-ch",
      plano: "Completa",
      conteudo: (on) => <Premios on={on} auto={auto} />,
    },
    {
      classe: "rx-mural",
      plano: "Completa",
      conteudo: (on) => <Mural on={on} />,
    },
    {
      classe: "rx-recados-ch",
      plano: "Inesquecível",
      conteudo: () => <Recados />,
    },
    {
      classe: "rx-sonhos",
      plano: "Completa",
      conteudo: (on) => <Sonhos on={on} />,
    },
    { classe: "rx-carta", plano: null, conteudo: (on) => <Carta on={on} /> },
    {
      classe: "rx-vales-ch",
      plano: "Inesquecível",
      conteudo: () => <Vales auto={auto} />,
    },
    {
      classe: "rx-capsula",
      plano: "Inesquecível",
      conteudo: (on) => <Capsula on={on} />,
    },
    {
      classe: "rx-pergunta-ch",
      plano: "Inesquecível",
      conteudo: () => <Pergunta pedido={pedido} auto={auto} />,
    },
    {
      classe: "rx-creditos",
      plano: null,
      conteudo: (on) => <Creditos on={on} onDeNovo={() => irPara(1)} />,
    },
  ];
  const total = capitulos.length - 1;

  /* modo "assistir sozinho": avança no ritmo de cada capítulo */
  useEffect(() => {
    if (!auto || !aberto) return;
    if (ativo >= total) {
      setAuto(false);
      return;
    }
    const classe = capitulos[ativo]?.classe ?? "";
    const t = window.setTimeout(
      () => irPara(ativo + 1),
      DURACAO[classe] ?? 5500,
    );
    return () => window.clearTimeout(t);
  });

  /* qualquer toque ou rolagem da pessoa desliga o modo automático */
  useEffect(() => {
    if (!auto) return;
    const el = scroller.current;
    const parar = () => setAuto(false);
    el?.addEventListener("wheel", parar, { passive: true });
    el?.addEventListener("touchstart", parar, { passive: true });
    return () => {
      el?.removeEventListener("wheel", parar);
      el?.removeEventListener("touchstart", parar);
    };
  }, [auto]);

  return (
    <div className={`rx${aberto ? " is-aberto" : ""}`}>
      {aberto && (
        <>
          <div className="rx-progresso" aria-hidden="true">
            {Array.from({ length: total }, (_, k) => (
              <i key={k} className={k + 1 <= ativo ? "cheio" : ""} />
            ))}
          </div>
          <div className="rx-controles">
            <button
              type="button"
              className={`rx-som${auto ? " ligado" : ""}`}
              onClick={() => setAuto(!auto)}
              aria-label={
                auto
                  ? "Pausar o modo assistir sozinho"
                  : "Assistir sozinho, como um filme"
              }
              aria-pressed={auto}
            >
              {auto ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              type="button"
              className="rx-som"
              onClick={alternarSom}
              aria-label={
                som ? "Desligar a trilha sonora" : "Ligar a trilha sonora"
              }
            >
              {som ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
          {ativo === 1 && !auto && (
            <button
              type="button"
              className="rx-autodica"
              onClick={() => setAuto(true)}
            >
              <Play size={14} /> Assistir sozinho, como um filme
            </button>
          )}
        </>
      )}

      <div className="rx-scroller" ref={scroller}>
        {capitulos.map((c, k) => (
          <section
            key={k}
            data-k={k}
            className={`rx-ch ${c.classe}${vistos.has(k) ? " on" : ""}`}
            aria-label={`Capítulo ${k} de ${total}`}
          >
            <div className="rx-in">{c.conteudo(vistos.has(k))}</div>
            {c.plano && (
              <span
                className={`rx-plano${c.plano === "Inesquecível" ? " top" : ""}`}
              >
                Plano {c.plano}
              </span>
            )}
            {aberto && k > 0 && k < total && (
              <button
                type="button"
                className="rx-proximo"
                onClick={() => irPara(k + 1)}
                aria-label="Próximo capítulo"
              >
                <ArrowUp size={18} />
              </button>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ capítulos ------------------------------ */

function Envelope({
  aberto,
  onAbrir,
}: {
  aberto: boolean;
  onAbrir: () => void;
}) {
  return (
    <>
      <p className="rx-kicker">Uma Retrô a Dois</p>
      <button
        type="button"
        className={`rx-env${aberto ? " aberto" : ""}`}
        onClick={onAbrir}
        disabled={aberto}
        aria-label={`Abrir o presente de ${RETRO.de} para ${RETRO.para}`}
      >
        <span className="rx-env__carta">
          <span className="rx-env__ano">{RETRO.ano}</span>
          <span>o nosso ano</span>
        </span>
        <span className="rx-env__corpo" />
        <span className="rx-env__aba" />
        <span className="rx-env__selo">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path
              d="M20 35 C8 27 3 20 3 13.5 A8.5 8.5 0 0 1 20 9.5 A8.5 8.5 0 0 1 37 13.5 C37 20 32 27 20 35Z"
              fill="#D7263D"
            />
            <path
              d="M19.5 14 L12 19.5 L19.5 25Z M28 14 L20.5 19.5 L28 25Z"
              fill="#FFD23F"
            />
          </svg>
        </span>
      </button>
      <p className="rx-mao">
        Para {RETRO.para}, de {RETRO.de}
      </p>
      <p className="rx-dica">
        {aberto
          ? "Abrindo…"
          : "Toque no envelope para abrir · use o som ligado"}
      </p>
    </>
  );
}

function Abertura({ on }: { on: boolean }) {
  return (
    <>
      <p className="rx-kicker rx-a" style={{ "--d": 0 } as CSSProperties}>
        {RETRO.ano} foi o ano de
      </p>
      <h1 className="rx-nomes rx-a" style={{ "--d": 1 } as CSSProperties}>
        {RETRO.de} <em>&amp;</em> {RETRO.para}
      </h1>
      <div className="rx-abertura__foto">
        <Polaroid
          cena="casal"
          legenda="nós dois"
          rot={-4}
          className={on ? "cai" : ""}
        />
      </div>
      <div className="rx-coracoes" aria-hidden="true">
        {Array.from({ length: 10 }, (_, k) => (
          <i key={k} style={{ "--k": k } as CSSProperties} />
        ))}
      </div>
    </>
  );
}

function Contador({
  valor,
  on,
  atraso,
}: {
  valor: number;
  on: boolean;
  atraso: number;
}) {
  const [n, setN] = useState(reduz() ? valor : 0);
  useEffect(() => {
    if (!on || reduz()) return;
    let raf = 0;
    const t0 = performance.now() + atraso;
    const passo = (agora: number) => {
      const t = Math.max(0, Math.min(1, (agora - t0) / 1400));
      setN(Math.round(valor * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [on, valor, atraso]);
  return <>{n.toLocaleString("pt-BR")}</>;
}

function Numeros({ on }: { on: boolean }) {
  return (
    <>
      <p className="rx-kicker rx-a">Desde {RETRO.juntosDesde}</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Esse foi <span className="rx-mark">{RETRO.anoJuntos}</span>
      </h2>
      <ul className="rx-nums">
        {RETRO.numeros.map((n, k) => (
          <li
            key={n.rotulo}
            className="rx-a"
            style={{ "--d": k + 2 } as CSSProperties}
          >
            <b>
              <Contador valor={n.valor} on={on} atraso={400 + k * 250} />
            </b>
            <span>{n.rotulo}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Musica({ on, tocando }: { on: boolean; tocando: boolean }) {
  const m = RETRO.musica;
  return (
    <>
      <p className="rx-kicker rx-a">A música do ano de vocês foi</p>
      <div
        className={`rx-vinil${on && tocando ? " gira" : ""}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="98" fill="#0E0A09" />
          {[88, 78, 68, 58, 50].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke="#2A201C"
              strokeWidth="1.5"
            />
          ))}
          <path
            d="M40 60 A70 70 0 0 1 80 32"
            stroke="#3A2E29"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <clipPath id="rx-rotulo">
              <circle cx="100" cy="100" r="34" />
            </clipPath>
          </defs>
          <circle cx="100" cy="100" r="34" fill="#D7263D" />
          <g clipPath="url(#rx-rotulo)">
            <CasalG x={68} y={70} s={0.64} />
          </g>
          <circle cx="100" cy="100" r="3" fill="#FBF6EF" />
        </svg>
        <span className="rx-braco" />
      </div>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        {m.titulo}
      </h2>
      <p className="rx-artista rx-a" style={{ "--d": 2 } as CSSProperties}>
        {m.artista}
      </p>
      <p className="rx-texto rx-a" style={{ "--d": 3 } as CSSProperties}>
        {m.detalhe}
      </p>
      <div
        className="rx-eq rx-a"
        style={{ "--d": 3 } as CSSProperties}
        aria-hidden="true"
      >
        {Array.from({ length: 14 }, (_, k) => (
          <i key={k} style={{ "--k": k } as CSSProperties} />
        ))}
      </div>
      <a
        className="rx-btn rx-a"
        style={{ "--d": 4 } as CSSProperties}
        href={m.spotify}
        target="_blank"
        rel="noreferrer"
      >
        Ouvir no Spotify <ExternalLink size={16} />
      </a>
    </>
  );
}

function Lugar({ on }: { on: boolean }) {
  const l = RETRO.lugar;
  return (
    <>
      <p className="rx-kicker rx-a">O lugar mais marcante</p>
      <div className="rx-mapa" aria-hidden="true">
        <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice">
          <rect width="300" height="180" fill="#9BD1E5" />
          <path
            d="M0 0 H300 V40 Q270 52 262 70 Q250 92 232 98 Q214 104 206 124 Q196 150 172 160 Q150 170 140 180 H0 Z"
            fill="#E9DCC3"
          />
          <path
            d="M20 30 Q90 60 150 50 T250 80"
            stroke="#FBF6EF"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6 5"
          />
          <path
            d="M40 120 Q100 100 190 118"
            stroke="#FBF6EF"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6 5"
          />
          <circle cx="60" cy="70" r="14" fill="#CFE3B5" />
          <circle cx="120" cy="140" r="18" fill="#CFE3B5" />
          <path
            d="M230 120 q10 -6 20 0 M244 140 q10 -6 20 0 M210 150 q10 -6 20 0"
            stroke="#FBF6EF"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <span className={`rx-pino${on ? " cai" : ""}`}>
          <svg viewBox="0 0 30 40">
            <path
              d="M15 39 C6 26 2 20 2 14 A13 13 0 0 1 28 14 C28 20 24 26 15 39Z"
              fill="#D7263D"
            />
            <circle cx="15" cy="14" r="5" fill="#FBF6EF" />
          </svg>
        </span>
        <span className="rx-mapa__nome">
          <b>{l.nome}</b>
          {l.regiao} · {l.quando}
        </span>
      </div>
      <div className="rx-leque">
        {l.fotos.map((f, k) => (
          <Polaroid
            key={k}
            cena={f.cena}
            legenda={f.legenda}
            rot={[-9, 2, 10][k]}
            className="rx-a"
            style={{ "--d": k + 3 } as CSSProperties}
          />
        ))}
      </div>
      <p className="rx-texto rx-a" style={{ "--d": 6 } as CSSProperties}>
        {l.frase}
      </p>
    </>
  );
}

const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function MesFeliz({ on }: { on: boolean }) {
  const m = RETRO.mesFeliz;
  return (
    <>
      <p className="rx-kicker rx-a">O mês mais feliz do ano</p>
      <div className={`rx-cal${on ? " liga" : ""}`} aria-hidden="true">
        {MESES.map((nome, k) => (
          <span
            key={nome}
            className={k === m.mes ? "eleito" : ""}
            style={{ "--k": k } as CSSProperties}
          >
            {nome}
          </span>
        ))}
      </div>
      <h2
        className="rx-titulo rx-grande rx-a"
        style={{ "--d": 4 } as CSSProperties}
      >
        {m.nome}
      </h2>
      <p className="rx-texto rx-a" style={{ "--d": 5 } as CSSProperties}>
        {m.frase}
      </p>
      <div className="rx-fila">
        {m.fotos.map((f, k) => (
          <Polaroid
            key={k}
            cena={f.cena}
            legenda={f.legenda}
            rot={[-5, 3, -2][k]}
            className="rx-a"
            style={{ "--d": k + 6 } as CSSProperties}
          />
        ))}
      </div>
    </>
  );
}

function Caos({ on }: { on: boolean }) {
  const c = RETRO.caos;
  return (
    <>
      <p className="rx-kicker rx-a">O momento mais caótico do ano</p>
      <h2
        className="rx-titulo rx-a rx-treme"
        style={{ "--d": 1 } as CSSProperties}
      >
        {c.titulo}
      </h2>
      <div className="rx-caos__foto">
        <Polaroid
          cena={c.foto.cena}
          legenda={c.foto.legenda}
          rot={6}
          className={on ? "treme" : ""}
        />
        <span className={`rx-carimbo${on ? " bate" : ""}`}>{c.carimbo}</span>
      </div>
      <ul className="rx-caos__lista">
        {c.itens.map((i, k) => (
          <li
            key={i}
            className="rx-a"
            style={
              {
                "--d": k + 2,
                "--r": `${[-2, 1.5, -1, 2][k]}deg`,
              } as CSSProperties
            }
          >
            {i}
          </li>
        ))}
      </ul>
    </>
  );
}

function Frase({ on }: { on: boolean }) {
  const f = RETRO.frase;
  const [n, setN] = useState(reduz() ? f.conversa.length : 0);
  useEffect(() => {
    if (!on || reduz() || n >= f.conversa.length) return;
    const t = window.setTimeout(() => setN((v) => v + 1), n === 0 ? 700 : 1100);
    return () => window.clearTimeout(t);
  }, [on, n, f.conversa.length]);
  const fim = n >= f.conversa.length;
  return (
    <>
      <p className="rx-kicker rx-a">A frase que mais se repetiu</p>
      <div className="rx-chat" aria-label="Conversa">
        {f.conversa.slice(0, n).map((m, k) => (
          <div
            key={k}
            className={`rx-bolha ${m.de === f.quem ? "ela" : "ele"}`}
          >
            {m.texto}
            <small>{m.hora}</small>
          </div>
        ))}
        {!fim && on && (
          <div className="rx-bolha ela digitando" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        )}
      </div>
      <h2 className={`rx-titulo rx-citacao${fim ? " mostra" : ""}`}>
        “{f.texto}”
      </h2>
      <p className={`rx-texto rx-depois${fim ? " mostra" : ""}`}>
        Dita pela {f.quem} {f.vezes}. {f.verdade}
      </p>
    </>
  );
}

function Mural({ on }: { on: boolean }) {
  const [frente, setFrente] = useState<number | null>(null);
  const pos = [
    [6, 4, -8],
    [52, 0, 6],
    [28, 26, -3],
    [0, 50, 5],
    [54, 46, -6],
    [26, 66, 3],
  ];
  return (
    <>
      <p className="rx-kicker rx-a">O ano em fotos</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Tudo que estava no rolo da câmera
      </h2>
      <div className={`rx-mesa${on ? " espalha" : ""}`}>
        {RETRO.mural.map((f, k) => {
          const [x, y, r] = pos[k]!;
          return (
            <button
              key={k}
              type="button"
              className={`rx-mesa__item${frente === k ? " frente" : ""}`}
              style={
                { "--x": `${x}%`, "--y": `${y}%`, "--k": k } as CSSProperties
              }
              onClick={() => setFrente(frente === k ? null : k)}
              aria-label={`Ver foto: ${f.legenda}`}
            >
              <Polaroid cena={f.cena} legenda={f.legenda} rot={r} />
            </button>
          );
        })}
      </div>
      <p className="rx-dica rx-a" style={{ "--d": 3 } as CSSProperties}>
        Toque numa foto para ver de perto
      </p>
    </>
  );
}

function Sonhos({ on }: { on: boolean }) {
  const estrelas = Array.from({ length: 46 }, (_, k) => ({
    x: (k * 37) % 100,
    y: (k * 53) % 100,
    s: 1 + (k % 3),
  }));
  const pontos = [
    [24, 30],
    [70, 46],
    [34, 70],
  ];
  return (
    <>
      <div className="rx-ceu" aria-hidden="true">
        {estrelas.map((e, k) => (
          <i
            key={k}
            style={
              {
                left: `${e.x}%`,
                top: `${e.y}%`,
                width: e.s,
                height: e.s,
                "--k": k,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <p className="rx-kicker rx-a">E o que vem em {RETRO.ano + 1}?</p>
      <div className={`rx-constelacao${on ? " acende" : ""}`}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points={pontos.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="#FFD23F"
            strokeWidth="0.4"
            strokeDasharray="2 1.5"
            pathLength={100}
          />
        </svg>
        {RETRO.sonhos.map((s, k) => (
          <span
            key={s}
            className="rx-sonho"
            style={
              {
                left: `${pontos[k]![0]}%`,
                top: `${pontos[k]![1]}%`,
                "--k": k,
              } as CSSProperties
            }
          >
            <i />
            <em>{s}</em>
          </span>
        ))}
      </div>
      <p className="rx-texto rx-a" style={{ "--d": 6 } as CSSProperties}>
        Três desejos para o próximo capítulo de vocês.
      </p>
    </>
  );
}

function Carta({ on }: { on: boolean }) {
  const texto = RETRO.carta.join("\n");
  const [n, setN] = useState(reduz() ? texto.length : 0);
  useEffect(() => {
    if (!on || reduz() || n >= texto.length) return;
    const t = window.setTimeout(() => setN((v) => v + 1), n === 0 ? 600 : 34);
    return () => window.clearTimeout(t);
  }, [on, n, texto.length]);
  return (
    <>
      <p className="rx-kicker rx-a">Uma carta para você</p>
      <div className="rx-papel rx-a" style={{ "--d": 1 } as CSSProperties}>
        <p className="rx-escrita" aria-label={texto}>
          <span aria-hidden="true">{texto.slice(0, n)}</span>
          {n < texto.length && <i className="rx-pena" aria-hidden="true" />}
        </p>
        <p className={`rx-assinatura${n >= texto.length ? " mostra" : ""}`}>
          {RETRO.de}
        </p>
      </div>
    </>
  );
}

function Capsula({ on }: { on: boolean }) {
  const [agora, setAgora] = useState(() => Date.now());
  const [tentou, setTentou] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [on]);
  const ms = Math.max(0, RETRO.capsula.abre.getTime() - agora);
  const nums = [
    [Math.floor(ms / 86400000), "dias"],
    [Math.floor(ms / 3600000) % 24, "horas"],
    [Math.floor(ms / 60000) % 60, "min"],
    [Math.floor(ms / 1000) % 60, "seg"],
  ] as const;
  return (
    <>
      <p className="rx-kicker rx-a">Cápsula do tempo</p>
      <button
        type="button"
        className={`rx-cadeado${tentou ? " treme" : ""}`}
        key={tentou}
        onClick={() => setTentou((v) => v + 1)}
        aria-label="Tentar abrir a cápsula"
      >
        <Lock size={44} strokeWidth={2.2} />
      </button>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Uma mensagem trancada até o Natal de {RETRO.ano + 1}
      </h2>
      <div
        className="rx-contagem rx-a"
        style={{ "--d": 2 } as CSSProperties}
        role="timer"
      >
        {nums.map(([v, l]) => (
          <span key={l}>
            <b key={v}>{l === "dias" ? v : String(v).padStart(2, "0")}</b>
            {l}
          </span>
        ))}
      </div>
      <p className="rx-texto rx-a" style={{ "--d": 3 } as CSSProperties}>
        {tentou
          ? `Ainda não! Volta aqui em ${RETRO.capsula.abreTexto}.`
          : `Abre em ${RETRO.capsula.abreTexto}, à meia-noite.`}
      </p>
    </>
  );
}

function Creditos({ on, onDeNovo }: { on: boolean; onDeNovo: () => void }) {
  return (
    <>
      <div className={`rx-rolo${on ? " rola" : ""}`}>
        <div className="rx-rolo__in">
          <p className="rx-fim">Fim de {RETRO.ano}.</p>
          {RETRO.creditos.map(([papel, nome]) => (
            <p key={papel} className="rx-credito">
              <small>{papel}</small>
              {nome}
            </p>
          ))}
          <p className="rx-continua">Continua em {RETRO.ano + 1}…</p>
        </div>
      </div>
      <div className="rx-fim-botoes">
        <Compartilhar />
        <button type="button" className="rx-btn" onClick={onDeNovo}>
          <RotateCcw size={16} /> Assistir de novo
        </button>
      </div>
      <a className="rx-assinatura-marca" href="../">
        <span>
          <Ilustracao cena="casal" />
        </span>
        Feito com Retrô a Dois · Monte a de vocês
      </a>
    </>
  );
}
