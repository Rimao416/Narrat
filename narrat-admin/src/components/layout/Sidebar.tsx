"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Music2,
  MessageSquareHeart,
  Flag,
  Target,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldAlert,
  Zap,
  Cross,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Principal",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Tableau de bord" },
      { href: "/users", icon: Users, label: "Utilisateurs" },
      { href: "/analytics", icon: BarChart3, label: "Analytiques" },
    ],
  },
  {
    label: "Contenu",
    items: [
      { href: "/content/books", icon: BookOpen, label: "Bibliothèque" },
      { href: "/content/courses", icon: GraduationCap, label: "Formation" },
      { href: "/content/songs", icon: Music2, label: "Louange" },
      { href: "/challenges", icon: Target, label: "Défis" },
    ],
  },
  {
    label: "Modération",
    items: [
      { href: "/community/confessions", icon: MessageSquareHeart, label: "Confessions" },
      { href: "/community/reports", icon: Flag, label: "Signalements" },
      { href: "/community/crisis", icon: ShieldAlert, label: "Crises IA" },
    ],
  },
  {
    label: "Système",
    items: [
      { href: "/notifications", icon: Zap, label: "Notifications" },
      { href: "/settings", icon: Settings, label: "Paramètres" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
          <Cross className="w-4 h-4 text-primary-foreground" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-bold text-sidebar-foreground text-sm tracking-wide">
            Narrat Admin
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1.5">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map(({ href, icon: Icon, label }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors group",
                        active
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      )}
                      title={sidebarCollapsed ? label : undefined}
                    >
                      <Icon className={cn("shrink-0 w-4 h-4", active && "text-primary")} />
                      {!sidebarCollapsed && <span>{label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-2 pb-3 border-t border-sidebar-border pt-3 space-y-0.5">
        {!sidebarCollapsed && user && (
          <div className="px-2 py-2 mb-1">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-md text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
          title={sidebarCollapsed ? "Déconnexion" : undefined}
        >
          <LogOut className="shrink-0 w-4 h-4" />
          {!sidebarCollapsed && <span>Déconnexion</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors shadow-sm z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
