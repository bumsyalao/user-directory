import { apiFetch } from "./client";
import { UserQueryParams, UsersResponse } from "../types/user.types";

/** Builds query string parameters for the users endpoint. */
function toSearchParams(params: UserQueryParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params.hobbies.length > 0) {
    searchParams.set("hobbies", params.hobbies.join(","));
  }

  if (params.nationalities.length > 0) {
    searchParams.set("nationalities", params.nationalities.join(","));
  }

  searchParams.set("sortBy", params.sortBy);
  searchParams.set("sortOrder", params.sortOrder);
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));

  return searchParams;
}

/**
 * Fetches paginated users with facet counts for the active filter state.
 */
export async function fetchUsers(
  params: UserQueryParams,
): Promise<UsersResponse> {
  const query = toSearchParams(params).toString();
  return apiFetch<UsersResponse>(`/api/users?${query}`);
}
