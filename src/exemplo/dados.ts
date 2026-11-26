/* Conteúdo da Retrô de exemplo (casal fictício).
   As Retrôs dos clientes usam este mesmo formato: o formulário em /montar/
   monta um objeto assim, e a página /r/ o carrega com usarRetro(). */

import type { Tema } from "./temas";
import { FOTOS as F } from "./fotos";

export type Plano = "basica" | "completa" | "inesquecivel";

export const EXEMPLO = {
  ehExemplo: true as boolean,
  plano: "inesquecivel" as Plano,
  fotoFavorita: F.neve,
  tema: "classico" as Tema,
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
      momento: "a estrada inteira até Pomerode",
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
    nome: "Pomerode",
    regiao: "Santa Catarina",
    quando: "julho de 2026",
    frase:
      "Onde a bateria do celular acabou no primeiro dia e, mesmo assim, foi a melhor semana do ano.",
    fotos: [
      { cena: F.portal, legenda: "o portal" },
      { cena: F.parque, legenda: "o parque, de novo" },
      { cena: F.castelo, legenda: "o castelo" },
    ],
  },

  mesFeliz: {
    mes: 6, // 0 = janeiro
    nome: "Julho",
    frase:
      "A viagem para Pomerode e o aniversário da Ana. Teve bolo, teve frio e teve muita risada.",
    fotos: [
      { cena: F.neve, legenda: "neve!" },
      { cena: F.festa, legenda: "o aniversário" },
      { cena: F.parque, legenda: "o parque" },
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
    foto: { cena: F.chave, legenda: "a chave da casa nova" },
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
    { cena: F.casa, legenda: "domingo em casa" },
    { cena: F.maos, legenda: "de mãos dadas" },
    { cena: F.pacoca, legenda: "o dia em que o Paçoca chegou" },
    { cena: F.formatura, legenda: "a formatura dela" },
    { cena: F.anel, legenda: "o anel" },
    { cena: F.beijo, legenda: "a gente" },
  ],

  comeco: [
    {
      data: "março de 2021",
      titulo: "O primeiro encontro",
      texto: "Um café que virou jantar, que virou cinco horas de conversa.",
      cena: F.antes,
    },
    {
      data: "setembro de 2021",
      titulo: "O primeiro \u201ceu te amo\u201d",
      texto: "Dito sem querer, no meio de um filme. Ninguém lembra do filme.",
      cena: F.bar,
    },
    {
      data: "fevereiro de 2022",
      titulo: "Começamos a namorar",
      texto: "No dia 14, porque a Ana achava clichê e o Leo achava perfeito.",
      cena: F.shopping,
    },
    {
      data: "março de 2026",
      titulo: "A casa nova",
      texto: "Um sofá, duas escovas de dente e o Paçoca.",
      cena: F.chave,
    },
  ],

  antesDepois: {
    antes: { cena: F.antes, legenda: "2021" },
    depois: { cena: F.festa, legenda: "2026" },
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

  mesAMes: [
    {
      mes: "Janeiro",
      frase: "Férias em São Paulo e a promessa de viajar mais.",
      cena: F.catedral,
    },
    {
      mes: "Fevereiro",
      frase: "Quatro anos de namoro e um beijo que ainda dá frio na barriga.",
      cena: F.beijo,
    },
    {
      mes: "Março",
      frase: "A mudança. A geladeira. O sofá. A gente sobreviveu.",
      cena: F.chave,
    },
    {
      mes: "Abril",
      frase: "O Paçoca chegou e virou o dono da casa.",
      cena: F.pacoca,
    },
    {
      mes: "Maio",
      frase: "Passeio de domingo, de mãos dadas, sem pressa.",
      cena: F.maos,
    },
    {
      mes: "Junho",
      frase: "O casamento da Júlia. A Ana pegou o buquê.",
      cena: F.festa2,
    },
    {
      mes: "Julho",
      frase: "Pomerode, a neve e o aniversário da Ana.",
      cena: F.neve,
    },
    {
      mes: "Agosto",
      frase: "Volta à rotina, com saudade de Pomerode.",
      cena: F.portal,
    },
    {
      mes: "Setembro",
      frase: "Primavera e um dia inteiro no parque.",
      cena: F.parque,
    },
    {
      mes: "Outubro",
      frase: "A formatura da Ana. Teve beca, teve choro e teve festa.",
      cena: F.formatura,
    },
    {
      mes: "Novembro",
      frase: "As alianças chegaram. O resto ainda é segredo.",
      cena: F.aliancas,
    },
    {
      mes: "Dezembro",
      frase: "E chegou a hora de lembrar de tudo isso.",
      cena: F.festa,
    },
  ],

  motivos: [
    "o jeito que você canta errado no carro",
    "o seu café de domingo",
    "você rir das minhas piadas sem graça",
    "você segurar minha mão no avião",
    "o seu abraço depois de um dia ruim",
    "você lembrar do meu pedido no delivery",
    "o jeito que você fala com o Paçoca",
    "você me esperar mesmo quando eu digo 'já tô chegando'",
    "a sua paciência com a minha bagunça",
    "você ser a minha casa, em qualquer lugar",
    "o seu cheiro no moletom que eu roubei",
    "você acreditar em mim antes de eu mesma acreditar",
  ],

  primeiras: [
    "Primeira viagem só nós dois",
    "Primeiro apartamento juntos",
    "Primeiro Natal com a família dele",
    "Primeira planta que não morreu",
    "Primeira briga por causa do ar-condicionado",
    "Primeiro bichinho da família",
  ],

  mapa: {
    lugares: ["São Paulo", "Campos do Jordão", "Pomerode", "Penha", "Paraty"],
    km: 2340,
  },

  cardapio: {
    restaurante: "o japonês da esquina",
    prato: "lasanha (quase) perfeita do Leo",
    delivery: "pizza de calabresa, sem cebola para a Ana",
    sobremesa: "brigadeiro de panela no sofá",
    drink: "café passado às 7h da manhã",
  },

  previsao: [
    {
      mes: "Fevereiro",
      tempo: "sol",
      texto: "Ensolarado, com pancadas de ciúme no fim da tarde.",
    },
    {
      mes: "Março",
      tempo: "tempestade",
      texto: "Tempestade de caixas de mudança. Alerta de sofá preso na porta.",
    },
    {
      mes: "Julho",
      tempo: "arcoiris",
      texto: "Neve em Pomerode. Índice de felicidade: máximo.",
    },
    {
      mes: "Outubro",
      tempo: "nublado",
      texto: "Nublado com chance de lasanha queimada.",
    },
  ],

  contrato: [
    "Lavar a louça às terças e quintas, sem reclamar.",
    "Não dar spoiler da série que estamos vendo juntos.",
    "Dividir a última fatia de pizza, sempre.",
    "Uma viagem nova por ano, nem que seja para a cidade vizinha.",
    "Dizer 'eu te amo' antes de dormir, mesmo brigados.",
  ],

  videos: [
    { src: "../videos/praia.mp4", legenda: "o primeiro mergulho do ano" },
    { src: "../videos/pacoca.mp4", legenda: "o Paçoca conhecendo a casa" },
  ] as { src: string; legenda: string }[],

  sonhos: [
    "Ver a neve de novo",
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
    ["Locações", "Pomerode, o apartamento novo e o banco do carro"],
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
