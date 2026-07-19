import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { InlineRowActions } from '../components/InlineRowActions';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { alertas } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAlertas } from '../services/radarApi';
import type { PageProps } from '../App';

export function Alertas({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [modulo, setModulo] = useState('');
  const { data, source, loading, error } = useAsyncData(fetchAlertas, alertas);

  const filtered = data.filter((item) => {
    const text = normalizeFilterText([item.titulo, item.fonte, item.status, item.criticidade, item.modulo, item.funcionalidade].join(' '));
    return (!search || text.includes(normalizeFilterText(search))) &&
      (!status || text.includes(normalizeFilterText(status))) &&
      (!prioridade || text.includes(normalizeFilterText(prioridade))) &&
      (!modulo || text.includes(normalizeFilterText(modulo)));
  });

  const totalCriticos = filtered.filter((item) => item.criticidade.toLowerCase().includes('crít') || item.criticidade.toLowerCase().includes('crit')).length;
  const emAnalise = filtered.filter((item) => item.status.toLowerCase().includes('análise') || item.status.toLowerCase().includes('analise')).length;
  const concluidos = filtered.filter((item) => item.status.toLowerCase().includes('concl')).length;

  return (
    <>
      <PageHeader title="Alertas Inteligentes" subtitle="Monitoramento proativo de mudanças e riscos" />
      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid four">
        <KpiCard label="Alertas totais" value={filtered.length} trend="lista atual" tone="blue" />
        <KpiCard label="Críticos" value={totalCriticos} trend="atenção" tone="red" />
        <KpiCard label="Em análise" value={emAnalise} trend="triagem" tone="orange" />
        <KpiCard label="Concluídos" value={concluidos} trend="fechados" tone="green" />
      </div>

      <div className="tabs"><button className="active">Todos</button><button>Críticos</button><button>Pendentes</button><button>Em análise</button><button>Concluídos</button></div>
      <SmartFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} prioridade={prioridade} onPrioridade={setPrioridade} modulo={modulo} onModulo={setModulo} placeholder="Buscar alerta, fonte, módulo ou funcionalidade..." />

      <div className="card">
        <table>
          <thead><tr><th>Criticidade</th><th>Título do alerta</th><th>Fonte</th><th>Data/Hora</th><th>Módulo / Funcionalidade</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {filtered.map((a) => {
              const detail = {
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
              };
              return (
                <tr className="clickable-row" key={`${a.titulo}-${a.data}`} onClick={() => onSelectDetail?.(detail)}>
                  <td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td>
                  <td><strong>{a.titulo}</strong></td>
                  <td>{a.fonte}</td>
                  <td>{a.data}</td>
                  <td>{a.modulo || '-'}<br/><span>{a.funcionalidade || '-'}</span></td>
                  <td><Badge tone="blue">{a.status}</Badge></td>
                  <td><InlineRowActions detail={detail} status={a.status} prioridade={a.criticidade} responsavel="Moises Mattos" onOpenDetail={onOpenDetail} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-note">Nenhum alerta encontrado para os filtros aplicados.</p>}
      </div>
    </>
  );
}
