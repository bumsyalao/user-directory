import path from "path";

/** Resolves a path relative to the current working directory when not absolute. */
function resolvePath(target: string): string {
  return path.isAbsolute(target) ? target : path.resolve(process.cwd(), target);
}

/** Runtime configuration derived from environment variables. */
export const env = {
  port: Number(process.env.PORT) || 3001,
  dbPath: process.env.DB_PATH
    ? resolvePath(process.env.DB_PATH)
    : path.resolve(process.cwd(), "..", "data", "directory.db"),
  clientDistPath: process.env.CLIENT_DIST_PATH
    ? resolvePath(process.env.CLIENT_DIST_PATH)
    : path.resolve(process.cwd(), "..", "client", "dist"),
  autoSeed: process.env.AUTO_SEED !== "false",
};
