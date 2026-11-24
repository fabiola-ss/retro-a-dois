import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Calendar,
  Camera,
  Check,
  Clock,
  Heart,
  HelpCircle,
  Infinity as InfinityIcon,
  Lock,
  MapPin,
  MessageCircle,
  Minus,
  Music,
  Plus,
  QrCode,
  Send,
  ShieldCheck,
  Star,
  Mail,
} from "lucide-react";

/* Links de checkout: troque pelos links reais de cada plano. */
const CHECKOUT = {
  basica: "#planos",
  completa: "#planos",
  inesquecivel: "#planos",
};

/* ------------------------------------------------------------------ */

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fica true (uma vez) quando o elemento entra na tela. */
function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Texto que se digita sozinho quando aparece na tela. */
function TypeLine({ text }: { text: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.6);
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (!prefersReduced()) setN(0);
  }, []);
  useEffect(() => {
    if (!inView || n >= text.length) return;
    const t = window.setTimeout(() => setN((v) => v + 1), n === 0 ? 500 : 42);
    return () => window.clearTimeout(t);
  }, [inView, n, text.length]);
  return <span ref={ref}>{text.slice(0, n)}</span>;
}

/** Preço que sobe de 0 até o valor quando aparece na tela. */
function CountPrice({ value }: { value: string }) {
  const target = Math.round(parseFloat(value.replace(",", ".")) * 100);
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const [cents, setCents] = useState(target);
  useEffect(() => {
    if (!prefersReduced()) setCents(0);
  }, []);
  useEffect(() => {
    if (!inView || prefersReduced()) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setCents(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return <span ref={ref}>{(cents / 100).toFixed(2).replace(".", ",")}</span>;
}

/** Barra fixa no rodapé do celular, que aparece depois do topo da página. */
function MobileBar() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const targets = ["topo", "planos", "fim"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set(e.target, e.isIntersecting);
      setOn(![...visible.values()].some(Boolean));
    });
    targets.forEach((t) => {
      visible.set(t, false);
      io.observe(t);
    });
    return () => io.disconnect();
  }, []);
  return (
    <div className={`ra-mbar${on ? " on" : ""}`} aria-hidden={!on}>
      <div className="ra-mbar__txt">
        <b>A partir de R$ 19,90</b>
        <span>Pronta em até 24h</span>
      </div>
      <a href="#planos" className="ra-btn" tabIndex={on ? 0 : -1}>
        Quero a minha
      </a>
    </div>
  );
}

const STRIP = "Pedidos para o Natal até 22/12 • Pronta em até 24h";
const STRIP_LONG =
  "Pedidos para o Natal até 22/12 • Pronta em até 24h • A partir de R$ 19,90 • Ajuste grátis + 7 dias de garantia • ";

export function RetroADois() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("ra-anim");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    el.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  /* barrinha de progresso de leitura, abaixo do menu */
  useEffect(() => {
    const bar = root.current?.querySelector<HTMLElement>(".ra-progress i");
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ra" ref={root}>
      <div className="ra-strip">
        <span className="ra-strip__static" aria-hidden="true">
          {STRIP}
        </span>
        <span className="ra-strip__marquee" aria-hidden="true">
          <span>{STRIP_LONG}</span>
          <span>{STRIP_LONG}</span>
        </span>
        <span className="sr-only ra-strip__sr">{STRIP}</span>
      </div>
      <Nav />
      <main>
        <Hero />
        <Identificacao />
        <Previa />
        <ComoFunciona />
        <div className="ra-dark">
          <Shape style={{ top: 40, left: -60 }} />
          <Shape style={{ top: 40, right: -60 }} />
          <Planos />
          <Capsula />
        </div>
        <GarantiaPrazo />
        <Faq />
      </main>
      <div className="ra-dark">
        <Shape style={{ top: 60, left: -70 }} />
        <Shape style={{ top: 60, right: -70 }} />
        <CtaFinal />
      </div>
      <MobileBar />
    </div>
  );
}

/* ---------------------------- navegação ---------------------------- */

