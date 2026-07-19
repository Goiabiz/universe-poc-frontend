import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { impactos } from '../data/mock';

export function ImpactosProduto() {
  return (
    <>
      <PageHeader title="Impactos no Produto" subtitle="Mapeamento de impactos por módulo e funcionalidade" action={<button className="secondary-btn">Exportar</button>} />
      <div className="kpi-grid"><KpiCard label="Impactos totais" value="57" trend="+8%" tone="green" /><KpiCard label="Críticos" value="23" trend="+15%" tone="red" /><KpiCard label="Clientes afetados" value="48" trend="+6%" tone="blue" /><KpiCard label="Ações em curso" value="31" trend="+3%" tone="orange" /></div>
      <div className="toolbar"><input placeholder="Buscar impacto..." /><button>Módulo</button><button>Funcionalidade</button><button>Criticidade</button><button>Cliente</button><button>Status</button></div>
      <div className="card"><table><thead><tr><th>Módulo</th><th>Funcionalidade</th><th>Origem</th><th>Criticidade</th><th>Cliente</th><th>Status</th></tr></thead><tbody>{impactos.map((i) => <tr key={i.funcionalidade}><td>{i.modulo}</td><td>{i.funcionalidade}</td><td>{i.origem}</td><td><Badge tone={i.criticidade.toLowerCase()}>{i.criticidade}</Badge></td><td>{i.cliente}</td><td><Badge tone="blue">{i.status}</Badge></td></tr>)}</tbody></table></div>
    </>
  );
}
