import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { InlineRowActions } from '../components/InlineRowActions';
import { SmartFilters, normalizeFilterText } from '../components/SmartFilters';
import { documentos as mockDocumentos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchDocumentos } from '../services/radarApi';
import type { PageProps } from '../App';

const isActive = (status: string) => {
  const normalized = status.toLowerCase();
  return normalized.includes('ativo') || normalized.includes('publicado') || normalized.includes('vigente');
};

export function BaseConhecimento({ onSelectDetail, onOpenDetail }: PageProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { data, source, loading, error } = useAsyncData(fetchDocumentos, mockDocumentos);

  const filtered = data.filter((documento) => {
    const text = normalizeFilterText([documento.titulo, documento.tipo, documento.fonte, documento.publicacao, documento.status, documento.tags?.join(' ')].join(' '));
    return (!search || text.includes(normalizeFilterText(search))) && (!status || text.includes(normalizeFilterText(status)));
  });

  const total = filtered.length;
  const ativos = filtered.filter((item) => isActive(item.status)).length || total;
  const fontes = new Set(filtered.map((item) => item.fonte).filter(Boolean)).size;
  const tags = new Set(filtered.flatMap((item) => item.tags ?? [])).size;

  return (
    <>
      <PageHeader title="Base de Conhecimento" subtitle="Fontes, documentos, regras e evidências que alimentam o SUSi e os alertas" action={<button className="secondary-btn">Novo documento</button>} />
      <div className="tabs"><button className="active">Documentos</button><button>Fontes</button><button>Curadoria</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid four">
        <KpiCard label="Documentos ativos" value={ativos} trend="lista demonstrativa" tone="green" />
        <KpiCard label="Fontes monitoradas" value={fontes || '-'} trend="origens cadastradas" tone="blue" />
        <KpiCard label="Tags identificadas" value={tags || '-'} trend="classificação" tone="purple" />
        <KpiCard label="Curadoria pendente" value={0} trend="fila atual" tone="orange" />
      </div>

      <SmartFilters search={search} onSearch={setSearch} status={status} onStatus={setStatus} placeholder="Buscar documentos por título, fonte, tipo ou tag..." />

      <div className="card">
        <div className="section-title-row"><h3>Documentos monitorados</h3><span className="small-muted">{filtered.length} registros</span></div>
        <table>
          <thead><tr><th>Título</th><th>Tipo</th><th>Fonte</th><th>Publicação</th><th>Status</th><th>Tags</th><th>Ações</th></tr></thead>
          <tbody>
            {filtered.map((documento) => {
              const detail = {
                title: documento.titulo,
                subtitle: documento.fonte,
                badge: documento.status,
                badgeTone: documento.status,
                description: 'Documento selecionado como fonte de conhecimento para alertas, impactos, decisões e orientações do SUSi.',
                meta: [
                  { label: 'Tipo', value: documento.tipo },
                  { label: 'Fonte', value: documento.fonte },
                  { label: 'Publicação', value: documento.publicacao },
                  { label: 'Tags', value: documento.tags?.join(', ') || '-' }
                ],
                actions: ['Gerar alerta', 'Orientar com SUSi', 'Marcar curadoria']
              };
              return (
                <tr className="clickable-row" key={`${documento.titulo}-${documento.publicacao}-${documento.fonte}`} onClick={() => onSelectDetail?.(detail)}>
                  <td><strong>{documento.titulo}</strong><div className="table-subtitle">Base interna do Radar SUS</div></td>
                  <td>{documento.tipo}</td>
                  <td>{documento.fonte}</td>
                  <td>{documento.publicacao}</td>
                  <td><Badge tone={isActive(documento.status) ? 'green' : 'orange'}>{documento.status}</Badge></td>
                  <td><div className="tag-list">{documento.tags?.map((tag) => <Badge key={tag} tone="blue">{tag}</Badge>)}</div></td>
                  <td><InlineRowActions detail={detail} status={documento.status} prioridade="Média" responsavel="Moises Mattos" onOpenDetail={onOpenDetail} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="empty-note">Nenhum documento encontrado para os filtros aplicados.</p>}
      </div>
    </>
  );
}
