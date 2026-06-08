import { createApp } from "./app";
import { env } from "./config/env";
import { isDatabaseSeeded } from "./db/connection";
import { seedDatabase } from "./db/seed";

/**
 * Bootstraps the database and starts the HTTP server.
 */
function main() {
  if (env.autoSeed && !isDatabaseSeeded()) {
    console.log("Database empty — seeding...");
    const result = seedDatabase();
    console.log(`Seeded ${result.inserted} users.`);
  }

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

main();
