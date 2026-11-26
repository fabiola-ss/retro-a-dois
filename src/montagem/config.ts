/* Ligação com o Supabase (banco de dados + fotos).
   Preencha com os dados do seu projeto: Supabase → Project Settings → API.
   A "anon public key" pode ficar aqui: ela é pública por natureza, e as regras
   de segurança do banco (supabase/schema.sql) é que protegem os dados.

   Enquanto estiver vazio, tudo funciona em MODO DE TESTE: os pedidos ficam
   guardados só no navegador de quem está testando. */

export const SUPABASE_URL = "https://nolpxnihzakztzcejdby.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_TiIpsJ5IKFWdQuck_zaa9A_XHk8Ttav";

/** Endereço público do site (usado para montar o link de cada Retrô). */
export const SITE = "https://fabiola-ss.github.io/retro-a-dois";
