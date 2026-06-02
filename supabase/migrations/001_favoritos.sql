# =================================================================
# Migration 001: Tabela de favoritos + RLS
#
# Como rodar:
#   1. Acesse https://supabase.com/dashboard/project/yajnnekchaemsuyriaqh/sql/new
#   2. Cole este arquivo inteiro no editor
#   3. Clique "Run" (ou Ctrl+Enter)
#   4. Verifique: Table Editor → "favoritos" deve aparecer
# =================================================================

-- Tabela de favoritos por usuário
create table if not exists public.favoritos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  hino_numero integer not null check (hino_numero between 1 and 640),
  created_at timestamptz not null default now(),
  -- Impede duplicata: 1 user só pode favoritar 1x cada hino
  unique(user_id, hino_numero)
);

-- Índice pra queries rápidas
create index if not exists idx_favoritos_user_numero
  on public.favoritos(user_id, hino_numero);

-- Habilita Row Level Security
alter table public.favoritos enable row level security;

-- Policy: user só vê os PRÓPRIOS favoritos
drop policy if exists "Users can view own favorites" on public.favoritos;
create policy "Users can view own favorites"
  on public.favoritos
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Policy: user pode inserir favoritos SÓ pra si mesmo
drop policy if exists "Users can insert own favorites" on public.favoritos;
create policy "Users can insert own favorites"
  on public.favoritos
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy: user pode deletar SÓ os próprios favoritos
drop policy if exists "Users can delete own favorites" on public.favoritos;
create policy "Users can delete own favorites"
  on public.favoritos
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- (Opcional) Trigger pra updated_at
-- Pode ser expandido depois. Mantemos created_at only por simplicidade.

-- Verificação
select
  'favoritos table created' as status,
  count(*) as rls_policies
from pg_policies
where schemaname = 'public' and tablename = 'favoritos';
