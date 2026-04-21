import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "d MMM yyyy", { locale: fr });
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), "d MMM yyyy, HH:mm", { locale: fr });
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const ROLE_LABELS: Record<string, string> = {
  USER: "Utilisateur",
  MODERATOR: "Modérateur",
  EDITOR: "Éditeur",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  REVIEW: "En révision",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
  REJECTED: "Rejeté",
};

export const LEVEL_LABELS: Record<string, string> = {
  NEW_BELIEVER: "Nouveau croyant",
  BELIEVER: "Croyant",
  ESTABLISHED: "Établi",
  LEADER: "Leader",
  PASTOR: "Pasteur",
};

export const CATEGORY_LABELS: Record<string, string> = {
  THEOLOGY: "Théologie",
  BIOGRAPHY: "Biographie",
  SPIRITUAL_GROWTH: "Croissance spirituelle",
  PRAYER: "Prière",
  MARRIAGE_FAMILY: "Mariage & Famille",
  FINANCES: "Finances",
  SPIRITUAL_WARFARE: "Guerre spirituelle",
  APOLOGETICS: "Apologétique",
  CHURCH_HISTORY: "Histoire de l'Église",
  ESCHATOLOGY: "Eschatologie",
  SENSITIVE_TOPICS: "Sujets sensibles",
  YOUTH_IDENTITY: "Jeunesse & Identité",
};

export const CHALLENGE_CATEGORY_LABELS: Record<string, string> = {
  PURITY: "Pureté",
  MENTAL_HEALTH: "Santé mentale",
  PRAYER: "Prière",
  BIBLE_READING: "Lecture biblique",
  FASTING: "Jeûne",
  FORGIVENESS: "Pardon",
  ANGER: "Colère",
  GRATITUDE: "Gratitude",
  EVANGELISM: "Évangélisation",
  FAMILY: "Famille",
};

export const COURSE_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Débutant",
  INTERMEDIATE: "Intermédiaire",
  ADVANCED: "Avancé",
};

export const QUIZ_QUESTION_TYPE_LABELS: Record<string, string> = {
  MCQ: "QCM",
  TRUE_FALSE: "Vrai / Faux",
  MATCHING: "Correspondance",
  FILL_BLANK: "Texte à trou",
};
