"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { QUIZ_QUESTION_TYPE_LABELS } from "@/lib/utils";
import type { CourseQuizItem, QuizQuestionItem } from "@/types";
import {
  Plus, Trash2, GripVertical, Check, X, ChevronDown, ChevronUp,
  HelpCircle, BookOpen, Settings2,
} from "lucide-react";

interface QuizEditorProps {
  quiz: CourseQuizItem;
  courseId: string;
  moduleId: string;
  onUpdateQuiz: (quizId: string, data: any) => Promise<void>;
  onDeleteQuiz: (quizId: string) => Promise<void>;
  onAddQuestion: (quizId: string, data: any) => Promise<any>;
  onUpdateQuestion: (quizId: string, questionId: string, data: any) => Promise<void>;
  onDeleteQuestion: (quizId: string, questionId: string) => Promise<void>;
}

interface QuestionFormData {
  type: "MCQ" | "TRUE_FALSE" | "MATCHING" | "FILL_BLANK";
  question: string;
  explanation: string;
  verseRef: string;
  answers: { text: string; isCorrect: boolean }[];
}

const EMPTY_QUESTION: QuestionFormData = {
  type: "MCQ",
  question: "",
  explanation: "",
  verseRef: "",
  answers: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
};

export function QuizEditor({
  quiz, courseId, moduleId,
  onUpdateQuiz, onDeleteQuiz,
  onAddQuestion, onUpdateQuestion, onDeleteQuestion,
}: QuizEditorProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuestionFormData>({ ...EMPTY_QUESTION });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<QuestionFormData>({ ...EMPTY_QUESTION });
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSaveSettings = async () => {
    await onUpdateQuiz(quiz.id, {
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      shuffleQuestions: quiz.shuffleQuestions,
    });
    setShowSettings(false);
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) return;
    const validAnswers = newQuestion.answers.filter((a) => a.text.trim());
    if (validAnswers.length < 1) return;
    await onAddQuestion(quiz.id, {
      ...newQuestion,
      answers: validAnswers,
      sortOrder: quiz.questions.length,
    });
    setNewQuestion({ ...EMPTY_QUESTION });
    setAddingQuestion(false);
  };

  const handleEditQuestion = async (questionId: string) => {
    if (!editForm.question.trim()) return;
    const validAnswers = editForm.answers.filter((a) => a.text.trim());
    if (validAnswers.length < 1) return;
    await onUpdateQuestion(quiz.id, questionId, {
      ...editForm,
      answers: validAnswers,
    });
    setEditingId(null);
  };

  const startEdit = (q: QuizQuestionItem) => {
    setEditingId(q.id);
    setEditForm({
      type: q.type,
      question: q.question,
      explanation: q.explanation ?? "",
      verseRef: q.verseRef ?? "",
      answers: q.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect })),
    });
  };

  return (
    <div className="space-y-3">
      {/* Quiz header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold">Quiz du module</h4>
          <Badge variant="secondary">{quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} title="Paramètres">
            <Settings2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDeleteQuiz(quiz.id)} title="Supprimer le quiz" className="text-destructive hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3 animate-fade-in">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Score minimum (%)</label>
              <Input
                type="number" min={0} max={100}
                defaultValue={quiz.passingScore}
                onBlur={(e) => onUpdateQuiz(quiz.id, { passingScore: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Max tentatives</label>
              <Input
                type="number" min={0}
                defaultValue={quiz.maxAttempts}
                onBlur={(e) => onUpdateQuiz(quiz.id, { maxAttempts: Number(e.target.value) })}
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">0 = illimité</p>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id={`shuffle-${quiz.id}`}
                defaultChecked={quiz.shuffleQuestions}
                onChange={(e) => onUpdateQuiz(quiz.id, { shuffleQuestions: e.target.checked })}
                className="rounded"
              />
              <label htmlFor={`shuffle-${quiz.id}`} className="text-xs">Mélanger</label>
            </div>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-2">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Question header */}
            <button
              onClick={() => toggleExpanded(q.id)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/30 transition-colors text-left"
            >
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">Q{idx + 1}</span>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {QUIZ_QUESTION_TYPE_LABELS[q.type] ?? q.type}
              </Badge>
              <span className="text-sm truncate flex-1">{q.question}</span>
              <div className="flex items-center gap-1 shrink-0">
                <Badge variant="success" className="text-[10px]">
                  {q.answers.filter((a) => a.isCorrect).length} correcte{q.answers.filter((a) => a.isCorrect).length !== 1 ? "s" : ""}
                </Badge>
                {expandedQuestions.has(q.id) ? (
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Question detail */}
            {expandedQuestions.has(q.id) && (
              <div className="px-3 pb-3 border-t border-border/50 pt-2 space-y-2 animate-fade-in">
                {editingId === q.id ? (
                  <QuestionForm
                    data={editForm}
                    onChange={setEditForm}
                    onSave={() => handleEditQuestion(q.id)}
                    onCancel={() => setEditingId(null)}
                    saveLabel="Sauvegarder"
                  />
                ) : (
                  <>
                    <div className="space-y-1.5">
                      {q.answers.map((a) => (
                        <div key={a.id} className="flex items-center gap-2 text-sm">
                          {a.isCorrect ? (
                            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                          )}
                          <span className={a.isCorrect ? "font-medium" : "text-muted-foreground"}>{a.text}</span>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        <BookOpen className="w-3 h-3 inline mr-1" />
                        {q.explanation}
                      </p>
                    )}
                    {q.verseRef && (
                      <p className="text-xs text-primary">{q.verseRef}</p>
                    )}
                    <div className="flex items-center gap-1 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(q)} className="text-xs h-7">
                        Modifier
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => onDeleteQuestion(quiz.id, q.id)}
                        className="text-xs h-7 text-destructive hover:text-destructive"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add question */}
      {addingQuestion ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-3 animate-fade-in">
          <h5 className="text-xs font-semibold">Nouvelle question</h5>
          <QuestionForm
            data={newQuestion}
            onChange={setNewQuestion}
            onSave={handleAddQuestion}
            onCancel={() => setAddingQuestion(false)}
            saveLabel="Ajouter"
          />
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAddingQuestion(true)} className="w-full">
          <Plus className="w-3.5 h-3.5" /> Ajouter une question
        </Button>
      )}
    </div>
  );
}

// ─── Question Form (reused for add & edit) ────────────────────────────────────

interface QuestionFormProps {
  data: QuestionFormData;
  onChange: (data: QuestionFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}

function QuestionForm({ data, onChange, onSave, onCancel, saveLabel }: QuestionFormProps) {
  const updateAnswer = (index: number, field: string, value: any) => {
    const answers = [...data.answers];
    answers[index] = { ...answers[index], [field]: value };
    onChange({ ...data, answers });
  };

  const addAnswer = () => {
    onChange({ ...data, answers: [...data.answers, { text: "", isCorrect: false }] });
  };

  const removeAnswer = (index: number) => {
    if (data.answers.length <= 1) return;
    onChange({ ...data, answers: data.answers.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <Select value={data.type} onChange={(e) => onChange({ ...data, type: e.target.value as any })} className="w-full">
            {Object.entries(QUIZ_QUESTION_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Réf. biblique</label>
          <Input value={data.verseRef} onChange={(e) => onChange({ ...data, verseRef: e.target.value })} placeholder="Ex: Jean 3:16" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Question *</label>
        <textarea
          value={data.question}
          onChange={(e) => onChange({ ...data, question: e.target.value })}
          rows={2}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          placeholder="Posez votre question..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Réponses</label>
        <div className="space-y-1.5">
          {data.answers.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateAnswer(i, "isCorrect", !a.isCorrect)}
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  a.isCorrect
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-muted-foreground/30 hover:border-muted-foreground/60"
                }`}
              >
                {a.isCorrect && <Check className="w-3 h-3" />}
              </button>
              <Input
                value={a.text}
                onChange={(e) => updateAnswer(i, "text", e.target.value)}
                placeholder={`Réponse ${i + 1}`}
                className="flex-1"
              />
              {data.answers.length > 1 && (
                <button type="button" onClick={() => removeAnswer(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={addAnswer} className="mt-1 text-xs h-7">
          <Plus className="w-3 h-3" /> Ajouter une réponse
        </Button>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Explication (optionnel)</label>
        <textarea
          value={data.explanation}
          onChange={(e) => onChange({ ...data, explanation: e.target.value })}
          rows={2}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          placeholder="Pourquoi cette réponse est correcte..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Annuler</Button>
        <Button size="sm" onClick={onSave}>{saveLabel}</Button>
      </div>
    </div>
  );
}
