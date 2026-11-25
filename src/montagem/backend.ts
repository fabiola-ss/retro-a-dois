/* Onde os pedidos e as fotos ficam guardados.
   - Com o Supabase configurado (config.ts): banco de dados + armazenamento.
   - Sem configuração: modo de teste, tudo no próprio navegador (IndexedDB). */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export type Status = "novo" | "pronto" | "enviado";

export type Pedido = {
  slug: string;
  criado_em: string;
  status: Status;
  plano: string;
  cliente_nome: string;
  cliente_whatsapp: string;
  cliente_email: string;
  dados: unknown;
};

export const modoTeste = !SUPABASE_URL || !SUPABASE_ANON_KEY;

let _sb: SupabaseClient | null = null;
const sb = () => (_sb ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY));

/** Código aleatório e difícil de adivinhar para o link de cada Retrô. */
export function novoSlug(nome: string) {
  const base = nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const cod = Array.from(
    bytes,
    (b) => "abcdefghjkmnpqrstuvwxyz23456789"[b % 31],
  ).join("");
  return `${base || "retro"}-${cod}`;
}

/* ------------------------------ modo de teste ------------------------------ */

function idb(): Promise<IDBDatabase> {
  return new Promise((ok, erro) => {
    const r = indexedDB.open("retro-a-dois-teste", 1);
    r.onupgradeneeded = () => {
      r.result.createObjectStore("pedidos", { keyPath: "slug" });
      r.result.createObjectStore("arquivos");
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => erro(r.error);
  });
}

async function idbFazer<T>(
  loja: string,
  modo: IDBTransactionMode,
  f: (s: IDBObjectStore) => IDBRequest<T>,
) {
  const db = await idb();
  return new Promise<T>((ok, erro) => {
    const req = f(db.transaction(loja, modo).objectStore(loja));
    req.onsuccess = () => ok(req.result);
    req.onerror = () => erro(req.error);
  });
}

/* ---------------------------------- API ---------------------------------- */

/** Sobe uma foto ou áudio e devolve o endereço para usar na Retrô. */
export async function subirArquivo(
  slug: string,
  nome: string,
  arquivo: Blob,
): Promise<string> {
  const caminho = `${slug}/${nome}`;
  if (modoTeste) {
    await idbFazer("arquivos", "readwrite", (s) => s.put(arquivo, caminho));
    return `idb:${caminho}`;
  }
  const { error } = await sb()
    .storage.from("fotos")
    .upload(caminho, arquivo, { contentType: arquivo.type, upsert: false });
  if (error) throw error;
  return sb().storage.from("fotos").getPublicUrl(caminho).data.publicUrl;
}

/** No modo de teste, troca os endereços "idb:" por links locais das fotos. */
export async function resolverArquivos<T>(dados: T): Promise<T> {
  if (!modoTeste) return dados;
  const texto = JSON.stringify(dados);
  const caminhos = [...new Set(texto.match(/idb:[^"]+/g) ?? [])];
  let out = texto;
  for (const c of caminhos) {
    const blob = await idbFazer<Blob | undefined>("arquivos", "readonly", (s) =>
      s.get(c.slice(4)),
    );
    if (blob) out = out.split(c).join(URL.createObjectURL(blob));
  }
  return JSON.parse(out) as T;
}

export async function enviarPedido(p: Omit<Pedido, "criado_em" | "status">) {
  const pedido: Pedido = {
    ...p,
    criado_em: new Date().toISOString(),
    status: "novo",
  };
  if (modoTeste) {
    await idbFazer("pedidos", "readwrite", (s) => s.put(pedido));
    return;
  }
  const { error } = await sb().from("pedidos").insert({
    slug: pedido.slug,
    status: "novo",
    plano: pedido.plano,
    cliente_nome: pedido.cliente_nome,
    cliente_whatsapp: pedido.cliente_whatsapp,
    cliente_email: pedido.cliente_email,
    dados: pedido.dados,
  });
  if (error) throw error;
}

/** Para a página da Retrô: só devolve Retrôs já aprovadas (ou qualquer uma para a admin logada). */
export async function lerRetro(slug: string): Promise<Pedido | null> {
  if (modoTeste) {
    const p = await idbFazer<Pedido | undefined>("pedidos", "readonly", (s) =>
      s.get(slug),
    );
    return p ?? null;
  }
  const { data: sessao } = await sb().auth.getSession();
  if (sessao.session) {
    const { data } = await sb()
      .from("pedidos")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    return (data as Pedido) ?? null;
  }
  const { data, error } = await sb().rpc("ver_retro", { p_slug: slug });
  if (error || !data) return null;
  return data as Pedido;
}

export async function listarPedidos(): Promise<Pedido[]> {
  if (modoTeste) {
    const todos = await idbFazer<Pedido[]>("pedidos", "readonly", (s) =>
      s.getAll(),
    );
    return todos.sort((a, b) => b.criado_em.localeCompare(a.criado_em));
  }
  const { data, error } = await sb()
    .from("pedidos")
    .select(
      "slug, criado_em, status, plano, cliente_nome, cliente_whatsapp, cliente_email, dados",
    )
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data as Pedido[]) ?? [];
}

export async function mudarStatus(slug: string, status: Status) {
  if (modoTeste) {
    const p = await idbFazer<Pedido | undefined>("pedidos", "readonly", (s) =>
      s.get(slug),
    );
    if (p)
      await idbFazer("pedidos", "readwrite", (s) => s.put({ ...p, status }));
    return;
  }
  const { error } = await sb()
    .from("pedidos")
    .update({ status })
    .eq("slug", slug);
  if (error) throw error;
}

export async function entrar(email: string, senha: string) {
  if (modoTeste) return;
  const { error } = await sb().auth.signInWithPassword({
    email,
    password: senha,
  });
  if (error) throw error;
}

export async function sair() {
  if (!modoTeste) await sb().auth.signOut();
}

export async function logada(): Promise<boolean> {
  if (modoTeste) return true;
  const { data } = await sb().auth.getSession();
  return !!data.session;
}
