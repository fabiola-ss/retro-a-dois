/* Fotos reais do casal do exemplo (usadas com autorização). */
import portal from "./fotos/1.jpg";
import neve from "./fotos/2.jpg";
import casa from "./fotos/3.jpg";
import antes from "./fotos/4.jpg";
import festa from "./fotos/5.jpg";
import parque from "./fotos/6.jpg";
import castelo from "./fotos/7.jpg";
import catedral from "./fotos/8.jpg";
import bar from "./fotos/9.jpg";
import shopping from "./fotos/10.jpg";
import type { Cena } from "./arte";

const c = (url: string) => url as Cena;

export const FOTOS = {
  portal: c(portal),
  neve: c(neve),
  casa: c(casa),
  antes: c(antes),
  festa: c(festa),
  parque: c(parque),
  castelo: c(castelo),
  catedral: c(catedral),
  bar: c(bar),
  shopping: c(shopping),
};
