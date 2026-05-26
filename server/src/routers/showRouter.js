import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireArtist, requireVenue } from '../middleware/requireRole.js';
import { createArtistShow, createVenueShow, updateShowAsArtist, updateShowAsVenue, deleteShowAsArtist, deleteShowAsVenue } from '../services/showService.js';

const router = Router();

router.post('/api/artist/shows', requireAuth, requireArtist, (req, res) => {
  const { event_name, date, contact_of_day, schedule } = req.body;
  const showId = createArtistShow({ event_name, date, contact_of_day, schedule }, req.dbUser.user_id, req.artist.artist_id);
  res.status(201).send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: 'confirmed' } });
});

router.put('/api/artist/shows/:showId', requireAuth, requireArtist, (req, res) => {
  const showId = parseInt(req.params.showId);
  const { event_name, date, contact_of_day, schedule, status } = req.body;
  const result = updateShowAsArtist(showId, req.artist.artist_id, { event_name, date, contact_of_day, schedule, status });
  if (result.error === 'forbidden') {
    return res.status(403).send({ errorMessage: 'Cannot edit this show' });
  }
  res.send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: status ?? 'confirmed' } });
});

router.delete('/api/artist/shows/:showId', requireAuth, requireArtist, (req, res) => {
  const showId = parseInt(req.params.showId);
  const result = deleteShowAsArtist(showId, req.artist.artist_id);
  if (result.error === 'forbidden') {
    return res.status(403).send({ errorMessage: 'Not your show' });
  }
  res.send({ data: { show_id: showId } });
});

router.post('/api/shows', requireAuth, requireVenue, (req, res) => {
  const { event_name, date, contact_of_day, schedule } = req.body;
  const showId = createVenueShow({ event_name, date, contact_of_day, schedule }, req.dbUser.user_id, req.venue.venue_id);
  res.status(201).send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: 'confirmed' } });
});

router.put('/api/shows/:showId', requireAuth, requireVenue, (req, res) => {
  const showId = parseInt(req.params.showId);
  const { event_name, date, contact_of_day, schedule, status } = req.body;
  const result = updateShowAsVenue(showId, req.venue.venue_id, { event_name, date, contact_of_day, schedule, status });
  if (result.error === 'forbidden') {
    return res.status(403).send({ errorMessage: 'Not your show' });
  }
  res.send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: status ?? 'confirmed' } });
});

router.delete('/api/shows/:showId', requireAuth, requireVenue, (req, res) => {
  const showId = parseInt(req.params.showId);
  const result = deleteShowAsVenue(showId, req.venue.venue_id);
  if (result.error === 'forbidden') {
    return res.status(403).send({ errorMessage: 'Not your show' });
  }
  res.send({ data: { show_id: showId } });
});

export default router;
