import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireArtist, requireVenue } from '../middleware/requireRole.js';
import { findByEmail } from '../database/queries/userQueries.js';
import { getShowsByArtistId, getShowsWithArtistsByVenueId } from '../database/queries/showQueries.js';
import { getArtistRider, getVenueRider } from '../database/queries/riderQueries.js';
import { getUserType } from '../services/userService.js';

const router = Router();

router.get('/api/home', requireAuth, (req, res) => {
  const result = getUserType(req.user.email);
  if (!result) {
    return res.status(404).send({ errorMessage: 'User not found' });
  }
  res.send({ data: { ...result.entity, userId: result.userId }, type: result.type });
});

router.get('/api/emails/:email', (req, res) => {
  const found = findByEmail(req.params.email);
  if (found) {
    return res.status(200).send({ data: { exists: true } });
  }
  res.status(404).send({ data: { exists: false } });
});

router.get('/api/artist/dashboard', requireAuth, requireArtist, (req, res) => {
  const shows = getShowsByArtistId(req.artist.artist_id);
  const riders = getArtistRider(req.artist.artist_id);
  res.send({ data: { artist: req.artist, shows, riders } });
});

router.get('/api/venue/dashboard', requireAuth, requireVenue, (req, res) => {
  const shows = getShowsWithArtistsByVenueId(req.venue.venue_id);
  const techSpecs = getVenueRider(req.venue.venue_id);
  res.send({ data: { venue: req.venue, shows, techSpecs } });
});

export default router;
