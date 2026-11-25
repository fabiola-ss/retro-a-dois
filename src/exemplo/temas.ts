/* Os 5 temas de cores da Retrô (planos Completa e Inesquecível).
   As cores de cada tema ficam em retro.css (html[data-tema="…"]). */

export type Tema = "classico" | "romantico" | "noite" | "praia" | "minimal";

export const TEMAS: {
  id: Tema;
  nome: string;
  cores: [string, string, string, string];
}[] = [
  {
    id: "classico",
    nome: "Clássico",
    cores: ["#D7263D", "#FFD23F", "#FBF6EF", "#17110F"],
  },
  {
    id: "romantico",
    nome: "Romântico",
    cores: ["#9E2A4B", "#F7C6D3", "#FDF5F3", "#3A1220"],
  },
  {
    id: "noite",
    nome: "Noite estrelada",
    cores: ["#2E4A8C", "#F2C94C", "#F4F2EC", "#0E1630"],
  },
  {
    id: "praia",
    nome: "Praia",
    cores: ["#D9573A", "#A8E6E2", "#FBF5EA", "#0F3D4C"],
  },
  {
    id: "minimal",
    nome: "Minimal",
    cores: ["#1C1C1C", "#E8E2D6", "#FFFFFF", "#161616"],
  },
];

export function aplicarTema(tema: Tema) {
  if (typeof document !== "undefined")
    document.documentElement.dataset.tema = tema;
}
