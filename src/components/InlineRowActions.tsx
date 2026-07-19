import { Edit3, Maximize2 } from 'lucide-react';
import type { PanelDetail } from './RightPanel';

type Props = {
  detail: PanelDetail;
  status?: string;
  prioridade?: string;
  responsavel?: string;
  onOpenDetail?: (detail: PanelDetail) => void;
  onEdit?: () => void;
};

export function InlineRowActions({ detail, status = 'Em análise', prioridade = 'Média', responsavel = 'Bruno Oliveira', onOpenDetail, onEdit }: Props) {
  return (
    <div className="inline-row-actions" onClick={(event) => event.stopPropagation()}>
      <button className="row-icon-btn" title="Editar texto rápido" onClick={onEdit}>
        <Edit3 size={14} />
      </button>

      <select title="Alterar status" defaultValue={status}>
        <option>Novo</option>
        <option>Em análise</option>
        <option>Em andamento</option>
        <option>Monitorando</option>
        <option>Pendente</option>
        <option>Concluído</option>
      </select>

      <select title="Alterar prioridade" defaultValue={prioridade}>
        <option>Crítico</option>
        <option>Alta</option>
        <option>Média</option>
        <option>Baixa</option>
      </select>

      <select title="Alterar responsável" defaultValue={responsavel}>
        <option>Bruno Oliveira</option>
        <option>Moises Mattos</option>
        <option>Mariana Lima</option>
        <option>Juliana Costa</option>
        <option>Rafael Mendes</option>
      </select>

      <button className="row-icon-btn expand" title="Abrir detalhe" onClick={() => onOpenDetail?.(detail)}>
        <Maximize2 size={15} />
      </button>
    </div>
  );
}
