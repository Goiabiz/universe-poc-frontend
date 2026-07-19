import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { documentos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchDocumentos } from '../services/radarApi';

export function BaseConhecimento() {
  const { data, source, loading, error } = useAsyncData(fetchDocumentos, documentos);

  return (
    <>
      <PageHeader title="Base de Conhecimento" subtitle="Conteúdo monitorado e curadoria da base" />
      <div className="tabs"><button className="active">Documentos</button><button>Fontes</button><button>Curadoria</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} />
      <div className="kpi-grid"><KpiCard label="Documentos ativos" value={String(data.length)} trend="lista atual" tone="green" /><KpiCard label="Fontes monitoradas" value="-" trend="em evolução" tone="blue" /><KpiCard label="Trechos indexados" value="-" trend="base IA" tone="purple" /><KpiCard label="Curadoria pendente" value="-" trend="fila" tone="orange" /></div>
      <div className="toolbar"><input placeholder="Buscar documentos por título, conteúdo ou ID..." /><button>Filtros</button><button>Tipo de documento</button><button>Fonte</button><button>Status</button></div>
      <div className="card"><table><thead><tr><th>Título</th><th>Tipo</th><th>Fonte</th><th>Publicação</th><th>Status</th><th>Tags</th></tr></thead><tbody>{data.map((d) => <tr key={`${d.titulo}-${d.publicacao}`}><td>{d.titulo}</td><td>{d.tipo}</td><td>{d.fonte}</td><td>{d.publicacao}</td><td><Badge tone="green">{d.status}</Badge></td><td>{d.tags.map((t) => <Badge key={t}>{t}</Badge>)}</td></tr>)}</tbody></table></div>
    </>
  );
}
