import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { InlineRowActions } from '../components/InlineRowActions';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { acoes } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAcoes } from '../services/radarApi';
import { getGeneratedRoadmapItems, getOperationalEventName } from '../services/operationalStore';
import type { PageProps } from '../App';

export function AnaliseAcoes({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const { data, source, loading, error, connectionState } = useAsyncData(fetchAcoes, acoes);
      const [generatedItems, setGeneratedItems] = useState(() => getGeneratedRoadmapItems());

      useEffect(() => {
        const refresh = () => setGeneratedItems(getGeneratedRoadmapItems());
        window.addEventListener(getOperationalEventName(), refresh);
        window.addEventListener('focus', refresh);
        refresh();
        return () => {
          window.removeEventListener(getOperationalEventName(), refresh);
          window.removeEventListener('focus', refresh);
        };
      }, []);

      const allItems = useMemo(() => [...generatedItems, ...data], [generatedItems, data]);

  const filtered = allItems.filter((item) => {
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
      <PageHeader title="Roadmap" subtitle="Decisões, priorizações e ações que transformam impacto em entrega" />
      <div className="tabs"><button className="active">Decisões</button><button>Priorização</button><button>Histórico</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} connectionState={connectionState} />

      <div className="kpi-grid four">
        <KpiCard label="Decisões pendentes" value={pendencias} trend="fila atual" tone="red" />
        <KpiCard label="Itens de roadmap" value={filtered.length} trend="decisões" tone="orange" />
        <KpiCard label="Concluídas" value={filtered.length - pendencias || '-'} trend="em evolução" tone="green" />
        <KpiCard label="Aguardando validação" value={aguardando} trend="validação" tone="blue" />
      </div>

      <SmartFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} prioridade={prioridade} onPrioridade={setPrioridade} responsavel={responsavel} onResponsavel={setResponsavel} placeholder="Buscar por resumo, origem ou número..." />

      <div className="card">
        <table>
          <thead><tr><th>Origem</th><th>Item de roadmap</th><th>Criticidade</th><th>Responsável</th><th>Prazo</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {filtered.map((a) => {
              const detail = {
                title: a.resumo,
                subtitle: a.origem,
                badge: a.criticidade,
                badgeTone: a.criticidade,
                description: 'Item de roadmap selecionado para decisão, priorização, vínculo com impacto e encaminhamento.',
                meta: [
                  { label: 'Origem', value: a.origem },
                  { label: 'Responsável', value: a.responsavel },
                  { label: 'Prazo', value: a.prazo },
                  { label: 'Status', value: a.status }
                ],
                actions: ['Priorizar item', 'Vincular impacto', 'Rejeitar']
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
        {filtered.length === 0 && <p className="empty-note">Nenhum item de roadmap encontrado para os filtros aplicados.</p>}
      </div>
    </>
  );
}
