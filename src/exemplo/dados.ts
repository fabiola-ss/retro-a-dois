/* Conteúdo da Retrô de exemplo (casal fictício).
   As Retrôs dos clientes usam este mesmo formato: o formulário em /montar/
   monta um objeto assim, e a página /r/ o carrega com usarRetro(). */

import type { Cena } from "./arte";

export type Plano = "basica" | "completa" | "inesquecivel";

export const EXEMPLO = {
  ehExemplo: true as boolean,
  plano: "inesquecivel" as Plano,
  fotoFavorita: "casal" as Cena,
  /* comprou o extra do pedido de namoro/casamento */
  temPedido: false as boolean,
  de: "Ana",
  para: "Leo",
  ano: 2026,
  juntosDesde: "14/02/2022",
  juntosDesdeData: new Date(2022, 1, 14, 20, 0, 0),
  /* WhatsApp de quem deu o presente, para receber a resposta (vazio = escolher contato) */
  whatsappDe: "",
  anoJuntos: "o 4º ano juntos",

  numeros: [
    { valor: 365, rotulo: "dias juntos" },
    { valor: 1284, rotulo: "fotos no rolo da câmera" },
    { valor: 3, rotulo: "viagens" },
    { valor: 47, rotulo: "cafés da manhã de domingo" },
    { valor: 1, rotulo: "cachorro adotado: o Paçoca" },
  ],

  musica: {
    titulo: "Velha Infância",
    artista: "Tribalistas",
    detalhe: "Tocou 312 vezes no carro. Ninguém pulou nenhuma.",
    spotify:
      "https://open.spotify.com/search/Velha%20Inf%C3%A2ncia%20Tribalistas",
  },

  playlist: [
    {
      titulo: "Velha Infância",
      artista: "Tribalistas",
      momento: "a estrada inteira até o Rosa",
    },
    {
      titulo: "Trem-Bala",
      artista: "Ana Vilela",
      momento: "a primeira noite na casa nova",
    },
    {
      titulo: "Ainda Bem",
      artista: "Marisa Monte",
      momento: "o jantar surpresa de julho",
    },
    {
      titulo: "Sutilmente",
      artista: "Skank",
      momento: "o karaokê no aniversário da Ana",
    },
    {
      titulo: "Do Seu Lado",
      artista: "Jota Quest",
      momento: "a que o Leo canta errado",
    },
  ],

  lugar: {
    nome: "Praia do Rosa",
    regiao: "Santa Catarina",
    quando: "julho de 2026",
    frase:
      "Onde o celular caiu no mar e, mesmo assim, foi a melhor semana do ano.",
    fotos: [
      { cena: "praia" as Cena, legenda: "primeiro mergulho" },
      { cena: "praia-por-do-sol" as Cena, legenda: "o pôr do sol" },
      { cena: "estrada" as Cena, legenda: "a estrada até lá" },
    ],
  },

  mesFeliz: {
    mes: 6, // 0 = janeiro
    nome: "Julho",
    frase:
      "A viagem para o Rosa e o aniversário da Ana. Teve bolo, teve mar e teve muita risada.",
    fotos: [
      { cena: "aniversario" as Cena, legenda: "o bolo torto" },
      { cena: "jantar" as Cena, legenda: "jantar surpresa" },
      { cena: "praia" as Cena, legenda: "Rosa, de novo" },
    ],
  },

  caos: {
    titulo: "A mudança de março",
    itens: [
      "3 dias sem geladeira",
      "1 sofá que não passou na porta",
      "1 pizza comida no chão da sala",
      "0 brigas sérias (quase)",
    ],
    carimbo: "Sobrevivemos",
    foto: { cena: "mudanca" as Cena, legenda: "a mudança" },
  },

  frase: {
    texto: "Já tô chegando.",
    quem: "Ana",
    vezes: "umas 200 vezes",
    verdade: "Vezes em que era verdade: 0.",
    conversa: [
      { de: "Ana", texto: "Já tô chegando!", hora: "19:02" },
      { de: "Ana", texto: "Já tô chegando, juro", hora: "19:41" },
      {
        de: "Leo",
        texto: "Ana, a sua localização ainda mostra a sua casa",
        hora: "19:43",
      },
      { de: "Ana", texto: "Já tô chegando.", hora: "20:15" },
    ],
  },

  mural: [
    { cena: "cafe" as Cena, legenda: "domingo" },
    { cena: "pacoca" as Cena, legenda: "o dia em que o Paçoca chegou" },
    { cena: "cidade" as Cena, legenda: "noite na cidade" },
    { cena: "sofa" as Cena, legenda: "maratona de série" },
    { cena: "natal" as Cena, legenda: "Natal passado" },
    { cena: "casal" as Cena, legenda: "a gente" },
  ],

  comeco: [
    {
      data: "março de 2021",
      titulo: "O primeiro encontro",
      texto: "Um café que virou jantar, que virou cinco horas de conversa.",
      cena: "cafe" as Cena,
    },
    {
      data: "setembro de 2021",
      titulo: "O primeiro \u201ceu te amo\u201d",
      texto: "Dito sem querer, no meio de um filme. Ninguém lembra do filme.",
      cena: "sofa" as Cena,
    },
    {
      data: "fevereiro de 2022",
      titulo: "Começamos a namorar",
      texto: "No dia 14, porque a Ana achava clichê e o Leo achava perfeito.",
      cena: "jantar" as Cena,
    },
    {
      data: "março de 2026",
      titulo: "A casa nova",
      texto: "Um sofá, duas escovas de dente e o Paçoca.",
      cena: "mudanca" as Cena,
    },
  ],

  antesDepois: {
    antes: { cena: "cidade" as Cena, legenda: "2021" },
    depois: { cena: "casal" as Cena, legenda: "2026" },
    frase: "Cinco anos depois, o mesmo sorriso. O cabelo do Leo, nem tanto.",
  },

  top5: {
    titulo: "Os apelidos mais usados",
    itens: [
      { nome: "Mozão", vezes: 1840 },
      { nome: "Vida", vezes: 1210 },
      { nome: "Neném", vezes: 760 },
      { nome: "Paçoquinha (era do cachorro)", vezes: 410 },
      { nome: "Ei, você", vezes: 95 },
    ],
  },

  quiz: [
    {
      pergunta: "Quem dorme primeiro no filme?",
      resposta: "Leo",
      piada: "Em 9 de cada 10 filmes. O décimo era de terror.",
    },
    {
      pergunta: "Quem esquece onde deixou a chave?",
      resposta: "Ana",
      piada: "Ela sempre está na bolsa. Sempre.",
    },
    {
      pergunta: "Quem pede desculpa primeiro?",
      resposta: "Leo",
      piada: "Mas é a Ana que manda o meme que faz as pazes.",
    },
    {
      pergunta: "Quem escolhe o restaurante?",
      resposta: "Ana",
      piada: "Depois de 40 minutos de \u201ctanto faz\u201d.",
    },
  ],

  premios: [
    {
      categoria: "Melhor cozinheiro",
      vencedor: "Leo",
      motivo: "pela lasanha que quase deu certo",
    },
    {
      categoria: "Pior DJ do carro",
      vencedor: "Ana",
      motivo: "312 vezes a mesma música",
    },
    {
      categoria: "Maior drama por um mosquito",
      vencedor: "Os dois",
      motivo: "às 3h da manhã, de chinelo na mão",
    },
    {
      categoria: "Melhor companhia",
      vencedor: "Paçoca",
      motivo: "foi ele que adotou vocês",
    },
  ],

  recados: [
    {
      de: "Júlia",
      quem: "irmã da Ana",
      texto:
        "Vocês são o casal mais caótico e mais lindo que eu conheço. Obrigada por me deixarem segurar vela em todas as viagens.",
    },
    {
      de: "Rafa",
      quem: "melhor amigo do Leo",
      texto: "Leo, nunca te vi tão feliz. Ana, cuida dele. E do Paçoca.",
    },
    {
      de: "Dona Célia",
      quem: "mãe do Leo",
      texto:
        "Que essa casa nova seja cheia de amor. E de netos! Mas sem pressa.",
    },
  ],

  vales: [
    { titulo: "Um café na cama", detalhe: "com pão de queijo" },
    { titulo: "Uma massagem", detalhe: "de 20 minutos, sem reclamar" },
    { titulo: "Um jantar", detalhe: "no restaurante que você escolher" },
  ],

  pergunta: {
    texto: "Quer passar 2027 comigo?",
    pedido: "Leo, quer casar comigo?",
    resposta: "Eu sabia.",
  },

  sonhos: [
    "Conhecer a neve juntos",
    "Acertar a receita da lasanha",
    "Um irmão para o Paçoca",
  ],

  carta: [
    "Leo,",
    "se eu pudesse escolher de novo cada dia desse ano, escolheria você em todos. Até no da geladeira quebrada.",
    "Obrigada por rir comigo quando tudo dá errado e por segurar minha mão quando dá certo.",
    "2026 foi nosso. Que 2027 seja ainda mais.",
    "Te amo.",
  ],

  /* áudio gravado por quem deu o presente (ex.: "./audio-carta.m4a").
     Vazio no exemplo: uma voz do próprio aparelho lê a carta. */
  cartaAudio: "" as string,

  capsula: {
    abre: new Date(2027, 11, 25, 0, 0, 0),
    abreTexto: "25/12/2027",
    mensagem: "" as string,
  },

  creditos: [
    ["Estrelando", "Ana e Leo"],
    ["Participação especial", "Paçoca"],
    ["Trilha sonora", "Velha Infância, Tribalistas"],
    ["Locações", "Praia do Rosa, o apartamento novo e o banco do carro"],
    ["Figurino", "o moletom que ela roubou dele"],
    ["Direção", "o amor de vocês"],
  ],
};

export type Retro = typeof EXEMPLO;

/** Os dados que a Retrô está mostrando agora (o exemplo ou a de um cliente). */
export let RETRO: Retro = EXEMPLO;

export function usarRetro(dados: Retro) {
  RETRO = dados;
}
