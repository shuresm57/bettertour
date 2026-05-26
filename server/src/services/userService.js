import { findByEmail, findArtistByUserId, findVenueByUserId } from '../database/queries/userQueries.js';

export function getUserType (email) {
  const user = findByEmail(email);

  if (!user) {
    return null;
  }

  const artist = findArtistByUserId(user.user_id);
  if (artist) {
    return { entity: artist, type: 'artist', userId: user.user_id };
  }

  const venue = findVenueByUserId(user.user_id);
  if (!venue) {
    return null;
  }

  return { entity: venue, type: 'venue', userId: user.user_id };
}
