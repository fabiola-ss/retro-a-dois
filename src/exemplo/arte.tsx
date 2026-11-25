/* Ilustrações da Retrô de exemplo: o casal em avatar, o Paçoca e as cenas
   que fazem o papel das fotos até as fotos reais chegarem. */

import type { CSSProperties, ReactNode } from "react";

const C = {
  creme: "#FBF6EF",
  creme2: "#F3EADD",
  cereja: "#D7263D",
  cereja2: "#B81E32",
  amarelo: "#FFD23F",
  rosa: "#F7A1B5",
  rosa2: "#FDE3EA",
  tinta: "#1C1416",
  tinta2: "#4D3F3B",
  noite: "#17110F",
  noite3: "#31251F",
};

/** O casal, desenhado num quadrado 100x100. Ana à esquerda, Leo à direita. */
export function CasalG({
  x = 0,
  y = 0,
  s = 1,
}: {
  x?: number;
  y?: number;
  s?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Ana: cabelo comprido atrás */}
      <path
        d="M26 44 Q24 26 38 24 Q52 26 50 44 L52 70 L24 70 Z"
        fill="#3B2620"
      />
      <path d="M22 100 Q22 66 38 62 Q54 66 54 100 Z" fill={C.cereja} />
      <path d="M33 61 L38 70 L43 61 Z" fill="#E8B48F" />
      <rect x="34" y="50" width="8" height="12" rx="3" fill="#E8B48F" />
      <circle cx="38" cy="42" r="10" fill="#E8B48F" />
      <path
        d="M28 40 Q30 28 40 29 Q48 30 48 38 Q40 36 34 33 Q31 38 28 40Z"
        fill="#3B2620"
      />
      <circle cx="34.5" cy="43" r="1.3" fill={C.tinta} />
      <circle cx="41.5" cy="43" r="1.3" fill={C.tinta} />
      <path
        d="M35 47 Q38 49.5 41 47"
        stroke={C.tinta}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="32" cy="46.5" r="1.8" fill={C.rosa} opacity="0.8" />
      <circle cx="44" cy="46.5" r="1.8" fill={C.rosa} opacity="0.8" />

      {/* Leo */}
      <path d="M46 100 Q46 64 63 60 Q80 64 80 100 Z" fill={C.tinta} />
      <path d="M58 60 L63 68 L68 60 Z" fill="#C98F6B" />
      <rect x="59" y="48" width="8" height="13" rx="3" fill="#C98F6B" />
      <circle cx="63" cy="40" r="10.5" fill="#C98F6B" />
      <path
        d="M52.5 38 Q52 27 63 27 Q75 27 73.5 38 Q70 32 63 33 Q57 32 52.5 38Z"
        fill={C.tinta}
      />
      <path
        d="M54 43 Q56 53 63 53 Q70 53 72 43 Q70 49 63 49.5 Q56 49 54 43Z"
        fill="#5A3A2C"
      />
      <circle cx="59.5" cy="41" r="1.3" fill={C.tinta} />
      <circle cx="66.5" cy="41" r="1.3" fill={C.tinta} />
      <path
        d="M60.5 46 Q63 47.8 65.5 46"
        stroke={C.creme}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

/** O Paçoca, o cachorro do casal. */
export function PacocaG({
  x = 0,
  y = 0,
  s = 1,
}: {
  x?: number;
  y?: number;
  s?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="50" cy="74" rx="22" ry="14" fill="#C98A4B" />
      <rect x="32" y="78" width="6" height="16" rx="3" fill="#C98A4B" />
      <rect x="60" y="78" width="6" height="16" rx="3" fill="#C98A4B" />
      <path
        d="M71 68 Q84 58 80 50"
        stroke="#C98A4B"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="34" cy="56" r="15" fill="#C98A4B" />
      <ellipse
        cx="22"
        cy="50"
        rx="6"
        ry="11"
        fill="#8F5A2B"
        transform="rotate(20 22 50)"
      />
      <ellipse
        cx="45"
        cy="47"
        rx="6"
        ry="11"
        fill="#8F5A2B"
        transform="rotate(-25 45 47)"
      />
      <ellipse cx="30" cy="62" rx="8" ry="6" fill="#E9C9A0" />
      <circle cx="28" cy="58" r="2.6" fill={C.tinta} />
      <circle cx="30" cy="53" r="1.5" fill={C.tinta} />
      <circle cx="38" cy="53" r="1.5" fill={C.tinta} />
      <path d="M32 66 Q35 70 38 66" fill={C.cereja} />
      <rect x="25" y="68" width="20" height="4" rx="2" fill={C.cereja} />
    </g>
  );
}

/** Uma cena ilustrada ou, nas Retrôs de clientes, o endereço de uma foto real. */
export type Cena =
  | (string & {})
  | "casal"
  | "praia"
  | "praia-por-do-sol"
  | "estrada"
  | "jantar"
  | "aniversario"
  | "cafe"
  | "pacoca"
  | "mudanca"
  | "cidade"
  | "natal"
  | "sofa";

/** Uma "foto" ilustrada. Quando as fotos reais chegarem, entram no lugar disto. */
export const ehFoto = (cena: string) =>
  /^(https?:|blob:|data:|\/|\.)/.test(cena);

export function Ilustracao({ cena }: { cena: Cena }) {
  if (ehFoto(cena))
    return (
      <img
        src={cena}
        alt=""
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  const casal = (x: number, y: number, s: number) => (
    <CasalG x={x} y={y} s={s} />
  );
  let fundo: ReactNode;
  let frente: ReactNode = casal(8, 18, 0.84);

  switch (cena) {
    case "casal":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.amarelo} />
          <circle cx="50" cy="44" r="30" fill={C.creme} />
          <path
            d="M50 22 l4 -4 a3 3 0 0 1 4 4 l-8 8 l-8 -8 a3 3 0 0 1 4 -4Z"
            fill={C.cereja}
          />
        </>
      );
      frente = casal(0, 10, 1);
      break;
    case "praia":
      fundo = (
        <>
          <rect width="100" height="100" fill="#BFE3F0" />
          <circle cx="78" cy="22" r="10" fill={C.amarelo} />
          <rect y="54" width="100" height="22" fill="#4FA3C7" />
          <rect y="60" width="100" height="3" fill="#7CC0DB" />
          <path d="M0 74 Q50 66 100 74 V100 H0Z" fill="#F1DDB8" />
        </>
      );
      break;
    case "praia-por-do-sol":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.rosa} />
          <circle cx="50" cy="60" r="22" fill={C.amarelo} />
          <rect y="60" width="100" height="40" fill={C.cereja} />
          <rect y="68" width="100" height="3" fill={C.cereja2} />
          <rect y="78" width="100" height="3" fill={C.cereja2} />
        </>
      );
      frente = <CasalG x={18} y={30} s={0.66} />;
      break;
    case "estrada":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.amarelo} />
          <circle cx="74" cy="26" r="11" fill={C.creme} />
          <path d="M0 60 Q30 40 60 56 T100 50 V100 H0Z" fill={C.cereja} />
          <path d="M0 74 Q40 60 100 72 V100 H0Z" fill={C.cereja2} />
        </>
      );
      frente = <CasalG x={16} y={24} s={0.74} />;
      break;
    case "jantar":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.noite3} />
          <circle cx="20" cy="18" r="3" fill={C.amarelo} opacity="0.7" />
          <circle cx="50" cy="12" r="3" fill={C.amarelo} opacity="0.7" />
          <circle cx="80" cy="18" r="3" fill={C.amarelo} opacity="0.7" />
          <path
            d="M0 16 Q50 26 100 16"
            stroke={C.creme}
            strokeWidth="0.6"
            fill="none"
            opacity="0.5"
          />
        </>
      );
      frente = (
        <>
          {casal(8, 14, 0.84)}
          <rect x="0" y="86" width="100" height="14" fill="#7A4A36" />
          <rect x="47" y="74" width="5" height="12" rx="1" fill={C.creme} />
          <path d="M49.5 66 Q53 70 49.5 74 Q46 70 49.5 66Z" fill={C.amarelo} />
        </>
      );
      break;
    case "aniversario":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.rosa2} />
          {[10, 28, 72, 88].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={14 + (i % 2) * 8}
              r="5"
              fill={i % 2 ? C.amarelo : C.rosa}
            />
          ))}
        </>
      );
      frente = (
        <>
          {casal(8, 10, 0.84)}
          <rect x="34" y="80" width="32" height="20" rx="3" fill={C.creme} />
          <rect x="34" y="80" width="32" height="6" fill={C.rosa} />
          <rect x="49" y="71" width="2.5" height="9" fill={C.cereja} />
          <path
            d="M50.2 66 Q53 69 50.2 72 Q47.5 69 50.2 66Z"
            fill={C.amarelo}
          />
        </>
      );
      break;
    case "cafe":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.creme2} />
          <rect x="0" y="0" width="100" height="40" fill="#FFE9A8" />
        </>
      );
      frente = (
        <>
          {casal(8, 8, 0.84)}
          <rect x="0" y="82" width="100" height="18" fill="#B5835A" />
          <path d="M26 72 h14 v8 a7 7 0 0 1 -14 0Z" fill={C.cereja} />
          <path d="M60 72 h14 v8 a7 7 0 0 1 -14 0Z" fill={C.tinta} />
          <path
            d="M30 66 q2 -3 0 -6 M36 66 q2 -3 0 -6 M64 66 q2 -3 0 -6 M70 66 q2 -3 0 -6"
            stroke={C.tinta2}
            strokeWidth="1"
            fill="none"
          />
        </>
      );
      break;
    case "pacoca":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.amarelo} />
          <circle cx="50" cy="56" r="34" fill={C.creme} />
        </>
      );
      frente = <PacocaG x={4} y={2} s={0.96} />;
      break;
    case "mudanca":
      fundo = <rect width="100" height="100" fill={C.creme2} />;
      frente = (
        <>
          {casal(22, 18, 0.8)}
          <g transform="rotate(-8 20 80)">
            <rect x="4" y="66" width="30" height="26" fill="#C9A06B" />
            <rect x="4" y="66" width="30" height="5" fill="#B08654" />
          </g>
          <g transform="rotate(10 82 76)">
            <rect x="66" y="62" width="30" height="30" fill="#C9A06B" />
            <rect
              x="77"
              y="62"
              width="8"
              height="30"
              fill={C.amarelo}
              opacity="0.8"
            />
          </g>
          <rect
            x="10"
            y="52"
            width="20"
            height="14"
            fill="#C9A06B"
            transform="rotate(14 20 59)"
          />
        </>
      );
      break;
    case "cidade":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.noite} />
          <circle cx="80" cy="16" r="7" fill={C.creme} />
          <rect x="4" y="40" width="18" height="60" fill={C.noite3} />
          <rect x="74" y="34" width="22" height="66" fill={C.noite3} />
          {[
            [8, 48],
            [14, 60],
            [80, 44],
            [88, 58],
            [80, 70],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="4" height="5" fill={C.amarelo} />
          ))}
        </>
      );
      break;
    case "natal":
      fundo = (
        <>
          <rect width="100" height="100" fill={C.rosa2} />
          <polygon points="84,22 98,50 70,50" fill={C.cereja} />
          <polygon points="84,34 100,64 68,64" fill={C.cereja2} />
          <circle cx="84" cy="22" r="4" fill={C.amarelo} />
        </>
      );
      frente = casal(-6, 16, 0.84);
      break;
    case "sofa":
      fundo = (
        <>
          <rect width="100" height="100" fill="#E6D9C6" />
          <rect x="62" y="10" width="26" height="20" fill={C.noite3} />
          <rect x="64" y="12" width="22" height="16" fill="#6FB6D9" />
        </>
      );
      frente = (
        <>
          {casal(8, 6, 0.84)}
          <rect x="2" y="74" width="96" height="26" rx="8" fill={C.cereja} />
          <rect x="2" y="68" width="14" height="32" rx="6" fill={C.cereja2} />
          <rect x="84" y="68" width="14" height="32" rx="6" fill={C.cereja2} />
          <PacocaG x={58} y={50} s={0.4} />
        </>
      );
      break;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {fundo}
      {frente}
    </svg>
  );
}

/** Polaroid com uma ilustração (ou, depois, a foto real) e uma legenda escrita à mão. */
export function Polaroid({
  cena,
  legenda,
  rot = 0,
  style,
  className = "",
}: {
  cena: Cena;
  legenda?: string;
  rot?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <figure
      className={`rx-polaroid ${className}`}
      style={{ "--rot": `${rot}deg`, ...style } as CSSProperties}
    >
      <div className="rx-polaroid__img">
        <Ilustracao cena={cena} />
      </div>
      {legenda && <figcaption>{legenda}</figcaption>}
    </figure>
  );
}
