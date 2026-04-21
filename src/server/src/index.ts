import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from '@7wonders/shared';
import { registerHandlers } from './socket/handlers';
import { initDb } from './db/persistence';

const app = express();
const server = http.createServer(app);

const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.use(cors({ origin: true }));   // dev: allow all origins (LAN, mobile, etc.)
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(server, {
  cors: { origin: true, methods: ['GET', 'POST'] },
});

io.on('connection', socket => {
  registerHandlers(io, socket);
});

server.listen(PORT, async () => {
  console.log(`7 Wonders server listening on port ${PORT}`);
  await initDb();  // no-op if DATABASE_URL is not set
});
