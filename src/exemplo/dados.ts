/* Conteúdo da Retrô de exemplo (casal fictício).
   Para montar a Retrô de um cliente, basta trocar os dados deste arquivo
   (e, quando houver, trocar as cenas ilustradas pelas fotos reais). */

import type { Cena } from "./arte";

export const RETRO = {
  de: "Ana",
  para: "Leo",
  ano: 2026,
  juntosDesde: "14/02/2022",
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

  capsula: { abre: new Date(2027, 11, 25, 0, 0, 0), abreTexto: "25/12/2027" },

  creditos: [
    ["Estrelando", "Ana e Leo"],
    ["Participação especial", "Paçoca"],
    ["Trilha sonora", "Velha Infância, Tribalistas"],
    ["Locações", "Praia do Rosa, o apartamento novo e o banco do carro"],
    ["Figurino", "o moletom que ela roubou dele"],
    ["Direção", "o amor de vocês"],
  ],
};
