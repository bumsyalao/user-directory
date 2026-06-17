import { useCallback, useMemo, useState } from "react";
import { useGetUsersQuery } from "../api/usersApi";
import {
  DirectoryState,
  FacetValue,
  User,
} from "../types/user.types";
import { getQueryErrorMessage } from "../utils/queryError";

const PAGE_SIZE = 20;

interface UseUserDirectoryResult {
  users: User[];
  facets: {
    hobbies: FacetValue[];
    nationalities: FacetValue[];
  };
  total: number;
  hasMore: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  loadMore: () => void;
  retry: () => void;
}

/** Fetches paginated users and facets via RTK Query with cached infinite scroll. */
export function useUserDirectory(state: DirectoryState): UseUserDirectoryResult {
  const stateKey = JSON.stringify(state);
  const [pagination, setPagination] = useState({ stateKey, page: 1 });

  const page =
    pagination.stateKey === stateKey ? pagination.page : 1;

  const queryArgs = useMemo(
    () => ({
      search: state.search,
      hobbies: state.hobbies,
      nationalities: state.nationalities,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      page,
      limit: PAGE_SIZE,
    }),
    [state, page],
  );

  const { data, error, isError, isFetching, isLoading, refetch } =
    useGetUsersQuery(queryArgs);

  const loadMore = useCallback(() => {
    if (!data?.pagination.hasMore || isFetching) {
      return;
    }

    setPagination({ stateKey, page: page + 1 });
  }, [data?.pagination.hasMore, isFetching, page, stateKey]);

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    users: data?.users ?? [],
    facets: data?.facets ?? { hobbies: [], nationalities: [] },
    total: data?.pagination.total ?? 0,
    hasMore: data?.pagination.hasMore ?? false,
    isInitialLoading: isLoading,
    isLoadingMore: isFetching && page > 1 && !isLoading,
    error: isError && error ? getQueryErrorMessage(error) : null,
    loadMore,
    retry,
  };
}
