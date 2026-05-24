import jwt from 'jsonwebtoken';

export function requireAuth (req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ error: 'Access Denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({ error: 'Invalid Token' });
    }
    req.user = user;
    return next();
  });
}
