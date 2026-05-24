import db from '../connection.js';

export function findVenueByEmail (email) {
  return db.prepare(`
    SELECT v.*, vu.user_id
    FROM venue v
    JOIN venue_user vu ON v.venue_id = vu.venue_id
    WHERE v.contact_email = ?
    `).get(email);
}

export function updateVenue (venueId, data) {
  const { name, address, bio, contactEmail } = data;
  return db.prepare(`
    UPDATE venue SET venue_name = ?, address = ?, bio = ?, contact_email = ? WHERE venue_id = ?
  `).run(name, address, bio, contactEmail, venueId);
}

export function deleteVenueById (venueId) {
  return db.prepare(`DELETE FROM venue WHERE venue_id = ?`).run(venueId);
}

export function createVenue (venueData) {
  const { venueName, address, bio, contactEmail } = venueData;

  return db.prepare(`
    INSERT INTO venue (venue_name, address, bio, contact_email)
    VALUES (?, ?, ?, ?);
    `).run(venueName, address, bio, contactEmail);
}
