import { useMemo, useState } from 'react';
import { BellPlus, ExternalLink, Maximize2, Pencil } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { AlertActionsMenu } from '../components/AlertActionsMenu';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { alertas as mockAlertas } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAlertas } from '../services/radarApi';
import type { PageProps } from '../App';

const statusOptions = ['Novo', 'Em andamento', 'Concluído'];
const prioridades = ['Baixa', 'Média', 'Alta', 'Crítico'];
const responsaveis = ['Moises Mattos', 'Bruno Oliveira', 'Mariana Lima', 'Juliana Costa'];
const canais = ['Usuários do sistema', 'E-mail', 'WhatsApp', 'Equipe', 'Clientes'];
const isClosed = (status: string) => status.toLowerCase().includes('concl') || status.toLowerCase().includes('cancel') || status.toLowerCase().includes('exclu');
const isCritical = (criticidade: string) => criticidade.toLowerCase().includes('crít') || criticidade.toLowerCase().includes('crit');
const normalizeStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('concl')) return 'Concluído';
  if (s.includes('novo')) return 'Novo';
  return 'Em andamento';
};

export function Alertas({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [canal, setCanal] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { data, source, loading, error, connectionState } = useAsyncData(fetchAlertas, mockAlertas);

  const alertas = useMemo(() => data.map((item, index) => ({
    ...item,
    status: normalizeStatus(item.status),
    emitidoEm: item.data,
    responsavel: responsaveis[index % responsaveis.length],
    canal: canais[index % canais.length],
    comunicados: index === 0 ? 12 : index === 1 ? 8 : index === 2 ? 4 : 2,
    tarefas: index === 0 ? 1 : index === 1 ? 2 : 0,
    contexto: [item.modulo, item.funcionalidade].filter(Boolean).join(' / ') || 'Contexto não informado'
  })), [data]);

  const filtered = alertas.filter((item) => {
    const text = normalizeFilterText([item.titulo, item.status, item.criticidade, item.responsavel, item.canal, item.contexto].join(' '));
    return (!search || text.includes(normalizeFilterText(search))) &&
      (!status || item.status === status) &&
      (!prioridade || item.criticidade === prioridade) &&
      (!canal || item.canal === canal);
  });

  const ativos = filtered.filter((item) => !isClosed(item.status)).length;
  const criticosAbertos = filtered.filter((item) => isCritical(item.criticidade) && !isClosed(item.status)).length;
  const emAndamento = filtered.filter((item) => item.status === 'Em andamento').length;
  const comunicados = filtered.reduce((acc, item) => acc + item.comunicados, 0);
  const tarefasGeradas = filtered.reduce((acc, item) => acc + item.tarefas, 0);

  const openDetail = (a: (typeof alertas)[number]) => {
    onSelectDetail?.({
      title: a.titulo,
      subtitle: `Alerta emitido em ${a.emitidoEm}`,
      badge: a.criticidade,
      badgeTone: a.criticidade,
      description: 'Alerta monitorado para comunicação, tratamento e geração de ações posteriores.',
      meta: [
        { label: 'Status', value: a.status },
        { label: 'Prioridade', value: a.criticidade },
        { label: 'Responsável', value: a.responsavel },
        { label: 'Emitido em', value: a.emitidoEm },
        { label: 'Canal principal', value: a.canal },
        { label: 'Comunicados enviados', value: a.comunicados },
        { label: 'Tarefas', value: a.tarefas },
        { label: 'Contexto', value: a.contexto }
      ],
      actions: ['Divulgar alerta', 'Encaminhar para tarefa', 'Vincular tarefa', 'Acionar agente', 'Concluir alerta']
    });
  };

  const openModal = (a: (typeof alertas)[number]) => {
    onOpenDetail?.({
      title: a.titulo,
      subtitle: `Alerta · ${a.status}`,
      badge: a.criticidade,
      badgeTone: a.criticidade,
      description: 'Visualização rápida do alerta. Use a Central de Alertas para monitorar comunicação, tratamento e tarefas geradas.',
      meta: [
        { label: 'Status', value: a.status },
        { label: 'Prioridade', value: a.criticidade },
        { label: 'Responsável', value: a.responsavel },
        { label: 'Emitido em', value: a.emitidoEm },
        { label: 'Canal principal', value: a.canal },
        { label: 'Comunicados enviados', value: a.comunicados },
        { label: 'Tarefas', value: a.tarefas }
      ],
      actions: ['Divulgar alerta', 'Encaminhar para tarefa', 'Concluir alerta']
    });
  };

  const actionButtons = (a: (typeof alertas)[number], key: string) => (
    <div className="alert-actions" onClick={(event) => event.stopPropagation()}>
<button className="row-icon-btn" title="Abrir detalhe" onClick={() => openDetail(a)}><ExternalLink size={15} /></button>
      <button className="row-icon-btn" title="Abrir em modal" onClick={() => openModal(a)}><Maximize2 size={15} /></button>
      <AlertActionsMenu id={key} openMenuId={openMenu} setOpenMenuId={setOpenMenu} />
    </div>
  );

  return (
    <>
      <PageHeader
        title="Central de Alertas"
        subtitle="Monitore avisos, divulgue para as pessoas certas e acompanhe as ações geradas."
        action={<button className="secondary-btn"><BellPlus size={16} /> Cadastrar alerta</button>}
      />
      <DataSourceNotice source={source} loading={loading} error={error} connectionState={connectionState} />

      <div className="kpi-grid five alert-kpis">
        <KpiCard label="Alertas ativos" value={ativos} tone="blue" tooltip="Alertas que ainda não foram concluídos, cancelados ou excluídos." />
        <KpiCard label="Alta prioridade" value={criticosAbertos} tone="red" tooltip="Alertas de maior prioridade que ainda exigem tratamento. Alertas concluídos não entram nesta contagem." />
        <KpiCard label="Em andamento" value={emAndamento} tone="orange" tooltip="Alertas que já estão sendo tratados, comunicados ou acompanhados." />
        <KpiCard label="Comunicados enviados" value={comunicados} tone="cyan" tooltip="Total de destinatários ou canais que receberam divulgação dos alertas filtrados." />
        <KpiCard label="Tarefas" value={tarefasGeradas} tone="green" tooltip="Tarefas criadas automaticamente ou manualmente a partir dos alertas." />
      </div>

      <div className="tabs alert-status-tabs">
        <button className={!status ? 'active' : ''} onClick={() => setStatus('')}>Todos</button>
        {statusOptions.map((option) => <button key={option} className={status === option ? 'active' : ''} onClick={() => setStatus(option)}>{option}</button>)}
      </div>

      <SmartFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        prioridade={prioridade}
        onPrioridade={setPrioridade}
        modulo={canal}
        onModulo={setCanal}
        placeholder="Buscar por descrição, responsável, canal ou contexto..."
      />

      <div className="card alert-table-card">
        <div className="section-title-row">
          <h3>Alertas</h3>
          <span className="small-muted">{filtered.length} registros</span>
        </div>

        <table className="alert-table">
          <thead>
            <tr>
              <th>Descrição do alerta</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Responsável</th>
              <th>Emitido em</th>
              <th>Tarefas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, index) => {
              const key = `${a.titulo}-${a.emitidoEm}-${index}`;
              return (
                <tr className="clickable-row alert-row" key={key} onClick={() => openDetail(a)}>
                  <td className="alert-description-cell">
                    <div className="knowledge-description-inline">
                      <button className="row-title-button" onClick={(event) => { event.stopPropagation(); openDetail(a); }}>
                        <strong>{a.titulo}</strong>
                        <span>{a.contexto}</span>
                      </button>
                      <button className="row-icon-btn row-edit-hover" title="Editar descrição" onClick={(event) => event.stopPropagation()}><Pencil size={15} /></button>
                    </div>
                  </td>
                  <td>
                    <select className="semantic-select" defaultValue={a.status} title="Status do alerta" onClick={(event) => event.stopPropagation()}>
                      {statusOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </td>
                  <td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td>
                  <td>
                    <select className="semantic-select" defaultValue={a.responsavel} title="Responsável" onClick={(event) => event.stopPropagation()}>
                      {responsaveis.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>{a.emitidoEm}</td>
<td className="task-count-cell"><strong>{a.tarefas}</strong></td>
                  <td onClick={(event) => event.stopPropagation()}>{actionButtons(a, key)}</td>
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
