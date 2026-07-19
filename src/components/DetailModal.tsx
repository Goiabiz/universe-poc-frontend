import { X, Maximize2, ExternalLink, Clock3, Link2, MessageSquareText, ShieldCheck } from 'lucide-react';
import type { PanelDetail } from './RightPanel';

export function DetailModal({ detail, onClose }: { detail: PanelDetail | null; onClose: () => void }) {
  if (!detail) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="detail-modal">
        <header className="detail-modal-header">
          <div>
            <span className="modal-eyebrow">Radar SUS</span>
            <h2>{detail.title}</h2>
            {detail.subtitle && <p>{detail.subtitle}</p>}
          </div>

          <div className="detail-modal-actions">
            <button className="icon-btn" title="Abrir em aba"><Maximize2 size={17} /></button>
            <button className="icon-btn modal-close" onClick={onClose} aria-label="Fechar detalhe">
              <X size={18} />
            </button>
          </div>
        </header>

        <nav className="detail-tabs">
          <button className="active">Resumo</button>
          <button>Histórico</button>
          <button>Vínculos</button>
          <button>Ações</button>
          <button>Anexos</button>
        </nav>

        <div className="detail-modal-body">
          <main className="detail-main">
            <section className="detail-section">
              <div className="section-title-row">
                <h3>Resumo do item</h3>
                <span className="badge badge-green">{detail.badge ?? 'Selecionado'}</span>
              </div>
              <p className="muted">{detail.description ?? 'Item selecionado para análise detalhada.'}</p>

              <div className="detail-info-grid">
                {(detail.meta ?? []).map((item) => (
                  <div key={item.label} className="detail-info-card">
                    <span>{item.label}</span>
                    <strong>{item.value ?? '-'}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h3>Linha do tempo</h3>
              <div className="timeline">
                <div><Clock3 size={16} /><span>Item selecionado para análise</span><small>agora</small></div>
                <div><ShieldCheck size={16} /><span>Validação automática disponível</span><small>próxima etapa</small></div>
                <div><MessageSquareText size={16} /><span>Comentário ou decisão do usuário</span><small>pendente</small></div>
              </div>
            </section>
          </main>

          <aside className="detail-side">
            <section className="detail-section">
              <h3>Ações rápidas</h3>
              <button className="primary full-width">{detail.actions?.[0] ?? 'Gerar ação'}</button>
              <button className="full-width">{detail.actions?.[1] ?? 'Ver documento'}</button>
              <button className="danger full-width">{detail.actions?.[2] ?? 'Descartar'}</button>
            </section>

            <section className="detail-section">
              <h3>Vínculos</h3>
              <div className="mini-row"><Link2 size={16} /> Documento de origem</div>
              <div className="mini-row"><Link2 size={16} /> Impacto relacionado</div>
              <div className="mini-row"><Link2 size={16} /> Ação vinculada</div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
