import { Router } from 'express';
import { requireAuth } from '../middleware/jwtAuthenticator.js';
import { requireArtist, requireVenue } from '../middleware/requireRole.js';
import { findByEmail, findArtistByUserId, findVenueByUserId } from '../database/queries/userQueries.js';
import { getShowsByArtistId, getShowsWithArtistsByVenueId, createShow } from '../database/queries/showQueries.js';
import { createShowParticipant } from '../database/queries/showParticipantQueries.js';
import { getArtistRider, getVenueRider, createArtistRider, createVenueRider } from '../database/queries/riderQueries.js';

const router = Router();

router.get('/api/home', requireAuth, (req, res) => {
  const user = findByEmail(req.user.email);
  if (!user) {
    return res.status(404).send({ errorMessage: 'User not found' });
  }

  const artist = findArtistByUserId(user.user_id);
  const type = artist ? 'artist' : 'venue';
  const payload = artist || findVenueByUserId(user.user_id);

  if (!payload) {
    return res.status(403).send({ errorMessage: 'No entity linked to this account' });
  }

  res.send({ data: { ...payload, userId: user.user_id }, type });
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

router.post('/api/riders', requireAuth, (req, res) => {
  const { riderName, riderUrl } = req.body;
  const user = findByEmail(req.user.email);

  if (req.user.type === 'artist') {
    const artist = findArtistByUserId(user.user_id);
    if (!artist) return res.status(403).send({ errorMessage: 'Not an artist account' });
    createArtistRider({ artistId: artist.artist_id, riderName, riderUrl });
  } else {
    const venue = findVenueByUserId(user.user_id);
    if (!venue) return res.status(403).send({ errorMessage: 'Not a venue account' });
    createVenueRider({ venueId: venue.venue_id, riderName, riderUrl });
  }

  res.status(201).send({ data: { riderName, riderUrl } });
});

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

export default router;
