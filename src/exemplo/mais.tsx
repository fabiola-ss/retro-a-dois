/* Mais capítulos: o ano mês a mês, motivos para te amar, primeiras vezes,
   mapa do ano, cardápio do casal, previsão do tempo do amor, jogo da memória,
   contrato do amor e vídeos do casal. */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Check,
  Cloud,
  CloudLightning,
  CloudRain,
  Download,
  Rainbow,
  RotateCcw,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Ilustracao, Polaroid } from "./arte";
import { RETRO } from "./dados";
import { reduz } from "./extras";

/* ----------------------------- mês a mês ----------------------------- */

export function MesAMes() {
  return (
    <>
      <p className="rx-kicker rx-a">O ano de {RETRO.ano}</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Mês a mês
      </h2>
      <ol
        className="rx-linha rx-meses rx-a"
        style={{ "--d": 2 } as CSSProperties}
      >
        {RETRO.mesAMes.map((m, k) => (
          <li key={m.mes} style={{ "--k": k } as CSSProperties}>
            <span className="rx-meses__nome">{m.mes}</span>
            <Polaroid cena={m.cena} rot={k % 2 ? 2 : -2} />
            <span>{m.frase}</span>
          </li>
        ))}
      </ol>
      <p className="rx-dica rx-a" style={{ "--d": 3 } as CSSProperties}>
        Arraste pelos 12 meses →
      </p>
    </>
  );
}

/* -------------------------- motivos (o pote) -------------------------- */

export function Motivos({ on, auto }: { on: boolean; auto: boolean }) {
  const lista = RETRO.motivos;
  const [n, setN] = useState(0);
  const [atual, setAtual] = useState<string | null>(null);
  const tirar = () => {
    if (n >= lista.length) return;
    setAtual(lista[n] ?? null);
    setN((v) => v + 1);
  };

  useEffect(() => {
    if (!on || !auto || n >= Math.min(4, lista.length)) return;
    const t = window.setTimeout(tirar, n === 0 ? 900 : 1700);
    return () => window.clearTimeout(t);
  });

  const fim = n >= lista.length;
  return (
    <>
      <p className="rx-kicker rx-a">{lista.length} motivos para te amar</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Tire um bilhete do pote
      </h2>
      <button
        type="button"
        className="rx-pote rx-a"
        style={{ "--d": 2 } as CSSProperties}
        onClick={tirar}
        disabled={fim}
        aria-label={fim ? "O pote está vazio" : "Tirar um bilhete do pote"}
      >
        <span className="rx-pote__tampa" />
        <span className="rx-pote__vidro">
          {lista.slice(n).map((_, k) => (
            <i key={k} style={{ "--k": k } as CSSProperties} />
          ))}
        </span>
      </button>
      <div className="rx-bilhete-area" aria-live="polite">
        {atual && (
          <p className="rx-bilhete" key={n}>
            {atual}
          </p>
        )}
      </div>
      <p className="rx-dica">
        {fim
          ? "E ainda tem motivo que não cabe num pote."
          : `${n} de ${lista.length} · toque no pote`}
      </p>
    </>
  );
}

/* --------------------------- primeiras vezes --------------------------- */

