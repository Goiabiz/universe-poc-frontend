import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { documentos } from '../data/mock';

export function BaseConhecimento() {
  return (
    <>
      <PageHeader title="Base de Conhecimento" subtitle="Conteúdo monitorado e curadoria da base" />
      <div className="tabs"><button className="active">Documentos</button><button>Fontes</button><button>Curadoria</button></div>
      <div className="kpi-grid"><KpiCard label="Documentos ativos" value="1.248" trend="+12%" tone="green" /><KpiCard label="Fontes monitoradas" value="87" trend="+8%" tone="blue" /><KpiCard label="Trechos indexados" value="24.831" trend="+15%" tone="purple" /><KpiCard label="Curadoria pendente" value="23" trend="+5%" tone="orange" /></div>
      <div className="toolbar"><input placeholder="Buscar documentos por título, conteúdo ou ID..." /><button>Filtros</button><button>Tipo de documento</button><button>Fonte</button><button>Status</button></div>
      <div className="card"><table><thead><tr><th>Título</th><th>Tipo</th><th>Fonte</th><th>Publicação</th><th>Status</th><th>Tags</th></tr></thead><tbody>{documentos.map((d) => <tr key={d.titulo}><td>{d.titulo}</td><td>{d.tipo}</td><td>{d.fonte}</td><td>{d.publicacao}</td><td><Badge tone="green">{d.status}</Badge></td><td>{d.tags.map((t) => <Badge key={t}>{t}</Badge>)}</td></tr>)}</tbody></table></div>
    </>
  );
}
