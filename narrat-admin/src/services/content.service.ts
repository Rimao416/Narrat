import { api } from "./api";
import type { Book, Course, Song, ContentStatus, PaginatedResponse, PaginationParams } from "@/types";

// ─── Books ────────────────────────────────────────────────────────────────────

export const booksService = {
  async list(params: PaginationParams & { status?: ContentStatus; category?: string }): Promise<PaginatedResponse<Book>> {
    const { data } = await api.get("/admin/books", { params });
    return data;
  },

  async get(id: string): Promise<Book> {
    const { data } = await api.get(`/admin/books/${id}`);
    return data;
  },

  async create(payload: Partial<Book>): Promise<Book> {
    const { data } = await api.post("/admin/books", payload);
    return data;
  },

  async update(id: string, payload: Partial<Book>): Promise<Book> {
    const { data } = await api.patch(`/admin/books/${id}`, payload);
    return data;
  },

  async updateStatus(id: string, status: ContentStatus): Promise<Book> {
    const { data } = await api.patch(`/admin/books/${id}/status`, { status });
    return data;
  },

  async reorder(ids: string[]): Promise<void> {
    await api.post("/admin/books/reorder", { ids });
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/books/${id}`);
  },
};

// ─── Courses ──────────────────────────────────────────────────────────────────

export const coursesService = {
  async list(params: PaginationParams & { status?: ContentStatus; level?: string }): Promise<PaginatedResponse<Course>> {
    const { data } = await api.get("/admin/courses", { params });
    return data;
  },

  async get(id: string): Promise<Course> {
    const { data } = await api.get(`/admin/courses/${id}`);
    return data;
  },

  async create(payload: Partial<Course>): Promise<Course> {
    const { data } = await api.post("/admin/courses", payload);
    return data;
  },

  async update(id: string, payload: Partial<Course>): Promise<Course> {
    const { data } = await api.patch(`/admin/courses/${id}`, payload);
    return data;
  },

  async updateStatus(id: string, status: ContentStatus): Promise<Course> {
    const { data } = await api.patch(`/admin/courses/${id}/status`, { status });
    return data;
  },

  async reorder(ids: string[]): Promise<void> {
    await api.post("/admin/courses/reorder", { ids });
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/courses/${id}`);
  },
};

// ─── Songs ────────────────────────────────────────────────────────────────────

export const songsService = {
  async list(params: PaginationParams & { status?: ContentStatus }): Promise<PaginatedResponse<Song>> {
    const { data } = await api.get("/admin/songs", { params });
    return data;
  },

  async create(payload: Partial<Song>): Promise<Song> {
    const { data } = await api.post("/admin/songs", payload);
    return data;
  },

  async update(id: string, payload: Partial<Song>): Promise<Song> {
    const { data } = await api.patch(`/admin/songs/${id}`, payload);
    return data;
  },

  async updateStatus(id: string, status: ContentStatus): Promise<Song> {
    const { data } = await api.patch(`/admin/songs/${id}/status`, { status });
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/songs/${id}`);
  },
};
