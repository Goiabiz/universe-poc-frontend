import { useState } from 'react';
import { FileText, Pencil, Maximize2, ExternalLink, Info, PlusCircle, Table2, ShieldCheck, PenLine, Database } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/Badge';
import { KpiCard } from '../components/KpiCard';
import { KnowledgeActionsMenu } from '../components/KnowledgeActionsMenu';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { documentos as mockDocumentos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchDocumentos } from '../services/radarApi';
import type { PageProps } from '../App';

const statusOptions = ['Novo', 'Em análise', 'Ativo', 'Cancelado'];
const classificacoes = ['Normativo', 'Operacional', 'Estratégico', 'Comercial', 'Técnico'];
const responsaveis = ['Moises Mattos', 'Bruno Oliveira', 'Mariana Lima', 'Juliana Costa'];

const normalizeStatus = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes('ativo') || normalized.includes('oficial') || normalized.includes('vigente') || normalized.includes('publicado')) return 'Ativo';
  if (normalized.includes('cancel') || normalized.includes('descart')) return 'Cancelado';
  if (normalized.includes('análise') || normalized.includes('analise') || normalized.includes('bruto')) return 'Em análise';
  return 'Novo';
};

const getClassification = (tags?: string[]) => {
  const joined = (tags ?? []).join(' ').toLowerCase();
  if (joined.includes('site') || joined.includes('institucional') || joined.includes('legis')) return 'Normativo';
  if (joined.includes('financ') || joined.includes('fatur')) return 'Operacional';
  if (joined.includes('concorr')) return 'Comercial';
  return 'Técnico';
};

const getOrigin = (tipo: string, titulo?: string) => {
  const normalized = `${tipo} ${titulo ?? ''}`.toLowerCase();

  if (normalized.includes('youtube') || normalized.includes('vídeo') || normalized.includes('video')) return { icon: <ExternalLink size={17} />, label: 'Canal de vídeo', tone: 'red' };
  if (normalized.includes('instagram') || normalized.includes('facebook') || normalized.includes('tiktok') || normalized.includes('linkedin') || normalized.includes('rede social')) return { icon: <ExternalLink size={17} />, label: 'Rede social', tone: 'purple' };
  if (normalized.includes('planilha') || normalized.includes('excel')) return { icon: <Table2 size={17} />, label: 'Planilha ou base tabular', tone: 'green' };
  if (normalized.includes('portaria') || normalized.includes('nota técnica') || normalized.includes('norma')) return { icon: <ShieldCheck size={17} />, label: 'Norma ou regra oficial', tone: 'blue' };
  if (normalized.includes('cadastro manual')) return { icon: <PenLine size={17} />, label: 'Cadastro manual', tone: 'purple' };
  if (normalized.includes('link') || normalized.includes('site') || normalized.includes('página') || normalized.includes('wiki') || normalized.includes('guia')) return { icon: <ExternalLink size={17} />, label: 'Página, Wiki ou fonte externa', tone: 'cyan' };
  if (normalized.includes('api') || normalized.includes('integração') || normalized.includes('integracao')) return { icon: <Database size={17} />, label: 'API ou integração', tone: 'green' };
  if (normalized.includes('atendimento') || normalized.includes('ticket')) return { icon: <FileText size={17} />, label: 'Atendimento ou ticket', tone: 'slate' };

  return { icon: <FileText size={17} />, label: 'Documento ou arquivo', tone: 'slate' };
};

const today = new Date().toLocaleDateString('pt-BR');

