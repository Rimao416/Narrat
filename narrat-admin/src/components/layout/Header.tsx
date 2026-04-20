"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon, Bell } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";
import { cn, initials } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/": "Tableau de bord",
  "/users": "Utilisateurs",
  "/analytics": "Analytiques",
  "/content/books": "Bibliothèque",
  "/content/courses": "Formation",
  "/content/songs": "Louange",
  "/challenges": "Défis spirituels",
  "/community/confessions": "Confessions",
  "/community/reports": "Signalements",
  "/community/crisis": "Alertes crises",
  "/notifications": "Notifications",
  "/settings": "Paramètres",
};

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useUIStore();
  const { user } = useAuthStore();

  const title = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <header className="flex items-center justify-between px-6 h-14 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>

        {user && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold ml-1">
            {initials(user.firstName, user.lastName)}
          </div>
        )}
      </div>
    </header>
  );
}
