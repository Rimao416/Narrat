"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Zap } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_VERSES = [
  { ref: "Jean 3:16", text: "Car Dieu a tant aimé le monde qu'il a donné son fils unique..." },
  { ref: "Psaume 23:1", text: "L'Éternel est mon berger, je ne manquerai de rien." },
  { ref: "Philippiens 4:13", text: "Je puis tout par celui qui me fortifie." },
];

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<"all" | "active" | "new">("all");

  const sendNotification = () => {
    if (!title.trim() || !body.trim()) { toast.error("Titre et message requis"); return; }
    toast.success(`Notification envoyée à tous les utilisateurs (${target})`);
    setTitle("");
    setBody("");
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Push Notification */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <CardTitle>Envoyer une notification push</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Cible</label>
            <div className="flex gap-2">
              {(["all", "active", "new"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    target === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "all" ? "Tous" : t === "active" ? "Actifs (7j)" : "Nouveaux (30j)"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Titre</label>
            <Input placeholder="Ex: Verset du jour 🙏" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Message</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              rows={3}
              placeholder="Votre message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <Button onClick={sendNotification}>
            <Send className="w-3.5 h-3.5" />
            Envoyer
          </Button>
        </CardContent>
      </Card>

      {/* Daily verse */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <CardTitle>Versets du jour programmés</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {SAMPLE_VERSES.map((v, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <Badge variant="default">{v.ref}</Badge>
                <p className="text-sm text-muted-foreground flex-1 line-clamp-2">{v.text}</p>
                <button className="text-xs text-destructive hover:text-destructive/80 shrink-0">Retirer</button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3">
            + Ajouter un verset
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
