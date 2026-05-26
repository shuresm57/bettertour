import { findByEmail, findArtistByUserId, findVenueByUserId, deleteUserById, updateUserPassword } from '../database/queries/userQueries.js';
import { deleteShowParticipantsByArtist, deleteShowParticipantsByVenue, deleteOrphanedShows } from '../database/queries/showParticipantQueries.js';
import { deleteRidersByArtistId, deleteRidersByVenueId } from '../database/queries/riderQueries.js';
import { updateArtist, deleteArtistById } from '../database/queries/artistQueries.js';
import { updateVenue, deleteVenueById } from '../database/queries/venueQueries.js';
import { deleteArtistUser } from '../database/queries/artistUserQueries.js';
import { deleteVenueUser } from '../database/queries/venueUserQueries.js';
import { hashPassword, comparePassword } from '../util/passwordUtil.js';

export function updateArtistProfile (artistId, { name, bio, contactEmail }) {
  updateArtist(artistId, { name, bio, contactEmail });
}

export function updateVenueProfile (venueId, { name, address, bio, contactEmail }) {
  updateVenue(venueId, { name, address, bio, contactEmail });
}

export async function changePassword (email, currentPassword, newPassword) {
  const user = findByEmail(email);
  if (!user) {
    return { error: 'not_found' };
  }

  const valid = await comparePassword(currentPassword, user.password_hash);
  if (!valid) {
    return { error: 'wrong_password' };
  }

  const hashed = await hashPassword(newPassword);
  updateUserPassword(user.user_id, hashed);
  return { success: true };
}

export function deleteProfile (userId, type) {
  if (type === 'artist') {
    const artist = findArtistByUserId(userId);
    if (artist) {
      deleteRidersByArtistId(artist.artist_id);
      deleteShowParticipantsByArtist(artist.artist_id);
      deleteOrphanedShows();
      deleteArtistUser(artist.artist_id);
      deleteArtistById(artist.artist_id);
    }
  } else {
    const venue = findVenueByUserId(userId);
    if (venue) {
      deleteRidersByVenueId(venue.venue_id);
      deleteShowParticipantsByVenue(venue.venue_id);
      deleteOrphanedShows();
      deleteVenueUser(venue.venue_id);
      deleteVenueById(venue.venue_id);
    }
  }
  deleteUserById(userId);
}
