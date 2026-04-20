import { useState, useCallback, useEffect } from "react";
import { booksService, coursesService, songsService } from "@/services/content.service";
import { useDebounce } from "./useDebounce";
import type { Book, Course, Song, ContentStatus, PaginatedResponse } from "@/types";
import { toast } from "sonner";
import { extractErrorMessage } from "@/services/api";

export function useBooks(initialPageSize = 20) {
  const [data, setData] = useState<PaginatedResponse<Book> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | undefined>();
  const debouncedSearch = useDebounce(search, 400);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await booksService.list({
        page,
        pageSize: initialPageSize,
        search: debouncedSearch || undefined,
        status: statusFilter,
      });
      setData(res);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, initialPageSize, debouncedSearch, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const updateStatus = async (id: string, status: ContentStatus) => {
    try {
      await booksService.updateStatus(id, status);
      toast.success("Statut mis à jour");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const reorder = async (ids: string[]) => {
    try {
      await booksService.reorder(ids);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksService.delete(id);
      toast.success("Livre supprimé");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    books: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    loading, page, search, statusFilter,
    setPage, setSearch, setStatusFilter,
    updateStatus, reorder, deleteBook, refresh: fetch,
  };
}

export function useCourses(initialPageSize = 20) {
  const [data, setData] = useState<PaginatedResponse<Course> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | undefined>();
  const debouncedSearch = useDebounce(search, 400);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await coursesService.list({
        page,
        pageSize: initialPageSize,
        search: debouncedSearch || undefined,
        status: statusFilter,
      });
      setData(res);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, initialPageSize, debouncedSearch, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const updateStatus = async (id: string, status: ContentStatus) => {
    try {
      await coursesService.updateStatus(id, status);
      toast.success("Statut mis à jour");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const reorder = async (ids: string[]) => {
    try {
      await coursesService.reorder(ids);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await coursesService.delete(id);
      toast.success("Formation supprimée");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    courses: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    loading, page, search, statusFilter,
    setPage, setSearch, setStatusFilter,
    updateStatus, reorder, deleteCourse, refresh: fetch,
  };
}

export function useSongs(initialPageSize = 20) {
  const [data, setData] = useState<PaginatedResponse<Song> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await songsService.list({
        page,
        pageSize: initialPageSize,
        search: debouncedSearch || undefined,
      });
      setData(res);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, initialPageSize, debouncedSearch]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const updateStatus = async (id: string, status: ContentStatus) => {
    try {
      await songsService.updateStatus(id, status);
      toast.success("Statut mis à jour");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    songs: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    loading, page, search,
    setPage, setSearch,
    updateStatus, refresh: fetch,
  };
}