export function PrimeirasVezes({ on }: { on: boolean }) {
  return (
    <>
      <p className="rx-kicker rx-a">Em {RETRO.ano}, foi a primeira vez que…</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Primeiras vezes
      </h2>
      <ul className={`rx-checks${on ? " marca" : ""}`}>
        {RETRO.primeiras.map((p, k) => (
          <li
            key={p}
            className="rx-a"
            style={{ "--d": k + 2 } as CSSProperties}
          >
            <span className="rx-checks__box" aria-hidden="true">
              <Check size={16} strokeWidth={3} />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

/* ------------------------------ mapa do ano ------------------------------ */

const PONTOS: [number, number][] = [
  [62, 70],
  [118, 52],
  [176, 118],
  [222, 92],
  [240, 168],
  [150, 210],
  [86, 160],
];

function SobeNumero({ valor, on }: { valor: number; on: boolean }) {
  const [v, setV] = useState(reduz() ? valor : 0);
  useEffect(() => {
    if (!on || reduz()) return;
    let raf = 0;
    const t0 = performance.now() + 1600;
    const passo = (agora: number) => {
      const t = Math.max(0, Math.min(1, (agora - t0) / 1500));
      setV(Math.round(valor * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [on, valor]);
  return <>{v.toLocaleString("pt-BR")}</>;
}

export function MapaDoAno({ on }: { on: boolean }) {
  const lugares = RETRO.mapa.lugares.slice(0, PONTOS.length);
  const pts = PONTOS.slice(0, lugares.length);
  return (
    <>
      <p className="rx-kicker rx-a">Por onde vocês andaram</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        O mapa do ano
      </h2>
      <div
        className={`rx-mapa2 rx-a${on ? " traca" : ""}`}
        style={{ "--d": 2 } as CSSProperties}
      >
        <svg viewBox="0 0 300 260" aria-hidden="true">
          <rect width="300" height="260" fill="#9BD1E5" />
          <path
            d="M0 0 H300 V30 Q270 60 280 110 Q290 160 250 200 Q220 230 160 240 Q100 250 60 230 Q20 210 0 220 Z"
            fill="#E9DCC3"
          />
          <circle cx="90" cy="110" r="22" fill="#CFE3B5" />
          <circle cx="200" cy="60" r="16" fill="#CFE3B5" />
          <polyline
            points={pts.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="#D7263D"
            strokeWidth="2.5"
            strokeDasharray="6 5"
            strokeLinecap="round"
            pathLength={100}
            className="rx-mapa2__rota"
          />
        </svg>
        {lugares.map((l, k) => (
          <span
            key={l}
            className="rx-mapa2__pino"
            style={
              {
                left: `${(pts[k]![0] / 300) * 100}%`,
                top: `${(pts[k]![1] / 260) * 100}%`,
                "--k": k,
              } as CSSProperties
            }
          >
            <i />
            <em>{l}</em>
          </span>
        ))}
      </div>
      <p className="rx-km rx-a" style={{ "--d": 3 } as CSSProperties}>
        <b>
          <SobeNumero valor={RETRO.mapa.km} on={on} /> km
        </b>
        percorridos juntos em {lugares.length} lugares
      </p>
    </>
  );
}

/* ---------------------------- cardápio do casal ---------------------------- */

export function Cardapio() {
  const c = RETRO.cardapio;
  const itens: [string, string][] = [
    ["Restaurante favorito", c.restaurante],
    ["Prato da casa", c.prato],
    ["Delivery mais pedido", c.delivery],
    ["Sobremesa", c.sobremesa],
    ["Drink da casa", c.drink],
  ];
  return (
    <>
      <p className="rx-kicker rx-a">Servido em {RETRO.ano}</p>
      <div className="rx-menu rx-a" style={{ "--d": 1 } as CSSProperties}>
        <p className="rx-menu__casa">Cardápio</p>
        <h2 className="rx-menu__nome">
          {RETRO.de} &amp; {RETRO.para}
        </h2>
        <span className="rx-menu__linha" aria-hidden="true" />
        <dl>
          {itens
            .filter(([, v]) => v)
            .map(([k, v], i) => (
              <div
                key={k}
                className="rx-a"
                style={{ "--d": i + 2 } as CSSProperties}
              >
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
        </dl>
        <p className="rx-menu__rodape">
          Aberto todos os dias · reservas só para dois
        </p>
      </div>
    </>
  );
}

/* ------------------------- previsão do tempo do amor ------------------------- */

const ICONE = {
  sol: Sun,
  chuva: CloudRain,
  nublado: Cloud,
  tempestade: CloudLightning,
  arcoiris: Rainbow,
} as const;

export function Previsao() {
  return (
    <>
      <p className="rx-kicker rx-a">Boletim especial</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        A previsão do tempo do amor
      </h2>
      <div className="rx-tempo">
        {RETRO.previsao.map((p, k) => {
          const Icone = ICONE[p.tempo as keyof typeof ICONE] ?? Sun;
          return (
            <div
              key={p.mes + k}
              className={`rx-tempo__card t-${p.tempo} rx-a`}
              style={{ "--d": k + 2 } as CSSProperties}
            >
              <Icone size={34} className="rx-tempo__ic" />
              <div>
                <b>{p.mes}</b>
                <span>{p.texto}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="rx-dica rx-a" style={{ "--d": 6 } as CSSProperties}>
        Mínima de 0 brigas sérias. Máxima de 100% de amor.
      </p>
    </>
  );
}

/* ----------------------------- jogo da memória ----------------------------- */

export function Memoria({ auto }: { auto: boolean }) {
  const fotos = useMemo(() => {
    const todas = [RETRO.fotoFavorita, ...RETRO.mural.map((m) => m.cena)];
    return [...new Set(todas)].slice(0, 6);
  }, []);
  const embaralhar = () =>
    [...fotos, ...fotos]
      .map((f, i) => ({ f, i, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((c, k) => ({ id: k, f: c.f }));
  const [cartas, setCartas] = useState(embaralhar);
  const [abertas, setAbertas] = useState<number[]>([]);
  const [achadas, setAchadas] = useState<Set<string>>(() => new Set());
  const [jogadas, setJogadas] = useState(0);
  const fim = achadas.size === fotos.length && fotos.length > 0;

  const virar = (k: number) => {
    const c = cartas[k];
    if (!c || abertas.length >= 2 || abertas.includes(k) || achadas.has(c.f))
      return;
    const novas = [...abertas, k];
    setAbertas(novas);
    if (novas.length === 2) {
      setJogadas((j) => j + 1);
      const [a, b] = novas.map((i) => cartas[i]!.f);
      window.setTimeout(
        () => {
          if (a === b) setAchadas((s) => new Set(s).add(a!));
          setAbertas([]);
        },
        a === b ? 450 : 900,
      );
    }
  };

  /* no modo "assistir sozinho", o jogo se resolve sozinho */
  useEffect(() => {
    if (!auto || fim || abertas.length) return;
    const falta = fotos.find((f) => !achadas.has(f));
    if (!falta) return;
    const pares = cartas
      .map((c, i) => (c.f === falta ? i : -1))
      .filter((i) => i >= 0);
    const t = window.setTimeout(() => {
      virar(pares[0]!);
      window.setTimeout(() => virar(pares[1]!), 350);
    }, 700);
    return () => window.clearTimeout(t);
  });

  if (fotos.length < 2) return null;
  return (
    <>
      <p className="rx-kicker rx-a">Hora de jogar</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Jogo da memória
      </h2>
      <div className="rx-memo rx-a" style={{ "--d": 2 } as CSSProperties}>
        {cartas.map((c, k) => {
          const aberta = abertas.includes(k) || achadas.has(c.f);
          return (
            <button
              key={c.id}
              type="button"
              className={`rx-memo__carta${aberta ? " aberta" : ""}${achadas.has(c.f) ? " achada" : ""}`}
              onClick={() => virar(k)}
              aria-label={aberta ? "Carta virada" : "Virar carta"}
            >
              <span className="rx-memo__verso" aria-hidden="true">
                <svg viewBox="0 0 40 40">
                  <path
                    d="M20 35 C8 27 3 20 3 13.5 A8.5 8.5 0 0 1 20 9.5 A8.5 8.5 0 0 1 37 13.5 C37 20 32 27 20 35Z"
                    fill="#FBF6EF"
                  />
                </svg>
              </span>
              <span className="rx-memo__frente">
                <Ilustracao cena={c.f} />
              </span>
            </button>
          );
        })}
      </div>
      <p className="rx-dica" aria-live="polite">
        {fim ? (
          <>
            Vocês combinam em tudo. {jogadas} jogadas.{" "}
            <button
              type="button"
              className="rx-link-btn"
              onClick={() => {
                setCartas(embaralhar());
                setAchadas(new Set());
                setJogadas(0);
              }}
            >
              <RotateCcw size={14} /> Jogar de novo
            </button>
          </>
        ) : (
          `Ache os pares · ${achadas.size} de ${fotos.length}`
        )}
      </p>
    </>
  );
}

/* ----------------------------- contrato do amor ----------------------------- */

export function Contrato({ on, auto }: { on: boolean; auto: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [assinado, setAssinado] = useState(false);
  const desenhando = useRef(false);
  const tracos = useRef(0);
  const ano = RETRO.ano + 1;
  const hoje = new Date().toLocaleDateString("pt-BR");

  const preparar = () => {
    const c = canvas.current;
    if (!c) return null;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    if (c.width !== c.clientWidth * 2) {
      c.width = c.clientWidth * 2;
      c.height = c.clientHeight * 2;
      ctx.scale(2, 2);
    }
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1C1416";
    return ctx;
  };

  const ponto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  /* no modo automático, uma assinatura se desenha sozinha */
  useEffect(() => {
    if (!on || !auto || assinado) return;
    const ctx = preparar();
    const c = canvas.current;
    if (!ctx || !c) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    let k = 0;
    const t = window.setInterval(() => {
      const x = 20 + k * ((w - 40) / 60);
      const y = h / 2 + Math.sin(k / 3) * 12 + Math.cos(k / 7) * 6;
      if (k === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      k++;
      if (k > 60) {
        window.clearInterval(t);
        setAssinado(true);
      }
    }, 30);
    return () => window.clearInterval(t);
  }, [on, auto, assinado]);

  const salvar = () => {
    const assinatura = canvas.current;
    const W = 1080;
    const H = 1500;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#FFFDF9";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#D7263D";
    ctx.textAlign = "center";
    ctx.font = "700 64px Outfit, sans-serif";
    ctx.fillText(`Contrato do amor · ${ano}`, W / 2, 140);
    ctx.fillStyle = "#1C1416";
    ctx.font = "500 36px Outfit, sans-serif";
    ctx.fillText(`${RETRO.de} e ${RETRO.para} se comprometem a:`, W / 2, 220);
    ctx.textAlign = "left";
    ctx.font = "400 34px Outfit, sans-serif";
    RETRO.contrato.forEach((cl, i) =>
      ctx.fillText(`${i + 1}. ${cl}`.slice(0, 62), 90, 330 + i * 90),
    );
    if (assinatura) ctx.drawImage(assinatura, 300, 950, 480, 160);
    ctx.textAlign = "center";
    ctx.font = "400 30px Outfit, sans-serif";
    ctx.fillText(`Assinado em ${hoje}`, W / 2, 1180);
    ctx.fillStyle = "#D7263D";
    ctx.font = "600 34px Outfit, sans-serif";
    ctx.fillText("Retrô a Dois", W / 2, 1420);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "contrato-do-amor.png";
    a.click();
  };

  return (
    <>
      <div className="rx-contrato rx-a" style={{ "--d": 1 } as CSSProperties}>
        <p className="rx-contrato__tit">Contrato do amor · {ano}</p>
        <p className="rx-contrato__partes">
          {RETRO.de} e {RETRO.para} se comprometem a:
        </p>
        <ol>
          {RETRO.contrato.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
        <div className={`rx-assina${assinado ? " ok" : ""}`}>
          <canvas
            ref={canvas}
            aria-label="Área para assinar com o dedo"
            onPointerDown={(e) => {
              const ctx = preparar();
              if (!ctx) return;
              desenhando.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              const [x, y] = ponto(e);
              ctx.beginPath();
              ctx.moveTo(x, y);
            }}
            onPointerMove={(e) => {
              if (!desenhando.current) return;
              const ctx = canvas.current?.getContext("2d");
              const [x, y] = ponto(e);
              ctx?.lineTo(x, y);
              ctx?.stroke();
              tracos.current++;
            }}
            onPointerUp={() => {
              desenhando.current = false;
              if (tracos.current > 12) setAssinado(true);
            }}
          />
          {!assinado && (
            <span className="rx-assina__dica">Assine aqui com o dedo</span>
          )}
          <span className="rx-assina__linha">{RETRO.para}</span>
          {assinado && (
            <span className="rx-carimbo bate rx-assina__selo">Assinado</span>
          )}
        </div>
      </div>
      {assinado ? (
        <button
          type="button"
          className="rx-btn rx-btn--amarelo"
          onClick={salvar}
        >
          <Download size={16} /> Salvar o contrato
        </button>
      ) : (
        <button
          type="button"
          className="rx-btn"
          onClick={() => setAssinado(true)}
        >
          Assinar depois
        </button>
      )}
    </>
  );
}

/* ------------------------------- vídeos ------------------------------- */

export function Videos({ on }: { on: boolean }) {
  const [som, setSom] = useState(false);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((v) => {
      if (!v) return;
      if (on) void v.play().catch(() => undefined);
      else v.pause();
    });
  }, [on]);
  return (
    <>
      <p className="rx-kicker rx-a">Em movimento</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Cenas do ano
      </h2>
      <div className="rx-videos rx-a" style={{ "--d": 2 } as CSSProperties}>
        {RETRO.videos.map((v, k) => (
          <figure
            key={v.src}
            className="rx-video"
            style={{ "--r": `${k % 2 ? 2 : -2}deg` } as CSSProperties}
          >
            <video
              ref={(el) => {
                refs.current[k] = el;
              }}
              src={v.src}
              muted={!som}
              loop
              playsInline
              preload="metadata"
            />
            <figcaption>{v.legenda}</figcaption>
          </figure>
        ))}
      </div>
      <button
        type="button"
        className="rx-btn rx-btn--claro"
        onClick={() => setSom(!som)}
      >
        {som ? <VolumeX size={16} /> : <Volume2 size={16} />}{" "}
        {som ? "Tirar o som" : "Ouvir os vídeos"}
      </button>
    </>
  );
}
