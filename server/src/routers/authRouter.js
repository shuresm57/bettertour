import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authLimiter } from '../middleware/rateLimiters.js';
import { registerUser, loginUser, requestPasswordReset, resetPassword } from '../services/authService.js';

const router = Router();

router.post('/api/register', authLimiter, async (req, res) => {
  const { password, email, name, type } = req.body;

  if (!password || !email || !name || !type) {
    return res.status(400).send({ errorMessage: 'Email, password, name and type are required.' });
  }

  const result = await registerUser(email, password, name, type);
  if (result?.error === 'User already exists') {
    return res.status(400).send({ errorMessage: 'User already exists.' });
  }

  res.status(201).send({ data: 'User registered successfully.' });
});

router.post('/api/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    if (!result) {
      return res.status(401).send({ errorMessage: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { email: result.user.email, id: result.user.user_id, type: result.type },
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
  const result = requestPasswordReset(email);
  if (result?.error === 'User not found') {
    return res.status(404).send({ errorMessage: 'No account with that email.' });
  }
  res.status(200).send({ data: 'Reset link sent.' });
});

router.post('/api/reset-password', authLimiter, async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await resetPassword(token, newPassword);
  if (result?.error === 'Invalid token') {
    return res.status(400).send({ errorMessage: 'Invalid or expired token.' });
  }
  res.status(200).send({ data: 'Password reset successfully.' });
});

export default router;
