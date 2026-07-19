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
5. Criar Parametrização > Perfil e Aparência.


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


## Versão v7 — Parametrização conectada

A tela **Parametrização** passa a usar dados reais do projeto `universe-poc`:

- `clientes_contratantes`
- `integracoes`
- `usuarios_sistema`

A alteração inclui:
- indicadores de clientes, integrações, usuários e ambientes;
- tabela de clientes;
- tabela de integrações;
- tabela de usuários;
- nota de roadmap para perfil, aparência, permissões e conectores externos.


## Correção v7.1 — Parametrização

Corrige a tela **Parametrização** para usar corretamente o cliente Supabase POC já configurado no frontend.

Correção:
- resolve erro `getPocClient is not defined`;
- mantém fallback demonstrativo;
- preserva a leitura de clientes, integrações e usuários.


## Correção v7.2 — Parametrização por views

A tela **Parametrização** passa a consumir views próprias do frontend, em vez de consultar tabelas brutas:

- `vw_frontend_config_clientes`
- `vw_frontend_config_integracoes`
- `vw_frontend_config_usuarios`

Isso mantém a estratégia de segurança: o frontend lê views controladas, sem abrir acesso direto às tabelas internas.


## Correção v7.3 — Parametrização sem tela branca

Corrige a tela **Parametrização** para proteger listas antes de usar `.filter()`, `.map()` e `.length`.

Correção:
- evita tela branca quando uma consulta retorna `undefined`;
- mantém fallback demonstrativo;
- preserva uso das views de configuração.


## Correção v7.4 — Parametrização conectando nas views

Corrige a camada `radarApi.ts` e `supabase.ts` para a tela **Parametrização** consumir diretamente:

- `vw_frontend_config_clientes`
- `vw_frontend_config_integracoes`
- `vw_frontend_config_usuarios`

Também mantém proteção contra tela branca caso alguma consulta falhe.


## Correção v7.5 — Compatibilidade Supabase

Corrige a compatibilidade interna da camada de API:

- mantém `universoSupabase` e `pocSupabase`;
- restaura aliases `supabaseUniverso` e `supabasePoc` usados pelas telas já conectadas;
- evita retorno para dados demonstrativos por erro de variável indefinida;
- preserva as views de Parametrização.


## Correção v7.6 — Indicador Supabase em Parametrização

Corrige as funções de Parametrização para retornarem o mesmo formato usado pelas demais telas:

- `{ data, source, error }`

Com isso, a tela Parametrização passa a exibir corretamente **Dados conectados ao Supabase** quando as views responderem.


## Versão v9 — Detalhe expandido em modal

Evolui o painel lateral dinâmico para permitir abrir o item selecionado em uma visão expandida.

Inclui:
- botão **Abrir detalhe** no painel lateral;
- modal grande no estilo ferramenta de gestão/Jira;
- abas de Resumo, Histórico, Vínculos, Ações e Anexos;
- área de informações principais;
- linha do tempo;
- ações rápidas;
- botão visual **Abrir em aba** preparado para evolução futura.

Nesta versão, o modal é visual e contextual. As abas e ações ainda não executam fluxo real.


## Correção v9.1 — Ajuste de import em Parametrização

Corrige erro de parse em `src/pages/Configuracoes.tsx`, onde o import de `PageProps` havia sido inserido dentro de um import já aberto.

Correção:
- reposiciona `import type { PageProps } from '../App';`
- preserva modal de detalhe expandido
- preserva painel lateral dinâmico


## Correção v9.2 — Refinamento visual do detalhe expandido

Ajusta o detalhe expandido para ficar mais próximo do padrão visual do Radar SUS e da experiência inspirada no Jira.

Inclui:
- remoção do botão textual **Abrir detalhe**;
- inclusão de ícone de expandir no painel lateral;
- título do painel clicável para abrir o detalhe;
- modal com paleta visual do sistema;
- botões superiores em formato de ícone;
- cards e abas mais compactos e elegantes.


## Correção v9.3 — Padrão Jira e roadmap de componentes

Refina a experiência de detalhe para aproximar do padrão Jira:

- modal volta a abrir centralizada;
- remove redundância do botão textual de detalhe;
- adiciona ícone de expandir na linha para abrir detalhe direto;
- mantém clique no título/linha para atualizar painel direito;
- adiciona possibilidade de recolher o painel lateral direito;
- mantém painel lateral como prévia rápida.

Roadmap registrado para próximos componentes:
- editar título/resumo inline com ícone de lápis;
- alterar status diretamente na linha;
- alterar prioridade diretamente na linha;
- alterar responsável diretamente na linha;
- filtros dinâmicos no topo por status, módulo, responsável, prioridade e período;
- conectar esses componentes aos campos reais do Supabase;
- criar rotas próprias para abrir detalhe em aba/página dedicada.


## Versão v10 — Workspaces configuráveis por módulo

Consolida o conceito de **área de trabalho configurável por módulo**.

Inclui:
- botão **Personalizar área** no topo;
- modal de personalização por módulo;
- configuração visual de colunas, filtros rápidos, painel lateral e cards/KPIs;
- modelo padrão específico para cada módulo;
- registro de roadmap para salvar preferências por usuário/perfil no Supabase.

