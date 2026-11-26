# Retrô a Dois

Página de vendas da Retrô a Dois, a retrospectiva interativa do casal.

Link publicado: https://fabiola-ss.github.io/retro-a-dois/

Retrô de exemplo: https://fabiola-ss.github.io/retro-a-dois/exemplo/

## Páginas

| Endereço | Para quem | O que é |
|---|---|---|
| `/` | público | Página de vendas |
| `/exemplo/` | público | Retrô completa de exemplo (Ana e Leo) |
| `/montar/?plano=basica` · `completa` · `inesquecivel` | cliente, depois de pagar | Formulário: fotos, respostas e áudio |
| `/r/?id=…` | o casal | A Retrô de cada cliente (só abre depois de aprovada) |
| `/painel/` | você | Pedidos: revisar, aprovar, enviar no WhatsApp, convite com QR |

## Montagem automática: como funciona

1. O cliente compra na Kiwify e recebe o link do formulário do plano dele.
2. Preenche o formulário. As fotos e o áudio vão para o Supabase e a Retrô é montada sozinha.
3. No `/painel/`, o pedido aparece como **Novo**. Confira na Kiwify se o e-mail pagou, clique em **Revisar** para ver a Retrô e depois em **Aprovar**.
4. Clique em **Enviar no WhatsApp**: abre a conversa com o cliente, com a mensagem e o link prontos.
5. No plano Inesquecível, **Convite com QR** baixa o convite para imprimir.

Enquanto o Supabase não estiver configurado, tudo funciona em **modo de teste**: os pedidos ficam guardados só no navegador de quem testou.

## Configurar o Supabase (uma vez só)

1. Crie uma conta em https://supabase.com e um projeto novo (região **South America (São Paulo)**). Guarde a senha do banco.
2. No menu **SQL Editor**, clique em **New query**, cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Authentication → Users → Add user**, crie o seu usuário (seu e-mail e uma senha). É com ele que você entra no painel.
4. Em **Authentication → Sign In / Providers**, desligue **Allow new users to sign up**, para ninguém mais criar conta.
5. Em **Project Settings → API**, copie a **Project URL** e a **anon public key** e cole em `src/montagem/config.ts`. Depois rode `npm run build` e faça o commit (ou peça para o Claude).

## Configurar a Kiwify

Em cada um dos 3 produtos, use como link de entrega (e de redirecionamento depois da compra):

- Básica: `https://fabiola-ss.github.io/retro-a-dois/montar/?plano=basica`
- Completa: `https://fabiola-ss.github.io/retro-a-dois/montar/?plano=completa`
- Inesquecível: `https://fabiola-ss.github.io/retro-a-dois/montar/?plano=inesquecivel`

## Onde fica cada coisa

| Arquivo | O que tem |
|---|---|
| `src/RetroPage.tsx` | Todo o conteúdo da página: textos, planos, perguntas frequentes. |
| `src/retro.css` | Cores, fontes e layout. |
| `src/index.html` | Título e descrição da página (o que aparece no Google e ao compartilhar o link). |
| `src/montagem/` | Formulário, painel e ligação com o Supabase (`config.ts`). |
| `supabase/schema.sql` | Estrutura do banco de dados e regras de segurança. |
| `src/exemplo/` | A Retrô completa de exemplo (Ana e Leo). O conteúdo fica em `src/exemplo/dados.ts`; os desenhos em `src/exemplo/arte.tsx`. |
| `docs/` | A versão publicada, gerada pelo build. Não edite à mão. |
| `copy-retro-a-dois.md` | A copy da página, para consulta. |

## Links de checkout

No topo de `src/RetroPage.tsx`, troque `#planos` pelo link de cada plano:

```ts
const CHECKOUT = {
  basica: "https://pay.kiwify.com.br/JSrFo7E",
  completa: "https://pay.kiwify.com.br/jSjdHtY",
  inesquecivel: "https://pay.kiwify.com.br/2XCZkSk",
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
