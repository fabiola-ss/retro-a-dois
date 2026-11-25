-- Retrô a Dois: banco de dados da montagem automática.
-- Cole tudo isto em Supabase → SQL Editor → New query → Run. Rode uma vez só.

-- 1. Tabela de pedidos ---------------------------------------------------------

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  criado_em timestamptz not null default now(),
  status text not null default 'novo' check (status in ('novo', 'pronto', 'enviado')),
  plano text not null check (plano in ('basica', 'completa', 'inesquecivel')),
  cliente_nome text,
  cliente_whatsapp text,
  cliente_email text,
  dados jsonb not null
);

alter table public.pedidos enable row level security;

-- O cliente (sem login) só pode CRIAR um pedido novo. Não consegue ler nem listar nada.
drop policy if exists "cliente envia pedido" on public.pedidos;
create policy "cliente envia pedido" on public.pedidos
  for insert to anon with check (status = 'novo');

-- Você (logada no painel) vê e atualiza tudo.
drop policy if exists "admin le" on public.pedidos;
create policy "admin le" on public.pedidos
  for select to authenticated using (true);

drop policy if exists "admin atualiza" on public.pedidos;
create policy "admin atualiza" on public.pedidos
  for update to authenticated using (true);

-- 2. Quem tem o link vê só AQUELA Retrô, e só depois que você aprovar ----------

create or replace function public.ver_retro(p_slug text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object('slug', slug, 'plano', plano, 'status', status, 'dados', dados)
  from public.pedidos
  where slug = p_slug and status in ('pronto', 'enviado');
$$;

grant execute on function public.ver_retro(text) to anon;

-- 3. Fotos e áudios ------------------------------------------------------------
-- Pasta pública com nomes impossíveis de adivinhar: quem tem o link da foto
-- consegue abrir, mas ninguém consegue listar as fotos da pasta.

insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

drop policy if exists "cliente sobe fotos" on storage.objects;
create policy "cliente sobe fotos" on storage.objects
  for insert to anon with check (bucket_id = 'fotos');
