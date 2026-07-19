import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { documentos as mockDocumentos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchDocumentos } from '../services/radarApi';

const isActive = (status: string) => {
  const normalized = status.toLowerCase();
  return normalized.includes('ativo') || normalized.includes('publicado') || normalized.includes('vigente');
};

export function BaseConhecimento() {
  const { data, source, loading, error } = useAsyncData(fetchDocumentos, mockDocumentos);

  const total = data.length;
  const ativos = data.filter((item) => isActive(item.status)).length || total;
  const fontes = new Set(data.map((item) => item.fonte).filter(Boolean)).size;
  const tags = new Set(data.flatMap((item) => item.tags ?? []).filter(Boolean)).size;
  const curadoriaPendente = data.filter((item) => item.status.toLowerCase().includes('pendente')).length;

  const selected = data[0];

  return (
    <>
      <PageHeader
        title="Base de Conhecimento"
        subtitle="Conteúdo monitorado, fontes cadastradas e curadoria da base"
        action={<button className="secondary-btn">Novo documento</button>}
      />

      <div className="tabs">
        <button className="active">Documentos</button>
        <button>Fontes</button>
        <button>Curadoria</button>
      </div>

      <DataSourceNotice source={source} loading={loading} error={error} />

      <div className="kpi-grid four">
        <KpiCard label="Documentos ativos" value={String(ativos)} trend={source === 'supabase' ? 'base atual' : 'lista demonstrativa'} tone="green" />
        <KpiCard label="Fontes monitoradas" value={String(fontes)} trend="origens cadastradas" tone="blue" />
        <KpiCard label="Tags identificadas" value={String(tags)} trend="classificação" tone="purple" />
        <KpiCard label="Curadoria pendente" value={String(curadoriaPendente)} trend="fila atual" tone="orange" />
      </div>

      <div className="toolbar">
        <input placeholder="Buscar documentos por título, fonte, tipo ou tag..." />
        <button>Filtros</button>
        <button>Tipo</button>
        <button>Fonte</button>
        <button>Status</button>
      </div>

      <div className="card">
        <div className="section-title-row">
          <h3>Documentos monitorados</h3>
          <span className="small-muted">{data.length} registros</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Fonte</th>
              <th>Publicação</th>
              <th>Status</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {data.map((documento) => (
              <tr key={`${documento.titulo}-${documento.publicacao}-${documento.fonte}`}>
                <td>
                  <strong>{documento.titulo}</strong>
                  <div className="table-subtitle">Base interna do Radar SUS</div>
                </td>
                <td>{documento.tipo || '-'}</td>
                <td>{documento.fonte || '-'}</td>
                <td>{documento.publicacao || '-'}</td>
                <td><Badge tone={isActive(documento.status) ? 'green' : 'orange'}>{documento.status || 'Sem status'}</Badge></td>
                <td className="tag-cell">
                  {(documento.tags?.length ? documento.tags : ['sem tag']).map((tag) => (
                    <Badge key={`${documento.titulo}-${tag}`} tone="blue">{tag}</Badge>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && <p className="empty-note">Nenhum documento encontrado na base.</p>}
      </div>

      {selected && (
        <div className="card knowledge-preview">
          <div>
            <h3>Prévia do documento selecionado</h3>
            <p className="muted">Esta área prepara o desenho para abrir detalhes, trechos indexados, vínculos e curadoria.</p>
          </div>
          <div className="detail-grid">
            <span>Título</span><strong>{selected.titulo}</strong>
            <span>Tipo</span><strong>{selected.tipo || '-'}</strong>
            <span>Fonte</span><strong>{selected.fonte || '-'}</strong>
            <span>Status</span><strong>{selected.status || '-'}</strong>
          </div>
        </div>
      )}
    </>
  );
}
