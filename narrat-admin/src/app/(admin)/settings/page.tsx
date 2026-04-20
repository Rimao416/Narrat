"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, extractErrorMessage } from "@/services/api";
import { toast } from "sonner";
import { Settings, Globe, Bell, Shield, Sliders } from "lucide-react";

interface FeatureFlag {
  id: string;
  key: string;
  description?: string;
  isEnabled: boolean;
  rolloutPct: number;
}

interface AppConfig {
  id: string;
  key: string;
  value: unknown;
  isPublic: boolean;
}

const FLAG_LABELS: Record<string, string> = {
  ai_assistant: "Assistant IA",
  family_groups: "Groupes familiaux",
  quiz_duels: "Duels quiz",
  tournaments: "Tournois quiz",
  evangelism_tools: "Outils évangélisation",
  revival_history: "Histoire du réveil",
  spiritual_health: "Bilan spirituel",
  push_notifications: "Push notifications",
};

export default function SettingsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [configs, setConfigs] = useState<AppConfig[]>([]);
  const [loadingFlags, setLoadingFlags] = useState(true);
  const [loadingConfigs, setLoadingConfigs] = useState(true);
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api");

  const fetchFlags = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/features");
      setFlags(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingFlags(false);
    }
  }, []);

  const fetchConfigs = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/config");
      setConfigs(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingConfigs(false);
    }
  }, []);

  useEffect(() => {
    fetchFlags();
    fetchConfigs();
  }, [fetchFlags, fetchConfigs]);

  const toggleFlag = async (key: string, current: boolean) => {
    // Optimistic update
    setFlags((prev) => prev.map((f) => f.key === key ? { ...f, isEnabled: !current } : f));
    try {
      await api.patch(`/admin/features/${key}`, { isEnabled: !current });
      toast.success(`${FLAG_LABELS[key] ?? key} ${!current ? "activé" : "désactivé"}`);
    } catch (err) {
      // Rollback
      setFlags((prev) => prev.map((f) => f.key === key ? { ...f, isEnabled: current } : f));
      toast.error(extractErrorMessage(err));
    }
  };

  const updateConfig = async (key: string, value: unknown) => {
    try {
      await api.patch(`/admin/config/${key}`, { value });
      toast.success("Paramètre enregistré");
      fetchConfigs();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const getConfigValue = (key: string): string => {
    const c = configs.find((c) => c.key === key);
    if (!c) return "";
    return typeof c.value === "string" || typeof c.value === "number" ? String(c.value) : JSON.stringify(c.value);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <CardTitle>Feature Flags</CardTitle>
          </div>
          <CardDescription>Activer ou désactiver les fonctionnalités en temps réel</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingFlags ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : flags.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun feature flag trouvé. Lancez le seed admin.</p>
          ) : (
            <div className="space-y-1">
              {flags.map((flag) => (
                <div key={flag.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{FLAG_LABELS[flag.key] ?? flag.key}</p>
                    {flag.description && <p className="text-xs text-muted-foreground">{flag.description}</p>}
                  </div>
                  <button
                    onClick={() => toggleFlag(flag.key, flag.isEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      flag.isEnabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                      flag.isEnabled ? "translate-x-[18px]" : "translate-x-0.5"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <CardTitle>Configuration application</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingConfigs ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {[
                { key: "app.daily_verse_time", label: "Heure du verset du jour", type: "time" },
                { key: "app.max_confession_length", label: "Longueur max confession (chars)", type: "number" },
                { key: "app.xp_per_lesson", label: "XP par leçon complétée", type: "number" },
                { key: "app.xp_per_checkin", label: "XP par check-in quotidien", type: "number" },
              ].map((item) => (
                <ConfigRow
                  key={item.key}
                  label={item.label}
                  type={item.type}
                  defaultValue={getConfigValue(item.key)}
                  onSave={(v) => updateConfig(item.key, item.type === "number" ? Number(v) : v)}
                />
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Moderation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <CardTitle>Modération automatique</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {[
            { key: "moderation.pre_moderate_confessions", label: "Pré-modération des confessions", desc: "Approbation requise avant publication" },
            { key: "moderation.crisis_detection", label: "Détection de crise IA", desc: "Signale automatiquement les conversations préoccupantes" },
            { key: "moderation.spam_filter", label: "Filtre de spam", desc: "Bloque les publications répétitives" },
          ].map((item) => {
            const flag = flags.find((f) => f.key === item.key);
            const enabled = flag?.isEnabled ?? false;
            return (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleFlag(item.key, enabled)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}

function ConfigRow({ label, type, defaultValue, onSave }: {
  label: string;
  type: string;
  defaultValue: string;
  onSave: (v: string) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => { setValue(defaultValue); }, [defaultValue]);

  return (
    <div>
      <label className="block text-xs font-medium mb-1.5">{label}</label>
      <div className="flex gap-2">
        <Input type={type} value={value} onChange={(e) => setValue(e.target.value)} className="flex-1" />
        <Button size="sm" variant="secondary" onClick={() => onSave(value)}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}
