"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Settings, Globe, Bell, Shield, Sliders } from "lucide-react";

interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_FLAGS: FeatureFlag[] = [
  { key: "ai_assistant", label: "Assistant IA", description: "Activer le conseiller spirituel IA", enabled: true },
  { key: "family_groups", label: "Groupes familiaux", description: "Module de dévotion familiale", enabled: true },
  { key: "quiz_duels", label: "Duels quiz", description: "Batailles bibliques 1v1", enabled: true },
  { key: "tournaments", label: "Tournois", description: "Tournois quiz multijoueurs", enabled: false },
  { key: "evangism_tools", label: "Outils évangélisation", description: "Tracker de contacts et ressources", enabled: true },
  { key: "revival_history", label: "Histoire du réveil", description: "Module figures et témoignages historiques", enabled: true },
  { key: "spiritual_health", label: "Bilan spirituel", description: "Évaluation et plans de croissance", enabled: true },
  { key: "push_notifications", label: "Push notifications", description: "Notifications mobiles quotidiennes", enabled: false },
];

export default function SettingsPage() {
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api");

  const toggleFlag = (key: string) => {
    setFlags((prev) => prev.map((f) => f.key === key ? { ...f, enabled: !f.enabled } : f));
    toast.success("Paramètre mis à jour");
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
          <CardDescription>Activer ou désactiver les fonctionnalités de l'application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {flags.map((flag) => (
              <div
                key={flag.key}
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{flag.label}</p>
                  <p className="text-xs text-muted-foreground">{flag.description}</p>
                </div>
                <button
                  onClick={() => toggleFlag(flag.key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none ${
                    flag.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                      flag.enabled ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <CardTitle>Configuration API</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">URL de l'API</label>
            <div className="flex gap-2">
              <Input
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" variant="secondary" onClick={() => toast.success("Enregistré")}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <CardTitle>Modération automatique</CardTitle>
          </div>
          <CardDescription>Paramètres de modération du contenu communautaire</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Pré-modération des confessions", description: "Toute nouvelle confession requiert approbation avant publication" },
            { label: "Détection de crise IA", description: "Signaler automatiquement les conversations préoccupantes" },
            { label: "Filtre de spam", description: "Bloquer les publications répétitives ou suspicieuses" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary transition-colors">
                <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm translate-x-4.5 transition-transform" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <CardTitle>Verset du jour</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5">Heure d'envoi</label>
            <Input type="time" defaultValue="07:00" className="w-32" />
          </div>
          <Button size="sm" onClick={() => toast.success("Paramètres enregistrés")}>
            Enregistrer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
