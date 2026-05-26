import db from '../connection.js';

export function getArtistRider (artistId) {
  return db.prepare(`
        SELECT rider_id AS id, rider_name AS name, rider_url AS url
        FROM rider
        WHERE artist_id = ?
    `).all(artistId);
}

export function getVenueRider (venueId) {
  return db.prepare(`
        SELECT rider_id AS id, rider_name AS name, rider_url AS url
        FROM rider
        WHERE venue_id = ?
    `).all(venueId);
}

export function deleteArtistRiderById (riderId, artistId) {
  return db.prepare(`DELETE FROM rider WHERE rider_id = ? AND artist_id = ?`).run(riderId, artistId);
}

export function deleteVenueRiderById (riderId, venueId) {
  return db.prepare(`DELETE FROM rider WHERE rider_id = ? AND venue_id = ?`).run(riderId, venueId);
}

export function deleteRidersByArtistId (artistId) {
  return db.prepare(`DELETE FROM rider WHERE artist_id = ?`).run(artistId);
}

export function deleteRidersByVenueId (venueId) {
  return db.prepare(`DELETE FROM rider WHERE venue_id = ?`).run(venueId);
}

export function createArtistRider (artistRiderData) {
  const { artistId, riderName, riderUrl } = artistRiderData;

  return db.prepare(`
    INSERT INTO rider (artist_id, rider_name, rider_url)
    VALUES (?, ?, ?);
    `).run(artistId, riderName, riderUrl);
}

export function createVenueRider (venueRiderData) {
  const { venueId, riderName, riderUrl } = venueRiderData;

  return db.prepare(`
    INSERT INTO rider (venue_id, rider_name, rider_url)
    VALUES (?, ?, ?);
    `).run(venueId, riderName, riderUrl);
}
