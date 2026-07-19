import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { clientes } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchClientes } from '../services/radarApi';

export function Configuracoes() {
  const { data, source, loading, error } = useAsyncData(fetchClientes, clientes);
  const ativos = data.filter((item) => item.status.toLowerCase().includes('ativo')).length;

  return (
    <>
      <PageHeader title="Configurações" subtitle="Parâmetros principais da operação" action={<button className="primary-small">+ Novo cliente</button>} />
      <div className="tabs"><button className="active">Clientes</button><button>Integrações</button><button>Usuários</button><button>Perfil e Aparência</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} />
      <div className="kpi-grid"><KpiCard label="Clientes ativos" value={String(ativos)} trend="base atual" tone="green" /><KpiCard label="Integrações configuradas" value="-" trend="em evolução" tone="blue" /><KpiCard label="Usuários cadastrados" value="-" trend="perfil" tone="purple" /><KpiCard label="Ambientes monitorados" value={String(data.length)} trend="produção/homologação" tone="orange" /></div>
      <div className="card"><table><thead><tr><th>Cliente</th><th>Plano</th><th>Ambiente</th><th>Status</th><th>Integrações</th><th>Última atualização</th></tr></thead><tbody>{data.map((c) => <tr key={c.cliente}><td>{c.cliente}</td><td><Badge tone="purple">{c.plano}</Badge></td><td>{c.ambiente}</td><td><Badge tone="green">{c.status}</Badge></td><td>{c.integracoes}</td><td>{c.atualizado}</td></tr>)}</tbody></table></div>
      <div className="card roadmap-card"><h3>Próximas configurações</h3><p>Perfil com foto, nome de exibição e e-mail; tema claro/escuro/sistema; personalização de cor da dashboard.</p></div>
    </>
  );
}
