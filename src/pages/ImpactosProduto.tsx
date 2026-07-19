import { Maximize2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { impactos as mockImpactos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchImpactos } from '../services/radarApi';
import type { PageProps } from '../App';

const isCritical = (value: string) => {
  const normalized = value.toLowerCase();
  return normalized.includes('crít') || normalized.includes('crit');
};

const isHigh = (value: string) => {
  const normalized = value.toLowerCase();
  return normalized.includes('alto') || normalized.includes('alta');
};

const activeStatuses = ['em andamento', 'em análise', 'monitoramento', 'monitorando', 'pendente'];

export function ImpactosProduto({ onSelectDetail, onOpenDetail }: PageProps) {
  const { data, source, loading, error } = useAsyncData(fetchImpactos, mockImpactos);

  const total = data.length;
  const criticos = data.filter((item) => isCritical(item.criticidade)).length;
  const altos = data.filter((item) => isHigh(item.criticidade)).length;
  const acoesEmCurso = data.filter((item) => activeStatuses.some((status) => item.status.toLowerCase().includes(status))).length;
  const clientesAfetados = new Set(data.map((item) => item.cliente).filter(Boolean)).size;

  const selected = data[0];

  return (
    <>
      <PageHeader title="Impactos no Produto" subtitle="Mapeamento de impactos por módulo e funcionalidade" action={<button className="secondary-btn">Exportar</button>} />
      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid four">
        <KpiCard label="Impactos totais" value={String(total)} trend={source === 'supabase' ? 'base atual' : '+8% vs ontem'} tone="green" />
        <KpiCard label="Críticos" value={String(criticos)} trend={criticos > 0 ? 'atenção necessária' : 'sem críticos'} tone="red" />
        <KpiCard label="Clientes afetados" value={String(clientesAfetados || total)} trend={source === 'supabase' ? 'base real' : '+6% vs ontem'} tone="blue" />
        <KpiCard label="Ações em curso" value={String(acoesEmCurso || altos)} trend={source === 'supabase' ? 'status atual' : '+3% vs ontem'} tone="orange" />
      </div>

      <div className="filter-bar">
        <input placeholder="Buscar impacto..." />
        <button>Módulo</button>
        <button>Funcionalidade</button>
        <button>Criticidade</button>
        <button>Cliente</button>
        <button>Status</button>
      </div>

      <div className="card">
        <div className="section-title-row">
          <h3>Impactos mapeados</h3>
          <span className="small-muted">{data.length} registros</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Módulo</th>
              <th>Funcionalidade</th>
              <th>Origem</th>
              <th>Criticidade</th>
              <th>Cliente</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr className="clickable-row" key={`${item.modulo}-${item.funcionalidade}-${item.origem}-${item.status}`} onClick={() => onSelectDetail?.({ title: item.funcionalidade || 'Impacto selecionado', subtitle: item.modulo, badge: item.criticidade, badgeTone: item.criticidade, description: 'Impacto selecionado para análise de produto, cliente e ação necessária.', meta: [{ label: 'Módulo', value: item.modulo }, { label: 'Funcionalidade', value: item.funcionalidade }, { label: 'Origem', value: item.origem }, { label: 'Cliente', value: item.cliente }, { label: 'Status', value: item.status }], actions: ['Gerar ação', 'Ver documento', 'Marcar revisão'] })}>
                <td>{item.modulo || '-'}</td>
                <td>{item.funcionalidade || '-'}</td>
                <td>{item.origem || '-'}</td>
                <td><Badge tone={item.criticidade.toLowerCase()}>{item.criticidade || 'Não informado'}</Badge></td>
                <td>{item.cliente || 'Geral'}</td>
                <td><Badge tone="blue">{item.status || 'Sem status'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <p className="empty-note">Nenhum impacto encontrado na base.</p>}
      </div>

      {selected && (
        <div className="mobile-detail-card card">
          <h3>Detalhe selecionado</h3>
          <p className="muted">Prévia do primeiro impacto carregado para apoiar a validação da POC.</p>
          <div className="detail-grid">
            <span>Módulo</span><strong>{selected.modulo || '-'}</strong>
            <span>Funcionalidade</span><strong>{selected.funcionalidade || '-'}</strong>
            <span>Criticidade</span><strong>{selected.criticidade || '-'}</strong>
            <span>Status</span><strong>{selected.status || '-'}</strong>
          </div>
        </div>
      )}
    </>
  );
}