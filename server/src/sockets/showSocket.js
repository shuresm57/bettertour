import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { findArtistByEmail } from '../database/queries/artistQueries.js';
import { findVenueByUserId } from '../database/queries/userQueries.js';
import { createShow, updateShowStatus } from '../database/queries/showQueries.js';
import { createShowParticipant, getShowParticipants } from '../database/queries/showParticipantQueries.js';

export function registerShowSocket (io) {
  io.use((socket, next) => {
    const cookies = cookie.parse(socket.request.headers.cookie ?? '');
    const token = cookies.token;
    if (!token) {
      return next(new Error('Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(new Error('Invalid token'));
      }
      socket.user = user;
      next();
    });
  });

  io.on('connection', (socket) => {
    socket.on('client-joins', (userId) => {
      socket.join(userId);
    });

    socket.on('venue-sends-show-request', (data) => {
      const artist = findArtistByEmail(data.artistEmail);
      if (!artist) {
        return;
      }

      const venue = findVenueByUserId(data.venueId);
      if (!venue) {
        return;
      }

      const result = createShow({
        date: data.date,
        schedule: data.schedule ? JSON.stringify(data.schedule) : null,
        eventName: data.event_name,
        contactOfDay: data.contact_of_day,
        status: 'pending'
      });

      const showId = result.lastInsertRowid;

      createShowParticipant({ showId, userId: data.venueId, artistId: null, venueId: venue.venue_id, role: 'venue' });
      createShowParticipant({ showId, userId: artist.user_id, artistId: artist.artist_id, venueId: null, role: 'artist' });

      const showPayload = {
        show_id: showId,
        event_name: data.event_name,
        date: data.date,
        contact_of_day: data.contact_of_day,
        schedule: data.schedule,
        status: 'pending',
        venueId: data.venueId,
        artistUserId: artist.user_id,
        artist_name: artist.artist_name
      };

      io.to(artist.user_id).emit('server-sends-show-request', showPayload);
      socket.emit('server-creates-show', showPayload);
    });

    socket.on('artist-accepts-show', (data) => {
      updateShowStatus(data.show_id, 'confirmed');
      io.to(data.venueId).emit('server-sends-acceptance', data);
      socket.emit('server-sends-acceptance', data);
    });

    socket.on('venue-updates-show', (data) => {
      const participants = getShowParticipants(data.show_id);
      const artistParticipant = participants.find(p => p.role === 'artist');
      if (!artistParticipant) {
        return;
      }
      io.to(artistParticipant.user_id).emit('server-sends-show-update', data);
    });
  });
}
