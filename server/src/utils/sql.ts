import { UserQueryParams } from "../types/user.types";

const SORT_FIELDS = new Set([
  "first_name",
  "last_name",
  "age",
  "nationality",
]);

export interface WhereClauseResult {
  whereSql: string;
  params: unknown[];
}

/**
 * Builds a reusable WHERE clause for user list and facet queries.
 * Hobby filters use AND semantics; nationality filters use OR semantics.
 */
export function buildWhereClause(query: UserQueryParams): WhereClauseResult {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (query.search?.trim()) {
    const term = `%${query.search.trim()}%`;
    conditions.push(
      "(u.first_name LIKE ? COLLATE NOCASE OR u.last_name LIKE ? COLLATE NOCASE)",
    );
    params.push(term, term);
  }

  if (query.nationalities?.length) {
    const placeholders = query.nationalities.map(() => "?").join(", ");
    conditions.push(`u.nationality IN (${placeholders})`);
    params.push(...query.nationalities);
  }

  if (query.hobbies?.length) {
    const placeholders = query.hobbies.map(() => "?").join(", ");
    conditions.push(`u.id IN (
      SELECT uh.user_id
      FROM user_hobbies uh
      WHERE uh.hobby IN (${placeholders})
      GROUP BY uh.user_id
      HAVING COUNT(DISTINCT uh.hobby) = ?
    )`);
    params.push(...query.hobbies, query.hobbies.length);
  }

  const whereSql =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return { whereSql, params };
}

/** Returns a validated ORDER BY clause with id as deterministic tie-breaker. */
export function buildOrderClause(
  sortBy: UserQueryParams["sortBy"],
  sortOrder: UserQueryParams["sortOrder"],
): string {
  const field = SORT_FIELDS.has(sortBy ?? "") ? sortBy! : "first_name";
  const direction = sortOrder === "desc" ? "DESC" : "ASC";
  return `ORDER BY u.${field} ${direction}, u.id ASC`;
}

/** Normalizes pagination inputs with safe defaults and upper bounds. */
export function normalizePagination(
  page?: number,
  limit?: number,
): { page: number; limit: number; offset: number } {
  const safePage = Math.max(1, page ?? 1);
  const safeLimit = Math.min(100, Math.max(1, limit ?? 20));
  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}

/** Parses comma-separated query values into a trimmed, non-empty array. */
export function parseListParam(value: unknown): string[] {
  if (typeof value !== "string" || !value.trim()) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
