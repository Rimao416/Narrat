import { useState, useEffect, useCallback } from 'react';
import { libraryService, Book } from '../services/libraryService';

export function useBooks(category?: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await libraryService.getBooks(category);
      setBooks(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
}
