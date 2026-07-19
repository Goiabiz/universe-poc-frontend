import { useEffect, useState } from 'react';
import type { DataSource, QueryResult } from '../services/radarApi';

export function useAsyncData<T>(loader: () => Promise<QueryResult<T>>, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [source, setSource] = useState<DataSource>('mock');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let active = true;

    setLoading(true);
    loader()
      .then((result) => {
        if (!active) return;
        setData(result.data);
        setSource(result.source);
        setError(result.error);
      })
      .catch((err) => {
        if (!active) return;
        setData(fallback);
        setSource('mock');
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loader, fallback]);

  return { data, source, loading, error };
}
