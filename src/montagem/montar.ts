/* Transforma as respostas do formulário no formato da Retrô (o mesmo do exemplo). */

import type { Plano, Retro } from "../exemplo/dados";

export const MESES_NOME = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export type Form = {
  plano: Plano;
  de: string;
  para: string;
  juntosDesde: string; // AAAA-MM-DD
  whatsapp: string;
  email: string;
  pet: string;
  numeros: { valor: string; rotulo: string }[];
  musica: { titulo: string; artista: string; detalhe: string };
  lugar: { nome: string; regiao: string; quando: string; frase: string };
  frase: {
    texto: string;
    quem: "de" | "para";
    vezes: string;
    resposta: string;
  };
  comeco: { data: string; titulo: string; texto: string }[];
  mesFeliz: { mes: string; frase: string };
  caos: { titulo: string; itens: string[] };
  antesDepois: { anoAntes: string; frase: string };
  top5: { titulo: string; itens: { nome: string; vezes: string }[] };
  playlist: { titulo: string; artista: string; momento: string }[];
  quiz: { pergunta: string; resposta: "de" | "para"; piada: string }[];
  premios: { categoria: string; vencedor: string; motivo: string }[];
  sonhos: string[];
  carta: string;
  recados: { de: string; quem: string; texto: string }[];
  vales: { titulo: string; detalhe: string }[];
  capsula: { mensagem: string; abre: string }; // AAAA-MM-DD
  pergunta: string;
  extras: { pet: boolean; pedido: boolean };
  mesAMes: string[]; // 12 frases
  motivos: string; // um por linha
  primeiras: string; // uma por linha
  mapaLugares: string; // um por linha
  mapaKm: string;
  cardapio: {
    restaurante: string;
    prato: string;
    delivery: string;
    sobremesa: string;
    drink: string;
  };
  previsao: { mes: string; tempo: string; texto: string }[];
  contrato: string; // uma promessa por linha
  videoLegendas: string[];
};

export const ANO = 2026;

export const formVazio = (plano: Plano): Form => ({
  plano,
  de: "",
  para: "",
  juntosDesde: "",
  whatsapp: "",
  email: "",
  pet: "",
  numeros: [
    { valor: "", rotulo: "fotos no rolo da câmera" },
    { valor: "", rotulo: "viagens" },
    { valor: "", rotulo: "" },
  ],
  musica: { titulo: "", artista: "", detalhe: "" },
  lugar: { nome: "", regiao: "", quando: "", frase: "" },
  frase: { texto: "", quem: "de", vezes: "", resposta: "" },
  comeco: [
    { data: "", titulo: "O primeiro encontro", texto: "" },
    { data: "", titulo: "", texto: "" },
  ],
  mesFeliz: { mes: "", frase: "" },
  caos: { titulo: "", itens: ["", "", ""] },
  antesDepois: { anoAntes: "", frase: "" },
  top5: {
    titulo: "Os apelidos mais usados",
    itens: Array.from({ length: 5 }, () => ({ nome: "", vezes: "" })),
  },
  playlist: Array.from({ length: 5 }, () => ({
    titulo: "",
    artista: "",
    momento: "",
  })),
  quiz: [
    { pergunta: "Quem dorme primeiro no filme?", resposta: "de", piada: "" },
    { pergunta: "Quem pede desculpa primeiro?", resposta: "de", piada: "" },
    { pergunta: "Quem escolhe o restaurante?", resposta: "de", piada: "" },
  ],
  premios: [
    { categoria: "Melhor cozinheiro(a)", vencedor: "", motivo: "" },
    { categoria: "Pior DJ do carro", vencedor: "", motivo: "" },
    { categoria: "Maior drama do ano", vencedor: "", motivo: "" },
  ],
  sonhos: ["", "", ""],
  carta: "",
  recados: [{ de: "", quem: "", texto: "" }],
  vales: [
    { titulo: "Um café na cama", detalhe: "" },
    { titulo: "", detalhe: "" },
    { titulo: "", detalhe: "" },
  ],
  capsula: { mensagem: "", abre: `${ANO + 1}-12-25` },
  pergunta: `Quer passar ${ANO + 1} comigo?`,
  extras: { pet: false, pedido: false },
  mesAMes: Array.from({ length: 12 }, () => ""),
  motivos: "",
  primeiras: "",
  mapaLugares: "",
  mapaKm: "",
  cardapio: {
    restaurante: "",
    prato: "",
    delivery: "",
    sobremesa: "",
    drink: "",
  },
  previsao: [
    { mes: "", tempo: "sol", texto: "" },
    { mes: "", tempo: "tempestade", texto: "" },
    { mes: "", tempo: "arcoiris", texto: "" },
  ],
  contrato: "",
  videoLegendas: ["", "", ""],
});

/** Endereços das fotos já enviadas, por espaço do formulário. */
export type Fotos = {
  favorita?: string;
  lugar: string[];
  mes: string[];
  caos?: string;
  antes?: string;
  depois?: string;
  mural: string[];
  comeco: (string | undefined)[];
  audio?: string;
  mesAMes: (string | undefined)[];
  videos: string[];
};

