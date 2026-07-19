import { Maximize2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { alertas, impactos, kpis } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAlertas, fetchDashboard, fetchImpactos } from '../services/radarApi';
import type { PageProps } from '../App';

const hasCriticalTone = (value: string) => {
  const normalized = value.toLowerCase();
  return normalized.includes('crít') || normalized.includes('crit') || normalized.includes('alto') || normalized.includes('alta');
};

const getCombinedSource = (sources: string[]) => {
  return sources.every((source) => source === 'supabase') ? 'supabase' : 'mock';
};

export function Dashboard({ onSelectDetail, onOpenDetail }: PageProps) {
  const dashboard = useAsyncData(fetchDashboard, kpis);
  const alertasData = useAsyncData(fetchAlertas, alertas);
  const impactosData = useAsyncData(fetchImpactos, impactos);

  const dashboardKpis = dashboard.data;
  const latestAlertas = alertasData.data.slice(0, 5);
  const latestImpactos = impactosData.data.slice(0, 4);
  const criticidadeTotal = alertasData.data.length + impactosData.data.filter((item) => hasCriticalTone(item.criticidade)).length;

  const source = getCombinedSource([dashboard.source, alertasData.source, impactosData.source]);
  const loading = dashboard.loading || alertasData.loading || impactosData.loading;
  const error = dashboard.error || alertasData.error || impactosData.error;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão executiva da operação" action={<button className="secondary-btn">Personalizar</button>} />
      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid five">
        {dashboardKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card large">
          <div className="section-title-row">
            <h3>Evolução de alertas</h3>
            <span className="small-muted">visual demonstrativo</span>
          </div>
          <div className="fake-chart"><span /><span /><span /><span /></div>
        </div>

        <div className="card">
          <div className="section-title-row">
            <h3>Criticidade</h3>
            <span className="small-muted">{source === 'supabase' ? 'base real' : 'mock'}</span>
          </div>
          <div className="donut"><strong>{criticidadeTotal}</strong></div>
          <p className="muted">Alertas e impactos classificados no período.</p>
        </div>
      </div>

      <div className="split-grid">
        <div className="card">
          <div className="section-title-row">
            <h3>Últimos alertas</h3>
            <span className="small-muted">{latestAlertas.length} registros</span>
          </div>
          <table>
            <tbody>
              {latestAlertas.map((a) => (
                <tr key={`${a.titulo}-${a.data}`}>
                  <td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td>
                  <td>{a.titulo}</td>
                  <td>{a.fonte}</td>
                  <td><Badge tone="blue">{a.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {latestAlertas.length === 0 && <p className="empty-note">Nenhum alerta encontrado na base.</p>}
        </div>

        <div className="card">
          <div className="section-title-row">
            <h3>Impactos recentes</h3>
            <span className="small-muted">{latestImpactos.length} registros</span>
          </div>
          {latestImpactos.map((i) => (
            <div className="list-item" key={`${i.modulo}-${i.funcionalidade}-${i.cliente}`}>
              <strong>{i.modulo}</strong>
              <span>{i.funcionalidade}</span>
              <Badge tone={i.criticidade.toLowerCase()}>{i.criticidade}</Badge>
            </div>
          ))}
          {latestImpactos.length === 0 && <p className="empty-note">Nenhum impacto encontrado na base.</p>}
        </div>
      </div>
    </>
  );
}