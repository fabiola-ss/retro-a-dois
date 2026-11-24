# Retrô a Dois

Página de vendas da Retrô a Dois, a retrospectiva interativa do casal.

Link publicado: https://fabiola-ss.github.io/retro-a-dois/

## Onde fica cada coisa

| Arquivo | O que tem |
|---|---|
| `src/RetroPage.tsx` | Todo o conteúdo da página: textos, planos, perguntas frequentes. |
| `src/retro.css` | Cores, fontes e layout. |
| `src/index.html` | Título e descrição da página (o que aparece no Google e ao compartilhar o link). |
| `docs/` | A versão publicada, gerada pelo build. Não edite à mão. |
| `copy-retro-a-dois.md` | A copy da página, para consulta. |

## Links de checkout

No topo de `src/RetroPage.tsx`, troque `#planos` pelo link de cada plano:

```ts
const CHECKOUT = {
  basica: "#planos",
  completa: "#planos",
  inesquecivel: "#planos",
};
```

## Atualizar a página publicada

Depois de qualquer mudança em `src/`:

```bash
npm install
npm run build
```

Faça o commit, incluindo a pasta `docs/`. O GitHub Pages atualiza o link em 1 a 2 minutos.

Para ver a página no seu computador enquanto edita: `npm run dev`.
