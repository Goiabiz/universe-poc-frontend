import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { Badge } from '../components/Badge';
import { acoes } from '../data/mock';

export function AnaliseAcoes() {
  return (
    <>
      <PageHeader title="Análise e Ações" subtitle="Triagem, decisão e encaminhamento operacional" />
      <div className="tabs"><button className="active">Pendências</button><button>Histórico</button></div>
      <div className="kpi-grid"><KpiCard label="Pendências" value="28" trend="+18%" tone="red" /><KpiCard label="Ações geradas" value="42" trend="+12%" tone="orange" /><KpiCard label="Concluídas" value="126" trend="+24%" tone="green" /><KpiCard label="Aguardando validação" value="16" trend="-8%" tone="blue" /></div>
      <div className="card"><table><thead><tr><th>Origem</th><th>Resumo</th><th>Criticidade</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr></thead><tbody>{acoes.map((a) => <tr key={a.resumo}><td>{a.origem}</td><td>{a.resumo}</td><td><Badge tone={a.criticidade.toLowerCase()}>{a.criticidade}</Badge></td><td>{a.responsavel}</td><td>{a.prazo}</td><td><Badge tone="orange">{a.status}</Badge></td></tr>)}</tbody></table></div>
    </>
  );
}
