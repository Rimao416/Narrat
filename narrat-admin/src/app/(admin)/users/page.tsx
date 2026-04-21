"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/components/ui/status-badge";
import { Modal } from "@/components/ui/modal";
import { formatDate, timeAgo, initials, LEVEL_LABELS } from "@/lib/utils";
import type { AdminUser, UserRole } from "@/types";
import { Search, Ban, CheckCircle, Shield, Trash2, Eye, MoreHorizontal } from "lucide-react";

const ROLES: { value: UserRole | ""; label: string }[] = [
  { value: "", label: "Tous les rôles" },
  { value: "USER", label: "Utilisateur" },
  { value: "MODERATOR", label: "Modérateur" },
  { value: "EDITOR", label: "Éditeur" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const ROLE_OPTIONS: UserRole[] = ["USER", "MODERATOR", "EDITOR", "ADMIN", "SUPER_ADMIN"];

export default function UsersPage() {
  const {
    users, total, totalPages, loading, page, search, roleFilter,
    setPage, setSearch, setRoleFilter, banUser, unbanUser, changeRole,
  } = useUsers({ pageSize: 25 });

  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [banModal, setBanModal] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState("");
  const [roleModal, setRoleModal] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("USER");

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "Utilisateur",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">
            {row.avatarUrl ? (
              <img src={row.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              initials(row.firstName, row.lastName)
            )}
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rôle",
      cell: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: "level",
      header: "Niveau",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">{LEVEL_LABELS[row.spiritualLevel] ?? row.spiritualLevel}</span>
      ),
    },
    {
      key: "xp",
      header: "XP",
      cell: (row) => <span className="text-sm font-mono">{row.xpTotal.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        row.isBanned
          ? <Badge variant="destructive">Banni</Badge>
          : row.isActive
          ? <Badge variant="success">Actif</Badge>
          : <Badge variant="secondary">Inactif</Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Inscrit",
      cell: (row) => <span className="text-xs text-muted-foreground">{timeAgo(row.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" onClick={() => setSelected(row)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setRoleModal(row); setNewRole(row.role); }}
          >
            <Shield className="w-3.5 h-3.5" />
          </Button>
          {row.isBanned ? (
            <Button variant="ghost" size="icon" onClick={() => unbanUser(row.id)}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => { setBanModal(row); setBanReason(""); }}>
              <Ban className="w-3.5 h-3.5 text-destructive" />
            </Button>
          )}
        </div>
      ),
      className: "w-28",
    },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-8"
          />
        </div>
        <Select
          value={roleFilter ?? ""}
          onChange={(e) => { setRoleFilter((e.target.value as UserRole) || undefined); setPage(1); }}
          className="w-44"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">{total} utilisateur{total !== 1 ? "s" : ""}</span>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="Aucun utilisateur trouvé"
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={25}
        onPageChange={setPage}
      />

      {/* User detail drawer */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détails utilisateur" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 text-primary text-xl font-bold">
                {initials(selected.firstName, selected.lastName)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selected.firstName} {selected.lastName}</p>
                <p className="text-sm text-muted-foreground">{selected.email}</p>
                <div className="flex gap-2 mt-1">
                  <RoleBadge role={selected.role} />
                  {selected.isBanned && <Badge variant="destructive">Banni</Badge>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">Niveau spirituel</p>
                <p className="font-medium">{LEVEL_LABELS[selected.spiritualLevel]}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">XP Total</p>
                <p className="font-medium">{selected.xpTotal.toLocaleString()}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">Inscrit le</p>
                <p className="font-medium">{formatDate(selected.createdAt)}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-muted-foreground text-xs">Langue</p>
                <p className="font-medium">{selected.language}</p>
              </div>
              {selected._count && (
                <>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Confessions</p>
                    <p className="font-medium">{selected._count.confessions}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Formations</p>
                    <p className="font-medium">{selected._count.courseEnrollments}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Ban modal */}
      <Modal open={!!banModal} onClose={() => setBanModal(null)} title="Bannir l'utilisateur" size="sm">
        {banModal && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Vous allez bannir <strong>{banModal.firstName} {banModal.lastName}</strong>. Cette action peut être annulée.
            </p>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Raison du bannissement</label>
              <Input
                placeholder="Décrivez la raison..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setBanModal(null)}>Annuler</Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={!banReason.trim()}
                onClick={async () => {
                  await banUser(banModal.id, banReason);
                  setBanModal(null);
                }}
              >
                <Ban className="w-3.5 h-3.5" />
                Bannir
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Role change modal */}
      <Modal open={!!roleModal} onClose={() => setRoleModal(null)} title="Changer le rôle" size="sm">
        {roleModal && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Changer le rôle de <strong>{roleModal.firstName} {roleModal.lastName}</strong>
            </p>
            <Select value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)} className="w-full">
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setRoleModal(null)}>Annuler</Button>
              <Button
                size="sm"
                onClick={async () => {
                  await changeRole(roleModal.id, newRole);
                  setRoleModal(null);
                }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
