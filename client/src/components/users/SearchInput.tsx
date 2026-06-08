import { useEffect, useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

/** Debounced text search input for first and last name filtering. */
export function SearchInput({
  value,
  onChange,
  debounceMs = 300,
}: SearchInputProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (draft !== value) {
        onChange(draft);
      }
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [draft, debounceMs, onChange, value]);

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        Search by name
      </span>
      <input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search first or last name..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
    </label>
  );
}
