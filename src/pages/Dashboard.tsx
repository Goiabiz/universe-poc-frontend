import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { InlineRowActions } from '../components/InlineRowActions';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { alertas, impactos, kpis } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAlertas, fetchDashboard, fetchImpactos } from '../services/radarApi';
import type { PageProps } from '../App';

const hasCriticalTone = (value: string) => {
  const normalized = value.toLowerCase();
  return normalized.includes('crít') || normalized.includes('crit') || normalized.includes('alto') || normalized.includes('alta');
};

const getCombinedSource = (sources: string[]) => sources.every((source) => source === 'supabase') ? 'supabase' : 'mock';

export function Dashboard({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const dashboard = useAsyncData(fetchDashboard, kpis);
  const alertasData = useAsyncData(fetchAlertas, alertas);
  const impactosData = useAsyncData(fetchImpactos, impactos);

  const dashboardKpis = dashboard.data;
  const latestAlertas = alertasData.data.slice(0, 5).filter((a) => {
    const text = normalizeFilterText([a.titulo, a.fonte, a.status, a.modulo, a.funcionalidade].join(' '));
    return (!search || text.includes(normalizeFilterText(search))) && (!status || text.includes(normalizeFilterText(status)));
  });
  const latestImpactos = impactosData.data.slice(0, 4);
  const criticidadeTotal = alertasData.data.length + impactosData.data.filter((item) => hasCriticalTone(item.criticidade)).length;

  const source = getCombinedSource([dashboard.source, alertasData.source, impactosData.source]);
  const loading = dashboard.loading || alertasData.loading || impactosData.loading;
  const error = dashboard.error || alertasData.error || impactosData.error;

  return (
    <>
      <PageHeader title="Área de Trabalho" subtitle="Sua visão principal de alertas, impactos, roadmap e ações pendentes" />
      <DataSourceNotice source={source} loading={loading} error={error} connectionState={source === 'supabase' ? 'connected' : loading ? 'connecting' : error ? 'error' : (dashboard.connectionState === 'slow' || alertasData.connectionState === 'slow' || impactosData.connectionState === 'slow') ? 'slow' : 'demo'} />

      <div className="kpi-grid five">{dashboardKpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</div>

      <div className="dashboard-grid">
        <div className="card large"><div className="section-title-row"><h3>Evolução operacional</h3><span className="small-muted">visual demonstrativo</span></div><div className="fake-chart"><span /><span /><span /><span /></div></div>
        <div className="card"><div className="section-title-row"><h3>Criticidade</h3><span className="small-muted">{source === 'supabase' ? 'base real' : 'mock'}</span></div><div className="donut"><strong>{criticidadeTotal}</strong></div><p className="muted">Alertas, impactos e decisões classificados no período.</p></div>
      </div>

      <SmartFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} placeholder="Filtrar últimos alertas..." />

      <div className="split-grid">
        <div className="card">
          <div className="section-title-row"><h3>Alertas recentes</h3><span className="small-muted">{latestAlertas.length} registros</span></div>
          <table>
            <thead><tr><th>Criticidade</th><th>Título</th><th>Fonte</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {latestAlertas.map((a) => {
                const detail = {
                  title: a.titulo,
                  subtitle: a.fonte,
                  badge: a.criticidade,
                  badgeTone: a.criticidade,
                  description: 'Alerta recente selecionado no dashboard.',
                  meta: [
                    { label: 'Fonte', value: a.fonte },
                    { label: 'Data/Hora', value: a.data },
                    { label: 'Módulo', value: a.modulo },
                    { label: 'Status', value: a.status }
                  ],
                  actions: ['Gerar ação', 'Ver documento', 'Descartar']
                };
                return (
                  <tr className="clickable-row" key={`${a.titulo}-${a.data}`} onClick={() => onSelectDetail?.(detail)}>
                    <td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td>
                    <td><strong>{a.titulo}</strong></td>
                    <td>{a.fonte}</td>
                    <td><Badge tone="blue">{a.status}</Badge></td>
                    <td><InlineRowActions detail={detail} status={a.status} prioridade={a.criticidade} responsavel="Moises Mattos" onOpenDetail={onOpenDetail} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {latestAlertas.length === 0 && <p className="empty-note">Nenhum alerta encontrado na base.</p>}
        </div>

        <div className="card">
          <div className="section-title-row"><h3>Mapa de impactos recente</h3><span className="small-muted">{latestImpactos.length} registros</span></div>
          {latestImpactos.map((i) => {
            const detail = {
              title: i.funcionalidade,
              subtitle: i.modulo,
              badge: i.criticidade,
              badgeTone: i.criticidade,
              description: 'Impacto recente selecionado no dashboard.',
              meta: [
                { label: 'Módulo', value: i.modulo },
                { label: 'Funcionalidade', value: i.funcionalidade },
                { label: 'Cliente', value: i.cliente },
                { label: 'Status', value: i.status }
              ],
              actions: ['Gerar ação', 'Ver impacto', 'Marcar revisão']
            };
            return (
              <div className="list-item clickable-row" key={`${i.modulo}-${i.funcionalidade}-${i.cliente}`} onClick={() => onSelectDetail?.(detail)}>
                <strong>{i.modulo}</strong><span>{i.funcionalidade}</span><Badge tone={i.criticidade.toLowerCase()}>{i.criticidade}</Badge>
                <InlineRowActions detail={detail} status={i.status} prioridade={i.criticidade} responsavel="Moises Mattos" onOpenDetail={onOpenDetail} />
              </div>
            );
          })}
          {latestImpactos.length === 0 && <p className="empty-note">Nenhum impacto encontrado na base.</p>}
        </div>
      </div>
    </>
  );
}
