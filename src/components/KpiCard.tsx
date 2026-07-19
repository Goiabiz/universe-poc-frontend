import { ArrowUpRight } from 'lucide-react';

export function KpiCard({ label, value, trend, tone = 'green' }: { label: string; value: string | number; trend?: string; tone?: string }) {
  return (
    <div className="kpi-card">
      <div className={`kpi-icon tone-${tone}`}><ArrowUpRight size={20} /></div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {trend && <small className={`trend tone-text-${tone}`}>{trend} vs ontem</small>}
      </div>
    </div>
  );
}
