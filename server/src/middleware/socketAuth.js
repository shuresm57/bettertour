import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export function socketAuth (socket, next) {
  const cookies = cookie.parse(socket.request.headers.cookie ?? '');
  const token = cookies.token;

  if (!token) {
    return next(new Error('Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new Error('Invalid token'));
    }
    socket.user = user;
    next();
  });
  
}
