import db from '../connection.js';

export function deleteShow (showId) {
  return db.prepare(`DELETE FROM show WHERE show_id = ?`).run(showId);
}

export function updateShow (showId, showData) {
  const { date, schedule, eventName, contactOfDay, status } = showData;

  return db.prepare(`
    UPDATE show
    SET date = ?, schedule = ?, event_name = ?, contact_of_day = ?, status = ?
    WHERE show_id = ?;
    `).run(date, schedule, eventName, contactOfDay, status, showId);
}

export function createShow (showData) {
  const { date, schedule, eventName, contactOfDay, status } = showData;

  return db.prepare(`
    INSERT INTO show (date, schedule, event_name, contact_of_day, status)
    VALUES (?, ?, ?, ?, ?);
    `).run(date, schedule, eventName, contactOfDay, status);
}

export function updateShowStatus (showId, status) {
  return db.prepare(`
    UPDATE show SET status = ? WHERE show_id = ?;
  `).run(status, showId);
}

export function getShowsByArtistId (artistId) {
  return db.prepare(`
    SELECT show.*, sp_venue.user_id AS venueId
    FROM show
    JOIN show_participant sp ON show.show_id = sp.show_id AND sp.role = 'artist'
    LEFT JOIN show_participant sp_venue ON show.show_id = sp_venue.show_id AND sp_venue.role = 'venue'
    WHERE sp.artist_id = ?
    ORDER BY show.date ASC
  `).all(artistId);
}

export function getShowsWithArtistsByVenueId (venueId) {
  return db.prepare(`
    SELECT show.*, artist.artist_name
    FROM show
    JOIN show_participant sp_venue ON show.show_id = sp_venue.show_id AND sp_venue.venue_id = ? AND sp_venue.role = 'venue'
    LEFT JOIN show_participant sp_artist ON show.show_id = sp_artist.show_id AND sp_artist.role = 'artist'
    LEFT JOIN artist ON sp_artist.artist_id = artist.artist_id
    ORDER BY show.date ASC
  `).all(venueId);
}
