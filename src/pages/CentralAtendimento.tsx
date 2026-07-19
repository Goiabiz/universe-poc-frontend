import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { atendimentos } from '../data/mock';

export function CentralAtendimento() {
  return (
    <>
      <PageHeader title="Central de Atendimento" subtitle="Atendimentos, tickets e integrações em acompanhamento" action={<button className="secondary-btn">Exportar</button>} />
      <div className="tabs"><button className="active">Atendimentos</button><button>Tickets</button><button>Integrações</button></div>
      <div className="kpi-grid"><KpiCard label="Atendimentos abertos" value="86" trend="-12%" tone="green" /><KpiCard label="Tickets externos" value="34" trend="+8%" tone="blue" /><KpiCard label="SLA em risco" value="7" trend="+2" tone="orange" /><KpiCard label="Integrações ativas" value="8" trend="0%" tone="purple" /></div>
      <div className="card"><table><thead><tr><th>Canal</th><th>Cliente</th><th>Assunto</th><th>Prioridade</th><th>Responsável</th><th>Última interação</th><th>Status</th></tr></thead><tbody>{atendimentos.map((a) => <tr key={a.cliente}><td>{a.canal}</td><td>{a.cliente}</td><td>{a.assunto}</td><td><Badge tone={a.prioridade.toLowerCase()}>{a.prioridade}</Badge></td><td>{a.responsavel}</td><td>{a.ultima}</td><td><Badge tone="green">{a.status}</Badge></td></tr>)}</tbody></table></div>
    </>
  );
}