Conceito:
- Módulo = área de trabalho;
- Funcionalidade = visão/aba/bloco dentro da área;
- Usuário = personaliza layout, colunas, filtros e painel conforme seu uso.


## Correção v10.1 — Personalização movida para Parametrização

Remove a personalização do topo global e concentra a configuração da área de trabalho dentro de **Parametrização > Aparência/Área de trabalho**.

Inclui:
- preferências salvas em `localStorage`;
- nome, e-mail e foto do usuário;
- tema claro/escuro/sistema;
- cor principal e cor da dashboard;
- densidade confortável/compacta;
- painel lateral aberto ou recolhido por padrão;
- flags para KPIs, gráficos e filtros rápidos;
- preparação para gravar preferências por usuário/perfil no Supabase.

Esse bloco substitui o botão global **Personalizar área** e evita reconfiguração a cada abertura do navegador.


## Versão v11 — Bloco operacional completo do front

Consolida os 7 apontamentos do primeiro bloco do front:

1. Validação visual da base v10.1 preservada.
2. Ícone de detalhe padronizado nas listas principais.
3. Painel lateral direito mantido como prévia rápida, com recolhimento.
4. Modal de detalhe com abas funcionais: Resumo, Histórico, Vínculos, Ações e Anexos.
5. Filtros dinâmicos visuais e funcionais por texto, status, prioridade, responsável e módulo.
6. Edição inline simulada na linha: editar texto, status, prioridade e responsável.
7. Preferências persistentes no navegador, com roadmap para Supabase.

Observação:
- Edição inline e filtros funcionam em modo front/local para POC.
- Persistência real de edição, preferências por perfil e rotas dedicadas serão conectadas ao Supabase na próxima fase.


## Versão v12 — Nomenclatura comercial, Mapa de Impactos e Personas

Ajusta a narrativa do produto sem alterar a estrutura central construída.

Renomeações:
- Dashboard → Área de Trabalho
- Alertas Inteligentes → Central de Alertas
- Análise e Ações → Roadmap
- Impactos no Produto → Mapa de Impactos

Escopo consolidado:
- Base de Conhecimento alimenta o SUSi e a Central de Alertas;
- Central de Alertas identifica mudanças, riscos e sinais relevantes;
- Mapa de Impactos cruza produto, cliente, serviço, persona e risco;
- Roadmap transforma impacto em decisão, prioridade e entrega;
- Central de Atendimento alimenta a inteligência com demandas reais de cliente;
- Parametrização concentra clientes, integrações, usuários, preferências e personas.

Inclui:
- blocos visuais de alcance no Mapa de Impactos;
- camada de personas em Parametrização;
- orientação do SUSi por perfil impactado;
- preparação para comunicação executiva, gerencial, operacional e técnica.


## Versão v12.1 — Parametrização e ordem do menu

Ajusta nomenclatura e organização visual do menu.

Alterações:
- Configurações → Parametrização;
- Área de Trabalho permanece fixa no topo;
- demais módulos organizados em ordem alfabética:
  - Base de Conhecimento;
  - Central de Alertas;
  - Central de Atendimento;
  - Mapa de Impactos;
  - Parametrização;
  - Roadmap.

Observação:
- Os nomes técnicos dos arquivos/componentes foram preservados para evitar refatoração desnecessária nesta etapa.
- A alteração é visual/conceitual e mantém a estrutura construída.


## Versão v12.2 — Tipografia híbrida Montserrat + Inter

Ajusta a identidade visual do Radar SUS com uma composição híbrida:

- Montserrat para títulos, menu, botões, badges, cards e elementos de identidade;
- Inter para tabelas, textos longos, campos, filtros e leitura operacional.

Objetivo:
- manter aparência mais premium e comercial;
- preservar legibilidade em telas densas;
- melhorar leitura de tabelas, filtros e informações operacionais.

Esta versão já inclui os ajustes da v12.1:
- Configurações → Parametrização;
- menu em ordem alfabética com Área de Trabalho fixa no topo.


## Versão v12.3 — Refinamento fino da tipografia

Ajusta o peso visual da tipografia híbrida:

- mantém Montserrat nos títulos, identidade, menu e cards;
- reduz o peso da Montserrat no menu lateral;
- preserva Inter em tabelas, campos e textos operacionais;
- torna badges e tabelas menos pesados visualmente;
- melhora leitura em itens com quebra de linha, como Base de Conhecimento e Central de Atendimento.

Objetivo:
- preservar aparência premium;
- evitar excesso de negrito;
- melhorar conforto visual nas áreas operacionais.


## Versão v13 — Ações reais e persistência operacional

Transforma a camada operacional da POC em uma experiência funcional no front/local.

Inclui:
- edição inline persistente em `localStorage`;
- alteração de status, prioridade e responsável preservada ao recarregar;
- envio de item para o Roadmap a partir do painel ou modal;
- descarte operacional do item;
- marcação de revisão do PO;
- histórico operacional local por item;
- aba Histórico da modal alimentada por ações reais locais;
- Roadmap passa a exibir itens gerados localmente;
- store local preparado para futura troca por persistência no Supabase.

Observação:
- As alterações ainda não gravam no Supabase.
- A estrutura foi preparada para conectar escrita real em uma próxima etapa sem refazer a experiência.
- Mantém o refino tipográfico da v12.3.
