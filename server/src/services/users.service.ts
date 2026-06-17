import { getDb } from "../db/connection";
import {
  UserQueryParams,
  UsersResponse,
  User,
  SortField,
  SortOrder,
} from "../types/user.types";
import {
  buildOrderClause,
  buildWhereClause,
  normalizePagination,
} from "../utils/sql";
import {
  formatNationalities,
  parseNationalities,
} from "../utils/nationality";

const HOBBIES_BY_USER = `
  SELECT user_id, hobby
  FROM user_hobbies
  WHERE user_id IN ({ids})
  ORDER BY hobby ASC
`;

/**
 * Fetches paginated users with facets for the active filter and sort state.
 */
export function getUsers(query: UserQueryParams): UsersResponse {
  const db = getDb();
  const { whereSql, params } = buildWhereClause(query);
  const { page, limit, offset } = normalizePagination(query.page, query.limit);
  const orderSql = buildOrderClause(query.sortBy, query.sortOrder);

  const countRow = db
    .prepare(`SELECT COUNT(*) AS total FROM users u ${whereSql}`)
    .get(...params) as { total: number };

  const total = countRow.total;

  const userRows = db
    .prepare(
      `SELECT u.id, u.avatar, u.first_name, u.last_name, u.age, u.nationality
       FROM users u
       ${whereSql}
       ${orderSql}
       LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset) as Omit<User, "hobbies">[];

  const users = attachHobbies(userRows).map((user) => ({
    ...user,
    nationality: formatNationalities(parseNationalities(user.nationality)),
  }));

  const nationalityFacets = db
    .prepare(
      `SELECT je.value AS value, COUNT(DISTINCT u.id) AS count
       FROM users u, json_each(u.nationality) AS je
       ${whereSql}
       GROUP BY je.value
       ORDER BY count DESC, je.value ASC
       LIMIT 20`,
    )
    .all(...params) as { value: string; count: number }[];

  const hobbyFacets = db
    .prepare(
      `SELECT uh.hobby AS value, COUNT(DISTINCT u.id) AS count
       FROM users u
       INNER JOIN user_hobbies uh ON uh.user_id = u.id
       ${whereSql}
       GROUP BY uh.hobby
       ORDER BY count DESC, uh.hobby ASC
       LIMIT 20`,
    )
    .all(...params) as { value: string; count: number }[];

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
    facets: {
      hobbies: hobbyFacets,
      nationalities: nationalityFacets,
    },
  };
}

/** Loads hobbies for a batch of users and returns fully populated user objects. */
function attachHobbies(rows: Omit<User, "hobbies">[]): User[] {
  if (rows.length === 0) {
    return [];
  }

  const db = getDb();
  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => "?").join(", ");
  const hobbyRows = db
    .prepare(HOBBIES_BY_USER.replace("{ids}", placeholders))
    .all(...ids) as { user_id: number; hobby: string }[];

  const hobbiesByUser = new Map<number, string[]>();
  for (const row of hobbyRows) {
    const existing = hobbiesByUser.get(row.user_id) ?? [];
    existing.push(row.hobby);
    hobbiesByUser.set(row.user_id, existing);
  }

  return rows.map((row) => ({
    ...row,
    hobbies: hobbiesByUser.get(row.id) ?? [],
  }));
}

/** Validates and normalizes incoming query parameters from the request. */
export function parseUserQuery(query: Record<string, unknown>): UserQueryParams {
  const sortFields: SortField[] = [
    "first_name",
    "last_name",
    "age",
    "nationality",
  ];
  const sortBy = sortFields.includes(query.sortBy as SortField)
    ? (query.sortBy as SortField)
    : "first_name";

  const sortOrder: SortOrder = query.sortOrder === "desc" ? "desc" : "asc";

  const parseCsv = (value: unknown): string[] => {
    if (typeof value !== "string" || !value.trim()) return [];
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  };

  return {
    search: typeof query.search === "string" ? query.search : "",
    hobbies: parseCsv(query.hobbies),
    nationalities: parseCsv(query.nationalities),
    sortBy,
    sortOrder,
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 20,
  };
}
