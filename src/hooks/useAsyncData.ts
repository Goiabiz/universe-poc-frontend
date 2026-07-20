import { useEffect, useState } from 'react';
import type { DataSource, QueryResult } from '../services/radarApi';

export type ConnectionState = 'connecting' | 'connected' | 'slow' | 'error' | 'demo';

const SLOW_CONNECTION_MS = 3500;

export function useAsyncData<T>(loader: () => Promise<QueryResult<T>>, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [source, setSource] = useState<DataSource>('mock');
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let active = true;

    setLoading(true);
    setConnectionState('connecting');
    setError(undefined);

    const slowTimer = window.setTimeout(() => {
      if (!active) return;

      // Não bloqueia a tela e não troca automaticamente para modo demonstrativo.
      // A tela segue exibindo a estrutura/fallback enquanto o Supabase responde em segundo plano.
      setLoading(false);
      setConnectionState('slow');
    }, SLOW_CONNECTION_MS);

    loader()
      .then((result) => {
        if (!active) return;

        window.clearTimeout(slowTimer);
        setData(result.data);
        setSource(result.source);
        setError(result.error);
        setConnectionState(result.source === 'supabase' ? 'connected' : result.error ? 'error' : 'demo');
      })
      .catch((err) => {
        if (!active) return;

        window.clearTimeout(slowTimer);
        setData(fallback);
        setSource('mock');
        setError(err instanceof Error ? err.message : 'Erro ao conectar ao Supabase');
        setConnectionState('error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      window.clearTimeout(slowTimer);
    };
  }, [loader, fallback]);

  return { data, source, loading, error, connectionState };
}
