import db from '../connection.js';

export function createShowParticipant (participantData) {
  const { showId, userId, artistId, venueId, role } = participantData;

  return db.prepare(`
    INSERT INTO show_participant (show_id, user_id, artist_id, venue_id, role)
    VALUES (?, ?, ?, ?, ?);
    `).run(showId, userId, artistId, venueId, role);
}

export function deleteShowParticipantsByArtist (artistId) {
  return db.prepare(`DELETE FROM show_participant WHERE artist_id = ?`).run(artistId);
}

export function deleteShowParticipantsByVenue (venueId) {
  return db.prepare(`DELETE FROM show_participant WHERE venue_id = ?`).run(venueId);
}

export function deleteOrphanedShows () {
  return db.prepare(`
    DELETE FROM show WHERE show_id NOT IN (SELECT DISTINCT show_id FROM show_participant)
  `).run();
}

export function deleteShowParticipants (showId) {
  return db.prepare(`DELETE FROM show_participant WHERE show_id = ?`).run(showId);
}

export function getShowParticipants (showId) {
  return db.prepare(`
    SELECT sp.role, sp.artist_id, sp.venue_id, sp.joined_at, u.email, a.artist_name, v.venue_name
    FROM show_participant sp
    JOIN user u ON sp.user_id = u.user_id
    LEFT JOIN artist a ON sp.artist_id = a.artist_id
    LEFT JOIN venue v ON sp.venue_id = v.venue_id
    WHERE sp.show_id = ?
  `).all(showId);
}
