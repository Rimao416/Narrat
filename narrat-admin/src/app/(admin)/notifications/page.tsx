"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { api, extractErrorMessage } from "@/services/api";
import { Bell, Send, Zap, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DailyVerse {
  key: string;
  value: { reference: string; text: string; language: string };
}

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<"all" | "active" | "new">("all");
  const [sending, setSending] = useState(false);

  const [verses, setVerses] = useState<DailyVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(true);
  const [showVerseForm, setShowVerseForm] = useState(false);
  const [newVerse, setNewVerse] = useState({ reference: "", text: "", language: "FR" });

  const fetchVerses = useCallback(async () => {
    setLoadingVerses(true);
    try {
      const { data } = await api.get("/admin/notifications/verses");
      setVerses(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingVerses(false);
    }
  }, []);

  useEffect(() => { fetchVerses(); }, [fetchVerses]);

  const sendNotification = async () => {
    if (!title.trim() || !body.trim()) { toast.error("Titre et message requis"); return; }
    setSending(true);
    try {
      await api.post("/admin/notifications/broadcast", { title, body, target });
      toast.success(`Notification envoyée (cible: ${target})`);
      setTitle("");
      setBody("");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const addVerse = async () => {
    if (!newVerse.reference || !newVerse.text) { toast.error("Référence et texte requis"); return; }
    try {
      await api.post("/admin/notifications/verses", newVerse);
      toast.success("Verset ajouté");
      setNewVerse({ reference: "", text: "", language: "FR" });
      setShowVerseForm(false);
      fetchVerses();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const removeVerse = async (key: string) => {
    try {
      await api.delete(`/admin/notifications/verses/${encodeURIComponent(key)}`);
      toast.success("Verset retiré");
      fetchVerses();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
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
          <Button onClick={sendNotification} loading={sending}>
            <Send className="w-3.5 h-3.5" />
            Envoyer
          </Button>
        </CardContent>
      </Card>

      {/* Daily Verses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <CardTitle>Versets du jour programmés</CardTitle>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowVerseForm(true)}>
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingVerses ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}
            </div>
          ) : verses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Aucun verset programmé</p>
          ) : (
            <div className="space-y-2">
              {verses.map((v) => (
                <div key={v.key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <Badge variant="default">{v.value.reference}</Badge>
                  <p className="text-sm text-muted-foreground flex-1 line-clamp-2">{v.value.text}</p>
                  <Badge variant="secondary">{v.value.language}</Badge>
                  <button onClick={() => removeVerse(v.key)} className="text-destructive hover:text-destructive/80 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Verse Modal */}
      <Modal open={showVerseForm} onClose={() => setShowVerseForm(false)} title="Ajouter un verset" size="sm">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5">Référence *</label>
            <Input placeholder="Ex: Jean 3:16" value={newVerse.reference} onChange={(e) => setNewVerse((p) => ({ ...p, reference: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Texte *</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              rows={3}
              value={newVerse.text}
              onChange={(e) => setNewVerse((p) => ({ ...p, text: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Langue</label>
            <select
              value={newVerse.language}
              onChange={(e) => setNewVerse((p) => ({ ...p, language: e.target.value }))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {["FR", "EN", "LN", "SW"].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => setShowVerseForm(false)}>Annuler</Button>
            <Button size="sm" onClick={addVerse}>Ajouter</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