function LogoMark() {
  return (
    <svg className="ra-logo__mark" viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="12" cy="17" r="10" fill="#D7263D" />
      <circle
        cx="22"
        cy="17"
        r="10"
        fill="#FFD23F"
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}

function Nav() {
  return (
    <header className="ra-nav">
      <div className="ra-wrap ra-nav__in">
        <a href="#topo" className="ra-logo" aria-label="Retrô a Dois, início">
          <LogoMark />
          Retrô a Dois
        </a>
        <nav aria-label="Seções">
          <ul className="ra-nav__links">
            <li>
              <a href="#como-funciona">Como funciona</a>
            </li>
            <li>
              <a href="#previa">Veja um exemplo</a>
            </li>
            <li>
              <a href="#planos">Planos</a>
            </li>
            <li>
              <a href="#duvidas">Dúvidas</a>
            </li>
          </ul>
        </nav>
        <a href="#planos" className="ra-btn">
          Quero a minha
        </a>
      </div>
      <div className="ra-progress" aria-hidden="true">
        <i />
      </div>
    </header>
  );
}

/* ------------------------------ hero ------------------------------ */

const TILES: {
  x: string;
  y: number;
  bg: string;
  fg: string;
  icon: ReactNode;
  label?: string;
}[] = [
  {
    x: "9%",
    y: 90,
    bg: "#D7263D",
    fg: "#fff",
    icon: <Music size={30} strokeWidth={2.4} />,
    label: "Música",
  },
  {
    x: "23%",
    y: 10,
    bg: "#FFD23F",
    fg: "#1C1416",
    icon: <Camera size={30} strokeWidth={2.4} />,
    label: "Fotos",
  },
  {
    x: "39%",
    y: 150,
    bg: "#F7A1B5",
    fg: "#1C1416",
    icon: <MapPin size={30} strokeWidth={2.4} />,
    label: "Lugares",
  },
  {
    x: "61%",
    y: 150,
    bg: "#D7263D",
    fg: "#fff",
    icon: <Heart size={30} strokeWidth={2.4} />,
    label: "Carta",
  },
  {
    x: "77%",
    y: 10,
    bg: "#1C1416",
    fg: "#FFD23F",
    icon: <MessageCircle size={30} strokeWidth={2.4} />,
  },
  {
    x: "91%",
    y: 90,
    bg: "#FFD23F",
    fg: "#1C1416",
    icon: <Calendar size={30} strokeWidth={2.4} />,
  },
];

function IsoTile({
  bg,
  fg,
  icon,
}: {
  bg: string;
  fg: string;
  icon: ReactNode;
}) {
  return (
    <div className="ra-tile__float">
      <svg
        viewBox="0 0 200 150"
        width="100%"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        <polygon points="100,20 190,66 100,112 10,66" fill="#FFFDF9" />
        <polygon points="10,66 100,112 100,132 10,86" fill="#E9DCCB" />
        <polygon points="100,112 190,66 190,86 100,132" fill="#F3EADD" />
        <ellipse cx="100" cy="74" rx="40" ry="20" fill="#F3EADD" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "6%",
          transform: "translateX(-50%)",
          width: "42%",
          aspectRatio: "1",
          borderRadius: "30%",
          background: bg,
          color: fg,
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

const HERO_WORDS =
  "Transforme o ano de vocês numa retrospectiva que dá vontade de assistir".split(
    " ",
  );

function Hero() {
  return (
    <section className="ra-hero" id="topo" data-reveal>
      <div className="ra-wrap">
        <h1 className="ra-h1 ra-words">
          {HERO_WORDS.map((w, k) => (
            <Fragment key={k}>
              <span className="ra-word" style={{ "--w": k } as CSSProperties}>
                {w}
              </span>{" "}
            </Fragment>
          ))}
          <span
            className="ra-word"
            style={{ "--w": HERO_WORDS.length } as CSSProperties}
          >
            <span className="ra-mark">mil vezes.</span>
          </span>
        </h1>
        <p className="ra-lead ra-rise" style={{ "--i": 1 } as CSSProperties}>
          A Retrô a Dois é uma retrospectiva interativa do casal, com as fotos,
          as músicas e os momentos que só vocês dois entendem. Você conta a
          história, a gente monta, e seu amor recebe um link + QR code pra abrir
          no celular.
        </p>
        <div
          className="ra-hero__cta ra-rise"
          style={{ "--i": 2 } as CSSProperties}
        >
          <a href="#planos" className="ra-btn">
            QUERO A RETRÔ DE NÓS DOIS <ArrowRight size={20} strokeWidth={2.6} />
          </a>
          <p className="ra-note">
            A partir de R$ 19,90 · Pronta em até 24h · Sem precisar baixar nada
          </p>
        </div>
      </div>
      <div className="ra-tiles" aria-hidden="true">
        {TILES.map((t, i) => (
          <div
            key={i}
            className="ra-tile"
            style={{ left: t.x, top: t.y, "--i": i } as CSSProperties}
          >
            <div className="ra-tile__pop">
              <IsoTile bg={t.bg} fg={t.fg} icon={t.icon} />
              {t.label && <span className="ra-tile__label">{t.label}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- identificação -------------------------- */

type OrbitItem = {
  a: number;
  r: number;
  bg: string;
  fg: string;
  icon: ReactNode;
  label: string;
};

function Orbit({
  children,
  items,
}: {
  children: ReactNode;
  items: OrbitItem[];
}) {
  return (
    <>
      <div className="ra-orbit__ring" />
      <div className="ra-orbit__ring" />
      <div className="ra-orbit__ring" />
      {children}
      <div className="ra-orbit__spin" aria-hidden="true">
        {items.map((o, i) => {
          const rad = (o.a * Math.PI) / 180;
          return (
            <div
              key={i}
              className="ra-orbit__item"
              style={{
                left: `${50 + o.r * Math.cos(rad)}%`,
                top: `${50 + o.r * Math.sin(rad)}%`,
              }}
            >
              <div>
                <span
                  className="ra-orbit__dot"
                  style={{ background: o.bg, color: o.fg }}
                >
                  {o.icon}
                </span>
                {o.label && <span className="ra-orbit__label">{o.label}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const PERGUNTAS = [
  "Você já deu presente que foi esquecido no fundo do armário?",
  "Já ficou sem ideia e apelou pro vale-presente?",
  "Já sentiu que o presente não mostrou nem metade do que você sente?",
];

const DECK_MS = 3500;

/** No celular, as perguntas viram um baralho: uma por vez, a próxima surge por cima. */
function QuestionDeck() {
  const [ref, inView] = useInView<HTMLDivElement>(0.5);
  const [deck, setDeck] = useState(false);
  const [q, setQ] = useState(0);

  useEffect(() => {
    if (prefersReduced()) return;
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setDeck(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!deck || !inView) return;
    const t = window.setTimeout(
      () => setQ((n) => (n + 1) % PERGUNTAS.length),
      DECK_MS,
    );
    return () => window.clearTimeout(t);
  }, [deck, inView, q]);

  const n = PERGUNTAS.length;
  return (
    <div
      ref={ref}
      className={`ra-qwrap ra-rise${deck ? " is-deck" : ""}`}
      style={{ "--i": 2 } as CSSProperties}
    >
      <ul className="ra-questions">
        {PERGUNTAS.map((text, k) => {
          const pos = (k - q + n) % n;
          return (
            <li
              key={text}
              data-pos={deck ? pos : undefined}
              aria-hidden={deck && pos !== 0 ? true : undefined}
              onClick={deck ? () => setQ((v) => (v + 1) % n) : undefined}
            >
              <HelpCircle size={22} strokeWidth={2.4} />
              {text}
            </li>
          );
        })}
      </ul>
      {deck && (
        <div className="ra-qdots">
          {PERGUNTAS.map((text, k) => (
            <button
              key={text}
              type="button"
              aria-label={`Pergunta ${k + 1} de ${n}`}
              aria-current={q === k}
              onClick={() => setQ(k)}
            >
              {q === k && (
                <i
                  key={q}
                  style={{ "--dur": `${DECK_MS}ms` } as CSSProperties}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Identificacao() {
  return (
    <section className="ra-sec" aria-labelledby="ident-t">
      <div className="ra-wrap">
        <div className="ra-ident">
          <div data-reveal>
            <h2 id="ident-t" className="ra-h2 ra-rise">
              Todo fim de ano é a <span className="ra-mark">mesma coisa,</span>{" "}
              né?
            </h2>
            <p
              className="ra-lead ra-rise"
              style={{ "--i": 1 } as CSSProperties}
            >
              Você quer dar um presente que tenha significado. Mas aí entra no
              shopping e só encontra perfume, relógio, camiseta… coisa que
              qualquer pessoa poderia dar.
            </p>
          </div>
          <QuestionDeck />
        </div>

        <div className="ra-truth" data-reveal>
          <p className="ra-truth__big ra-rise">
            O problema não é o valor do presente. É que ele não conta a{" "}
            <span className="ra-mark">história de vocês.</span>
          </p>
          <p className="ra-lead ra-rise" style={{ "--i": 1 } as CSSProperties}>
            E em 2026 vocês viveram muita coisa: aquela viagem, aquela briga
            boba, a música que tocou mil vezes no carro. Tudo isso está
            espalhado no rolo da câmera, esperando alguém juntar.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- ilustrações ---------------------------- */

type SceneKind = "praia" | "cidade" | "natal" | "estrada" | "casal";

function Scene({ kind }: { kind: SceneKind }) {
  const common = {
    viewBox: "0 0 100 100",
    width: "100%",
    height: "100%",
    preserveAspectRatio: "xMidYMid slice",
  };
  if (kind === "praia")
    return (
      <svg {...common} aria-hidden="true">
        <rect width="100" height="100" fill="#F7A1B5" />
        <circle cx="50" cy="58" r="22" fill="#FFD23F" />
        <rect y="58" width="100" height="42" fill="#D7263D" />
        <rect y="66" width="100" height="4" fill="#B81E32" />
        <rect y="76" width="100" height="4" fill="#B81E32" />
        <path d="M0 88 Q50 80 100 88 V100 H0Z" fill="#F3EADD" />
      </svg>
    );
  if (kind === "cidade")
    return (
      <svg {...common} aria-hidden="true">
        <rect width="100" height="100" fill="#17110F" />
        <circle cx="76" cy="22" r="9" fill="#FBF6EF" />
        <rect x="6" y="48" width="18" height="52" fill="#31251F" />
        <rect x="28" y="34" width="20" height="66" fill="#4D3F3B" />
        <rect x="52" y="54" width="16" height="46" fill="#31251F" />
        <rect x="72" y="42" width="22" height="58" fill="#4D3F3B" />
        {[
          [10, 56],
          [16, 66],
          [32, 42],
          [40, 52],
          [32, 64],
          [56, 62],
          [76, 50],
          [84, 62],
          [76, 74],
          [40, 78],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="4" height="5" fill="#FFD23F" />
        ))}
      </svg>
    );
  if (kind === "natal")
    return (
      <svg {...common} aria-hidden="true">
        <rect width="100" height="100" fill="#FDE3EA" />
        <polygon points="50,14 74,54 26,54" fill="#D7263D" />
        <polygon points="50,32 80,78 20,78" fill="#B81E32" />
        <rect x="45" y="78" width="10" height="12" fill="#4D3F3B" />
        <circle cx="50" cy="14" r="6" fill="#FFD23F" />
        <circle cx="40" cy="60" r="3" fill="#FFD23F" />
        <circle cx="60" cy="68" r="3" fill="#FBF6EF" />
        <circle cx="54" cy="46" r="3" fill="#FBF6EF" />
      </svg>
    );
  if (kind === "estrada")
    return (
      <svg {...common} aria-hidden="true">
        <rect width="100" height="100" fill="#FFD23F" />
        <circle cx="72" cy="30" r="12" fill="#FBF6EF" />
        <path d="M0 62 Q30 40 60 58 T100 52 V100 H0Z" fill="#D7263D" />
        <path d="M0 76 Q40 60 100 74 V100 H0Z" fill="#B81E32" />
        <path d="M44 100 L52 66 L56 66 L68 100Z" fill="#1C1416" />
        <path
          d="M54 72 L55 78 M56 84 L57.5 92"
          stroke="#FFD23F"
          strokeWidth="2"
        />
      </svg>
    );
  return (
    <svg {...common} aria-hidden="true">
      <rect width="100" height="100" fill="#FFD23F" />
      <circle cx="50" cy="40" r="26" fill="#FBF6EF" />
      <circle cx="38" cy="50" r="10" fill="#1C1416" />
      <path d="M20 100 Q22 66 38 64 Q54 66 56 100Z" fill="#1C1416" />
      <circle cx="62" cy="48" r="10" fill="#D7263D" />
      <path d="M44 100 Q46 64 62 62 Q78 64 80 100Z" fill="#D7263D" />
      <path
        d="M50 30 l4 -4 a3 3 0 0 1 4 4 l-8 8 l-8 -8 a3 3 0 0 1 4 -4Z"
        fill="#D7263D"
      />
    </svg>
  );
}

/* --------------------------- como funciona --------------------------- */

function QrDrawing({ size = 64 }: { size?: number }) {
  const cells = [
    "1110111",
    "1010101",
    "1110111",
    "0001000",
    "1101011",
    "0110110",
    "1011101",
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 7 7"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {cells.flatMap((row, y) =>
        row
          .split("")
          .map((c, x) =>
            c === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                fill="#1C1416"
              />
            ) : null,
          ),
      )}
    </svg>
  );
}

function ComoFunciona() {
  return (
    <section
      className="ra-sec ra-sec--tight-top ra-center"
      id="como-funciona"
      style={{ background: "var(--creme-2)" }}
      aria-labelledby="cf-t"
    >
      <div className="ra-wrap">
        <div data-reveal>
          <span className="ra-pill ra-rise">Como funciona</span>
          <h2
            id="cf-t"
            className="ra-h2 ra-rise"
            style={{ "--i": 1 } as CSSProperties}
          >
            Pronta em 3 passos
          </h2>
        </div>

        <ol
          className="ra-steps"
          data-reveal
          style={{ listStyle: "none", padding: 0 }}
        >
          <li className="ra-step ra-rise">
            <div className="ra-step__ui" data-ui aria-hidden="true">
              <div className="ra-ui-win">
                <div className="ra-ui-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="ra-ui-q">
                  Qual foi a música do ano de vocês?
                </div>
                <div className="ra-ui-field">
                  <TypeLine text="Aquela que tocou a viagem inteira" />
                  <span className="ra-ui-caret" />
                </div>
                <div className="ra-ui-photos">
                  <div>
                    <Scene kind="praia" />
                  </div>
                  <div>
                    <Scene kind="cidade" />
                  </div>
                  <div>
                    <Scene kind="casal" />
                  </div>
                  <div className="ra-ui-add">
                    <Plus size={20} strokeWidth={2.6} />
                  </div>
                </div>
              </div>
            </div>
            <h3 className="ra-h3">
              Escolha seu plano e conte a história de vocês
            </h3>
            <p>
              Leva uns 10 minutos: você manda as fotos e responde perguntas
              divertidas sobre o ano de vocês.
            </p>
          </li>

          <li className="ra-step ra-rise" style={{ "--i": 1 } as CSSProperties}>
            <div className="ra-step__ui" data-ui aria-hidden="true">
              <div className="ra-ui-msg">
                <b>Retrô a Dois</b>
                Sua Retrô está pronta! Agora é só entregar:
                <br />
                <span>retroadois.com/ana-e-leo</span>
              </div>
              <div className="ra-ui-row">
                <span
                  className="ra-ui-row__ic"
                  style={{ background: "#D7263D", color: "#fff" }}
                >
                  <Send size={16} />
                </span>
                Enviado no WhatsApp
                <span className="ra-ui-toggle" />
              </div>
              <div className="ra-ui-row">
                <span
                  className="ra-ui-row__ic"
                  style={{ background: "#FFD23F" }}
                >
                  <Mail size={16} />
                </span>
                Enviado no e-mail
                <span className="ra-ui-toggle" />
              </div>
              <div className="ra-ui-row">
                <span
                  className="ra-ui-row__ic"
                  style={{ background: "#F7A1B5" }}
                >
                  <QrCode size={16} />
                </span>
                QR code gerado
                <span className="ra-ui-toggle" />
              </div>
            </div>
            <h3 className="ra-h3">A gente monta a Retrô</h3>
            <p>Em até 24h você recebe o link pronto no WhatsApp e no e-mail.</p>
          </li>

          <li className="ra-step ra-rise" style={{ "--i": 2 } as CSSProperties}>
            <div className="ra-step__ui" data-ui aria-hidden="true">
              <div className="ra-ui-phone">
                <div className="ra-ui-phone__screen">
                  <div className="ra-ui-phone__bars">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div
                    style={{ marginTop: "auto", fontSize: 12, opacity: 0.9 }}
                  >
                    Retrô a Dois
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: 19, lineHeight: 1.1 }}
                  >
                    2026 foi o ano de Ana e Leo
                  </div>
                  <div
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      height: 110,
                    }}
                  >
                    <Scene kind="casal" />
                  </div>
                </div>
              </div>
              <div className="ra-ui-qr">
                <QrDrawing />
              </div>
            </div>
            <h3 className="ra-h3">Seu amor abre e se emociona</h3>
            <p>
              Pelo link ou pelo QR code, direto no celular, sem baixar nada.
            </p>
          </li>
        </ol>

        <div className="ra-cta-row">
          <a href="#planos" className="ra-btn">
            MONTAR A NOSSA RETRÔ <ArrowRight size={20} strokeWidth={2.6} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- o que tem dentro ------------------------- */

/* ------------------------------ prévia ------------------------------ */

type Slide = {
  bg: string;
  fg: string;
  render: (a: string, b: string) => ReactNode;
};

const SLIDES: Slide[] = [
  {
    bg: "#D7263D",
    fg: "#fff",
    render: (a, b) => (
      <>
        <p className="ra-slide__kicker">Retrô a Dois</p>
        <p className="ra-slide__title">
          2026 foi o ano de {a} e {b}
        </p>
        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            aspectRatio: "1",
            background: "#fff",
            padding: 8,
          }}
        >
          <div style={{ height: "100%", borderRadius: 10, overflow: "hidden" }}>
            <Scene kind="casal" />
          </div>
        </div>
      </>
    ),
  },
  {
    bg: "#FFD23F",
    fg: "#1C1416",
    render: () => (
      <>
        <p className="ra-slide__kicker">Neste ano, vocês passaram</p>
        <p className="ra-slide__huge">365</p>
        <p className="ra-slide__title">dias juntos. E cada um deles contou.</p>
      </>
    ),
  },
  {
    bg: "#17110F",
    fg: "#FBF6EF",
    render: () => (
      <>
        <p className="ra-slide__kicker">A música do ano de vocês foi…</p>
        <p className="ra-slide__title">
          Aquela que tocou a viagem inteira no carro
        </p>
        <div className="ra-player">
          <div className="ra-player__art">
            <Scene kind="estrada" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Tocando agora</div>
            <div className="ra-player__wave">
              {[14, 22, 10, 18, 22, 8, 16].map((h, i) => (
                <i
                  key={i}
                  style={{ height: h, animationDelay: `${i * 110}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    bg: "#F7A1B5",
    fg: "#1C1416",
    render: () => (
      <>
        <p className="ra-slide__kicker">O lugar mais marcante</p>
        <div
          style={{ borderRadius: 18, overflow: "hidden", aspectRatio: "4 / 3" }}
        >
          <Scene kind="praia" />
        </div>
        <p className="ra-slide__title">A praia onde o celular caiu no mar</p>
      </>
    ),
  },
  {
    bg: "#D7263D",
    fg: "#fff",
    render: (a) => (
      <>
        <p className="ra-slide__kicker">A frase que mais se repetiu</p>
        <p className="ra-slide__title" style={{ fontSize: 40 }}>
          “Já tô chegando.”
        </p>
        <p className="ra-slide__kicker">Dita por {a}. Nunca era verdade.</p>
      </>
    ),
  },
  {
    bg: "#17110F",
    fg: "#FBF6EF",
    render: (a, b) => (
      <>
        <span className="ra-lock">
          <Lock size={28} />
        </span>
        <p className="ra-slide__title">
          Uma mensagem de {a} para {b}
        </p>
        <p className="ra-slide__kicker">Abre em 25/12/2027</p>
      </>
    ),
  },
];

const SLIDE_MS = 4200;

function Previa() {
  const [a, setA] = useState("Ana");
  const [b, setB] = useState("Leo");
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);
  const [touched, setTouched] = useState(false);

  const go = (step: number) => {
    setDir(step);
    setTouched(true);
    setI((n) => (n + step + SLIDES.length) % SLIDES.length);
    if (typeof navigator !== "undefined" && "vibrate" in navigator)
      navigator.vibrate?.(8);
  };

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => {
      setDir(1);
      setI((n) => (n + 1) % SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [i, paused]);

  const nameA = a.trim() || "Você";
  const nameB = b.trim() || "seu amor";
  const s = SLIDES[i] ?? SLIDES[0]!;

  return (
    <section
      className="ra-sec ra-sec--tight-top"
      id="previa"
      aria-labelledby="prev-t"
    >
      <div className="ra-wrap ra-demo">
        <div data-reveal>
          <h2 id="prev-t" className="ra-h2 ra-rise">
            Veja como seu amor vai <span className="ra-mark">receber</span>
          </h2>
          <p className="ra-lead ra-rise" style={{ "--i": 1 } as CSSProperties}>
            Escreva os dois nomes e assista a uma Retrô de exemplo, capítulo por
            capítulo. A de vocês ainda tem o momento mais caótico do ano, o mês
            mais feliz, o que vem em 2027 e a sua carta final.
          </p>
          <div
            className="ra-demo__form ra-rise"
            style={{ "--i": 2 } as CSSProperties}
          >
            <div className="ra-field">
              <label htmlFor="ra-a">Seu nome</label>
              <input
                id="ra-a"
                value={a}
                maxLength={14}
                onChange={(e) => setA(e.target.value)}
                autoComplete="off"
              />
            </div>
            <span className="ra-demo__amp" aria-hidden="true">
              &amp;
            </span>
            <div className="ra-field">
              <label htmlFor="ra-b">Nome do seu amor</label>
              <input
                id="ra-b"
                value={b}
                maxLength={14}
                onChange={(e) => setB(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          <p
            className="ra-note ra-demo__hint ra-rise"
            style={{ "--i": 3 } as CSSProperties}
          >
            Toque nas laterais da tela para avançar ou voltar. Exemplo com
            ilustrações; a sua usa as fotos de vocês.
          </p>
        </div>

        <div className="ra-demo__stage">
          <Orbit
            items={[
              {
                a: -40,
                r: 46,
                bg: "#FFD23F",
                fg: "#1C1416",
                icon: <Music size={26} />,
                label: "",
              },
              {
                a: 40,
                r: 46,
                bg: "#F7A1B5",
                fg: "#1C1416",
                icon: <Heart size={26} />,
                label: "",
              },
              {
                a: 150,
                r: 46,
                bg: "#D7263D",
                fg: "#fff",
                icon: <Camera size={26} />,
                label: "",
              },
              {
                a: 215,
                r: 46,
                bg: "#1C1416",
                fg: "#FFD23F",
                icon: <MapPin size={26} />,
                label: "",
              },
            ]}
          >
            <div
              className="ra-phone"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div
                className="ra-phone__screen"
                style={{ background: s.bg, color: s.fg }}
                role="region"
                aria-roledescription="carrossel"
                aria-label="Retrô de exemplo"
              >
                <div
                  className={`ra-phone__bars${paused ? " paused" : ""}`}
                  style={{ "--dur": `${SLIDE_MS}ms` } as CSSProperties}
                >
                  {SLIDES.map((_, k) => (
                    <i
                      key={k}
                      className={k < i ? "done" : k === i ? "now" : ""}
                    >
                      <b key={k === i ? `n${i}` : `o${k}`} />
                    </i>
                  ))}
                </div>
                <div
                  className={`ra-slide${dir < 0 ? " ra-slide--back" : ""}`}
                  key={i}
                  aria-live="polite"
                >
                  {s.render(nameA, nameB)}
                </div>
                <div className="ra-slide__tap">
                  <button
                    type="button"
                    aria-label="Capítulo anterior"
                    onClick={() => go(-1)}
                  />
                  <button
                    type="button"
                    aria-label="Próximo capítulo"
                    onClick={() => go(1)}
                  />
                </div>
                {!touched && (
                  <span className="ra-taphint" aria-hidden="true">
                    <i />
                    toque
                  </span>
                )}
              </div>
            </div>
          </Orbit>
          <div className="ra-hearts" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <Heart
                key={k}
                size={16 + (k % 3) * 6}
                fill="currentColor"
                strokeWidth={0}
                style={{ "--h": k } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ planos ------------------------------ */

type Feature = { t: string; on: boolean };

const PLANOS: {
  id: keyof typeof CHECKOUT;
  nome: string;
  preco: string;
  sub: string;
  icon: ReactNode;
  star?: boolean;
  cta: string;
  features: Feature[];
}[] = [
  {
    id: "basica",
    nome: "Básica",
    preco: "19,90",
    sub: "Uma surpresa curta e certeira.",
    icon: <Heart size={28} color="#F7A1B5" />,
    cta: "QUERO A BÁSICA",
    features: [
      { t: "Até 5 fotos", on: true },
      { t: "6 capítulos", on: true },
      { t: "Carta final curta", on: true },
      { t: "Link + QR code por 1 ano", on: true },
      { t: "Trilha sonora", on: false },
      { t: "Cápsula do tempo", on: false },
    ],
  },
  {
    id: "completa",
    nome: "Completa · mais escolhida",
    preco: "29,90",
    sub: "O ano inteiro, com trilha sonora.",
    icon: <Star size={28} color="#FFD23F" fill="#FFD23F" />,
    star: true,
    cta: "QUERO A COMPLETA",
    features: [
      { t: "Até 20 fotos", on: true },
      { t: "12+ capítulos", on: true },
      { t: "Trilha sonora", on: true },
      { t: "Carta final longa ou em vídeo", on: true },
      { t: "Link + QR code para sempre", on: true },
      { t: "Cápsula do tempo", on: false },
    ],
  },
  {
    id: "inesquecivel",
    nome: "Inesquecível",
    preco: "49,90",
    sub: "Tudo da Completa, e um presente que continua.",
    icon: <InfinityIcon size={30} color="#D7263D" strokeWidth={2.6} />,
    cta: "QUERO A INESQUECÍVEL",
    features: [
      { t: "Até 20 fotos e 12+ capítulos", on: true },
      { t: "Trilha sonora e carta longa ou em vídeo", on: true },
      { t: "Link + QR code para sempre", on: true },
      { t: "Cápsula do tempo", on: true },
      { t: "Abre no dia que você escolher", on: true },
      { t: "Convite com QR para imprimir", on: true },
    ],
  },
];

function Planos() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  const centerOn = (k: number, smooth: boolean) => {
    const el = track.current;
    const card = el?.children[k] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  /* no celular, começa com a Completa no meio e as outras aparecendo nas pontas */
  useEffect(() => {
    const el = track.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const first = el.children[1] as HTMLElement | undefined;
    if (first)
      el.scrollLeft =
        first.offsetLeft - (el.clientWidth - first.clientWidth) / 2;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        Array.from(el.children).forEach((c, k) => {
          const card = c as HTMLElement;
          const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - mid);
          if (d < dist) {
            dist = d;
            best = k;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="ra-sec ra-center"
      id="planos"
      aria-labelledby="pl-t"
      style={{ position: "relative" }}
    >
      <div className="ra-wrap">
        <div data-reveal style={{ position: "relative", zIndex: 1 }}>
          <span className="ra-pill ra-rise">Planos</span>
          <h2
            id="pl-t"
            className="ra-h2 ra-rise"
            style={{ "--i": 1 } as CSSProperties}
          >
            Escolha o tamanho da surpresa
          </h2>
        </div>
        <div className="ra-plans" data-reveal ref={track}>
          {PLANOS.map((p, k) => (
            <article
              key={p.id}
              className={`ra-plan ra-rise${p.star ? " ra-plan--star" : ""}`}
              style={{ "--i": k } as CSSProperties}
            >
              <span className="ra-plan__ic" aria-hidden="true">
                {p.icon}
              </span>
              <h3 className="ra-plan__tag">{p.nome}</h3>
              <p className="ra-plan__price">
                <small>R$</small>
                <CountPrice value={p.preco} />
              </p>
              <p className="ra-plan__sub">{p.sub}</p>
              <ul className="ra-plan__list">
                {p.features.map((f, fi) => (
                  <li
                    key={f.t}
                    className={f.on ? "" : "off"}
                    style={{ "--f": fi } as CSSProperties}
                  >
                    {f.on ? (
                      <Check
                        size={18}
                        strokeWidth={3}
                        color={p.star ? "#FFD23F" : "#F7A1B5"}
                      />
                    ) : (
                      <Minus size={18} strokeWidth={3} />
                    )}
                    <span>
                      {f.on ? (
                        ""
                      ) : (
                        <span className="sr-only">Não inclui: </span>
                      )}
                      {f.t}
                    </span>
                  </li>
                ))}
              </ul>
              <a href={CHECKOUT[p.id]} className="ra-btn ra-btn--full">
                {p.cta}
              </a>
            </article>
          ))}
        </div>
        <div className="ra-plans-dots">
          {PLANOS.map((p, k) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Ver plano ${p.nome.split(" ·")[0]}`}
              aria-current={active === k}
              onClick={() => centerOn(k, true)}
            />
          ))}
          <span className="ra-plans-swipe" aria-hidden="true">
            arraste <ArrowRight size={16} />
          </span>
        </div>
        <div className="ra-plans-foot" data-reveal>
          <p className="ra-rise">
            Por menos que uma pizza, você dá um presente que ninguém mais no
            mundo poderia dar.
          </p>
          <p className="ra-note ra-rise" style={{ "--i": 1 } as CSSProperties}>
            Tem pet? No checkout você pode adicionar a Retrô do seu bichinho por
            + R$ 19,90.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ cápsula ------------------------------ */

const ABERTURA = new Date(2027, 11, 25, 0, 0, 0);

function useCountdown(target: Date) {
  const [left, setLeft] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  } | null>(null);
  useEffect(() => {
    const tick = () => {
      const ms = Math.max(0, target.getTime() - Date.now());
      setLeft({
        d: Math.floor(ms / 86400000),
        h: Math.floor(ms / 3600000) % 24,
        m: Math.floor(ms / 60000) % 60,
        s: Math.floor(ms / 1000) % 60,
      });
    };
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [target]);
  return left;
}

function Capsula() {
  const left = useCountdown(ABERTURA);
  const pad = (n: number) => String(n).padStart(2, "0");
  const nums = [
    { v: left ? String(left.d) : "—", l: "dias" },
    { v: left ? pad(left.h) : "—", l: "horas" },
    { v: left ? pad(left.m) : "—", l: "min" },
    { v: left ? pad(left.s) : "—", l: "seg" },
  ];
  return (
    <section
      className="ra-sec"
      style={{ paddingTop: 0 }}
      aria-labelledby="cap2-t"
    >
      <div className="ra-wrap ra-capsule">
        <div data-reveal>
          <span className="ra-pill ra-rise">Cápsula do tempo</span>
          <h2
            id="cap2-t"
            className="ra-h2 ra-rise"
            style={{ "--i": 1, marginTop: 20 } as CSSProperties}
          >
            Um presente que continua emocionando em{" "}
            <span className="ra-mark">2027</span>
          </h2>
          <p className="ra-lead ra-rise" style={{ "--i": 2 } as CSSProperties}>
            No plano Inesquecível, o último capítulo é uma mensagem (ou um
            áudio) trancada até a data que você escolher. Até lá, seu amor só vê
            um cadeado e uma contagem regressiva.
          </p>
          <a
            href={CHECKOUT.inesquecivel}
            className="ra-btn ra-rise"
            style={{ "--i": 4 } as CSSProperties}
          >
            QUERO A VERSÃO INESQUECÍVEL{" "}
            <ArrowRight size={20} strokeWidth={2.6} />
          </a>
        </div>
        <div className="ra-count" data-reveal>
          <div className="ra-rise">
            <span className="ra-count__lock" aria-hidden="true">
              <Lock size={36} strokeWidth={2.4} />
            </span>
            <p className="ra-count__label">
              Uma mensagem escrita hoje, que abre no Natal de 2027:
            </p>
            <div
              className="ra-count__nums"
              role="timer"
              aria-label="Contagem regressiva até 25 de dezembro de 2027"
            >
              {nums.map((n) => (
                <div key={n.l} className="ra-count__num">
                  <b key={n.v}>{n.v}</b>
                  <span>{n.l}</span>
                </div>
              ))}
            </div>
            <p className="ra-count__msg">
              <Clock
                size={16}
                style={{ verticalAlign: "-3px", marginRight: 6 }}
              />
              Abre em 25/12/2027, às 00h00
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------- garantia e prazo -------------------------- */

function GarantiaPrazo() {
  return (
    <section className="ra-sec" aria-label="Garantia e prazo">
      <div className="ra-wrap ra-promise" data-reveal>
        <div className="ra-promise__card ra-promise__card--g ra-rise">
          <span className="ra-promise__ic" aria-hidden="true">
            <ShieldCheck size={32} strokeWidth={2.2} />
          </span>
          <h2 className="ra-h2">Ajuste grátis e 7 dias de garantia</h2>
          <p>
            Se a sua Retrô não ficar do jeito que você imaginou, a gente ajusta
            sem custo. E se ainda assim não gostar, você tem 7 dias para pedir
            seu dinheiro de volta. Simples assim.
          </p>
        </div>
        <div
          className="ra-promise__card ra-promise__card--p ra-rise"
          style={{ "--i": 1 } as CSSProperties}
        >
          <span className="ra-promise__ic" aria-hidden="true">
            <Calendar size={32} strokeWidth={2.2} />
          </span>
          <h2 className="ra-h2">Prazo para pedir</h2>
          <div className="ra-dates">
            <div className="ra-date">
              <i className="ra-date__dot" aria-hidden="true" />
              <b>22/12</b>
              <span>Último dia para receber antes do Natal</span>
            </div>
            <div className="ra-date">
              <b>29/12</b>
              <span>Ainda dá tempo para o Réveillon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- faq -------------------------------- */

const FAQ = [
  {
    q: "Preciso baixar algum aplicativo?",
    a: "Não. A Retrô abre direto no navegador do celular, pelo link ou pelo QR code.",
  },
  {
    q: "E se a gente estiver junto há pouco tempo?",
    a: "Funciona do mesmo jeito. A Retrô pode contar os primeiros meses de vocês, e isso costuma emocionar ainda mais.",
  },
  {
    q: "Minhas fotos ficam públicas?",
    a: "Não. Só quem tiver o link consegue ver a Retrô.",
  },
  {
    q: "Posso dar para alguém que mora longe?",
    a: "Pode. Você manda o link por WhatsApp ou escolhe o dia em que a Retrô vai abrir (no plano Inesquecível).",
  },
  { q: "Quais as formas de pagamento?", a: "Pix ou cartão de crédito." },
];

function Faq() {
  return (
    <section
      className="ra-sec"
      style={{ paddingTop: 0 }}
      id="duvidas"
      aria-labelledby="faq-t"
    >
      <div className="ra-wrap ra-faq">
        <div className="ra-faq__head" data-reveal>
          <h2 id="faq-t" className="ra-h2 ra-rise">
            Perguntas frequentes
          </h2>
          <p className="ra-lead ra-rise" style={{ "--i": 1 } as CSSProperties}>
            Ficou alguma dúvida? As mais comuns estão aqui.
          </p>
        </div>
        <div className="ra-faq__list" data-reveal>
          {FAQ.map((f, k) => (
            <details
              key={f.q}
              className="ra-rise"
              style={{ "--i": k } as CSSProperties}
              open={k === 0}
            >
              <summary>
                {f.q}
                <span className="ra-faq__plus" aria-hidden="true">
                  <Plus size={20} strokeWidth={2.6} />
                </span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- cta final ----------------------------- */

function Shape({ style }: { style: CSSProperties }) {
  return (
    <div className="ra-shape" style={style} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <g fill="currentColor">
          <circle cx="50" cy="26" r="24" />
          <circle cx="74" cy="50" r="24" />
          <circle cx="50" cy="74" r="24" />
          <circle cx="26" cy="50" r="24" />
        </g>
        <circle cx="50" cy="76" r="2.6" fill="#F7A1B5" />
      </svg>
    </div>
  );
}

function Letters({
  text,
  start,
  em,
}: {
  text: string;
  start: number;
  em?: boolean;
}) {
  const chars = [...text].map((c, k) => (
    <span
      key={k}
      className="ra-ch"
      aria-hidden="true"
      style={{ "--c": start + k } as CSSProperties}
    >
      {c}
    </span>
  ));
  return em ? <em>{chars}</em> : <span className="ra-wordgroup">{chars}</span>;
}

function CtaFinal() {
  return (
    <section
      className="ra-sec"
      id="fim"
      style={{ paddingBottom: 0 }}
      aria-labelledby="fim-t"
    >
      <div className="ra-wrap">
        <div className="ra-final" data-reveal>
          <h2 id="fim-t" className="ra-h2 ra-rise">
            Esse ano merece ser <span className="ra-mark">lembrado</span>
          </h2>
          <p className="ra-lead ra-rise" style={{ "--i": 1 } as CSSProperties}>
            Daqui a alguns anos, ninguém vai lembrar do perfume que ganhou em
            2026. Mas seu amor vai lembrar do dia em que abriu a Retrô de vocês
            e viu o ano inteiro passar na tela.
          </p>
          <a
            href="#planos"
            className="ra-giant ra-rise"
            style={{ "--i": 2 } as CSSProperties}
          >
            <i aria-hidden="true" />
            QUERO DAR ESSE PRESENTE
            <i aria-hidden="true" />
          </a>
          <p className="ra-note ra-rise" style={{ "--i": 3 } as CSSProperties}>
            A partir de R$ 19,90 · 7 dias de garantia
          </p>
        </div>
        <footer className="ra-foot" data-reveal>
          <p className="ra-foot__name" aria-label="Retrô a Dois">
            <Letters text="Retrô" start={0} /> <Letters text="a" start={5} em />{" "}
            <Letters text="Dois" start={6} />
          </p>
          <div className="ra-foot__meta">
            <p>
              <a href="#como-funciona">Como funciona</a>
              <a href="#planos">Planos</a>
              <a href="#duvidas">Dúvidas</a>
            </p>
            <p style={{ marginTop: 10 }}>
              © 2026 Retrô a Dois · Pix ou cartão de crédito
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
