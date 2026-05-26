# BetterTour Server

Express 5 REST API with Socket.io. Handles authentication, show and rider management, and real-time booking notifications.

Built with Express 5, better-sqlite3, Socket.io, and JWT.

## Structure

- `src/routers/` — route handlers
- `src/services/` — business logic
- `src/database/` — queries and migrations
- `src/sockets/` — Socket.io event handlers
- `src/middleware/` — auth and role guards
