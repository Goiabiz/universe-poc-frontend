import { useEffect, useMemo, useState } from 'react';
import { Edit3, Maximize2 } from 'lucide-react';
import type { PanelDetail } from './RightPanel';
import { getOperationalEventName, getPatch, updateOperationalPatch } from '../services/operationalStore';

type Props = {
  detail: PanelDetail;
  status?: string;
  prioridade?: string;
  responsavel?: string;
  onOpenDetail?: (detail: PanelDetail) => void;
  onEdit?: () => void;
};

export function InlineRowActions({ detail, status = 'Em análise', prioridade = 'Média', responsavel = 'Bruno Oliveira', onOpenDetail, onEdit }: Props) {
  const loadValues = () => {
    const patch = getPatch(detail);
    return {
      status: patch?.status ?? status,
      prioridade: patch?.prioridade ?? prioridade,
      responsavel: patch?.responsavel ?? responsavel
    };
  };

  const [values, setValues] = useState(loadValues);

  useEffect(() => {
    const refresh = () => setValues(loadValues());
    window.addEventListener(getOperationalEventName(), refresh);
    return () => window.removeEventListener(getOperationalEventName(), refresh);
  }, [detail.title, status, prioridade, responsavel]);

  const patchedDetail = useMemo(() => ({
    ...detail,
    badge: values.prioridade || detail.badge,
    badgeTone: values.prioridade || detail.badgeTone,
    meta: [
      ...(detail.meta ?? []).filter((item) => !['Status', 'Responsável', 'Prioridade'].includes(item.label)),
      { label: 'Status', value: values.status },
      { label: 'Prioridade', value: values.prioridade },
      { label: 'Responsável', value: values.responsavel }
    ]
  }), [detail, values]);

  const handleChange = (field: 'status' | 'prioridade' | 'responsavel', value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    updateOperationalPatch(detail, { [field]: value });
  };

  return (
    <div className="inline-row-actions" onClick={(event) => event.stopPropagation()}>
      <button className="row-icon-btn" title="Editar texto rápido" onClick={onEdit}>
        <Edit3 size={14} />
      </button>

      <select title="Alterar status" value={values.status} onChange={(event) => handleChange('status', event.target.value)}>
        <option>Novo</option>
        <option>Em análise</option>
        <option>Em andamento</option>
        <option>Monitorando</option>
        <option>Pendente</option>
        <option>Aguardando revisão do PO</option>
        <option>Descartado</option>
        <option>Concluído</option>
      </select>

      <select title="Alterar prioridade" value={values.prioridade} onChange={(event) => handleChange('prioridade', event.target.value)}>
        <option>Crítico</option>
        <option>Alta</option>
        <option>Média</option>
        <option>Baixa</option>
      </select>

      <select title="Alterar responsável" value={values.responsavel} onChange={(event) => handleChange('responsavel', event.target.value)}>
        <option>Bruno Oliveira</option>
        <option>Moises Mattos</option>
        <option>Mariana Lima</option>
        <option>Juliana Costa</option>
        <option>Rafael Mendes</option>
      </select>

      <button className="row-icon-btn expand" title="Abrir detalhe" onClick={() => onOpenDetail?.(patchedDetail)}>
        <Maximize2 size={15} />
      </button>
    </div>
  );
}
