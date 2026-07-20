import type { DataSource } from '../services/radarApi';
import type { ConnectionState } from '../hooks/useAsyncData';

type Props = {
  source: DataSource;
  loading?: boolean;
  error?: string;
  connectionState?: ConnectionState;
};

export function DataSourceNotice({ source, loading, error, connectionState }: Props) {
  if (source === 'supabase' || connectionState === 'connected') {
    return <div className="data-source live">Dados conectados ao Supabase</div>;
  }

  if (loading || connectionState === 'connecting') {
    return <div className="data-source loading">Conectando ao Supabase...</div>;
  }

  if (connectionState === 'slow') {
    return (
      <div className="data-source slow">
        Supabase demorando para responder — exibindo estrutura local enquanto tenta conectar
      </div>
    );
  }

  if (error || connectionState === 'error') {
    return (
      <div className="data-source mock">
        Sem conexão com Supabase — exibindo estrutura demonstrativa
      </div>
    );
  }

  return <div className="data-source mock">Modo demonstrativo</div>;
}
