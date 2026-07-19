# Radar SUS Frontend MVP

Frontend inicial da POC vendável do Radar SUS.

## Status desta versão

- Layout principal com menu lateral.
- Telas-resumo dos módulos principais.
- Painel contextual direito.
- Dados demonstrativos como fallback.
- Integração preparada com Supabase via `.env`.
- Leitura inicial das views:
  - `vw_radar_dashboard`
  - `vw_alertas_pendentes`
  - `vw_documentos_base`
  - `vw_impactos_produto`
  - `vw_decisoes_po`
  - `vw_universe_poc_atendimentos`
  - `clientes_contratantes`

## Rodar localmente

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Abra:

```text
http://localhost:5173/
```

## Configurar Supabase

Edite o arquivo `.env` e preencha as publishable keys dos projetos.

```env
VITE_SUPABASE_UNIVERSO_URL=https://ejclkqscqutvhtutextc.supabase.co
VITE_SUPABASE_UNIVERSO_ANON_KEY=cole_a_publishable_key_do_universo_conectasus

VITE_SUPABASE_POC_URL=https://yjazpxdyitevivbxnmfm.supabase.co
VITE_SUPABASE_POC_ANON_KEY=cole_a_publishable_key_do_universe_poc
```

Se o Supabase não estiver configurado ou a política RLS bloquear leitura pública, o sistema mantém os dados demonstrativos e exibe o aviso `Usando dados demonstrativos`.

## Próximos passos

1. Implementar autenticação Supabase.
2. Trocar fallback mock por dados reais após login.
3. Criar ações dos botões internos.
4. Criar detalhes das funcionalidades por módulo.
5. Criar Configurações > Perfil e Aparência.


## Versão v3 — listas reais no dashboard

Esta versão mantém a integração Supabase da v2 e passa a usar dados reais também nas listas do Dashboard:

- `vw_alertas_pendentes` para **Últimos alertas**
- `vw_impactos_produto` para **Impactos recentes**
- `vw_radar_dashboard` para os cards executivos

A tela continua com fallback demonstrativo se alguma consulta falhar.


## Versão v4 — Impactos no Produto conectado

A tela **Impactos no Produto** passa a usar dados reais da view:

- `vw_impactos_produto`

A tela calcula indicadores a partir dos registros carregados e mantém fallback demonstrativo caso a consulta falhe.


## Versão v5 — Base de Conhecimento conectada

A tela **Base de Conhecimento** passa a exibir melhor os documentos reais vindos da view:

- `vw_documentos_base`

A alteração melhora:
- indicadores da base;
- tabela de documentos monitorados;
- tags e status;
- prévia do documento selecionado;
- preparação visual para as futuras áreas de Fontes, Curadoria e Conectores Externos.

A conexão com fontes externas reais permanece no roadmap e não faz parte desta versão do frontend.


## Versão v6 — Central de Atendimento conectada

A tela **Central de Atendimento** passa a usar dados reais da view:

- `vw_universe_poc_atendimentos`

A alteração melhora:
- indicadores de atendimentos;
- tickets externos vinculados;
- canais ativos;
- tabela de acompanhamento;
- prévia do atendimento selecionado.

Esta versão ainda não executa ações reais nos botões internos.


## Versão v7 — Configurações conectada

A tela **Configurações** passa a usar dados reais do projeto `universe-poc`:

- `clientes_contratantes`
- `integracoes`
- `usuarios_sistema`

A alteração inclui:
- indicadores de clientes, integrações, usuários e ambientes;
- tabela de clientes;
- tabela de integrações;
- tabela de usuários;
- nota de roadmap para perfil, aparência, permissões e conectores externos.


## Correção v7.1 — Configurações

Corrige a tela **Configurações** para usar corretamente o cliente Supabase POC já configurado no frontend.

Correção:
- resolve erro `getPocClient is not defined`;
- mantém fallback demonstrativo;
- preserva a leitura de clientes, integrações e usuários.


## Correção v7.2 — Configurações por views

A tela **Configurações** passa a consumir views próprias do frontend, em vez de consultar tabelas brutas:

- `vw_frontend_config_clientes`
- `vw_frontend_config_integracoes`
- `vw_frontend_config_usuarios`

Isso mantém a estratégia de segurança: o frontend lê views controladas, sem abrir acesso direto às tabelas internas.


## Correção v7.3 — Configurações sem tela branca

Corrige a tela **Configurações** para proteger listas antes de usar `.filter()`, `.map()` e `.length`.

Correção:
- evita tela branca quando uma consulta retorna `undefined`;
- mantém fallback demonstrativo;
- preserva uso das views de configuração.


## Correção v7.4 — Configurações conectando nas views

Corrige a camada `radarApi.ts` e `supabase.ts` para a tela **Configurações** consumir diretamente:

- `vw_frontend_config_clientes`
- `vw_frontend_config_integracoes`
- `vw_frontend_config_usuarios`

Também mantém proteção contra tela branca caso alguma consulta falhe.


## Correção v7.5 — Compatibilidade Supabase

Corrige a compatibilidade interna da camada de API:

- mantém `universoSupabase` e `pocSupabase`;
- restaura aliases `supabaseUniverso` e `supabasePoc` usados pelas telas já conectadas;
- evita retorno para dados demonstrativos por erro de variável indefinida;
- preserva as views de Configurações.


## Correção v7.6 — Indicador Supabase em Configurações

Corrige as funções de Configurações para retornarem o mesmo formato usado pelas demais telas:

- `{ data, source, error }`

Com isso, a tela Configurações passa a exibir corretamente **Dados conectados ao Supabase** quando as views responderem.
