import db from '../connection.js';

export function findArtistByEmail (email) {
  return db.prepare(`
    SELECT artist.*, artist_user.user_id
    FROM artist
    JOIN artist_user ON artist.artist_id = artist_user.artist_id
    JOIN user ON artist_user.user_id = user.user_id
    WHERE user.email = ?
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
