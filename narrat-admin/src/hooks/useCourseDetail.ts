"use client";

import { useState, useCallback, useEffect } from "react";
import { coursesService } from "@/services/content.service";
import { extractErrorMessage } from "@/services/api";
import type { CourseDetail, CourseModuleItem, CourseStats, ContentStatus } from "@/types";
import { toast } from "sonner";

export function useCourseDetail(courseId: string | null) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await coursesService.get(courseId);
      setCourse(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const fetchStats = useCallback(async () => {
    if (!courseId) return;
    try {
      const data = await coursesService.getStats(courseId);
      setStats(data);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // ─── Course CRUD ────────────────────────────────────────────────────────────

  const saveCourse = async (data: Partial<CourseDetail>) => {
    if (!courseId) return;
    setSaving(true);
    try {
      const updated = await coursesService.update(courseId, data);
      setCourse(updated);
      setHasUnsavedChanges(false);
      toast.success("Formation sauvegardée");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (status: ContentStatus) => {
    if (!courseId) return;
    try {
      await coursesService.updateStatus(courseId, status);
      setCourse((prev) => prev ? { ...prev, status } : prev);
      toast.success("Statut mis à jour");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const deleteCourse = async () => {
    if (!courseId) return;
    try {
      await coursesService.delete(courseId);
      toast.success("Formation supprimée");
      return true;
    } catch (err) {
      toast.error(extractErrorMessage(err));
      return false;
    }
  };

  // ─── Module CRUD ────────────────────────────────────────────────────────────

  const createModule = async (data: Partial<CourseModuleItem>) => {
    if (!courseId) return;
    try {
      const mod = await coursesService.createModule(courseId, data);
      setCourse((prev) =>
        prev ? { ...prev, modules: [...prev.modules, mod], moduleCount: prev.moduleCount + 1 } : prev
      );
      toast.success("Module créé");
      return mod;
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const updateModule = async (moduleId: string, data: Partial<CourseModuleItem>) => {
    if (!courseId) return;
    try {
      const updated = await coursesService.updateModule(courseId, moduleId, data);
      setCourse((prev) =>
        prev
          ? { ...prev, modules: prev.modules.map((m) => (m.id === moduleId ? updated : m)) }
          : prev
      );
      toast.success("Module sauvegardé");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!courseId) return;
    try {
      await coursesService.deleteModule(courseId, moduleId);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.filter((m) => m.id !== moduleId),
              moduleCount: prev.moduleCount - 1,
            }
          : prev
      );
      toast.success("Module supprimé");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const reorderModules = async (moduleIds: string[]) => {
    if (!courseId) return;
    try {
      await coursesService.reorderModules(courseId, moduleIds);
      setCourse((prev) => {
        if (!prev) return prev;
        const reordered = moduleIds
          .map((id, index) => {
            const mod = prev.modules.find((m) => m.id === id);
            return mod ? { ...mod, moduleIndex: index } : null;
          })
          .filter(Boolean) as CourseModuleItem[];
        return { ...prev, modules: reordered };
      });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  // ─── Quiz CRUD ──────────────────────────────────────────────────────────────

  const createQuiz = async (moduleId: string, data: any) => {
    if (!courseId) return;
    try {
      const quiz = await coursesService.createQuiz(courseId, moduleId, data);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map((m) =>
                m.id === moduleId ? { ...m, quiz } : m
              ),
            }
          : prev
      );
      toast.success("Quiz créé");
      return quiz;
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const updateQuiz = async (moduleId: string, quizId: string, data: any) => {
    if (!courseId) return;
    try {
      const updated = await coursesService.updateQuiz(courseId, moduleId, quizId, data);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map((m) =>
                m.id === moduleId ? { ...m, quiz: updated } : m
              ),
            }
          : prev
      );
      toast.success("Quiz mis à jour");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const deleteQuiz = async (moduleId: string, quizId: string) => {
    if (!courseId) return;
    try {
      await coursesService.deleteQuiz(courseId, moduleId, quizId);
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              modules: prev.modules.map((m) =>
                m.id === moduleId ? { ...m, quiz: undefined } : m
              ),
            }
          : prev
      );
      toast.success("Quiz supprimé");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  // ─── Quiz Questions ─────────────────────────────────────────────────────────

  const addQuizQuestion = async (moduleId: string, quizId: string, data: any) => {
    if (!courseId) return;
    try {
      const question = await coursesService.addQuizQuestion(courseId, moduleId, quizId, data);
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((m) =>
            m.id === moduleId && m.quiz
              ? { ...m, quiz: { ...m.quiz, questions: [...m.quiz.questions, question] } }
              : m
          ),
        };
      });
      toast.success("Question ajoutée");
      return question;
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const updateQuizQuestion = async (moduleId: string, quizId: string, questionId: string, data: any) => {
    if (!courseId) return;
    try {
      const updated = await coursesService.updateQuizQuestion(courseId, moduleId, quizId, questionId, data);
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((m) =>
            m.id === moduleId && m.quiz
              ? {
                  ...m,
                  quiz: {
                    ...m.quiz,
                    questions: m.quiz.questions.map((q) =>
                      q.id === questionId ? updated : q
                    ),
                  },
                }
              : m
          ),
        };
      });
      toast.success("Question mise à jour");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  const deleteQuizQuestion = async (moduleId: string, quizId: string, questionId: string) => {
    if (!courseId) return;
    try {
      await coursesService.deleteQuizQuestion(courseId, moduleId, quizId, questionId);
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((m) =>
            m.id === moduleId && m.quiz
              ? {
                  ...m,
                  quiz: {
                    ...m.quiz,
                    questions: m.quiz.questions.filter((q) => q.id !== questionId),
                  },
                }
              : m
          ),
        };
      });
      toast.success("Question supprimée");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return {
    course,
    stats,
    loading,
    saving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    fetchCourse,
    fetchStats,
    saveCourse,
    updateStatus,
    deleteCourse,
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
  };
}
