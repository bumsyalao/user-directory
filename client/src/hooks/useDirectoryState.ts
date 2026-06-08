import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DirectoryState,
  SortField,
  SortOrder,
} from "../types/user.types";

const SORT_FIELDS: SortField[] = [
  "first_name",
  "last_name",
  "age",
  "nationality",
];

const DEFAULT_STATE: DirectoryState = {
  search: "",
  hobbies: [],
  nationalities: [],
  sortBy: "first_name",
  sortOrder: "asc",
};

function parseCsv(value: string | null): string[] {
  if (!value?.trim()) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSortField(value: string | null): SortField {
  if (value && SORT_FIELDS.includes(value as SortField)) {
    return value as SortField;
  }
  return DEFAULT_STATE.sortBy;
}

function parseSortOrder(value: string | null): SortOrder {
  return value === "desc" ? "desc" : "asc";
}

/** Reads and writes directory filter/sort state via URL search params. */
export function useDirectoryState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo<DirectoryState>(() => {
    return {
      search: searchParams.get("search") ?? DEFAULT_STATE.search,
      hobbies: parseCsv(searchParams.get("hobbies")),
      nationalities: parseCsv(searchParams.get("nationalities")),
      sortBy: parseSortField(searchParams.get("sortBy")),
      sortOrder: parseSortOrder(searchParams.get("sortOrder")),
    };
  }, [searchParams]);

  const updateState = useCallback(
    (patch: Partial<DirectoryState>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);

          const merged: DirectoryState = {
            search: patch.search ?? (current.get("search") ?? ""),
            hobbies: patch.hobbies ?? parseCsv(current.get("hobbies")),
            nationalities:
              patch.nationalities ?? parseCsv(current.get("nationalities")),
            sortBy: patch.sortBy ?? parseSortField(current.get("sortBy")),
            sortOrder:
              patch.sortOrder ?? parseSortOrder(current.get("sortOrder")),
          };

          if (merged.search.trim()) {
            next.set("search", merged.search.trim());
          } else {
            next.delete("search");
          }

          if (merged.hobbies.length > 0) {
            next.set("hobbies", merged.hobbies.join(","));
          } else {
            next.delete("hobbies");
          }

          if (merged.nationalities.length > 0) {
            next.set("nationalities", merged.nationalities.join(","));
          } else {
            next.delete("nationalities");
          }

          next.set("sortBy", merged.sortBy);
          next.set("sortOrder", merged.sortOrder);

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggleHobby = useCallback(
    (hobby: string) => {
      const exists = state.hobbies.includes(hobby);
      updateState({
        hobbies: exists
          ? state.hobbies.filter((item) => item !== hobby)
          : [...state.hobbies, hobby],
      });
    },
    [state.hobbies, updateState],
  );

  const toggleNationality = useCallback(
    (nationality: string) => {
      const exists = state.nationalities.includes(nationality);
      updateState({
        nationalities: exists
          ? state.nationalities.filter((item) => item !== nationality)
          : [...state.nationalities, nationality],
      });
    },
    [state.nationalities, updateState],
  );

  const clearFilters = useCallback(() => {
    updateState({
      search: "",
      hobbies: [],
      nationalities: [],
    });
  }, [updateState]);

  return {
    state,
    updateState,
    toggleHobby,
    toggleNationality,
    clearFilters,
  };
}
