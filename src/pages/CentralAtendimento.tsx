import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { atendimentos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAtendimentos } from '../services/radarApi';

export function CentralAtendimento() {
  const { data, source, loading, error } = useAsyncData(fetchAtendimentos, atendimentos);
  const abertos = data.filter((item) => item.status.toLowerCase().includes('aberto')).length;
  const alta = data.filter((item) => item.prioridade.toLowerCase().includes('alta')).length;

  return (
    <>
      <PageHeader title="Central de Atendimento" subtitle="Atendimentos, tickets e integrações em acompanhamento" action={<button className="secondary-btn">Exportar</button>} />
      <div className="tabs"><button className="active">Atendimentos</button><button>Tickets</button><button>Integrações</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} />
      <div className="kpi-grid"><KpiCard label="Atendimentos abertos" value={String(abertos)} trend="ativos" tone="green" /><KpiCard label="Tickets externos" value="-" trend="em evolução" tone="blue" /><KpiCard label="Prioridade alta" value={String(alta)} trend="atenção" tone="orange" /><KpiCard label="Integrações ativas" value="-" trend="base POC" tone="purple" /></div>
      <div className="card"><table><thead><tr><th>Canal</th><th>Cliente</th><th>Assunto</th><th>Prioridade</th><th>Responsável</th><th>Última interação</th><th>Status</th></tr></thead><tbody>{data.map((a) => <tr key={`${a.cliente}-${a.assunto}`}><td>{a.canal}</td><td>{a.cliente}</td><td>{a.assunto}</td><td><Badge tone={a.prioridade.toLowerCase()}>{a.prioridade}</Badge></td><td>{a.responsavel}</td><td>{a.ultima}</td><td><Badge tone="green">{a.status}</Badge></td></tr>)}</tbody></table></div>
    </>
  );
}
