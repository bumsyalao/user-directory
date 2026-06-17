/** Serializes nationalities for storage in the users.nationality JSON array column. */
export function serializeNationalities(nationalities: string[]): string {
  return JSON.stringify(nationalities);
}

/** Parses stored nationalities, supporting legacy plain-string values. */
export function parseNationalities(stored: string): string[] {
  try {
    const parsed = JSON.parse(stored) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is string => typeof item === "string" && item.trim() !== "",
      );
    }
  } catch {
    // Fall through for legacy plain-string rows.
  }

  return stored.trim() ? [stored.trim()] : [];
}

/** Formats nationalities for API responses and UI display. */
export function formatNationalities(nationalities: string[]): string {
  return nationalities.join(", ");
}
