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
  PRAYER: "Prière",
  MARRIAGE_FAMILY: "Mariage & Famille",
  LEADERSHIP: "Leadership",
  EVANGELISM: "Évangélisation",
  DEVOTIONAL: "Dévotion",
  BIBLICAL_STUDY: "Étude biblique",
  SPIRITUAL_GROWTH: "Croissance spirituelle",
  YOUTH: "Jeunesse",
  PROPHECY: "Prophétie",
  HEALING: "Guérison",
  REVIVAL: "Réveil",
};

export const CHALLENGE_CATEGORY_LABELS: Record<string, string> = {
  PURITY: "Pureté",
  MENTAL_HEALTH: "Santé mentale",
  PRAYER: "Prière",
  FASTING: "Jeûne",
  BIBLE_READING: "Lecture biblique",
  SERVICE: "Service",
  EVANGELISM: "Évangélisation",
  WORSHIP: "Louange",
  COMMUNITY: "Communauté",
  FINANCE: "Finances",
};
