import { Router } from 'express';
import { generalLimiter } from '../middleware/rateLimiters.js';
import { sendContactEmail } from '../util/emailUtil.js';

const router = Router();

router.post('/api/contact', generalLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Name, email and message are required.');
  }

  try {
    await sendContactEmail(name, email, message);
    res.status(200).send('Message sent.');
  } catch {
    res.status(500).send('Failed to send message.');
  }
});

export default router;
