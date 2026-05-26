import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireArtist, requireVenue } from '../middleware/requireRole.js';
import { createShow, updateShow, deleteShow } from '../database/queries/showQueries.js';
import { createShowParticipant, getShowParticipants, deleteShowParticipants } from '../database/queries/showParticipantQueries.js';

const router = Router();

router.post('/api/artist/shows', requireAuth, requireArtist, (req, res) => {
  const { event_name, date, contact_of_day, schedule } = req.body;

  const result = createShow({
    date,
    schedule: schedule ? JSON.stringify(schedule) : null,
    eventName: event_name,
    contactOfDay: contact_of_day,
    status: 'confirmed'
  });
  const showId = result.lastInsertRowid;

  createShowParticipant({ showId, userId: req.dbUser.user_id, artistId: req.artist.artist_id, venueId: null, role: 'artist' });

  res.status(201).send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: 'confirmed' } });
});

router.put('/api/artist/shows/:showId', requireAuth, requireArtist, (req, res) => {
  const showId = parseInt(req.params.showId);
  const participants = getShowParticipants(showId);
  const isParticipant = participants.some(p => p.artist_id === req.artist.artist_id);
  const hasVenue = participants.some(p => p.role === 'venue');
  if (!isParticipant || hasVenue) return res.status(403).send({ errorMessage: 'Cannot edit this show' });
  const { event_name, date, contact_of_day, schedule, status } = req.body;
  updateShow(showId, {
    date,
    schedule: schedule ? JSON.stringify(schedule) : null,
    eventName: event_name,
    contactOfDay: contact_of_day,
    status: status ?? 'confirmed'
  });
  res.send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: status ?? 'confirmed' } });
});

router.delete('/api/artist/shows/:showId', requireAuth, requireArtist, (req, res) => {
  const showId = parseInt(req.params.showId);
  const participants = getShowParticipants(showId);
  if (!participants.some(p => p.artist_id === req.artist.artist_id)) {
    return res.status(403).send({ errorMessage: 'Not your show' });
  }
  deleteShowParticipants(showId);
  deleteShow(showId);
  res.send({ data: { show_id: showId } });
});

router.post('/api/shows', requireAuth, requireVenue, (req, res) => {
  const { event_name, date, contact_of_day, schedule } = req.body;

  const result = createShow({
    date,
    schedule: schedule ? JSON.stringify(schedule) : null,
    eventName: event_name,
    contactOfDay: contact_of_day,
    status: 'confirmed'
  });
  const showId = result.lastInsertRowid;

  createShowParticipant({ showId, userId: req.dbUser.user_id, artistId: null, venueId: req.venue.venue_id, role: 'venue' });

  res.status(201).send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: 'confirmed' } });
});

router.put('/api/shows/:showId', requireAuth, requireVenue, (req, res) => {
  const showId = parseInt(req.params.showId);
  const participants = getShowParticipants(showId);
  if (!participants.some(p => p.venue_id === req.venue.venue_id)) {
    return res.status(403).send({ errorMessage: 'Not your show' });
  }
  const { event_name, date, contact_of_day, schedule, status } = req.body;
  updateShow(showId, {
    date,
    schedule: schedule ? JSON.stringify(schedule) : null,
    eventName: event_name,
    contactOfDay: contact_of_day,
    status: status ?? 'confirmed'
  });
  res.send({ data: { show_id: showId, event_name, date, contact_of_day, schedule, status: status ?? 'confirmed' } });
});

router.delete('/api/shows/:showId', requireAuth, requireVenue, (req, res) => {
  const showId = parseInt(req.params.showId);
  const participants = getShowParticipants(showId);
  if (!participants.some(p => p.venue_id === req.venue.venue_id)) {
    return res.status(403).send({ errorMessage: 'Not your show' });
  }
  deleteShowParticipants(showId);
  deleteShow(showId);
  res.send({ data: { show_id: showId } });
});

export default router;
