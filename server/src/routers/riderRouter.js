import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { createRider, deleteRider } from '../services/riderService.js';

const router = Router();

router.post('/api/riders', requireAuth, (req, res) => {
  const { riderName, riderUrl } = req.body;
  const result = createRider(req.user.id, req.user.type, riderName, riderUrl);
  if (!result) {
    return res.status(403).send({ errorMessage: 'No account linked' });
  }
  res.status(201).send({ data: { id: result.riderId, riderName, riderUrl } });
});

router.delete('/api/riders/:riderId', requireAuth, (req, res) => {
  const riderId = parseInt(req.params.riderId);
  const ok = deleteRider(req.user.id, req.user.type, riderId);
  if (!ok) {
    return res.status(403).send({ errorMessage: 'No account linked' });
  }
  res.send({ data: { riderId } });
});

export default router;
