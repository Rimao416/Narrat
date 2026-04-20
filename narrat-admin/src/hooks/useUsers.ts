import { useState, useCallback, useEffect } from "react";
import { usersService } from "@/services/users.service";
import { useDebounce } from "./useDebounce";
import type { AdminUser, PaginatedResponse, UserRole } from "@/types";
import { toast } from "sonner";
import { extractErrorMessage } from "@/services/api";

interface UseUsersOptions {
  initialPage?: number;
  pageSize?: number;
}

export function useUsers({ initialPage = 1, pageSize = 20 }: UseUsersOptions = {}) {
  const [data, setData] = useState<PaginatedResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>();

  const debouncedSearch = useDebounce(search, 400);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersService.list({
        page,
        pageSize,
        search: debouncedSearch || undefined,
        role: roleFilter,
      });
      setData(res);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, roleFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  const banUser = async (id: string, reason: string) => {
    try {
      await usersService.ban(id, reason);
      toast.success("Utilisateur banni");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const unbanUser = async (id: string) => {
    try {
      await usersService.unban(id);
      toast.success("Utilisateur débanni");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const changeRole = async (id: string, role: UserRole) => {
    try {
      await usersService.updateRole(id, role);
      toast.success("Rôle mis à jour");
      fetch();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    users: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    loading,
    page,
    search,
    roleFilter,
    setPage,
    setSearch,
    setRoleFilter,
    banUser,
    unbanUser,
    changeRole,
    refresh: fetch,
  };
}
