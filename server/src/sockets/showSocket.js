import { socketAuth } from '../middleware/socketAuth.js';
import { createShowRequest, acceptShow, getArtistUserIdForShow } from '../services/showService.js';

export function registerShowSocket (io) {
  io.use(socketAuth);

  io.on('connection', (socket) => {
    socket.on('client-joins', (userId) => {
      socket.join(userId);
    });

    socket.on('venue-sends-show-request', (data) => {
      const result = createShowRequest(data.venueId, data.artistEmail, data);
      if (!result) {
        return;
      }

      const showPayload = {
        show_id: result.showId,
        event_name: data.event_name,
        date: data.date,
        contact_of_day: data.contact_of_day,
        schedule: data.schedule,
        status: 'pending',
        venueId: data.venueId,
        artistUserId: result.artist.user_id,
        artist_name: result.artist.artist_name
      };

      io.to(result.artist.user_id).emit('server-sends-show-request', showPayload);
      socket.emit('server-creates-show', showPayload);
    });

    socket.on('artist-accepts-show', (data) => {
      acceptShow(data.show_id);
      io.to(data.venueId).emit('server-sends-acceptance', data);
      socket.emit('server-sends-acceptance', data);
    });

    socket.on('venue-updates-show', (data) => {
      const artistUserId = getArtistUserIdForShow(data.show_id);
      if (!artistUserId) {
        return;
      }
      io.to(artistUserId).emit('server-sends-show-update', data);
    });
  });
}
