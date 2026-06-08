interface FilterOptionProps {
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
}

/** Clickable facet chip with count badge for sidebar filters. */
export function FilterOption({
  label,
  count,
  selected,
  onToggle,
}: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
        selected
          ? "border-indigo-500 bg-indigo-50 text-indigo-900"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
          selected
            ? "bg-indigo-100 text-indigo-700"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
