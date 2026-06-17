import { FacetValue } from "../../types/user.types";
import { FilterOption } from "./FilterOption";

interface FilterSidebarProps {
  hobbies: FacetValue[];
  nationalities: FacetValue[];
  selectedHobbies: string[];
  selectedNationalities: string[];
  onToggleHobby: (hobby: string) => void;
  onToggleNationality: (nationality: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

/** Sidebar showing top 20 hobbies and nationalities for the active result set. */
export function FilterSidebar({
  hobbies,
  nationalities,
  selectedHobbies,
  selectedNationalities,
  onToggleHobby,
  onToggleNationality,
  onClearFilters,
  hasActiveFilters,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-6 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Filters</h2>
          <p className="text-xs text-slate-500">
            Counts reflect your current search and selections
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear all
          </button>
        )}
      </div>

      <section>
        <h3 className="mb-2 text-sm font-medium text-slate-800">
          Top 20 nationalities
        </h3>
        {nationalities.length === 0 ? (
          <p className="text-sm text-slate-500">No nationalities available.</p>
        ) : (
          <div className="space-y-2">
            {nationalities.map((item) => (
              <FilterOption
                key={item.value}
                label={item.value}
                count={item.count}
                selected={selectedNationalities.includes(item.value)}
                onToggle={() => onToggleNationality(item.value)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium text-slate-800">Top 20 hobbies</h3>
        {hobbies.length === 0 ? (
          <p className="text-sm text-slate-500">No hobbies available.</p>
        ) : (
          <div className="space-y-2">
            {hobbies.map((item) => (
              <FilterOption
                key={item.value}
                label={item.value}
                count={item.count}
                selected={selectedHobbies.includes(item.value)}
                onToggle={() => onToggleHobby(item.value)}
              />
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}
