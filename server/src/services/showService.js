import { findArtistByEmail } from '../database/queries/artistQueries.js';
import { findVenueByUserId } from '../database/queries/userQueries.js';
import { createShow, updateShow, deleteShow, updateShowStatus } from '../database/queries/showQueries.js';
import { createShowParticipant, getShowParticipants, deleteShowParticipants } from '../database/queries/showParticipantQueries.js';

function addArtistToShow (showId, userId, artistId) {
  createShowParticipant({ showId, userId, artistId, venueId: null, role: 'artist' });
}

function addVenueToShow (showId, userId, venueId) {
  createShowParticipant({ showId, userId, artistId: null, venueId, role: 'venue' });
}

function buildShowData (data) {

  return {
    date: data.date,
    schedule: data.schedule ? JSON.stringify(data.schedule) : null,
    eventName: data.event_name,
    contactOfDay: data.contact_of_day,
    status: data.status ?? 'confirmed'
  };

}

export function createArtistShow (showData, userId, artistId) {

  const result = createShow(buildShowData(showData));
  const showId = result.lastInsertRowid;
  addArtistToShow(showId, userId, artistId);
  return showId;
}

export function createVenueShow (showData, userId, venueId) {

  const result = createShow(buildShowData(showData));
  const showId = result.lastInsertRowid;
  addVenueToShow(showId, userId, venueId);
  return showId;
}

export function createShowRequest (venueUserId, artistEmail, showData) {
  
  const artist = findArtistByEmail(artistEmail);
  if (!artist) {
    return null;
  }

  const venue = findVenueByUserId(venueUserId);
  if (!venue) {
    return null;
  }

  const result = createShow({ ...buildShowData(showData), status: 'pending' });
  const showId = result.lastInsertRowid;

  addVenueToShow(showId, venueUserId, venue.venue_id);
  addArtistToShow(showId, artist.user_id, artist.artist_id);

  const payload = {
    show_id: showId,
    event_name: showData.event_name,
    date: showData.date,
    contact_of_day: showData.contact_of_day,
    schedule: showData.schedule,
    status: 'pending',
    venueId: venueUserId,
    artistUserId: artist.user_id,
    artist_name: artist.artist_name
  };

  return payload;
}

export function updateShowAsArtist (showId, artistId, showData) {
  const participants = getShowParticipants(showId);
  const isParticipant = participants.some(participant => participant.artist_id === artistId);
  const hasVenue = participants.some(participant => participant.role === 'venue');
  if (!isParticipant || hasVenue) {
    return { error: 'forbidden' };
  }
  updateShow(showId, buildShowData(showData));
}

export function updateShowAsVenue (showId, venueId, showData) {
  const participants = getShowParticipants(showId);
  if (!participants.some(participant => participant.venue_id === venueId)) {
    return { error: 'forbidden' };
  }
  updateShow(showId, buildShowData(showData));
}

export function deleteShowAsArtist (showId, artistId) {
  const participants = getShowParticipants(showId);
  if (!participants.some(participant => participant.artist_id === artistId)) {
    return { error: 'forbidden' };
  }
  deleteShowParticipants(showId);
  deleteShow(showId);
}

export function deleteShowAsVenue (showId, venueId) {
  const participants = getShowParticipants(showId);
  if (!participants.some(participant => participant.venue_id === venueId)) {
    return { error: 'forbidden' };
  }
  deleteShowParticipants(showId);
  deleteShow(showId);
}

export function acceptShow (showId) {
  updateShowStatus(showId, 'confirmed');
}

export function getArtistUserIdForShow (showId) {
  const participants = getShowParticipants(showId);
  return participants.find(participant => participant.role === 'artist')?.user_id ?? null;
}

export function getVenueUserIdForShow (showId) {
  const participants = getShowParticipants(showId);
  return participants.find(participant => participant.role === 'venue')?.user_id ?? null;
}
