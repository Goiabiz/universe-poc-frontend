import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { clientes } from '../data/mock';

export function Configuracoes() {
  return (
    <>
      <PageHeader title="Configurações" subtitle="Parâmetros principais da operação" action={<button className="primary-small">+ Novo cliente</button>} />
      <div className="tabs"><button className="active">Clientes</button><button>Integrações</button><button>Usuários</button></div>
      <div className="kpi-grid"><KpiCard label="Clientes ativos" value="24" trend="+14%" tone="green" /><KpiCard label="Integrações configuradas" value="87" trend="+18%" tone="blue" /><KpiCard label="Usuários cadastrados" value="126" trend="+9%" tone="purple" /><KpiCard label="Ambientes monitorados" value="35" trend="+12%" tone="orange" /></div>
      <div className="card"><table><thead><tr><th>Cliente</th><th>Plano</th><th>Ambiente</th><th>Status</th><th>Integrações</th><th>Última atualização</th></tr></thead><tbody>{clientes.map((c) => <tr key={c.cliente}><td>{c.cliente}</td><td><Badge tone="purple">{c.plano}</Badge></td><td>{c.ambiente}</td><td><Badge tone="green">{c.status}</Badge></td><td>{c.integracoes}</td><td>{c.atualizado}</td></tr>)}</tbody></table></div>
    </>
  );
}
