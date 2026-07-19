import { Maximize2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { atendimentos as mockAtendimentos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAtendimentos } from '../services/radarApi';
import type { PageProps } from '../App';

const isOpen = (status: string) => {
  const normalized = status.toLowerCase();
  return (
    normalized.includes('aberto') ||
    normalized.includes('andamento') ||
    normalized.includes('em atendimento') ||
    normalized.includes('pendente') ||
    normalized.includes('novo')
  );
};

const isRisk = (prioridade: string, status: string) => {
  const normalizedPriority = prioridade.toLowerCase();
  const normalizedStatus = status.toLowerCase();

  return (
    normalizedPriority.includes('alta') ||
    normalizedPriority.includes('crítica') ||
    normalizedPriority.includes('critica') ||
    normalizedStatus.includes('risco') ||
    normalizedStatus.includes('atras')
  );
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function CentralAtendimento({ onSelectDetail, onOpenDetail }: PageProps) {
  const { data, source, loading, error } = useAsyncData(fetchAtendimentos, mockAtendimentos);

  const total = data.length;
  const abertos = data.filter((item) => isOpen(item.status)).length || total;
  const ticketsExternos = data.filter((item) => Boolean(item.ticket)).length;
  const slaRisco = data.filter((item) => isRisk(item.prioridade, item.status)).length;
  const integracoes = new Set(data.map((item) => item.canal).filter(Boolean)).size;

  const selected = data[0];

  return (
    <>
      <PageHeader
        title="Central de Atendimento"
        subtitle="Atendimentos, tickets e integrações em acompanhamento"
        action={<button className="secondary-btn">Novo atendimento</button>}
      />

      <div className="tabs">
        <button className="active">Atendimentos</button>
        <button>Tickets</button>
        <button>Integrações</button>
      </div>

      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid four">
        <KpiCard label="Atendimentos abertos" value={String(abertos)} trend={source === 'supabase' ? 'fila atual' : '+4 vs ontem'} tone="green" />
        <KpiCard label="Tickets externos" value={String(ticketsExternos)} trend="vinculados" tone="blue" />
        <KpiCard label="SLA em risco" value={String(slaRisco)} trend={slaRisco > 0 ? 'atenção necessária' : 'sem risco crítico'} tone="red" />
        <KpiCard label="Canais ativos" value={String(integracoes)} trend="integrações na base" tone="orange" />
      </div>

      <div className="toolbar">
        <button>Canal</button>
        <button>Prioridade</button>
        <button>Responsável</button>
        <input placeholder="Buscar atendimento, cliente, protocolo ou assunto..." />
        <button>Filtros</button>
      </div>

      <div className="card">
        <div className="section-title-row">
          <h3>Atendimentos em acompanhamento</h3>
          <span className="small-muted">{data.length} registros</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Canal</th>
              <th>Cliente</th>
              <th>Assunto</th>
              <th>Prioridade</th>
              <th>Responsável</th>
              <th>Última interação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((atendimento) => (
              <tr className="clickable-row" key={`${atendimento.protocolo}-${atendimento.assunto}-${atendimento.cliente}`} onClick={() => onSelectDetail?.({ title: atendimento.assunto || 'Atendimento selecionado', subtitle: atendimento.cliente, badge: atendimento.prioridade, badgeTone: atendimento.prioridade, description: 'Atendimento selecionado para acompanhamento operacional e vínculo com ticket.', meta: [{ label: 'Canal', value: atendimento.canal }, { label: 'Cliente', value: atendimento.cliente }, { label: 'Responsável', value: atendimento.responsavel }, { label: 'Última interação', value: formatDate(atendimento.ultimaInteracao) }, { label: 'Status', value: atendimento.status }, { label: 'Ticket', value: atendimento.ticket || '-' }], actions: ['Responder', 'Abrir ticket', 'Vincular alerta'] })}>
                <td><Badge tone="blue">{atendimento.canal || '-'}</Badge></td>
                <td>{atendimento.cliente || '-'}</td>
                <td>
                  <strong>{atendimento.assunto || '-'}</strong>
                  <div className="table-subtitle">{atendimento.protocolo || 'sem protocolo'}</div>
                </td>
                <td><Badge tone={isRisk(atendimento.prioridade, atendimento.status) ? 'red' : 'orange'}>{atendimento.prioridade || '-'}</Badge></td>
                <td>{atendimento.responsavel || '-'}</td>
                <td>{formatDate(atendimento.ultimaInteracao)}</td>
                <td><Badge tone="blue">{atendimento.status || 'Sem status'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && <p className="empty-note">Nenhum atendimento encontrado na base.</p>}
      </div>

      {selected && (
        <div className="card atendimento-preview">
          <div>
            <h3>Prévia do atendimento selecionado</h3>
            <p className="muted">Esta área prepara o desenho para timeline, mensagens, ticket externo e ações rápidas.</p>
          </div>
          <div className="detail-grid">
            <span>Cliente</span><strong>{selected.cliente || '-'}</strong>
            <span>Assunto</span><strong>{selected.assunto || '-'}</strong>
            <span>Canal</span><strong>{selected.canal || '-'}</strong>
            <span>Ticket</span><strong>{selected.ticket || '-'}</strong>
          </div>
        </div>
      )}
    </>
  );
}