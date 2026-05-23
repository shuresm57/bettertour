import db from './connection.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    user_id TEXT NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS artist (
    artist_id INTEGER PRIMARY KEY,
    artist_name TEXT,
    bio TEXT,
    contact_email VARCHAR(255),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS venue (
    venue_id INTEGER PRIMARY KEY,
    venue_name TEXT,
    address TEXT,
    bio TEXT,
    contact_email VARCHAR(255),
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS show (
    show_id INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    schedule TEXT,
    event_name TEXT,
    contact_of_day TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rider (
    rider_id INTEGER PRIMARY KEY,
    artist_id INTEGER REFERENCES artist(artist_id),
    venue_id INTEGER REFERENCES venue(venue_id),
    rider_name VARCHAR(255),
    rider_url TEXT,
    CHECK (
      (artist_id IS NOT NULL AND venue_id IS NULL) OR
      (artist_id IS NULL AND venue_id IS NOT NULL)
    )
  );

  CREATE TABLE IF NOT EXISTS show_participant (
    participant_id INTEGER PRIMARY KEY,
    show_id INTEGER NOT NULL REFERENCES show(show_id),
    user_id TEXT NOT NULL REFERENCES user(user_id),
    artist_id INTEGER REFERENCES artist(artist_id),
    venue_id INTEGER REFERENCES venue(venue_id),
    role TEXT NOT NULL CHECK (role IN ('artist', 'venue')),
    joined_at TEXT DEFAULT (datetime('now')),
    UNIQUE(show_id, role)
  );

  CREATE TABLE IF NOT EXISTS artist_user (
    artist_id INTEGER NOT NULL REFERENCES artist(artist_id),
    user_id TEXT NOT NULL REFERENCES user(user_id),
    role TEXT NOT NULL DEFAULT 'member',
    PRIMARY KEY (artist_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS venue_user (
    venue_id INTEGER NOT NULL REFERENCES venue(venue_id),
    user_id TEXT NOT NULL REFERENCES user(user_id),
    role TEXT NOT NULL DEFAULT 'member',
    PRIMARY KEY (venue_id, user_id)
  );
`);
