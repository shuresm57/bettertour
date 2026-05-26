import { findArtistByUserId, findVenueByUserId } from '../database/queries/userQueries.js';
import { createArtistRider, createVenueRider, deleteArtistRiderById, deleteVenueRiderById } from '../database/queries/riderQueries.js';

export function createRider (userId, type, riderName, riderUrl) {
  if (type === 'artist') {
    const artist = findArtistByUserId(userId);
    if (!artist) {
      return null;
    }
    const riderId = createArtistRider({ artistId: artist.artist_id, riderName, riderUrl }).lastInsertRowid;
    return { riderId };
  } else {
    const venue = findVenueByUserId(userId);
    if (!venue) {
      return null;
    }
    const riderId = createVenueRider({ venueId: venue.venue_id, riderName, riderUrl }).lastInsertRowid;
    return { riderId };
  }
}

export function deleteRider (userId, type, riderId) {
  if (type === 'artist') {
    const artist = findArtistByUserId(userId);
    if (!artist) {
      return false;
    }
    deleteArtistRiderById(riderId, artist.artist_id);
  } else {
    const venue = findVenueByUserId(userId);
    if (!venue) {
      return false;
    }
    deleteVenueRiderById(riderId, venue.venue_id);
  }
  return true;
}
