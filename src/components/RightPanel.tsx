import { ArrowRight, CheckCircle2, FileText, Maximize2, PlusCircle, X } from 'lucide-react';

export type PanelDetail = {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  badgeTone?: string;
  meta?: Array<{ label: string; value?: string | number | null }>;
  actions?: string[];
};

type Variant = 'dashboard' | 'alerta' | 'acao' | 'documento' | 'atendimento' | 'impacto' | 'config';

const titles: Record<Variant, string> = {
  dashboard: 'Área de Trabalho',
  alerta: 'Central de Alertas',
  acao: 'Roadmap',
  documento: 'Documento selecionado',
  atendimento: 'Atendimento selecionado',
  impacto: 'Mapa de Impactos',
  config: 'Detalhes da configuração'
};

const defaults: Record<Variant, PanelDetail> = {
  dashboard: {
    title: 'Principais insights',
    badge: 'Resumo',
    badgeTone: 'blue',
    description: 'Selecione um item para visualizar impacto, persona afetada, orientação do SUSi e encaminhamento recomendado.',
    meta: [
      { label: 'Status', value: 'Operação monitorada' },
      { label: 'Origem', value: 'Dashboard' }
    ]
  },
  alerta: { title: 'Nenhum alerta selecionado', badge: 'Alerta', badgeTone: 'red', description: 'Clique em um alerta para visualizar criticidade, origem, alcance, persona afetada e orientação do SUSi.' },
  acao: { title: 'Nenhum item de roadmap selecionado', badge: 'Roadmap', badgeTone: 'orange', description: 'Clique em uma decisão para visualizar prioridade, responsável, prazo, vínculo com alerta/impacto e próximo encaminhamento.' },
  documento: { title: 'Nenhum documento selecionado', badge: 'Documento', badgeTone: 'blue', description: 'Clique em um documento para visualizar fonte, tipo, publicação, tags e status.' },
  atendimento: { title: 'Nenhum atendimento selecionado', badge: 'Atendimento', badgeTone: 'green', description: 'Clique em um atendimento para visualizar cliente, canal, prioridade, status e ticket vinculado.' },
  impacto: { title: 'Nenhum impacto selecionado', badge: 'Impacto', badgeTone: 'red', description: 'Clique em um impacto para visualizar produto, cliente, serviço, persona afetada, risco e orientação recomendada.' },
  config: { title: 'Nenhuma configuração selecionada', badge: 'Configuração', badgeTone: 'green', description: 'Clique em cliente, integração ou usuário para visualizar informações de configuração.' }
};

const toneToClass = (tone?: string) => {
  const normalized = (tone ?? '').toLowerCase();
  if (normalized.includes('crit') || normalized.includes('red')) return 'badge-red';
  if (normalized.includes('alto') || normalized.includes('orange') || normalized.includes('pendente')) return 'badge-orange';
  if (normalized.includes('green') || normalized.includes('ativo')) return 'badge-green';
  return 'badge-blue';
};

export function RightPanel({ variant = 'dashboard', detail, onExpand, onClose }: { variant?: Variant; detail?: PanelDetail | null; onExpand?: (detail: PanelDetail) => void; onClose?: () => void }) {
  const current = detail ?? defaults[variant];

  return (
    <div className="panel-card">
      <div className="panel-header">
            <h2>{titles[variant]}</h2>
            <div className="panel-header-actions">
              <button className="icon-btn" title="Expandir detalhe" onClick={() => onExpand?.(current)}><Maximize2 size={16} /></button>
              <button className="icon-btn" title="Recolher painel" onClick={onClose}><X size={16} /></button>
            </div>
          </div>

      <div className="panel-section">
        <span className={`badge ${toneToClass(current.badgeTone ?? current.badge)}`}>{current.badge ?? 'Selecionado'}</span>
        <h3 className="panel-clickable-title" onClick={() => onExpand?.(current)}>{current.title}</h3>
        {current.subtitle && <strong className="panel-subtitle">{current.subtitle}</strong>}
        <p>{current.description ?? 'Informação selecionada com origem, vínculos, criticidade e encaminhamentos relacionados.'}</p>
      </div>

      {current.meta?.length ? (
        <div className="panel-section">
          <h4>Contexto</h4>
          <div className="panel-meta">
            {current.meta.map((item) => (
              <div key={item.label} className="panel-meta-row">
                <span>{item.label}</span>
                <strong>{item.value ?? '-'}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="panel-section">
        <h4>Vínculos</h4>
        <div className="mini-row"><FileText size={16} /> Documento de origem <ArrowRight size={15} /></div>
        <div className="mini-row"><CheckCircle2 size={16} /> Impacto relacionado <ArrowRight size={15} /></div>
      </div>

      <div className="panel-section panel-actions">
        <button className="primary"><PlusCircle size={17} /> {current.actions?.[0] ?? 'Gerar ação'}</button>
        <button>{current.actions?.[1] ?? 'Ver documento'}</button>
        <button className="danger">{current.actions?.[2] ?? 'Descartar'}</button>
      </div>
    </div>
  );
}
