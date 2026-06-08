import { socketAuth } from '../middleware/socketAuth.js';
import { createShowRequest, acceptShow, getArtistUserIdForShow, getVenueUserIdForShow } from '../services/showService.js';

export function registerShowSocket (io) {
  io.use(socketAuth);

  io.on('connection', (socket) => {
    socket.on('client-joins', (userId) => {
      socket.join(userId);
    });

    socket.on('venue-sends-show-request', (data) => {
      const payload = createShowRequest(data.venueId, data.artistEmail, {
        event_name: data.event_name,
        date: data.date,
        contact_of_day: data.contact_of_day,
        schedule: data.schedule
      });
      if (!payload) return;
      io.to(payload.artistUserId).emit('server-sends-show-request', payload);
      socket.emit('server-creates-show', payload);
    });

    socket.on('artist-accepts-show', (data) => {
      const venueUserId = getVenueUserIdForShow(data.show_id);
      acceptShow(data.show_id);
      if (venueUserId) {
        io.to(venueUserId).emit('server-sends-acceptance', { show_id: data.show_id });
      }
      socket.emit('server-sends-acceptance', { show_id: data.show_id });
    });

    socket.on('venue-updates-show', (data) => {
      const artistUserId = getArtistUserIdForShow(data.show_id);
      if (!artistUserId) return;
      io.to(artistUserId).emit('server-sends-show-update', data);
    });

  });
}
