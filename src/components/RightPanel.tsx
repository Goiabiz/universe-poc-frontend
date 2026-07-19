import { ArrowRight, CheckCircle2, FileText, PlusCircle, X } from 'lucide-react';

export function RightPanel({ variant = 'dashboard' }: { variant?: 'dashboard' | 'alerta' | 'acao' | 'documento' | 'atendimento' | 'impacto' | 'config' }) {
  const titles = {
    dashboard: 'Resumo do dia',
    alerta: 'Detalhes do alerta',
    acao: 'Detalhes da ação',
    documento: 'Documento selecionado',
    atendimento: 'Atendimento #ATD-9842',
    impacto: 'Detalhes do impacto',
    config: 'Detalhes do cliente'
  };

  return (
    <div className="panel-card">
      <div className="panel-header"><h2>{titles[variant]}</h2><X size={18} /></div>
      <div className="panel-section">
        <span className="badge badge-red">Crítico</span>
        <h3>{variant === 'dashboard' ? 'Principais insights' : 'Atualização na tabela SIGTAP impacta cálculo de procedimentos'}</h3>
        <p>Informação selecionada com origem, vínculos, criticidade e encaminhamentos relacionados.</p>
      </div>
      <div className="panel-section">
        <h4>Vínculos</h4>
        <div className="mini-row"><FileText size={16} /> Documento de origem <ArrowRight size={15} /></div>
        <div className="mini-row"><CheckCircle2 size={16} /> Impacto relacionado <ArrowRight size={15} /></div>
      </div>
      <div className="panel-section panel-actions">
        <button className="primary"><PlusCircle size={17} /> Gerar ação</button>
        <button>Ver documento</button>
        <button className="danger">Descartar</button>
      </div>
    </div>
  );
}
