import { findByEmail, findArtistByUserId, findVenueByUserId } from '../database/queries/userQueries.js';

export function requireArtist (req, res, next) {
  const user = findByEmail(req.user.email);
  const artist = user && findArtistByUserId(user.user_id);
  if (!artist) {
    return res.status(403).send({ errorMessage: 'Not an artist account' });
  }
  req.artist = artist;
  req.dbUser = user;
  next();
}

export function requireVenue (req, res, next) {
  const user = findByEmail(req.user.email);
  const venue = user && findVenueByUserId(user.user_id);
  if (!venue) {
    return res.status(403).send({ errorMessage: 'Not a venue account' });
  }
  req.venue = venue;
  req.dbUser = user;
  next();
}
