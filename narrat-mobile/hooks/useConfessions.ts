import { useState, useEffect, useCallback } from 'react';
import { confessionService, Post } from '../services/confessionService';

export function useConfessions() {
  const [confessions, setConfessions] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await confessionService.getAll();
      setConfessions(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { confessions, loading, error, refetch: fetch };
}
