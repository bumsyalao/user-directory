import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

/** Maps RTK Query errors to a user-facing message. */
export function getQueryErrorMessage(
  error: FetchBaseQueryError | SerializedError,
): string {
  if ("status" in error) {
    const data = error.data;
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      return data.error;
    }

    if (typeof error.error === "string") {
      return error.error;
    }
  }

  if ("message" in error && error.message) {
    return error.message;
  }

  return "Failed to load users";
}
