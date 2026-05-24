import db from '../connection.js';

export function findArtistByEmail (email) {
  return db.prepare(`
    SELECT a.*, au.user_id
    FROM artist a
    JOIN artist_user au ON a.artist_id = au.artist_id
    JOIN user u ON au.user_id = u.user_id
    WHERE u.email = ?
    `).get(email);
}

export function updateArtist (artistId, data) {
  const { name, bio, contactEmail } = data;
  return db.prepare(`
    UPDATE artist SET artist_name = ?, bio = ?, contact_email = ? WHERE artist_id = ?
  `).run(name, bio, contactEmail, artistId);
}

export function deleteArtistById (artistId) {
  return db.prepare(`DELETE FROM artist WHERE artist_id = ?`).run(artistId);
}

export function createArtist (artistData) {
  const { artistName, bio, contactEmail } = artistData;

  return db.prepare(`
    INSERT INTO artist (artist_name, bio, contact_email)
    VALUES (?, ?, ?);
    `).run(artistName, bio, contactEmail);
}
