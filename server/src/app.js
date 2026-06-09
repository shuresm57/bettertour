import 'dotenv/config';
import './database/initDatabase.js';

//========================================
//            Middleware
//========================================

import express from 'express';
const app = express();

import helmet from 'helmet';
app.use(helmet());

import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import { generalLimiter } from './middleware/rateLimiters.js';
app.use(generalLimiter);

//======================================== 
//                Routes
//======================================== 

import authRouter from './routers/authRouter.js';
app.use(authRouter);

import userRouter from './routers/userRouter.js';
app.use(userRouter);

import riderRouter from './routers/riderRouter.js';
app.use(riderRouter);

import profileRouter from './routers/profileRouter.js';
app.use(profileRouter);

import contactRouter from './routers/contactRouter.js';
app.use(contactRouter);

import showRouter from './routers/showRouter.js';
app.use(showRouter);

//========================================
//                Static
//========================================

import path from 'path';

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

//========================================
//           Socket.io Server
//========================================

import http from 'http';
import { Server } from 'socket.io';
import { registerShowSocket } from './sockets/showSocket.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true
  }
});

registerShowSocket(io);

const DEFAULT_PORT = 3000;
const PORT = process.env.PORT ?? DEFAULT_PORT;

server.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
