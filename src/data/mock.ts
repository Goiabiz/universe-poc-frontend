export const kpis = [
  { label: 'Documentos monitorados', value: '1.248', trend: '+12%', tone: 'green' },
  { label: 'Alertas críticos', value: '23', trend: '+15%', tone: 'red' },
  { label: 'Impactos identificados', value: '57', trend: '+8%', tone: 'blue' },
  { label: 'Ações pendentes', value: '31', trend: '+3%', tone: 'orange' },
  { label: 'Integrações ativas', value: '8', trend: 'sem alterações', tone: 'cyan' }
];

export const alertas = [
  { criticidade: 'Crítico', titulo: 'Atualização na tabela SIGTAP impacta cálculo de procedimentos', fonte: 'Nota Técnica 2024/118', data: '20/05/2024 08:42', modulo: 'Faturamento', funcionalidade: 'Cálculo de AIH', status: 'Novo' },
  { criticidade: 'Alto', titulo: 'Novo leiaute do BPA-I a partir de competência 06/2024', fonte: 'Portaria GM/MS 2.234/24', data: '20/05/2024 07:15', modulo: 'BPA-I', funcionalidade: 'Importação', status: 'Em análise' },
  { criticidade: 'Médio', titulo: 'Alteração de regra de validação para CNES inativo/ativo', fonte: 'Comunicado SAS 43/2024', data: '19/05/2024 16:30', modulo: 'CNES', funcionalidade: 'Cadastro', status: 'Em andamento' },
  { criticidade: 'Baixo', titulo: 'Ajuste na descrição do campo Tipo de Estabelecimento', fonte: 'Nota Informativa SAES 12/2024', data: '19/05/2024 10:20', modulo: 'SCNES', funcionalidade: 'Relatórios', status: 'Monitorando' }
];

export const impactos = [
  { modulo: 'Faturamento', funcionalidade: 'Geração de Guia de Atendimento (GA)', origem: 'Alerta crítico', criticidade: 'Crítico', cliente: 'Hospital das Clínicas de São Paulo', status: 'Em andamento' },
  { modulo: 'BPA', funcionalidade: 'Validação de procedimentos na autorização', origem: 'Impacto identificado', criticidade: 'Alto', cliente: 'Secretaria Municipal de Saúde - RJ', status: 'Em análise' },
  { modulo: 'CNES', funcionalidade: 'Sincronização de estabelecimentos', origem: 'Cliente', criticidade: 'Médio', cliente: 'Prefeitura de Curitiba', status: 'Monitorando' },
  { modulo: 'Prontuário Eletrônico', funcionalidade: 'Registro de atendimento ambulatorial', origem: 'Alerta crítico', criticidade: 'Crítico', cliente: 'Santa Casa de Belo Horizonte', status: 'Em andamento' }
];

export const documentos = [
  { titulo: 'Portaria GM/MS nº 3.222/2024', tipo: 'Portaria', fonte: 'Ministério da Saúde', publicacao: '20/05/2024', status: 'Ativo', tags: ['Financiamento', 'Atenção Primária'] },
  { titulo: 'Nota Técnica nº 15/2024-CGAFI/DAF', tipo: 'Nota Técnica', fonte: 'Ministério da Saúde', publicacao: '18/05/2024', status: 'Ativo', tags: ['Execução', 'Fundo a Fundo'] },
  { titulo: 'Relatório Anual de Gestão 2023', tipo: 'Relatório', fonte: 'Ministério da Saúde', publicacao: '10/05/2024', status: 'Ativo', tags: ['Gestão', 'Planejamento'] },
  { titulo: 'Painel de Indicadores do SUS - 1º Trimestre', tipo: 'Planilha', fonte: 'DataSUS', publicacao: '07/05/2024', status: 'Ativo', tags: ['Indicadores', 'Monitoramento'] }
];

export const atendimentos = [
  { canal: 'WhatsApp', cliente: 'Hospital Santa Clara', assunto: 'Falha na integração', prioridade: 'Alta', responsavel: 'Bruno Oliveira', ultima: '20/05/2024 10:42', status: 'Aberto' },
  { canal: 'E-mail', cliente: 'UPA Zona Norte', assunto: 'Dúvida sobre relatório', prioridade: 'Média', responsavel: 'Juliana Costa', ultima: '20/05/2024 09:18', status: 'Em andamento' },
  { canal: 'Telefone', cliente: 'Secretaria de Saúde - MG', assunto: 'Erro ao validar BPA-I', prioridade: 'Alta', responsavel: 'Rafael Mendes', ultima: '20/05/2024 08:33', status: 'Aberto' },
  { canal: 'Portal', cliente: 'Hospital São Lucas', assunto: 'Acesso ao sistema', prioridade: 'Baixa', responsavel: 'Camila Rocha', ultima: '20/05/2024 07:58', status: 'Respondido' }
];

export const acoes = [
  { origem: 'Alerta crítico', resumo: 'Aumento de alertas críticos', criticidade: 'Crítico', responsavel: 'Mariana Lima', prazo: '20/05/2024', status: 'Pendente' },
  { origem: 'Impacto identificado', resumo: 'Instabilidade no Módulo BPA-I', criticidade: 'Alta', responsavel: 'Carlos Mendes', prazo: '21/05/2024', status: 'Pendente' },
  { origem: 'Ação pendente', resumo: 'Atualização emergencial de versão', criticidade: 'Alta', responsavel: 'Juliana Rocha', prazo: '22/05/2024', status: 'Aguardando validação' }
];

export const clientes = [
  { cliente: 'Prefeitura de Fortaleza', plano: 'Enterprise', ambiente: 'Produção', status: 'Ativo', integracoes: 6, atualizado: '20/05/2024 08:42' },
  { cliente: 'Prefeitura de Belo Horizonte', plano: 'Enterprise', ambiente: 'Produção', status: 'Ativo', integracoes: 5, atualizado: '20/05/2024 08:15' },
  { cliente: 'Prefeitura de Salvador', plano: 'Profissional', ambiente: 'Produção', status: 'Ativo', integracoes: 3, atualizado: '20/05/2024 07:58' }
];
