import { Router } from 'express';
import { requireAuth } from '../middleware/jwtAuthenticator.js';
import { requireArtist, requireVenue } from '../middleware/requireRole.js';
import { findByEmail, findArtistByUserId, findVenueByUserId, deleteUserById, updateUserPassword } from '../database/queries/userQueries.js';
import { getShowsByArtistId, getShowsWithArtistsByVenueId, createShow, updateShow, deleteShow } from '../database/queries/showQueries.js';
import { createShowParticipant, getShowParticipants, deleteShowParticipants, deleteShowParticipantsByArtist, deleteShowParticipantsByVenue, deleteOrphanedShows } from '../database/queries/showParticipantQueries.js';
import { getArtistRider, getVenueRider, createArtistRider, createVenueRider, deleteRidersByArtistId, deleteRidersByVenueId, deleteRiderById } from '../database/queries/riderQueries.js';
import { updateArtist, deleteArtistById } from '../database/queries/artistQueries.js';
import { updateVenue, deleteVenueById } from '../database/queries/venueQueries.js';
import { deleteArtistUser } from '../database/queries/artistUserQueries.js';
import { deleteVenueUser } from '../database/queries/venueUserQueries.js';
import { hashPassword, comparePassword } from '../util/passwordUtil.js';

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

export default router;
