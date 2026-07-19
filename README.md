# Radar SUS Frontend

Frontend MVP da POC vendável do Radar SUS.

## Stack

- React
- Vite
- TypeScript
- Supabase
- CSS puro com design system próprio
- Lucide React para ícones

## Telas iniciais

- Dashboard
- Alertas Inteligentes
- Análise e Ações
- Base de Conhecimento
- Central de Atendimento
- Impactos no Produto
- Configurações

## Views esperadas no Supabase

Projeto `universo-conectasus`:

- `vw_radar_dashboard`
- `vw_documentos_base`
- `vw_alertas_pendentes`
- `vw_impactos_produto`
- `vw_decisoes_po`
- `vw_requisitos_vinculados`

Projeto `universe-poc`:

- `vw_universe_poc_dashboard`
- `vw_universe_poc_atendimentos`

## Como rodar

```bash
npm install
copy .env.example .env
npm run dev
```

No Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Depois preencha as chaves no arquivo `.env`.
