import { useDirectoryState } from "../hooks/useDirectoryState";
import { useUserDirectory } from "../hooks/useUserDirectory";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import { AppShell } from "../components/layout/AppShell";
import { SearchInput } from "../components/users/SearchInput";
import { SortControls } from "../components/users/SortControls";
import { UserList } from "../components/users/UserList";

/** Main directory page orchestrating filters, sorting, and the user list. */
export function UserDirectoryPage() {
  const {
    state,
    updateState,
    toggleHobby,
    toggleNationality,
    clearFilters,
  } = useDirectoryState();

  const {
    users,
    facets,
    total,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    error,
    loadMore,
    retry,
  } = useUserDirectory(state);

  const hasActiveFilters =
    state.search.trim().length > 0 ||
    state.hobbies.length > 0 ||
    state.nationalities.length > 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
          <SearchInput
            value={state.search}
            onChange={(search) => updateState({ search })}
          />
          <SortControls
            sortBy={state.sortBy}
            sortOrder={state.sortOrder}
            onSortByChange={(sortBy) => updateState({ sortBy })}
            onSortOrderChange={(sortOrder) => updateState({ sortOrder })}
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <FilterSidebar
            hobbies={facets.hobbies}
            nationalities={facets.nationalities}
            selectedHobbies={state.hobbies}
            selectedNationalities={state.nationalities}
            onToggleHobby={toggleHobby}
            onToggleNationality={toggleNationality}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <UserList
            users={users}
            isInitialLoading={isInitialLoading}
            selectedHobbies={state.hobbies}
            isLoadingMore={isLoadingMore}
            error={error}
            hasMore={hasMore}
            total={total}
            onLoadMore={loadMore}
            onRetry={retry}
          />
        </div>
      </div>
    </AppShell>
  );
}
