import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireArtist, requireVenue } from '../middleware/requireRole.js';
import { updateArtistProfile, updateVenueProfile, changePassword, deleteProfile } from '../services/profileService.js';

const router = Router();

router.put('/api/artist/profile', requireAuth, requireArtist, (req, res) => {
  const { name, bio, contact_email } = req.body;
  updateArtistProfile(req.artist.artist_id, { name, bio, contactEmail: contact_email });
  res.send({ data: { artist_name: name, bio, contact_email } });
});

router.put('/api/venue/profile', requireAuth, requireVenue, (req, res) => {
  const { name, address, bio, contact_email } = req.body;
  updateVenueProfile(req.venue.venue_id, { name, address, bio, contactEmail: contact_email });
  res.send({ data: { venue_name: name, address, bio, contact_email } });
});

router.put('/api/profile/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await changePassword(req.user.email, currentPassword, newPassword);
  if (result?.error === 'User not found') return res.status(404).send({ errorMessage: 'User not found.' });
  if (result?.error === 'Wrong password') return res.status(401).send({ errorMessage: 'Current password is incorrect.' });
  res.send({ data: 'Password updated.' });
});

router.delete('/api/profile', requireAuth, (req, res) => {
  deleteProfile(req.user.id, req.user.type);
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.send({ data: 'Account deleted.' });
});

export default router;
