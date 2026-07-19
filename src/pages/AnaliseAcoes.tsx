import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { DataSourceNotice } from '../components/DataSourceNotice';
import { acoes } from '../data/mock';
import { useAsyncData } from '../hooks/useAsyncData';
import { fetchAcoes } from '../services/radarApi';

export function AnaliseAcoes() {
  const { data, source, loading, error } = useAsyncData(fetchAcoes, acoes);
  const pendencias = data.filter((item) => !item.status.toLowerCase().includes('concl')).length;
  const aguardando = data.filter((item) => item.status.toLowerCase().includes('valid')).length;

  return (
    <>
      <PageHeader title="Análise e Ações" subtitle="Triagem, decisão e encaminhamento operacional" />
      <div className="tabs"><button className="active">Pendências</button><button>Histórico</button></div>
      <DataSourceNotice source={source} loading={loading} error={error} />
      <div className="kpi-grid"><KpiCard label="Pendências" value={String(pendencias)} trend="fila atual" tone="red" /><KpiCard label="Ações geradas" value={String(data.length)} trend="decisões" tone="orange" /><KpiCard label="Concluídas" value="-" trend="em evolução" tone="green" /><KpiCard label="Aguardando validação" value={String(aguardando)} trend="validação" tone="blue" /></div>
      <div className="toolbar"><button>Criticidade</button><button>Responsável</button><button>Tipo de ação</button><input placeholder="Buscar por resumo, origem ou número..." /><button>Filtros</button></div>
      <div className="card"><table><thead><tr><th>Origem</th><th>Resumo</th><th>Criticidade</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr></thead><tbody>{data.map((a) => <tr key={`${a.origem}-${a.resumo}`}><td>{a.origem}</td><td>{a.resumo}</td><td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td><td>{a.responsavel}</td><td>{a.prazo}</td><td><Badge tone="orange">{a.status}</Badge></td></tr>)}</tbody></table></div>
    </>
  );
}
