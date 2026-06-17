import { User } from "../../types/user.types";

interface UserCardProps {
  user: User;
  selectedHobbies?: string[];
}

function sortHobbiesBySelection(hobbies: string[], selectedHobbies: string[]) {
  if (selectedHobbies.length === 0) {
    return hobbies;
  }

  const selectedSet = new Set(selectedHobbies);
  return [...hobbies].sort((a, b) => {
    const aSelected = selectedSet.has(a);
    const bSelected = selectedSet.has(b);
    if (aSelected === bSelected) {
      return 0;
    }
    return aSelected ? -1 : 1;
  });
}

/** Displays a single user in the directory list layout. */
export function UserCard({ user, selectedHobbies = [] }: UserCardProps) {
  const sortedHobbies = sortHobbiesBySelection(user.hobbies, selectedHobbies);
  const visibleHobbies = sortedHobbies.slice(0, 2);
  const remainingCount = Math.max(0, user.hobbies.length - visibleHobbies.length);

  return (
    <article className="flex h-24 items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <img
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        className="h-14 w-14 shrink-0 rounded-full border border-slate-200 bg-slate-100 object-cover"
        loading="lazy"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {user.first_name} {user.last_name}
          </h3>
          <span className="shrink-0 text-sm text-slate-500">{user.age}</span>
        </div>

        <p className="truncate text-sm text-slate-600">{user.nationality}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {visibleHobbies.map((hobby) => (
            <span
              key={hobby}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
            >
              {hobby}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-xs font-medium text-indigo-600">
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
