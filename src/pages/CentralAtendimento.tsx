import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { InlineRowActions } from '../components/InlineRowActions';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { atendimentos as mockAtendimentos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAtendimentos } from '../services/radarApi';
import type { PageProps } from '../App';

type Atendimento = {
  canal: string;
  cliente: string;
  assunto: string;
  prioridade: string;
  responsavel: string;
  ultima?: string;
  ultimaInteracao?: string;
  status: string;
  protocolo?: string;
  ticket?: string;
};

const isOpen = (status: string) => {
  const normalized = status.toLowerCase();
  return normalized.includes('aberto') || normalized.includes('andamento') || normalized.includes('atendimento') || normalized.includes('pendente') || normalized.includes('novo');
};

const isRisk = (prioridade: string, status: string) => {
  const p = prioridade.toLowerCase();
  const s = status.toLowerCase();
  return p.includes('alta') || p.includes('crít') || s.includes('pendente');
};

const formatDate = (value?: string) => value || '-';

export function CentralAtendimento({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const result = useAsyncData(fetchAtendimentos, mockAtendimentos as Atendimento[]);
  const data = result.data as Atendimento[];

  const filtered = data.filter((item) => {
    const text = normalizeFilterText([item.canal, item.cliente, item.assunto, item.prioridade, item.responsavel, item.status].join(' '));
    return (!search || text.includes(normalizeFilterText(search))) &&
      (!status || text.includes(normalizeFilterText(status))) &&
      (!prioridade || text.includes(normalizeFilterText(prioridade))) &&
      (!responsavel || text.includes(normalizeFilterText(responsavel)));
  });

  const abertos = filtered.filter((item) => isOpen(item.status)).length;
  const risco = filtered.filter((item) => isRisk(item.prioridade, item.status)).length;
  const canais = new Set(filtered.map((item) => item.canal).filter(Boolean)).size;

  return (
    <>
      <PageHeader title="Central de Atendimento" subtitle="Atendimentos, tickets e integrações em acompanhamento" action={<button className="secondary-btn">Novo atendimento</button>} />
      <div className="tabs"><button className="active">Atendimentos</button><button>Tickets</button><button>Integrações</button></div>
      <DataSourceNotice source={result.source} loading={result.loading} error={result.error} />

      <div className="kpi-grid four">
        <KpiCard label="Atendimentos abertos" value={abertos} trend="+4" tone="green" />
        <KpiCard label="Tickets externos" value={0} trend="vinculados" tone="blue" />
        <KpiCard label="SLA em risco" value={risco} trend="atenção necessária" tone="red" />
        <KpiCard label="Canais ativos" value={canais || '-'} trend="integrações na base" tone="orange" />
      </div>

      <SmartFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} prioridade={prioridade} onPrioridade={setPrioridade} responsavel={responsavel} onResponsavel={setResponsavel} placeholder="Buscar atendimento, cliente, protocolo ou assunto..." />

      <div className="card">
        <div className="section-title-row"><h3>Atendimentos em acompanhamento</h3><span className="small-muted">{filtered.length} registros</span></div>
        <table>
          <thead><tr><th>Canal</th><th>Cliente</th><th>Assunto</th><th>Prioridade</th><th>Responsável</th><th>Última interação</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {filtered.map((atendimento) => {
              const detail = {
                title: atendimento.assunto || 'Atendimento selecionado',
                subtitle: atendimento.cliente,
                badge: atendimento.prioridade,
                badgeTone: atendimento.prioridade,
                description: 'Atendimento selecionado para acompanhamento operacional e vínculo com ticket.',
                meta: [
                  { label: 'Canal', value: atendimento.canal },
                  { label: 'Cliente', value: atendimento.cliente },
                  { label: 'Responsável', value: atendimento.responsavel },
                  { label: 'Última interação', value: formatDate(atendimento.ultimaInteracao ?? atendimento.ultima) },
                  { label: 'Status', value: atendimento.status },
                  { label: 'Ticket', value: atendimento.ticket || '-' }
                ],
                actions: ['Responder', 'Abrir ticket', 'Vincular alerta']
              };
              return (
                <tr className="clickable-row" key={`${atendimento.protocolo ?? atendimento.cliente}-${atendimento.assunto}`} onClick={() => onSelectDetail?.(detail)}>
                  <td><Badge tone="blue">{atendimento.canal}</Badge></td>
                  <td>{atendimento.cliente}</td>
                  <td><strong>{atendimento.assunto}</strong><div className="table-subtitle">{atendimento.protocolo ?? 'sem protocolo'}</div></td>
                  <td><Badge tone={atendimento.prioridade.toLowerCase()}>{atendimento.prioridade}</Badge></td>
                  <td>{atendimento.responsavel}</td>
                  <td>{formatDate(atendimento.ultimaInteracao ?? atendimento.ultima)}</td>
                  <td><Badge tone="blue">{atendimento.status}</Badge></td>
                  <td><InlineRowActions detail={detail} status={atendimento.status} prioridade={atendimento.prioridade} responsavel={atendimento.responsavel} onOpenDetail={onOpenDetail} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-note">Nenhum atendimento encontrado para os filtros aplicados.</p>}
      </div>
    </>
  );
}
