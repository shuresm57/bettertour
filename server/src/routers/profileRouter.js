import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireArtist, requireVenue } from '../middleware/requireRole.js';
import { findByEmail, findArtistByUserId, findVenueByUserId, deleteUserById, updateUserPassword } from '../database/queries/userQueries.js';
import { deleteShowParticipantsByArtist, deleteShowParticipantsByVenue, deleteOrphanedShows } from '../database/queries/showParticipantQueries.js';
import { deleteRidersByArtistId, deleteRidersByVenueId } from '../database/queries/riderQueries.js';
import { updateArtist, deleteArtistById } from '../database/queries/artistQueries.js';
import { updateVenue, deleteVenueById } from '../database/queries/venueQueries.js';
import { deleteArtistUser } from '../database/queries/artistUserQueries.js';
import { deleteVenueUser } from '../database/queries/venueUserQueries.js';
import { hashPassword, comparePassword } from '../util/passwordUtil.js';

const router = Router();

router.put('/api/artist/profile', requireAuth, requireArtist, (req, res) => {
  const { name, bio, contact_email } = req.body;
  updateArtist(req.artist.artist_id, { name, bio, contactEmail: contact_email });
  res.send({ data: { artist_name: name, bio, contact_email } });
});

router.put('/api/venue/profile', requireAuth, requireVenue, (req, res) => {
  const { name, address, bio, contact_email } = req.body;
  updateVenue(req.venue.venue_id, { name, address, bio, contactEmail: contact_email });
  res.send({ data: { venue_name: name, address, bio, contact_email } });
});

router.put('/api/profile/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = findByEmail(req.user.email);
  if (!user) return res.status(404).send({ errorMessage: 'User not found.' });
  const valid = await comparePassword(currentPassword, user.password_hash);
  if (!valid) return res.status(401).send({ errorMessage: 'Current password is incorrect.' });
  const hashed = await hashPassword(newPassword);
  updateUserPassword(user.user_id, hashed);
  res.send({ data: 'Password updated.' });
});

router.delete('/api/profile', requireAuth, (req, res) => {
  const user = findByEmail(req.user.email);
  if (!user) return res.status(404).send({ errorMessage: 'User not found.' });

  if (req.user.type === 'artist') {
    const artist = findArtistByUserId(user.user_id);
    if (artist) {
      deleteRidersByArtistId(artist.artist_id);
      deleteShowParticipantsByArtist(artist.artist_id);
      deleteOrphanedShows();
      deleteArtistUser(artist.artist_id);
      deleteArtistById(artist.artist_id);
    }
  } else {
    const venue = findVenueByUserId(user.user_id);
    if (venue) {
      deleteRidersByVenueId(venue.venue_id);
      deleteShowParticipantsByVenue(venue.venue_id);
      deleteOrphanedShows();
      deleteVenueUser(venue.venue_id);
      deleteVenueById(venue.venue_id);
    }
  }

  deleteUserById(user.user_id);
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.send({ data: 'Account deleted.' });
});

export default router;
