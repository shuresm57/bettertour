import jwt from 'jsonwebtoken';

// sessions are stateful, the sessions lives with the server and the client just holds a Session ID in the cookies
// JWT are stateless, the token lives with the client
export function requireAuth (req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ errorMessage: 'Access Denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({ errorMessage: 'Invalid Token' });
    }
    req.user = user;
    return next();
  });
}
