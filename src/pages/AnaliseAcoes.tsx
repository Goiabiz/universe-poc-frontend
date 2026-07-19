import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { InlineRowActions } from '../components/InlineRowActions';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { acoes } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAcoes } from '../services/radarApi';
import type { PageProps } from '../App';

export function AnaliseAcoes({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const { data, source, loading, error } = useAsyncData(fetchAcoes, acoes);

  const filtered = data.filter((item) => {
    const text = normalizeFilterText([item.origem, item.resumo, item.criticidade, item.responsavel, item.prazo, item.status].join(' '));
    return (!search || text.includes(normalizeFilterText(search))) &&
      (!status || text.includes(normalizeFilterText(status))) &&
      (!prioridade || text.includes(normalizeFilterText(prioridade))) &&
      (!responsavel || text.includes(normalizeFilterText(responsavel)));
  });

  const pendencias = filtered.filter((item) => !item.status.toLowerCase().includes('concl')).length;
  const aguardando = filtered.filter((item) => item.status.toLowerCase().includes('valid')).length;

  return (
    <>
      <PageHeader title="Análise e Ações" subtitle="Triagem, decisão e encaminhamento operacional" />
      <div className="tabs"><button className="active">Pendências</button><button>Histórico</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid four">
        <KpiCard label="Pendências" value={pendencias} trend="fila atual" tone="red" />
        <KpiCard label="Ações geradas" value={filtered.length} trend="decisões" tone="orange" />
        <KpiCard label="Concluídas" value={filtered.length - pendencias || '-'} trend="em evolução" tone="green" />
        <KpiCard label="Aguardando validação" value={aguardando} trend="validação" tone="blue" />
      </div>

      <SmartFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} prioridade={prioridade} onPrioridade={setPrioridade} responsavel={responsavel} onResponsavel={setResponsavel} placeholder="Buscar por resumo, origem ou número..." />

      <div className="card">
        <table>
          <thead><tr><th>Origem</th><th>Resumo</th><th>Criticidade</th><th>Responsável</th><th>Prazo</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {filtered.map((a) => {
              const detail = {
                title: a.resumo,
                subtitle: a.origem,
                badge: a.criticidade,
                badgeTone: a.criticidade,
                description: 'Pendência selecionada para decisão, validação ou encaminhamento.',
                meta: [
                  { label: 'Origem', value: a.origem },
                  { label: 'Responsável', value: a.responsavel },
                  { label: 'Prazo', value: a.prazo },
                  { label: 'Status', value: a.status }
                ],
                actions: ['Aprovar ação', 'Ver documento', 'Rejeitar']
              };
              return (
                <tr className="clickable-row" key={`${a.origem}-${a.resumo}`} onClick={() => onSelectDetail?.(detail)}>
                  <td>{a.origem}</td>
                  <td><strong>{a.resumo}</strong></td>
                  <td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td>
                  <td>{a.responsavel}</td>
                  <td>{a.prazo}</td>
                  <td><Badge tone="orange">{a.status}</Badge></td>
                  <td><InlineRowActions detail={detail} status={a.status} prioridade={a.criticidade} responsavel={a.responsavel} onOpenDetail={onOpenDetail} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-note">Nenhuma ação encontrada para os filtros aplicados.</p>}
      </div>
    </>
  );
}
