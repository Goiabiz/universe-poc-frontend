import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export function CollapsibleKpiSection({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className={`collapsible-kpis ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="collapsible-kpis-header">
        <button
          type="button"
          className="collapsible-kpis-icon"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          title={expanded ? 'Recolher indicadores' : 'Expandir indicadores'}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {expanded && children}
    </section>
  );
}
