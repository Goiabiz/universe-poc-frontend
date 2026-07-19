import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { alertas } from '../data/mock';

export function Alertas() {
  return (
    <>
      <PageHeader title="Alertas Inteligentes" subtitle="Monitoramento proativo de mudanças e riscos" />
      <div className="kpi-grid"><KpiCard label="Alertas totais" value="128" trend="+18%" tone="blue" /><KpiCard label="Críticos" value="23" trend="+15%" tone="red" /><KpiCard label="Em análise" value="42" trend="+5%" tone="orange" /><KpiCard label="Concluídos" value="63" trend="+22%" tone="green" /></div>
      <div className="filter-bar"><button className="chip active">Todos</button><button className="chip red">Críticos</button><button className="chip orange">Pendentes</button><button className="chip blue">Em análise</button><button className="chip green">Concluídos</button></div>
      <div className="card"><table><thead><tr><th>Criticidade</th><th>Título do alerta</th><th>Fonte</th><th>Data/Hora</th><th>Módulo / Funcionalidade</th><th>Status</th></tr></thead><tbody>{alertas.map((a) => <tr key={a.titulo}><td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td><td>{a.titulo}</td><td>{a.fonte}</td><td>{a.data}</td><td>{a.modulo}<br/><span>{a.funcionalidade}</span></td><td><Badge tone="blue">{a.status}</Badge></td></tr>)}</tbody></table></div>
    </>
  );
}
