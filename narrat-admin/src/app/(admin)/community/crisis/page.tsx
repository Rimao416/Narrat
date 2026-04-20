"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, MessageSquare, User, Clock } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const MOCK_CRISES = [
  {
    id: "1",
    userId: "u1",
    userName: "Marie K.",
    sessionId: "sess_01",
    flaggedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    severity: "HIGH",
    snippet: "Je me sens complètement désespérée et je pense que personne ne m'aime vraiment...",
    status: "PENDING",
  },
  {
    id: "2",
    userId: "u2",
    userName: "Jean P.",
    sessionId: "sess_02",
    flaggedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    severity: "MEDIUM",
    snippet: "Je traverses une période très sombre et je ne sais plus quoi faire...",
    status: "REVIEWED",
  },
];

const SEVERITY_VARIANTS = {
  HIGH: "destructive" as const,
  MEDIUM: "warning" as const,
  LOW: "secondary" as const,
};

export default function CrisisPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Conversations IA signalées automatiquement par le système de détection de crise
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_CRISES.map((crisis) => (
          <Card key={crisis.id} className="border-destructive/20">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-destructive/10 text-destructive shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{crisis.userName}</span>
                      <Badge variant={SEVERITY_VARIANTS[crisis.severity as keyof typeof SEVERITY_VARIANTS] ?? "default"}>
                        {crisis.severity}
                      </Badge>
                      {crisis.status === "PENDING" && <Badge variant="warning">En attente</Badge>}
                      {crisis.status === "REVIEWED" && <Badge variant="secondary">Examiné</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(crisis.flaggedAt)}
                    </p>
                    <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        "{crisis.snippet}"
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button size="sm" variant="destructive">Contacter</Button>
                  <Button size="sm" variant="outline">Marquer examiné</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
