"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coursesService } from "@/services/content.service";
import { extractErrorMessage } from "@/services/api";
import { toast } from "sonner";
import {
  ArrowLeft, Save, GraduationCap, User, Target, Image, FileText,
  Plus, X, Award, Globe, BarChart,
} from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  subtitle: z.string().optional(),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  language: z.enum(["FR", "EN", "LN", "SW"]),
  passingScore: z.coerce.number().min(0).max(100),
  hasCertificate: z.boolean(),
  hasAudio: z.boolean(),
  hasVideo: z.boolean(),
  coverUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  teacherName: z.string().optional(),
  teacherBio: z.string().optional(),
  estimatedHours: z.coerce.number().positive().optional().or(z.literal(0 as unknown as undefined)),
});

type FormData = z.infer<typeof schema>;

const LANGUAGE_LABELS: Record<string, string> = { FR: "Français", EN: "English", LN: "Lingala", SW: "Kiswahili" };

export default function NewCoursePage() {
  const router = useRouter();
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");

  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      level: "BEGINNER",
      language: "FR",
      passingScore: 70,
      hasCertificate: true,
      hasAudio: false,
      hasVideo: false,
    },
  });

  const addObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective("");
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const course = await coursesService.create({
        ...data,
        objectives,
        coverUrl: data.coverUrl || undefined,
        teacherName: data.teacherName || undefined,
        teacherBio: data.teacherBio || undefined,
      } as any);
      toast.success("Formation créée avec succès !");
      router.push(`/content/courses/${course.id}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/content/courses")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-base font-semibold">Nouvelle Formation</h1>
              <p className="text-xs text-muted-foreground">Remplissez les informations pour créer une formation</p>
            </div>
          </div>
          <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
            <Save className="w-4 h-4" /> Créer la formation
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Subtitle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Titre de la formation *</label>
                  <Input
                    {...register("title")}
                    placeholder="Ex: Les fondements de la foi chrétienne"
                    className="text-lg font-medium h-11"
                  />
                  {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Sous-titre</label>
                  <Input {...register("subtitle")} placeholder="Une brève accroche pour la formation" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Description *</label>
                  <textarea
                    {...register("description")}
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y leading-relaxed"
                    placeholder="Décrivez la formation en détail : contenu, public cible, prérequis..."
                  />
                  {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Objectifs d&apos;apprentissage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {objectives.length > 0 && (
                  <div className="space-y-2">
                    {objectives.map((obj, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                        <span className="text-xs font-mono text-primary font-bold">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-sm flex-1">{obj}</span>
                        <button type="button" onClick={() => removeObjective(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Ex: Comprendre les bases de la prière"
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </Button>
                </div>
                {objectives.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Ajoutez au moins un objectif pour aider les apprenants à savoir ce qu&apos;ils vont apprendre.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Teacher */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Enseignant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Nom de l&apos;enseignant</label>
                  <Input {...register("teacherName")} placeholder="Ex: Pasteur Jean-Marc" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Biographie</label>
                  <textarea
                    {...register("teacherBio")}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    placeholder="Brève biographie de l'enseignant..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-primary" />
                  Couverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center mb-3">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-8 h-8 mx-auto mb-1 opacity-40" />
                    <p className="text-xs">Ajoutez une URL d&apos;image</p>
                  </div>
                </div>
                <Input {...register("coverUrl")} placeholder="https://..." />
                {errors.coverUrl && <p className="text-xs text-destructive mt-1">{errors.coverUrl.message}</p>}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    <BarChart className="w-3 h-3 inline mr-1" />Niveau *
                  </label>
                  <Select {...register("level")} className="w-full">
                    <option value="BEGINNER">Débutant</option>
                    <option value="INTERMEDIATE">Intermédiaire</option>
                    <option value="ADVANCED">Avancé</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    <Globe className="w-3 h-3 inline mr-1" />Langue
                  </label>
                  <Select {...register("language")} className="w-full">
                    {Object.entries(LANGUAGE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">Score minimum (%)</label>
                  <Input {...register("passingScore")} type="number" min={0} max={100} />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">Durée estimée (heures)</label>
                  <Input {...register("estimatedHours")} type="number" min={0} step={0.5} placeholder="Ex: 4.5" />
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register("hasCertificate")} id="cert" className="rounded" />
                    <label htmlFor="cert" className="text-sm flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Certificat
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register("hasAudio")} id="audio" className="rounded" />
                    <label htmlFor="audio" className="text-sm">Contenu audio</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register("hasVideo")} id="video" className="rounded" />
                    <label htmlFor="video" className="text-sm">Contenu vidéo</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
