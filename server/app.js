import 'dotenv/config';

import express from 'express';

import helmet from 'helmet';

import cors from 'cors';

import cookieParser from 'cookie-parser';

import './database/initDatabase.js';

import { generalLimiter } from './middleware/rateLimiters.js';

import authRouter from './routers/authRouter.js';

import userRouter from './routers/userRouter.js';

import contactRouter from './routers/contactRouter.js';

import path from 'path';

import http from 'http';

import { Server } from 'socket.io';

import { registerShowSocket } from './sockets/showSocket.js';
const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);
app.use(authRouter);
app.use(userRouter);
app.use(contactRouter);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.resolve('../client/dist/index.html'));
  });
} else {
  app.get('/{*splat}', (req, res) => {
    res.status(404).send('<h1>404 - Page not found</h1>');
  });
}

app.all('/{*splat}', (req, res) => {
  res.status(404).send({ errorMessage: 'Route not found' });
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true
  }
});
registerShowSocket(io);

const PORT = process.env.PORT ?? 3000;

server.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
