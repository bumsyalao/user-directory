import { useCallback, useEffect, useRef, useState } from "react";
import { fetchUsers } from "../api/users";
import {
  DirectoryState,
  FacetValue,
  User,
  UserQueryParams,
} from "../types/user.types";

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

/** Fetches paginated users and facets, appending pages for infinite scroll. */
export function useUserDirectory(state: DirectoryState): UseUserDirectoryResult {
  const [users, setUsers] = useState<User[]>([]);
  const [facets, setFacets] = useState<{
    hobbies: FacetValue[];
    nationalities: FacetValue[];
  }>({ hobbies: [], nationalities: [] });
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const stateKey = JSON.stringify(state);

  const buildParams = useCallback(
    (pageNumber: number): UserQueryParams => ({
      search: state.search,
      hobbies: state.hobbies,
      nationalities: state.nationalities,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      page: pageNumber,
      limit: PAGE_SIZE,
    }),
    [state],
  );

  const fetchPage = useCallback(
    async (pageNumber: number, append: boolean) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
        setError(null);
      }

      try {
        const response = await fetchUsers(buildParams(pageNumber));

        if (requestId !== requestIdRef.current) {
          return;
        }

        setUsers((current) =>
          append ? [...current, ...response.users] : response.users,
        );
        setFacets(response.facets);
        setTotal(response.pagination.total);
        setHasMore(response.pagination.hasMore);
        setPage(pageNumber);
        setError(null);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to load users";
        setError(message);

        if (!append) {
          setUsers([]);
          setFacets({ hobbies: [], nationalities: [] });
          setTotal(0);
          setHasMore(false);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsInitialLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [buildParams],
  );

  useEffect(() => {
    setPage(1);
    void fetchPage(1, false);
  }, [stateKey, fetchPage]);

  const loadMore = useCallback(() => {
    if (isInitialLoading || isLoadingMore || !hasMore) {
      return;
    }
    void fetchPage(page + 1, true);
  }, [fetchPage, hasMore, isInitialLoading, isLoadingMore, page]);

  const retry = useCallback(() => {
    void fetchPage(1, false);
  }, [fetchPage]);

  return {
    users,
    facets,
    total,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    error,
    loadMore,
    retry,
  };
}
