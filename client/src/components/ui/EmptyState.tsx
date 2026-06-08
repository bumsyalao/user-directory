interface EmptyStateProps {
  title?: string;
  message?: string;
}

/** Shown when the current filters return no users. */
export function EmptyState({
  title = "No users found",
  message = "Try adjusting your search or filters to find more people.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{message}</p>
    </div>
  );
}
