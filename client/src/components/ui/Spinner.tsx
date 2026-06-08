interface SpinnerProps {
  label?: string;
  size?: "sm" | "md";
}

/** Accessible loading indicator. */
export function Spinner({ label = "Loading", size = "md" }: SpinnerProps) {
  const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <div className="flex items-center gap-2 text-sm text-slate-600" role="status">
      <span
        className={`inline-block animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 ${dimension}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