const br = (iso: string) => (iso ? iso.split("-").reverse().join("/") : "");
const linhas = (t: string) =>
  t
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
const num = (v: string) => Number(String(v).replace(/\D/g, "")) || 0;

export function montarRetro(f: Form, fotos: Fotos): Retro {
  const nivel = { basica: 0, completa: 1, inesquecivel: 2 }[f.plano];
  const desde = f.juntosDesde
    ? new Date(`${f.juntosDesde}T12:00:00`)
    : new Date(ANO, 0, 1);
  const inicioAno = new Date(ANO, 0, 1);
  const fimAno = new Date(ANO, 11, 31);
  const diasNoAno =
    Math.round(
      (+fimAno - +(desde > inicioAno ? desde : inicioAno)) / 86400000,
    ) + 1;
  const anos = Math.floor((+fimAno - +desde) / (365.25 * 86400000));
  const anoJuntos =
    anos <= 0 ? "o primeiro ano juntos" : `o ${anos + 1}º ano juntos`;
  const quem = (q: "de" | "para") => (q === "de" ? f.de : f.para);
  const outro = (q: "de" | "para") => (q === "de" ? f.para : f.de);
  const cheio = <T>(lista: T[], ok: (x: T) => boolean) =>
    nivel >= 1 ? lista.filter(ok) : [];

  const numeros = [
    { valor: Math.min(365, Math.max(1, diasNoAno)), rotulo: "dias juntos" },
    ...f.numeros
      .filter((n) => num(n.valor) && n.rotulo.trim())
      .map((n) => ({ valor: num(n.valor), rotulo: n.rotulo.trim() })),
  ];
  if (f.pet.trim()) numeros.push({ valor: 1, rotulo: `pet: ${f.pet.trim()}` });

  const fotoLugar = fotos.lugar.map((cena, k) => ({
    cena,
    legenda: ["", "", ""][k] ?? "",
  }));
  const fraseTexto = f.frase.texto.trim();

  return {
    ehExemplo: false,
    temPedido: f.extras.pedido,
    plano: f.plano,
    fotoFavorita: fotos.favorita ?? "casal",
    de: f.de.trim(),
    para: f.para.trim(),
    ano: ANO,
    juntosDesde: br(f.juntosDesde),
    juntosDesdeData: desde,
    whatsappDe: f.whatsapp,
    anoJuntos,
    numeros,
    musica: {
      titulo: f.musica.titulo.trim(),
      artista: f.musica.artista.trim(),
      detalhe: f.musica.detalhe.trim(),
      spotify: `https://open.spotify.com/search/${encodeURIComponent(`${f.musica.titulo} ${f.musica.artista}`)}`,
    },
    playlist: cheio(f.playlist, (m) => !!m.titulo.trim()).map((m) => ({
      titulo: m.titulo.trim(),
      artista: m.artista.trim(),
      momento: m.momento.trim(),
    })),
    lugar: {
      nome: f.lugar.nome.trim(),
      regiao: f.lugar.regiao.trim(),
      quando: f.lugar.quando.trim(),
      frase: f.lugar.frase.trim(),
      fotos: fotoLugar,
    },
    mesFeliz: {
      mes: Math.max(0, MESES_NOME.indexOf(f.mesFeliz.mes)),
      nome: nivel >= 1 ? f.mesFeliz.mes : "",
      frase: f.mesFeliz.frase.trim(),
      fotos: fotos.mes.map((cena) => ({ cena, legenda: "" })),
    },
    caos: {
      titulo: f.caos.titulo.trim(),
      itens:
        nivel >= 1 && f.caos.titulo.trim()
          ? f.caos.itens.map((i) => i.trim()).filter(Boolean)
          : [],
      carimbo: "Sobrevivemos",
      foto: { cena: fotos.caos ?? "mudanca", legenda: "" },
    },
    frase: {
      texto: fraseTexto,
      quem: quem(f.frase.quem),
      vezes: f.frase.vezes.trim() || "muitas vezes",
      verdade: "",
      conversa: fraseTexto
        ? [
            { de: quem(f.frase.quem), texto: fraseTexto, hora: "19:02" },
            { de: quem(f.frase.quem), texto: fraseTexto, hora: "19:41" },
            ...(f.frase.resposta.trim()
              ? [
                  {
                    de: outro(f.frase.quem),
                    texto: f.frase.resposta.trim(),
                    hora: "19:43",
                  },
                ]
              : []),
            { de: quem(f.frase.quem), texto: fraseTexto, hora: "20:15" },
          ]
        : [],
    },
    mural: nivel >= 1 ? fotos.mural.map((cena) => ({ cena, legenda: "" })) : [],
    comeco: cheio(
      f.comeco.map((m, k) => ({ ...m, foto: fotos.comeco[k] })),
      (m) => !!m.titulo.trim() && !!m.texto.trim(),
    ).map((m) => ({
      data: m.data.trim(),
      titulo: m.titulo.trim(),
      texto: m.texto.trim(),
      cena: m.foto ?? "casal",
    })),
    antesDepois: {
      antes: {
        cena: nivel >= 1 && fotos.antes ? fotos.antes : "",
        legenda: f.antesDepois.anoAntes.trim() || "antes",
      },
      depois: {
        cena: nivel >= 1 && fotos.depois ? fotos.depois : "",
        legenda: String(ANO),
      },
      frase: f.antesDepois.frase.trim(),
    },
    top5: {
      titulo: f.top5.titulo.trim(),
      itens: cheio(f.top5.itens, (i) => !!i.nome.trim()).map((i) => ({
        nome: i.nome.trim(),
        vezes: num(i.vezes) || 1,
      })),
    },
    quiz: cheio(f.quiz, (q) => !!q.pergunta.trim()).map((q) => ({
      pergunta: q.pergunta.trim(),
      resposta: quem(q.resposta),
      piada: q.piada.trim(),
    })),
    premios: cheio(
      f.premios,
      (p) => !!p.categoria.trim() && !!p.vencedor.trim(),
    ).map((p) => ({
      categoria: p.categoria.trim(),
      vencedor: p.vencedor.trim(),
      motivo: p.motivo.trim(),
    })),
    recados:
      nivel >= 2
        ? f.recados
            .filter((r) => r.de.trim() && r.texto.trim())
            .map((r) => ({
              de: r.de.trim(),
              quem: r.quem.trim(),
              texto: r.texto.trim(),
            }))
        : [],
    mesAMes:
      nivel >= 1
        ? MESES_NOME.map((mes, k) => ({
            mes,
            frase: (f.mesAMes[k] ?? "").trim(),
            cena: fotos.mesAMes[k] ?? "",
          }))
            .filter((m) => m.frase || m.cena)
            .map((m) => ({ ...m, cena: m.cena || "casal" }))
        : [],
    motivos: nivel >= 1 ? linhas(f.motivos).slice(0, 20) : [],
    primeiras: nivel >= 1 ? linhas(f.primeiras).slice(0, 8) : [],
    mapa: {
      lugares: nivel >= 1 ? linhas(f.mapaLugares).slice(0, 7) : [],
      km: num(f.mapaKm),
    },
    cardapio:
      nivel >= 1
        ? {
            restaurante: f.cardapio.restaurante.trim(),
            prato: f.cardapio.prato.trim(),
            delivery: f.cardapio.delivery.trim(),
            sobremesa: f.cardapio.sobremesa.trim(),
            drink: f.cardapio.drink.trim(),
          }
        : {
            restaurante: "",
            prato: "",
            delivery: "",
            sobremesa: "",
            drink: "",
          },
    previsao:
      nivel >= 1
        ? f.previsao
            .filter((p) => p.mes && p.texto.trim())
            .map((p) => ({ ...p, texto: p.texto.trim() }))
        : [],
    contrato: nivel >= 2 ? linhas(f.contrato).slice(0, 6) : [],
    videos:
      nivel >= 2
        ? fotos.videos.map((src, k) => ({
            src,
            legenda: (f.videoLegendas[k] ?? "").trim(),
          }))
        : [],
    sonhos: nivel >= 1 ? f.sonhos.map((s) => s.trim()).filter(Boolean) : [],
    carta: f.carta
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean),
    cartaAudio: nivel >= 2 ? (fotos.audio ?? "") : "",
    vales:
      nivel >= 2
        ? f.vales
            .filter((v) => v.titulo.trim())
            .map((v) => ({
              titulo: v.titulo.trim(),
              detalhe: v.detalhe.trim(),
            }))
        : [],
    pergunta: {
      texto: f.pergunta.trim() || `Quer passar ${ANO + 1} comigo?`,
      pedido: f.pergunta.trim(),
      resposta: "Eu sabia.",
    },
    capsula: {
      abre: new Date(`${f.capsula.abre || `${ANO + 1}-12-25`}T00:00:00`),
      abreTexto:
        nivel >= 2 && f.capsula.mensagem.trim()
          ? br(f.capsula.abre || `${ANO + 1}-12-25`)
          : "",
      mensagem: f.capsula.mensagem.trim(),
    },
    creditos: [
      ["Estrelando", `${f.de.trim()} e ${f.para.trim()}`],
      ...(f.pet.trim() ? [["Participação especial", f.pet.trim()]] : []),
      ...(f.musica.titulo.trim()
        ? [
            [
              "Trilha sonora",
              `${f.musica.titulo.trim()}${f.musica.artista.trim() ? `, ${f.musica.artista.trim()}` : ""}`,
            ],
          ]
        : []),
      ...(f.lugar.nome.trim() ? [["Locações", f.lugar.nome.trim()]] : []),
      ["Direção", "o amor de vocês"],
    ] as string[][],
  } as unknown as Retro;
}

/** Converte as datas que voltam do banco como texto em objetos Date. */
export function reviverRetro(dados: Retro): Retro {
  return {
    ...dados,
    juntosDesdeData: new Date(dados.juntosDesdeData as unknown as string),
    capsula: {
      ...dados.capsula,
      abre: new Date(dados.capsula.abre as unknown as string),
    },
  };
}
