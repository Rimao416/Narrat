"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QuizEditor } from "./QuizEditor";
import type { CourseModuleItem } from "@/types";
import {
  ChevronDown, ChevronUp, GripVertical, Trash2, Save,
  Video, Headphones, BookOpen, Lock, Unlock, Plus, HelpCircle, X,
} from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface CourseModuleEditorProps {
  module: CourseModuleItem;
  index: number;
  courseId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (moduleId: string, data: Partial<CourseModuleItem>) => Promise<void>;
  onDelete: (moduleId: string) => Promise<void>;
  onCreateQuiz: (moduleId: string, data: any) => Promise<any>;
  onUpdateQuiz: (moduleId: string, quizId: string, data: any) => Promise<void>;
  onDeleteQuiz: (moduleId: string, quizId: string) => Promise<void>;
  onAddQuestion: (moduleId: string, quizId: string, data: any) => Promise<any>;
  onUpdateQuestion: (moduleId: string, quizId: string, questionId: string, data: any) => Promise<void>;
  onDeleteQuestion: (moduleId: string, quizId: string, questionId: string) => Promise<void>;
  dragHandleProps?: any;
}

export function CourseModuleEditor({
  module, index, courseId,
  isExpanded, onToggle,
  onUpdate, onDelete,
  onCreateQuiz, onUpdateQuiz, onDeleteQuiz,
  onAddQuestion, onUpdateQuestion, onDeleteQuestion,
  dragHandleProps,
}: CourseModuleEditorProps) {
  const [title, setTitle] = useState(module.title);
  const [content, setContent] = useState(module.content);
  const [summary, setSummary] = useState(module.summary ?? "");
  const [audioUrl, setAudioUrl] = useState(module.audioUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(module.videoUrl ?? "");
  const [readTime, setReadTime] = useState(module.readTime ?? 0);
  const [verseRefs, setVerseRefs] = useState<string[]>(module.verseRefs ?? []);
  const [newVerseRef, setNewVerseRef] = useState("");
  const [isLocked, setIsLocked] = useState(module.isLocked);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const markDirty = () => setHasChanges(true);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(module.id, {
      title, content, summary: summary || undefined,
      audioUrl: audioUrl || undefined,
      videoUrl: videoUrl || undefined,
      readTime: readTime || undefined,
      verseRefs, isLocked,
    });
    setHasChanges(false);
    setSaving(false);
  };

  const handleAddVerseRef = () => {
    if (!newVerseRef.trim()) return;
    setVerseRefs([...verseRefs, newVerseRef.trim()]);
    setNewVerseRef("");
    markDirty();
  };

  const handleRemoveVerseRef = (idx: number) => {
    setVerseRefs(verseRefs.filter((_, i) => i !== idx));
    markDirty();
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all">
      {/* Module header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/20">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground/40" />
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <button onClick={onToggle} className="flex-1 text-left flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate">{module.title}</span>
          {module.isLocked && <Lock className="w-3 h-3 text-muted-foreground/60 shrink-0" />}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          {module.audioUrl && <Headphones className="w-3.5 h-3.5 text-muted-foreground/60" />}
          {module.videoUrl && <Video className="w-3.5 h-3.5 text-muted-foreground/60" />}
          {module.quiz && (
            <Badge variant="secondary" className="text-[10px]">
              <HelpCircle className="w-2.5 h-2.5 mr-0.5" />
              {module.quiz.questions.length}
            </Badge>
          )}
          {module._count?.completions != null && module._count.completions > 0 && (
            <Badge variant="default" className="text-[10px]">{module._count.completions} complété{module._count.completions > 1 ? "s" : ""}</Badge>
          )}
          {hasChanges && <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Non sauvegardé" />}
          <button onClick={onToggle}>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Module content */}
      {isExpanded && (
        <div className="px-4 py-4 space-y-4 border-t border-border/50 animate-fade-in">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-1.5">Titre du module *</label>
            <Input value={title} onChange={(e) => { setTitle(e.target.value); markDirty(); }} placeholder="Ex: Introduction à la prière" />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-medium mb-1.5">Contenu *</label>
            <RichTextEditor
              content={content}
              onChange={(html) => { setContent(html); markDirty(); }}
              placeholder="Le contenu détaillé de la leçon..."
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-medium mb-1.5">Résumé</label>
            <RichTextEditor
              content={summary}
              onChange={(val) => { setSummary(val); markDirty(); }}
              placeholder="Un résumé court de la leçon..."
            />
          </div>

          {/* Media */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FileUpload
                value={audioUrl}
                onChange={(url) => { setAudioUrl(url); markDirty(); }}
                accept="audio/*"
                label="URL Audio"
                folder="courses/audio"
              />
            </div>
            <div>
              <FileUpload
                value={videoUrl}
                onChange={(url) => { setVideoUrl(url); markDirty(); }}
                accept="video/*"
                label="URL Vidéo"
                folder="courses/video"
              />
            </div>
          </div>

          {/* Read time + Lock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Temps de lecture (min)</label>
              <Input type="number" min={0} value={readTime} onChange={(e) => { setReadTime(Number(e.target.value)); markDirty(); }} />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <button
                onClick={() => { setIsLocked(!isLocked); markDirty(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                  isLocked
                    ? "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700"
                    : "border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                }`}
              >
                {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {isLocked ? "Verrouillé" : "Déverrouillé"}
              </button>
            </div>
          </div>

          {/* Verse refs */}
          <div>
            <label className="block text-xs font-medium mb-1.5">
              <BookOpen className="w-3 h-3 inline mr-1" />Références bibliques
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {verseRefs.map((ref, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {ref}
                  <button onClick={() => handleRemoveVerseRef(i)} className="hover:text-destructive">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newVerseRef}
                onChange={(e) => setNewVerseRef(e.target.value)}
                placeholder="Ex: Matthieu 6:9-13"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddVerseRef())}
              />
              <Button variant="outline" size="sm" onClick={handleAddVerseRef}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Quiz section */}
          <div className="border-t border-border pt-4">
            {module.quiz ? (
              <QuizEditor
                quiz={module.quiz}
                courseId={courseId}
                moduleId={module.id}
                onUpdateQuiz={(qid, data) => onUpdateQuiz(module.id, qid, data)}
                onDeleteQuiz={(qid) => onDeleteQuiz(module.id, qid)}
                onAddQuestion={(qid, data) => onAddQuestion(module.id, qid, data)}
                onUpdateQuestion={(qid, questionId, data) => onUpdateQuestion(module.id, qid, questionId, data)}
                onDeleteQuestion={(qid, questionId) => onDeleteQuestion(module.id, qid, questionId)}
              />
            ) : (
              <Button
                variant="outline" size="sm"
                onClick={() => onCreateQuiz(module.id, { passingScore: 70, maxAttempts: 0, shuffleQuestions: true })}
                className="w-full"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Ajouter un quiz
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <Button
              variant="ghost" size="sm"
              onClick={() => onDelete(module.id)}
              className="text-destructive hover:text-destructive text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Supprimer ce module
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving} disabled={!hasChanges}>
              <Save className="w-3.5 h-3.5" /> Sauvegarder
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
