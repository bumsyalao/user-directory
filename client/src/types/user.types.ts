/** Sortable user fields exposed by the API. */
export type SortField = "first_name" | "last_name" | "age" | "nationality";

/** Sort direction for user list queries. */
export type SortOrder = "asc" | "desc";

/** A user record returned by the API. */
export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

/** Facet value with occurrence count for the active filter state. */
export interface FacetValue {
  value: string;
  count: number;
}

/** Query parameters sent to the users API. */
export interface UserQueryParams {
  search: string;
  hobbies: string[];
  nationalities: string[];
  sortBy: SortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

/** Paginated user list response including facets. */
export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  facets: {
    hobbies: FacetValue[];
    nationalities: FacetValue[];
  };
}

/** Directory view state synced to the URL. */
export interface DirectoryState {
  search: string;
  hobbies: string[];
  nationalities: string[];
  sortBy: SortField;
  sortOrder: SortOrder;
}
