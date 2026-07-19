import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { alertas, impactos, kpis } from '../data/mock';

export function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão executiva da operação" action={<button className="secondary-btn">Personalizar</button>} />
      <div className="kpi-grid five">{kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</div>
      <div className="dashboard-grid">
        <div className="card large"><h3>Evolução de alertas</h3><div className="fake-chart"><span /><span /><span /><span /></div></div>
        <div className="card"><h3>Criticidade</h3><div className="donut"><strong>133</strong></div><p className="muted">Críticos, altos, médios e baixos no período.</p></div>
      </div>
      <div className="split-grid">
        <div className="card"><h3>Últimos alertas</h3><table><tbody>{alertas.map((a) => <tr key={a.titulo}><td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td><td>{a.titulo}</td><td>{a.fonte}</td><td><Badge tone="blue">{a.status}</Badge></td></tr>)}</tbody></table></div>
        <div className="card"><h3>Impactos recentes</h3>{impactos.slice(0,4).map((i) => <div className="list-item" key={i.funcionalidade}><strong>{i.modulo}</strong><span>{i.funcionalidade}</span><Badge tone={i.criticidade.toLowerCase()}>{i.criticidade}</Badge></div>)}</div>
      </div>
    </>
  );
}
