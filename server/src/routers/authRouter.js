import { Router } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authLimiter } from '../middleware/rateLimiters.js';
import { hashPassword, comparePassword } from '../util/passwordUtil.js';
import { v7 as uuidv7 } from 'uuid';
import { sendWelcomeEmail, sendPasswordRecoveryEmail } from '../util/emailUtil.js';
import { findByEmail, findArtistByUserId, saveUser } from '../database/queries/userQueries.js';
import { setExpiryTokenByEmail, findUserByToken, updateUserAndToken } from '../database/queries/authQueries.js';
import { createArtist } from '../database/queries/artistQueries.js';
import { createVenue } from '../database/queries/venueQueries.js';
import { createArtistUser } from '../database/queries/artistUserQueries.js';
import { createVenueUser } from '../database/queries/venueUserQueries.js';

const router = Router();

router.post('/api/register', authLimiter, async (req, res) => {
  const { password, email, name, type } = req.body;

  if (!password || !email || !name || !type) {
    return res.status(400).send({ errorMessage: 'Email, password, name and type are required.' });
  }

  const existingUser = findByEmail(email);
  if (existingUser) {
    return res.status(400).send({ errorMessage: 'User already exists.' });
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
  res.status(201).send({ data: 'User registered successfully.' });
});

router.post('/api/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = findByEmail(email);
    if (!user || !(await comparePassword(password, user.password_hash))) {
      return res.status(401).send({ errorMessage: 'Invalid credentials.' });
    }

    const type = findArtistByUserId(user.user_id) ? 'artist' : 'venue';

    const token = jwt.sign(
      { email: user.email, id: user.user_id, type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000
    });

    res.status(200).send({ data: `${email} logged in successfully.` });
  } catch {
    res.status(500).send({ errorMessage: 'Login failed.' });
  }
});

router.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).send({ data: 'Logged out successfully.' });
});

router.post('/api/request-reset', authLimiter, (req, res) => {
  const { email } = req.body;
  const user = findByEmail(email);

  if (!user) {
    return res.status(404).send({ errorMessage: 'No account with that email.' });
  }

  const token = crypto.randomUUID();
  const expiry = Date.now() + 15 * 60 * 1000;
  
  setExpiryTokenByEmail(token, expiry, email);
  sendPasswordRecoveryEmail(email, user.email, `${process.env.CLIENT_URL}/reset-password?token=${token}`);

  res.status(200).send({ data: 'Reset link sent.' });
});

router.post('/api/reset-password', authLimiter, async (req, res) => {
  const { token, newPassword } = req.body;
  const user = findUserByToken(token, Date.now());
  if (!user) {
    return res.status(400).send({ errorMessage: 'Invalid or expired token.' });
  }

  const hashed = await hashPassword(newPassword);
  updateUserAndToken(hashed, user.user_id);

  res.status(200).send({ data: 'Password reset successfully.' });
});

export default router;
