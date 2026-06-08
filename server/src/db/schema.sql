CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  avatar TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  nationality TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_hobbies (
  user_id INTEGER NOT NULL,
  hobby TEXT NOT NULL,
  PRIMARY KEY (user_id, hobby),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_users_last_name ON users(last_name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_users_nationality ON users(nationality);
CREATE INDEX IF NOT EXISTS idx_user_hobbies_hobby ON user_hobbies(hobby);
