import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { impactos } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchImpactos } from '../services/radarApi';

export function ImpactosProduto() {
  const { data, source, loading, error } = useAsyncData(fetchImpactos, impactos);
  const criticos = data.filter((item) => item.criticidade.toLowerCase().includes('crít') || item.criticidade.toLowerCase().includes('crit')).length;
  const emCurso = data.filter((item) => !item.status.toLowerCase().includes('resol')).length;

  return (
    <>
      <PageHeader title="Impactos no Produto" subtitle="Mapeamento de impactos por módulo e funcionalidade" action={<button className="secondary-btn">Exportar</button>} />
      <DataSourceNotice source={source} loading={loading} error={error} />
      <div className="kpi-grid"><KpiCard label="Impactos totais" value={String(data.length)} trend="lista atual" tone="green" /><KpiCard label="Críticos" value={String(criticos)} trend="atenção" tone="red" /><KpiCard label="Clientes afetados" value="-" trend="em evolução" tone="blue" /><KpiCard label="Ações em curso" value={String(emCurso)} trend="abertas" tone="orange" /></div>
      <div className="toolbar"><input placeholder="Buscar impacto..." /><button>Módulo</button><button>Funcionalidade</button><button>Criticidade</button><button>Cliente</button><button>Status</button></div>
      <div className="card"><table><thead><tr><th>Módulo</th><th>Funcionalidade</th><th>Origem</th><th>Criticidade</th><th>Cliente</th><th>Status</th></tr></thead><tbody>{data.map((i) => <tr key={`${i.modulo}-${i.funcionalidade}-${i.cliente}`}><td>{i.modulo}</td><td>{i.funcionalidade}</td><td>{i.origem}</td><td><Badge tone={i.criticidade.toLowerCase()}>{i.criticidade}</Badge></td><td>{i.cliente}</td><td><Badge tone="blue">{i.status}</Badge></td></tr>)}</tbody></table></div>
    </>
  );
}