export function BaseConhecimento({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { data, source, loading, error, connectionState } = useAsyncData(fetchDocumentos, mockDocumentos);

  const filtered = data.filter((documento) => {
    const semanticStatus = normalizeStatus(documento.status);
    const classification = getClassification(documento.tags);
    const text = normalizeFilterText([
      documento.titulo,
      documento.tipo,
      documento.fonte,
      documento.publicacao,
      semanticStatus,
      classification,
      documento.tags?.join(' ')
    ].join(' '));
    return (!search || text.includes(normalizeFilterText(search))) && (!status || text.includes(normalizeFilterText(status)));
  });

  const ativos = filtered.filter((item) => normalizeStatus(item.status) === 'Ativo').length;
  const fontes = new Set(filtered.map((item) => item.fonte).filter(Boolean)).size;
  const grupos = new Set(filtered.flatMap((item) => item.tags ?? [])).size;
  const analises = filtered.filter((item) => normalizeStatus(item.status) === 'Em análise' || normalizeStatus(item.status) === 'Novo').length;

  const applyShortcut = (value: string) => setStatus(value);

  const buildDetail = (documento: (typeof data)[number]) => {
    const semanticStatus = normalizeStatus(documento.status);
    const classification = getClassification(documento.tags);
    return {
      title: documento.titulo,
      subtitle: documento.fonte,
      badge: semanticStatus,
      badgeTone: semanticStatus === 'Ativo' ? 'green' : semanticStatus === 'Cancelado' ? 'red' : 'orange',
      description: 'Conhecimento cadastrado na base para consulta, análise, geração de alertas, impactos, orientações e tarefas.',
      meta: [
        { label: 'Origem', value: documento.tipo },
        { label: 'Fonte', value: documento.fonte },
        { label: 'Incluído em', value: today },
        { label: 'Data da fonte', value: documento.publicacao || '-' },
        { label: 'Grupo', value: documento.tags?.join(', ') || '-' },
        { label: 'Status', value: semanticStatus },
        { label: 'Classificação', value: classification },
        { label: 'Responsável', value: 'Moises Mattos' },
        { label: 'Monitoramento', value: semanticStatus === 'Ativo' ? 'Disponível para configurar' : 'Após ativação' }
      ],
      actions: ['Gerar alerta', 'Adicionar tarefa', 'Cancelar']
    };
  };

  return (
    <>
      <PageHeader
        title="Base de Conhecimento"
        subtitle="Gerencie fontes, conteúdos e regras que servem de base para alertas, análises e tarefas."
        action={<button className="secondary-btn"><PlusCircle size={16} /> Adicionar Conhecimento</button>}
      />
      <div className="tabs"><button className="active">Conhecimentos</button><button className="disabled-tab" title="Visão de fontes prevista para próxima etapa">Fontes</button><button className="disabled-tab" title="Visão de análises prevista para próxima etapa">Análises</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} connectionState={connectionState} />

      <div className="kpi-grid four knowledge-kpis">
        <div className="tooltip-kpi" title="Total de conhecimentos ativos e disponíveis para consulta por usuários, agentes configurados, alertas, impactos e orientações.">
          <KpiCard label="Conhecimentos ativos" value={ativos || filtered.length} tone="green" />
          <Info className="kpi-tooltip-icon" size={14} />
        </div>
        <div className="tooltip-kpi" title="Fontes cadastradas ou monitoradas que originam conhecimentos na base.">
          <KpiCard label="Fontes monitoradas" value={fontes || '-'} tone="blue" />
          <Info className="kpi-tooltip-icon" size={14} />
        </div>
        <div className="tooltip-kpi" title="Agrupamentos usados para classificar, localizar e relacionar conhecimentos.">
          <KpiCard label="Grupos" value={grupos || '-'} tone="purple" />
          <Info className="kpi-tooltip-icon" size={14} />
        </div>
        <div className="tooltip-kpi" title="Conhecimentos novos ou em análise que ainda não foram ativados ou cancelados.">
          <KpiCard label="Análises pendentes" value={analises} tone="orange" />
          <Info className="kpi-tooltip-icon" size={14} />
        </div>
      </div>

      <SmartFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        placeholder="Buscar conhecimento por descrição, fonte, grupo ou assunto..."
      />

      <div className="card knowledge-table-card">
        <div className="section-title-row"><h3>Conhecimentos monitorados</h3><span className="small-muted">{filtered.length} registros</span></div>
        <table className="knowledge-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Origem</th>
              <th>Fonte</th>
              <th>Incluído em</th>
              <th>Data da fonte</th>
              <th>Grupo</th>
              <th>Status</th>
              <th>Classificação</th>
              <th>Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((documento) => {
              const detail = buildDetail(documento);
              const key = `${documento.titulo}-${documento.publicacao}-${documento.fonte}`;
              const semanticStatus = normalizeStatus(documento.status);
              const classification = getClassification(documento.tags);

              return (
                <tr className="clickable-row" key={key}>
                  <td className="knowledge-description-cell">
                        <div className="knowledge-description-inline">
                          <button className="row-title-button" onClick={() => onSelectDetail?.(detail)}>
                            <strong>{documento.titulo}</strong>
                            <span>Base interna do Radar SUS</span>
                          </button>
                          <button className="row-icon-btn row-edit-hover" title="Editar descrição"><Pencil size={15} /></button>
                        </div>
                      </td>
                  <td>
                        {(() => {
                          const origin = getOrigin(documento.tipo, documento.titulo);
                          return <span className={`origin-icon origin-${origin.tone}`} title={`Origem: ${origin.label}`}>{origin.icon}</span>;
                        })()}
                      </td>
                  <td>{documento.fonte}</td>
                  <td>{today}</td>
                  <td>{documento.publicacao || '-'}</td>
                  <td><div className="tag-list">{(documento.tags ?? ['Sem grupo']).slice(0, 2).map((tag) => <Badge key={tag} tone="blue">{tag}</Badge>)}</div></td>
                  <td>
                    <select className="semantic-select" defaultValue={semanticStatus} title="Status do conhecimento">
                      {statusOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="semantic-select" defaultValue={classification} title="Classificação do conhecimento">
                      {classificacoes.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="semantic-select responsible" defaultValue="Moises Mattos" title="Responsável pelo conhecimento">
                      {responsaveis.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="row-action-group" onClick={(event) => event.stopPropagation()}>
                      <button className="row-icon-btn" title="Expandir em modal" onClick={() => { setOpenMenu(null); onOpenDetail?.(detail); }}><Maximize2 size={15} /></button>
                      <button className="row-icon-btn" title="Acessar em nova guia" onClick={() => { setOpenMenu(null); window.open(`${window.location.origin}/?base=${encodeURIComponent(documento.titulo)}`, '_blank'); }}><ExternalLink size={15} /></button>
                      <KnowledgeActionsMenu id={key} title={documento.titulo} openMenuId={openMenu} setOpenMenuId={setOpenMenu} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-note">Nenhum conhecimento encontrado para os filtros aplicados.</p>}
      </div>
    </>
  );
}
