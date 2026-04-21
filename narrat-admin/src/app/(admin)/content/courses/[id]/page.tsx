"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCourseDetail } from "@/hooks/useCourseDetail";
import { CourseModuleEditor } from "@/components/content/CourseModuleEditor";
import { CourseStatsPanel } from "@/components/content/CourseStatsPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { COURSE_LEVEL_LABELS, STATUS_LABELS, timeAgo } from "@/lib/utils";
import type { ContentStatus } from "@/types";
import {
  ArrowLeft, Save, Plus, GraduationCap, Target, User, FileText,
  BookOpen, BarChart3, Layers, Trash2, X, Globe, Award, Image,
} from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

const STATUS_OPTIONS: ContentStatus[] = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED", "REJECTED"];
const LANGUAGE_LABELS: Record<string, string> = { FR: "Français", EN: "English", LN: "Lingala", SW: "Kiswahili" };

type TabKey = "content" | "modules" | "stats";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const {
    course, stats, loading, saving, hasUnsavedChanges, setHasUnsavedChanges,
    fetchStats, saveCourse, updateStatus, deleteCourse,
    createModule, updateModule, deleteModule, reorderModules,
    createQuiz, updateQuiz, deleteQuiz,
    addQuizQuestion, updateQuizQuestion, deleteQuizQuestion,
  } = useCourseDetail(courseId);

  const [activeTab, setActiveTab] = useState<TabKey>("content");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // ─── Local form state ───────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherBio, setTeacherBio] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [level, setLevel] = useState("BEGINNER");
  const [language, setLanguage] = useState("FR");
  const [passingScore, setPassingScore] = useState(70);
  const [hasCertificate, setHasCertificate] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  // Sync local state when course loads
  const [initializedFor, setInitializedFor] = useState<string | null>(null);
  if (course && initializedFor !== course.id) {
    setTitle(course.title);
    setSubtitle(course.subtitle ?? "");
    setDescription(course.description);
    setObjectives(course.objectives ?? []);
    setTeacherName(course.teacherName ?? "");
    setTeacherBio(course.teacherBio ?? "");
    setCoverUrl(course.coverUrl ?? "");
    setLevel(course.level);
    setLanguage(course.language);
    setPassingScore(course.passingScore);
    setHasCertificate(course.hasCertificate);
    setHasAudio(course.hasAudio);
    setHasVideo(course.hasVideo);
    setInitializedFor(course.id);
  }

  const markDirty = () => setHasUnsavedChanges(true);

  const handleSave = async () => {
    await saveCourse({
      title, subtitle: subtitle || undefined, description,
      objectives, teacherName: teacherName || undefined,
      teacherBio: teacherBio || undefined,
      coverUrl: coverUrl || undefined,
      level: level as any, language: language as any,
      passingScore, hasCertificate, hasAudio, hasVideo,
    });
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer cette formation ? Cette action est irréversible.")) return;
    const ok = await deleteCourse();
    if (ok) router.push("/content/courses");
  };

  const handleAddModule = async () => {
    const mod = await createModule({
      title: `Module ${(course?.modules.length ?? 0) + 1}`,
      content: "Contenu de la leçon...",
    } as any);
    if (mod) {
      setExpandedModules((prev) => new Set([...prev, mod.id]));
    }
  };

  const toggleModuleExpanded = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective("");
    markDirty();
  };

  const removeObjective = (i: number) => {
    setObjectives(objectives.filter((_, idx) => idx !== i));
    markDirty();
  };

  const fetchStatsCallback = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: "content", label: "Contenu", icon: FileText },
    { key: "modules", label: `Modules (${course?.modules.length ?? 0})`, icon: Layers },
    { key: "stats", label: "Statistiques", icon: BarChart3 },
  ];

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/content/courses")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold truncate max-w-md">{course.title}</h1>
                <StatusBadge status={course.status} />
                {hasUnsavedChanges && (
                  <Badge variant="warning" className="text-[10px] animate-pulse">Non sauvegardé</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Modifié {timeAgo(course.updatedAt)} · {course._count?.modules ?? course.moduleCount} modules · {course._count?.enrollments ?? course.enrollCount} inscrits
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={course.status}
              onChange={(e) => updateStatus(e.target.value as ContentStatus)}
              className="w-36 h-8 text-xs"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
              ))}
            </Select>
            <Button onClick={handleSave} loading={saving} disabled={!hasUnsavedChanges}>
              <Save className="w-4 h-4" /> Sauvegarder
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-0.5">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* ─── Content Tab ─────────────────────────────────────────────────── */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <label className="block text-xs font-medium mb-1.5">Titre *</label>
                    <Input value={title} onChange={(e) => { setTitle(e.target.value); markDirty(); }} className="text-lg font-medium h-11" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Sous-titre</label>
                    <Input value={subtitle} onChange={(e) => { setSubtitle(e.target.value); markDirty(); }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); markDirty(); }}
                      rows={6}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y leading-relaxed"
                    />
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
                      placeholder="Ajouter un objectif..."
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                    />
                    <Button variant="outline" size="sm" onClick={addObjective}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
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
                    <label className="block text-xs font-medium mb-1.5">Nom</label>
                    <Input value={teacherName} onChange={(e) => { setTeacherName(e.target.value); markDirty(); }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Biographie</label>
                    <textarea
                      value={teacherBio}
                      onChange={(e) => { setTeacherBio(e.target.value); markDirty(); }}
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
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
                  <FileUpload
                    value={coverUrl}
                    onChange={(url) => { setCoverUrl(url); markDirty(); }}
                    accept="image/*"
                    folder="courses/covers"
                  />
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
                    <label className="block text-xs font-medium mb-1.5">Niveau</label>
                    <Select value={level} onChange={(e) => { setLevel(e.target.value); markDirty(); }} className="w-full">
                      {Object.entries(COURSE_LEVEL_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">
                      <Globe className="w-3 h-3 inline mr-1" />Langue
                    </label>
                    <Select value={language} onChange={(e) => { setLanguage(e.target.value); markDirty(); }} className="w-full">
                      {Object.entries(LANGUAGE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">Score minimum (%)</label>
                    <Input type="number" min={0} max={100} value={passingScore} onChange={(e) => { setPassingScore(Number(e.target.value)); markDirty(); }} />
                  </div>
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="cert-edit" checked={hasCertificate} onChange={(e) => { setHasCertificate(e.target.checked); markDirty(); }} className="rounded" />
                      <label htmlFor="cert-edit" className="text-sm flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" /> Certificat
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="audio-edit" checked={hasAudio} onChange={(e) => { setHasAudio(e.target.checked); markDirty(); }} className="rounded" />
                      <label htmlFor="audio-edit" className="text-sm">Contenu audio</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="video-edit" checked={hasVideo} onChange={(e) => { setHasVideo(e.target.checked); markDirty(); }} className="rounded" />
                      <label htmlFor="video-edit" className="text-sm">Contenu vidéo</label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger zone */}
              <Card className="border-destructive/30">
                <CardContent className="p-4">
                  <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full">
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer la formation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ─── Modules Tab ─────────────────────────────────────────────────── */}
        {activeTab === "modules" && (
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Modules de la formation</h2>
                <p className="text-xs text-muted-foreground">{course.modules.length} module{course.modules.length !== 1 ? "s" : ""} · Glissez pour réordonner</p>
              </div>
              <Button size="sm" onClick={handleAddModule}>
                <Plus className="w-3.5 h-3.5" /> Nouveau module
              </Button>
            </div>

            {course.modules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Layers className="w-12 h-12 text-muted-foreground/20 mb-3" />
                <h3 className="text-sm font-medium mb-1">Aucun module</h3>
                <p className="text-xs text-muted-foreground mb-4 max-w-sm">
                  Les modules sont les leçons de votre formation. Ajoutez votre premier module pour commencer à structurer le contenu.
                </p>
                <Button size="sm" onClick={handleAddModule}>
                  <Plus className="w-3.5 h-3.5" /> Créer le premier module
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {course.modules.map((mod, idx) => (
                  <CourseModuleEditor
                    key={mod.id}
                    module={mod}
                    index={idx}
                    courseId={courseId}
                    isExpanded={expandedModules.has(mod.id)}
                    onToggle={() => toggleModuleExpanded(mod.id)}
                    onUpdate={updateModule}
                    onDelete={deleteModule}
                    onCreateQuiz={createQuiz}
                    onUpdateQuiz={updateQuiz}
                    onDeleteQuiz={deleteQuiz}
                    onAddQuestion={addQuizQuestion}
                    onUpdateQuestion={updateQuizQuestion}
                    onDeleteQuestion={deleteQuizQuestion}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Stats Tab ───────────────────────────────────────────────────── */}
        {activeTab === "stats" && (
          <div className="max-w-3xl">
            <CourseStatsPanel stats={stats} onLoad={fetchStatsCallback} />
          </div>
        )}
      </div>
    </div>
  );
}
