-- 016_operacional_auditoria_workspace_roadmap.sql
-- Estrutura sugerida para persistência operacional real do Radar SUS.

create table if not exists public.roadmap_itens_operacionais (
  id uuid primary key default gen_random_uuid(),
  origem text not null,
  resumo text not null,
  criticidade text,
  responsavel text,
  prazo text,
  status text default 'Pendente',
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table if not exists public.workspace_alteracoes_operacionais (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  status text,
  prioridade text,
  responsavel text,
  resumo text,
  descartado boolean default false,
  revisao boolean default false,
  atualizado_em timestamptz default now()
);

create table if not exists public.historico_operacional (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  acao text not null,
  descricao text,
  usuario_nome text,
  criado_em timestamptz default now()
);

create table if not exists public.auditoria_usuario (
  id uuid primary key default gen_random_uuid(),
  usuario_nome text not null,
  usuario_email text,
  modulo text not null,
  funcionalidade text,
  operacao text not null check (operacao in ('insert', 'update', 'delete', 'login', 'export', 'print', 'external_link', 'susi_action')),
  origem text,
  ip inet,
  registro_id text,
  dados_antes jsonb,
  dados_depois jsonb,
  observacao text,
  criado_em timestamptz default now()
);

create table if not exists public.acessos_links_externos (
  id uuid primary key default gen_random_uuid(),
  usuario_nome text not null,
  usuario_email text,
  url text not null,
  dominio text,
  origem text,
  modulo text,
  seguro boolean default false,
  confirmado boolean default false,
  ip inet,
  criado_em timestamptz default now()
);

create table if not exists public.susi_auditoria_fontes (
  id uuid primary key default gen_random_uuid(),
  usuario_nome text,
  fonte text not null,
  url text,
  tipo_acao text not null,
  documento_origem text,
  orientacao_gerada text,
  evidencia jsonb,
  criado_em timestamptz default now()
);

create index if not exists idx_roadmap_itens_status on public.roadmap_itens_operacionais(status);
create index if not exists idx_roadmap_itens_criticidade on public.roadmap_itens_operacionais(criticidade);
create index if not exists idx_workspace_alteracoes_titulo on public.workspace_alteracoes_operacionais(titulo);
create index if not exists idx_historico_operacional_titulo on public.historico_operacional(titulo);
create index if not exists idx_auditoria_usuario_modulo_operacao on public.auditoria_usuario(modulo, operacao);
create index if not exists idx_auditoria_usuario_criado_em on public.auditoria_usuario(criado_em);
create index if not exists idx_links_externos_dominio on public.acessos_links_externos(dominio);

alter table public.roadmap_itens_operacionais enable row level security;
alter table public.workspace_alteracoes_operacionais enable row level security;
alter table public.historico_operacional enable row level security;
alter table public.auditoria_usuario enable row level security;
alter table public.acessos_links_externos enable row level security;
alter table public.susi_auditoria_fontes enable row level security;
