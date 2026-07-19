import type { DataSource } from '../services/radarApi';

type Props = {
  source: DataSource;
  loading?: boolean;
  error?: string;
};

export function DataSourceNotice({ source, loading, error }: Props) {
  if (loading) {
    return <div className="data-source loading">Carregando dados...</div>;
  }

  if (source === 'supabase') {
    return <div className="data-source live">Dados conectados ao Supabase</div>;
  }

  return (
    <div className="data-source mock">
      Usando dados demonstrativos{error ? ` — ${error}` : ''}
    </div>
  );
}
