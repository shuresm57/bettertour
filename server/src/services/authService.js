import crypto from 'crypto';
import { v7 as uuidv7 } from 'uuid';
import { hashPassword, comparePassword } from '../util/passwordUtil.js';
import { sendWelcomeEmail, sendPasswordRecoveryEmail } from '../util/emailUtil.js';
import { findByEmail, findArtistByUserId, saveUser } from '../database/queries/userQueries.js';
import { setExpiryTokenByEmail, findUserByToken, updateUserAndToken } from '../database/queries/authQueries.js';
import { createArtist } from '../database/queries/artistQueries.js';
import { createVenue } from '../database/queries/venueQueries.js';
import { createArtistUser } from '../database/queries/artistUserQueries.js';
import { createVenueUser } from '../database/queries/venueUserQueries.js';

export async function registerUser (email, password, name, type) {
  if (findByEmail(email)) {
    return { error: 'user_exists' };
  }

  const hashedPassword = await hashPassword(password);
  const userId = uuidv7();
  saveUser(userId, email, hashedPassword);

  if (type === 'artist') {
    const result = createArtist({ artistName: name, bio: '', contactEmail: email });
    createArtistUser({ artistId: result.lastInsertRowid, userId, role: 'member' });
  } else {
    const result = createVenue({ venueName: name, address: '', bio: '', contactEmail: email });
    createVenueUser({ venueId: result.lastInsertRowid, userId, role: 'member' });
  }

  try {
    await sendWelcomeEmail(email, name);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  return { success: true };
}

export async function loginUser (email, password) {
  const user = findByEmail(email);
  if (!user) {
    return null;
  }

  const passwordMatch = await comparePassword(password, user.password_hash);
  if (!passwordMatch) {
    return null;
  }

  const type = findArtistByUserId(user.user_id) ? 'artist' : 'venue';
  return { user, type };
}

export function requestPasswordReset (email) {
  const user = findByEmail(email);
  if (!user) {
    return { error: 'not_found' };
  }

  const token = crypto.randomUUID();
  const expiry = Date.now() + 15 * 60 * 1000;
  setExpiryTokenByEmail(token, expiry, email);
  sendPasswordRecoveryEmail(email, user.email, `${process.env.CLIENT_URL}/reset-password?token=${token}`);

  return { success: true };
}

export async function resetPassword (token, newPassword) {
  const user = findUserByToken(token, Date.now());
  if (!user) {
    return { error: 'invalid_token' };
  }

  const hashed = await hashPassword(newPassword);
  updateUserAndToken(hashed, user.user_id);

  return { success: true };
}
