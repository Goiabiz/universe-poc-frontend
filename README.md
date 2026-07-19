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
