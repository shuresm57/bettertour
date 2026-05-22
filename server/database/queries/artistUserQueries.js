import db from '../connection.js';

export function createArtistUser (artistUserData) {
  const { artistId, userId, role } = artistUserData;

  return db.prepare(`
    INSERT INTO artist_user (artist_id, user_id, role)
    VALUES (?, ?, ?);
    `).run(artistId, userId, role);
}
