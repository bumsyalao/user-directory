import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { env } from "../config/env";

let db: Database.Database | null = null;

/**
 * Opens (or returns) the shared SQLite connection and ensures schema is applied.
 */
export function getDb(): Database.Database {
  if (db) {
    return db;
  }

  const dir = path.dirname(env.dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(env.dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);

  return db;
}

/** Returns true when the users table contains at least one row. */
export function isDatabaseSeeded(): boolean {
  const database = getDb();
  const row = database
    .prepare("SELECT COUNT(*) AS count FROM users")
    .get() as { count: number };
  return row.count > 0;
}

/** Closes the database connection (used in tests or graceful shutdown). */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
