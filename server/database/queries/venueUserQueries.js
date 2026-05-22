import db from '../connection.js';

export function createVenueUser (venueUserData) {
  const { venueId, userId, role } = venueUserData;

  return db.prepare(`
    INSERT INTO venue_user (venue_id, user_id, role)
    VALUES (?, ?, ?);
    `).run(venueId, userId, role);
}
