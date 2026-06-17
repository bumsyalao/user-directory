const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Lisa", "Daniel", "Nancy",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
  "Timothy", "Deborah", "Ronald", "Stephanie", "Edward", "Rebecca", "Jason", "Sharon",
  "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
  "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
  "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
  "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
  "Frank", "Rachel", "Alexander", "Carolyn", "Patrick", "Janet", "Jack", "Catherine",
  "Amina", "Yuki", "Carlos", "Fatima", "Olga", "Raj", "Sofia", "Chen", "Amir", "Ingrid",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
  "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
  "Carter", "Roberts", "Patel", "Kim", "Singh", "Mueller", "Schmidt", "Ivanov",
  "Kowalski", "Okafor", "Tanaka", "Ali", "Hassan", "Berg", "Silva", "Costa",
];

const NATIONALITIES = [
  "American", "British", "Canadian", "German", "French", "Spanish", "Italian",
  "Japanese", "Chinese", "Indian", "Brazilian", "Mexican", "Australian",
  "Swedish", "Norwegian", "Dutch", "Polish", "Nigerian", "South African", "Emirati",
];

const HOBBIES = [
  "Reading", "Hiking", "Cooking", "Photography", "Gaming", "Cycling", "Running",
  "Yoga", "Painting", "Gardening", "Travel", "Music", "Dancing", "Swimming",
  "Chess", "Knitting", "Fishing", "Camping", "Writing", "Birdwatching",
  "Surfing", "Skiing", "Pottery", "Astronomy", "Volunteering", "Meditation",
  "Rock Climbing", "Board Games", "Film", "Fitness",
];

const USER_COUNT = 3000;

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickMany<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function avatarUrl(id: number, firstName: string, lastName: string): string {
  const seed = encodeURIComponent(`${firstName}-${lastName}-${id}`);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

/**
 * Populates the database with synthetic user records for development and demos.
 * Skips seeding when users already exist unless force=true.
 */
import { getDb, isDatabaseSeeded } from "./connection";
import { serializeNationalities } from "../utils/nationality";

export function seedDatabase(force = false): { inserted: number; skipped: boolean } {
  if (!force && isDatabaseSeeded()) {
    return { inserted: 0, skipped: true };
  }

  const db = getDb();

  const seed = db.transaction(() => {
    if (force) {
      db.exec("DELETE FROM user_hobbies; DELETE FROM users;");
    }

    const insertUser = db.prepare(
      `INSERT INTO users (avatar, first_name, last_name, age, nationality)
       VALUES (?, ?, ?, ?, ?)`,
    );
    const insertHobby = db.prepare(
      `INSERT INTO user_hobbies (user_id, hobby) VALUES (?, ?)`,
    );

    let inserted = 0;

    for (let i = 0; i < USER_COUNT; i++) {
      const firstName = pick(FIRST_NAMES);
      const lastName = pick(LAST_NAMES);
      const age = 18 + Math.floor(Math.random() * 63);
      const nationalityCount = 1 + Math.floor(Math.random() * 2);
      const nationalities = pickMany(NATIONALITIES, nationalityCount);
      const nationality = serializeNationalities(nationalities);
      const avatar = avatarUrl(i + 1, firstName, lastName);

      const result = insertUser.run(
        avatar,
        firstName,
        lastName,
        age,
        nationality,
      );
      const userId = Number(result.lastInsertRowid);

      const hobbyCount = Math.floor(Math.random() * 11);
      const hobbies = pickMany(HOBBIES, hobbyCount);
      for (const hobby of hobbies) {
        insertHobby.run(userId, hobby);
      }

      inserted++;
    }

    return inserted;
  });

  const inserted = seed();
  return { inserted, skipped: false };
}

// Allow running directly: yarn workspace directory-server seed
if (require.main === module) {
  const force = process.argv.includes("--force");
  const result = seedDatabase(force);
  if (result.skipped) {
    console.log("Database already seeded. Use --force to re-seed.");
  } else {
    console.log(`Seeded ${result.inserted} users.`);
  }
}
