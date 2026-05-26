import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { findByEmail, findArtistByUserId, findVenueByUserId } from '../database/queries/userQueries.js';
import { createArtistRider, createVenueRider, deleteRiderById } from '../database/queries/riderQueries.js';

const router = Router();

router.post('/api/riders', requireAuth, (req, res) => {
  const { riderName, riderUrl } = req.body;
  const user = findByEmail(req.user.email);
  let riderId;

  if (req.user.type === 'artist') {
    const artist = findArtistByUserId(user.user_id);
    if (!artist) return res.status(403).send({ errorMessage: 'Not an artist account' });
    riderId = createArtistRider({ artistId: artist.artist_id, riderName, riderUrl }).lastInsertRowid;
  } else {
    const venue = findVenueByUserId(user.user_id);
    if (!venue) return res.status(403).send({ errorMessage: 'Not a venue account' });
    riderId = createVenueRider({ venueId: venue.venue_id, riderName, riderUrl }).lastInsertRowid;
  }

  res.status(201).send({ data: { id: riderId, riderName, riderUrl } });
});

router.delete('/api/riders/:riderId', requireAuth, (req, res) => {
  const riderId = parseInt(req.params.riderId);
  const user = findByEmail(req.user.email);

  if (req.user.type === 'artist') {
    const artist = findArtistByUserId(user.user_id);
    if (!artist) return res.status(403).send({ errorMessage: 'Not an artist account' });
    deleteRiderById(riderId, artist.artist_id, null);
  } else {
    const venue = findVenueByUserId(user.user_id);
    if (!venue) return res.status(403).send({ errorMessage: 'Not a venue account' });
    deleteRiderById(riderId, null, venue.venue_id);
  }

  res.send({ data: { riderId } });
});

export default router;
