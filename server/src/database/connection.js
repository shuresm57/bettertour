import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const db = new DatabaseSync(join(dirname(fileURLToPath(import.meta.url)), 'bettertour.db'));
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

export default db;
