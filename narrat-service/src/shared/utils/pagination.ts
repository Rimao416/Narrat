export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export function paginate(page = 1, pageSize = 20) {
  const p = Math.max(1, Number(page));
  const s = Math.min(100, Math.max(1, Number(pageSize)));
  return { skip: (p - 1) * s, take: s };
}

export function paginatedResponse<T>(data: T[], total: number, page = 1, pageSize = 20) {
  return {
    data,
    total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize),
  };
}
