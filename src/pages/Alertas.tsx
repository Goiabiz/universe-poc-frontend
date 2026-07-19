import { Maximize2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { alertas } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAlertas } from '../services/radarApi';
import type { PageProps } from '../App';

export function Alertas({ onSelectDetail, onOpenDetail }: PageProps) {
  const { data, source, loading, error } = useAsyncData(fetchAlertas, alertas);
  const totalCriticos = data.filter((item) => item.criticidade.toLowerCase().includes('crít') || item.criticidade.toLowerCase().includes('crit')).length;
  const emAnalise = data.filter((item) => item.status.toLowerCase().includes('análise') || item.status.toLowerCase().includes('analise')).length;
  const concluidos = data.filter((item) => item.status.toLowerCase().includes('concl')).length;

  return (
    <>
      <PageHeader title="Alertas Inteligentes" subtitle="Monitoramento proativo de mudanças e riscos" />
      <DataSourceNotice source={source} loading={loading} error={error} />
      <div className="kpi-grid"><KpiCard label="Alertas totais" value={String(data.length)} trend="lista atual" tone="blue" /><KpiCard label="Críticos" value={String(totalCriticos)} trend="atenção" tone="red" /><KpiCard label="Em análise" value={String(emAnalise)} trend="triagem" tone="orange" /><KpiCard label="Concluídos" value={String(concluidos)} trend="fechados" tone="green" /></div>
      <div className="filter-bar"><button className="chip active">Todos</button><button className="chip red">Críticos</button><button className="chip orange">Pendentes</button><button className="chip blue">Em análise</button><button className="chip green">Concluídos</button></div>
      <div className="card"><table><thead><tr><th>Criticidade</th><th>Título do alerta</th><th>Fonte</th><th>Data/Hora</th><th>Módulo / Funcionalidade</th><th>Status</th><th>Ações</th></tr></thead><tbody>{data.map((a) => <tr className="clickable-row" key={`${a.titulo}-${a.data}`} onClick={() => onSelectDetail?.({ title: a.titulo, subtitle: a.fonte, badge: a.criticidade, badgeTone: a.criticidade, description: 'Alerta selecionado para análise de impacto e encaminhamento operacional.', meta: [{ label: 'Fonte', value: a.fonte }, { label: 'Data/Hora', value: a.data }, { label: 'Módulo', value: a.modulo }, { label: 'Funcionalidade', value: a.funcionalidade }, { label: 'Status', value: a.status }], actions: ['Gerar ação', 'Ver documento', 'Descartar'] })}><td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td><td>{a.titulo}</td><td>{a.fonte}</td><td>{a.data}</td><td>{a.modulo}<br/><span>{a.funcionalidade}</span></td><td><Badge tone="blue">{a.status}</Badge></td><td className="row-expand-cell"><button title="Abrir detalhe" onClick={(event) => { event.stopPropagation(); onSelectDetail?.({
        title: a.titulo,
        subtitle: a.fonte,
        badge: a.criticidade,
        badgeTone: a.criticidade,
        description: 'Alerta selecionado para análise de impacto e encaminhamento operacional.',
        meta: [
          { label: 'Fonte', value: a.fonte },
          { label: 'Data/Hora', value: a.data },
          { label: 'Módulo', value: a.modulo },
          { label: 'Funcionalidade', value: a.funcionalidade },
          { label: 'Status', value: a.status }
        ],
        actions: ['Gerar ação', 'Ver documento', 'Descartar']
      }); onOpenDetail?.({ title: a.titulo, subtitle: a.fonte, badge: a.criticidade, badgeTone: a.criticidade, description: 'Alerta selecionado para análise de impacto e encaminhamento operacional.', meta: [{ label: 'Fonte', value: a.fonte }, { label: 'Data/Hora', value: a.data }, { label: 'Módulo', value: a.modulo }, { label: 'Funcionalidade', value: a.funcionalidade }, { label: 'Status', value: a.status }], actions: ['Gerar ação', 'Ver documento', 'Descartar'] }); }}><Maximize2 size={15} /></button></td></tr>)}</tbody></table></div>
    </>
  );
}