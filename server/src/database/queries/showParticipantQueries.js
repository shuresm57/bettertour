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
    SELECT sp.role, sp.user_id, sp.artist_id, sp.venue_id, sp.joined_at, user.email, artist.artist_name, venue.venue_name
    FROM show_participant sp
    JOIN user ON sp.user_id = user.user_id
    LEFT JOIN artist ON sp.artist_id = artist.artist_id
    LEFT JOIN venue ON sp.venue_id = venue.venue_id
    WHERE sp.show_id = ?
  `).all(showId);
}
