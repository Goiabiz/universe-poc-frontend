import { ArrowUpRight, Info } from 'lucide-react';

export function KpiCard({
  label,
  value,
  trend,
  tone = 'green',
  tooltip
}: {
  label: string;
  value: string | number;
  trend?: string;
  tone?: string;
  tooltip?: string;
}) {
  return (
    <div className="kpi-card">
      {tooltip && (
        <button className="kpi-card-info" type="button" aria-label={`Sobre ${label}`}>
          <Info size={15} />
          <span>{tooltip}</span>
        </button>
      )}

      <div className={`kpi-icon tone-${tone}`}><ArrowUpRight size={20} /></div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {trend && <small className={`trend tone-text-${tone}`}>{trend} vs ontem</small>}
      </div>
    </div>
  );
}
