import { Maximize2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { useAsyncData } from '../hooks/useAsyncData';
import {
  fetchClientesConfig,
  fetchIntegracoesConfig,
  fetchUsuariosConfig,
  type ClienteConfig,
  type IntegracaoConfig,
  type UsuarioConfig,
} from '../services/radarApi';
import type { PageProps } from '../App';

const mockClientes: ClienteConfig[] = [
  {
    nome: 'Prefeitura Demonstrativa',
    tipo: 'Município',
    status: 'ativo',
    plano: 'Padrão',
    ambiente: 'Produção',
    integracoes: '3',
    atualizadoEm: '2026-07-19',
  },
];

const mockIntegracoes: IntegracaoConfig[] = [
  {
    nome: 'Jira',
    provedor: 'Atlassian',
    status: 'ativo',
    autenticacao: 'OAuth',
    cliente: 'Prefeitura Demonstrativa',
    atualizadoEm: '2026-07-19',
  },
];

const mockUsuarios: UsuarioConfig[] = [
  {
    nome: 'Bruno Oliveira',
    email: 'bruno@exemplo.com',
    perfil: 'Administrador',
    status: 'ativo',
    cliente: 'Operadora',
    ultimoLogin: '2026-07-19',
  },
];

const formatDate = (value?: string) => {
  if (!value || value === '-') return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getSource = (sources: string[]) => {
  return sources.every((source) => source === 'supabase') ? 'supabase' : 'mock';
};

export function Configuracoes({ onSelectDetail, onOpenDetail }: PageProps) {
  const clientesResult = useAsyncData(fetchClientesConfig, mockClientes);
  const integracoesResult = useAsyncData(fetchIntegracoesConfig, mockIntegracoes);
  const usuariosResult = useAsyncData(fetchUsuariosConfig, mockUsuarios);

  const clientes = Array.isArray(clientesResult.data) ? clientesResult.data : mockClientes;
  const integracoes = Array.isArray(integracoesResult.data) ? integracoesResult.data : mockIntegracoes;
  const usuarios = Array.isArray(usuariosResult.data) ? usuariosResult.data : mockUsuarios;

  const source = getSource([clientesResult.source, integracoesResult.source, usuariosResult.source]);
  const loading = clientesResult.loading || integracoesResult.loading || usuariosResult.loading;
  const error = clientesResult.error || integracoesResult.error || usuariosResult.error;

  const clientesAtivos = clientes.filter((item) => item.status.toLowerCase().includes('ativo')).length;
  const integracoesAtivas = integracoes.filter((item) => item.status.toLowerCase().includes('ativo')).length;
  const usuariosAtivos = usuarios.filter((item) => item.status.toLowerCase().includes('ativo')).length;
  const ambientes = new Set(clientes.map((item) => item.ambiente).filter(Boolean)).size;

  return (
    <>
      <PageHeader
        title="Configurações"
        subtitle="Parâmetros principais da operação, clientes, integrações e usuários"
        action={<button className="secondary-btn">Nova configuração</button>}
      />

      <div className="tabs">
        <button className="active">Clientes</button>
        <button>Integrações</button>
        <button>Usuários</button>
        <button>Aparência</button>
      </div>

      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid four">
        <KpiCard label="Clientes ativos" value={String(clientesAtivos || clientes.length)} trend="base atual" tone="green" />
        <KpiCard label="Integrações configuradas" value={String(integracoesAtivas || integracoes.length)} trend="conectores internos" tone="blue" />
        <KpiCard label="Usuários cadastrados" value={String(usuariosAtivos || usuarios.length)} trend="acesso operacional" tone="purple" />
        <KpiCard label="Ambientes monitorados" value={String(ambientes || 1)} trend="produção/homologação" tone="orange" />
      </div>

      <div className="toolbar">
        <input placeholder="Buscar cliente, integração, usuário ou parâmetro..." />
        <button>Clientes</button>
        <button>Integrações</button>
        <button>Usuários</button>
        <button>Status</button>
      </div>

      <div className="config-grid">
        <section className="card">
          <div className="section-title-row">
            <h3>Clientes</h3>
            <span className="small-muted">{clientes.length} registros</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Plano</th>
                <th>Ambiente</th>
                <th>Status</th><th>Ações</th><th>Ações</th><th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr className="clickable-row" key={`${cliente.nome}-${cliente.tipo}-${cliente.status}`} onClick={() => onSelectDetail?.({ title: cliente.nome, subtitle: cliente.tipo, badge: cliente.status, badgeTone: cliente.status, description: 'Cliente selecionado para configuração operacional.', meta: [{ label: 'Tipo', value: cliente.tipo }, { label: 'Plano', value: cliente.plano }, { label: 'Ambiente', value: cliente.ambiente }, { label: 'Integrações', value: cliente.integracoes }], actions: ['Editar cliente', 'Configurar integrações', 'Desativar'] })}>
                  <td>
                    <strong>{cliente.nome}</strong>
                    <div className="table-subtitle">Integrações: {cliente.integracoes}</div>
                  </td>
                  <td>{cliente.tipo}</td>
                  <td>{cliente.plano}</td>
                  <td>{cliente.ambiente}</td>
                  <td><Badge tone={cliente.status.toLowerCase().includes('ativo') ? 'green' : 'orange'}>{cliente.status}</Badge></td>
                      <td className="row-expand-cell"><button title="Abrir detalhe" onClick={(event) => { event.stopPropagation(); onOpenDetail?.({
                        title: cliente.nome,
                        subtitle: cliente.tipo,
                        badge: cliente.status,
                        badgeTone: cliente.status,
                        description: 'Cliente selecionado para configuração operacional.',
                        meta: [
                          { label: 'Tipo', value: cliente.tipo },
                          { label: 'Plano', value: cliente.plano },
                          { label: 'Ambiente', value: cliente.ambiente },
                          { label: 'Integrações', value: cliente.integracoes }
                        ],
                        actions: ['Editar cliente', 'Configurar integrações', 'Desativar']
                      }); }}><Maximize2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <div className="section-title-row">
            <h3>Integrações</h3>
            <span className="small-muted">{integracoes.length} registros</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Integração</th>
                <th>Provedor</th>
                <th>Cliente</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {integracoes.map((integracao) => (
                <tr key={`${integracao.nome}-${integracao.provedor}-${integracao.cliente}`}>
                  <td>
                    <strong>{integracao.nome}</strong>
                    <div className="table-subtitle">{integracao.autenticacao}</div>
                  </td>
                  <td>{integracao.provedor}</td>
                  <td>{integracao.cliente}</td>
                  <td><Badge tone={integracao.status.toLowerCase().includes('ativo') ? 'green' : 'orange'}>{integracao.status}</Badge></td>
                      <td className="row-expand-cell"><button title="Abrir detalhe" onClick={(event) => { event.stopPropagation(); onOpenDetail?.({
                        title: integracao.nome,
                        subtitle: integracao.provedor,
                        badge: integracao.status,
                        badgeTone: integracao.status,
                        description: 'Integração selecionada para revisão de acesso, autenticação e status.',
                        meta: [
                          { label: 'Provedor', value: integracao.provedor },
                          { label: 'Cliente', value: integracao.cliente },
                          { label: 'Autenticação', value: integracao.autenticacao },
                          { label: 'Atualizado em', value: formatDate(integracao.atualizadoEm) }
                        ],
                        actions: ['Editar integração', 'Testar conexão', 'Desativar']
                      }); }}><Maximize2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="card config-users-card">
        <div className="section-title-row">
          <h3>Usuários</h3>
          <span className="small-muted">{usuarios.length} registros</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Cliente</th>
              <th>Último login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={`${usuario.email}-${usuario.nome}`}>
                <td><strong>{usuario.nome}</strong></td>
                <td>{usuario.email}</td>
                <td>{usuario.perfil}</td>
                <td>{usuario.cliente}</td>
                <td>{formatDate(usuario.ultimoLogin)}</td>
                <td><Badge tone={usuario.status.toLowerCase().includes('ativo') ? 'green' : 'orange'}>{usuario.status}</Badge></td>
                    <td className="row-expand-cell"><button title="Abrir detalhe" onClick={(event) => { event.stopPropagation(); onOpenDetail?.({
                      title: usuario.nome,
                      subtitle: usuario.email,
                      badge: usuario.status,
                      badgeTone: usuario.status,
                      description: 'Usuário selecionado para revisão de perfil, cliente e acesso.',
                      meta: [
                        { label: 'E-mail', value: usuario.email },
                        { label: 'Perfil', value: usuario.perfil },
                        { label: 'Cliente', value: usuario.cliente },
                        { label: 'Último login', value: formatDate(usuario.ultimoLogin) }
                      ],
                      actions: ['Editar usuário', 'Gerenciar permissões', 'Desativar']
                    }); }}><Maximize2 size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card roadmap-note">
        <h3>Roadmap de configuração</h3>
        <p className="muted">
          Próximas evoluções: perfil com foto, nome e e-mail; tema claro/escuro/sistema;
          personalização de cor; permissões avançadas; conectores externos configuráveis.
        </p>
      </div>
    </>
  );
}