import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserQueryParams, UsersResponse } from "../types/user.types";

/** Builds query string parameters for the users endpoint. */
function toSearchParams(params: UserQueryParams): string {
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

  return searchParams.toString();
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, UserQueryParams>({
      query: (params) => `/api/users?${toSearchParams(params)}`,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { page: _page, ...filterArgs } = queryArgs;
        return `${endpointName}(${JSON.stringify(filterArgs)})`;
      },
      merge: (currentCache, newResponse, { arg }) => {
        if (arg.page === 1) {
          return newResponse;
        }

        return {
          ...newResponse,
          users: [...currentCache.users, ...newResponse.users],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
