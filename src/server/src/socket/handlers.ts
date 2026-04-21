import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, SocketData, PendingAction } from '@7wonders/shared';
import {
  createRoom,
  joinRoom,
  rejoinRoom,
  startGame,
  getRoom,
  getEngine,
  buildPublicState,
  getLobbyPlayers,
  addBot,
  getBotIds,
  persistRoom,
  restoreRoom,
  cleanupRoom,
  destroyRoom,
} from './roomManager';

type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;
type AppServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

export function registerHandlers(io: AppServer, socket: AppSocket): void {
  // ── LOBBY ─────────────────────────────────────────────────────────────────

  socket.on('lobby:create', (playerName, callback) => {
    const { roomId, playerId } = createRoom(playerName, socket.id);
    socket.data.playerId = playerId;
    socket.data.roomId = roomId;
    socket.data.playerName = playerName;
    socket.join(roomId);
    callback(roomId, playerId);
    io.to(roomId).emit('lobby:updated', getLobbyPlayers(roomId));
  });

  socket.on('lobby:join', (roomId, playerName, callback) => {
    const result = joinRoom(roomId, playerName, socket.id);
    if ('error' in result) {
      callback(result.error);
      return;
    }
    socket.data.playerId = result.playerId;
    socket.data.roomId = roomId;
    socket.data.playerName = playerName;
    socket.join(roomId);
    callback(undefined, result.playerId);
    io.to(roomId).emit('lobby:updated', getLobbyPlayers(roomId));
  });

  socket.on('lobby:add_bot', (callback: (err?: string) => void) => {
    const { roomId, playerId } = socket.data;
    if (!roomId || !playerId) { callback('Not in a room'); return; }
    const result = addBot(roomId, playerId);
    if ('error' in result) { callback(result.error); return; }
    callback();
    io.to(roomId).emit('lobby:updated', getLobbyPlayers(roomId));
  });

  socket.on('lobby:start', (callback) => {
    const { roomId, playerId } = socket.data;
    if (!roomId || !playerId) { callback('Not in a room'); return; }

    const result = startGame(roomId, playerId);
    if ('error' in result) { callback(result.error); return; }

    callback();
    broadcastGameState(io, roomId); // triggerBots is called inside broadcastGameState
  });

  // ── GAME ──────────────────────────────────────────────────────────────────

  socket.on('game:action', (action: PendingAction, callback) => {
    const { roomId, playerId } = socket.data;
    if (!roomId || !playerId) { callback('Not in a room'); return; }

    const engine = getEngine(roomId);
    if (!engine) { callback('No active game'); return; }

    const error = engine.submitAction(playerId, action);
    if (error) { callback(error); return; }

    callback();
    broadcastGameState(io, roomId);
    scheduleRevealAndAdvance(io, roomId);
  });

  socket.on('game:choose_from_discard', (cardId: string, callback: (err?: string) => void) => {
    const { roomId, playerId } = socket.data;
    if (!roomId || !playerId) { callback('Not in a room'); return; }

    const engine = getEngine(roomId);
    if (!engine) { callback('No active game'); return; }

    const error = engine.buildFromDiscard(playerId, cardId);
    if (error) { callback(error); return; }

    callback();
    broadcastGameState(io, roomId);
    scheduleRevealAndAdvance(io, roomId);
  });

  socket.on('game:skip_discard_pick', (callback: (err?: string) => void) => {
    const { roomId, playerId } = socket.data;
    if (!roomId || !playerId) { callback('Not in a room'); return; }

    const engine = getEngine(roomId);
    if (!engine) { callback('No active game'); return; }

    const error = engine.skipDiscardPick(playerId);
    if (error) { callback(error); return; }

    callback();
    broadcastGameState(io, roomId);
    scheduleRevealAndAdvance(io, roomId);
  });

  socket.on('game:abandon', (callback: (err?: string) => void) => {
    const { roomId, playerName } = socket.data;
    if (!roomId) { callback('Not in a room'); return; }
    // Notify everyone in the room first, then destroy
    io.to(roomId).emit('game:abandoned', `${playerName} abandonó la partida.`);
    destroyRoom(roomId);
    callback();
  });

  socket.on('game:chat', (message: string) => {
    const { roomId, playerName } = socket.data;
    if (!roomId || !message?.trim()) return;
    const text = message.trim().slice(0, 200);
    io.to(roomId).emit('game:chat', playerName ?? 'Anónimo', text, Date.now());
  });

  socket.on('game:rejoin', async (roomId, playerId, callback) => {
    // Try in-memory first, then restore from DB if server restarted
    let ok = rejoinRoom(roomId, playerId, socket.id);
    if (!ok) {
      const restoredEngine = await restoreRoom(roomId);
      if (restoredEngine) ok = rejoinRoom(roomId, playerId, socket.id);
    }
    if (!ok) { callback('Cannot rejoin'); return; }
    socket.data.playerId = playerId;
    socket.data.roomId = roomId;
    socket.join(roomId);
    callback();

    const engine = getEngine(roomId);
    if (engine) {
      broadcastGameState(io, roomId);
    } else {
      socket.emit('lobby:updated', getLobbyPlayers(roomId));
    }
  });

  // ── DISCONNECT ────────────────────────────────────────────────────────────

  socket.on('disconnect', () => {
    // Socket is gone but player data is preserved — they can rejoin within the session
    const { roomId, playerName } = socket.data;
    if (roomId && playerName) {
      // Use game:chat to notify others as a system message (less alarming than an error)
      io.to(roomId).emit('game:chat', '⚡ Sistema', `${playerName} se desconectó. Puede reconectarse.`, Date.now());
    }
  });
}

/** Emit the current game state to each player in the room (personalized view). */
function broadcastGameState(io: AppServer, roomId: string): void {
  const engine = getEngine(roomId);
  if (!engine) return;

  const state = engine.getState();
  const room = getRoom(roomId);
  if (!room) return;

  for (const member of room.players) {
    if (member.isBot) continue;
    const personalState = buildPublicState(state, member.id);
    io.to(member.socketId).emit('game:state', personalState);
  }

  // Persist after every state change
  persistRoom(roomId);

  // Cleanup DB when game fully ends (scoring is the terminal state in 7 Wonders)
  if (state.phase === 'finished' || state.phase === 'scoring') cleanupRoom(roomId);

  if (state.phase === 'choose') triggerBots(io, roomId);
  if (state.phase === 'choose_from_discard') triggerBotDiscardPick(io, roomId);
}

/** Auto-pick a discard card for a bot player who triggered Halicarnaso stage 2. */
function triggerBotDiscardPick(io: AppServer, roomId: string): void {
  const botIds = getBotIds(roomId);
  if (botIds.length === 0) return;

  const engine = getEngine(roomId);
  if (!engine) return;

  const state = engine.getState();
  if (!state.pendingDiscardPlayerId) return;
  if (!botIds.includes(state.pendingDiscardPlayerId)) return;

  const delay = 600 + Math.floor(Math.random() * 400);
  setTimeout(() => {
    const currentEngine = getEngine(roomId);
    if (!currentEngine) return;
    const currentState = currentEngine.getState();
    if (currentState.phase !== 'choose_from_discard') return;
    if (!currentState.pendingDiscardPlayerId) return;
    if (!getBotIds(roomId).includes(currentState.pendingDiscardPlayerId)) return;

    const botId = currentState.pendingDiscardPlayerId;
    const discard = currentState.discardPile;

    let err: string | null;
    if (discard.length === 0) {
      err = currentEngine.skipDiscardPick(botId);
    } else {
      // Pick a random card from the discard pile
      const card = discard[Math.floor(Math.random() * discard.length)];
      err = currentEngine.buildFromDiscard(botId, card.id);
    }

    if (!err) {
      broadcastGameState(io, roomId);
      scheduleRevealAndAdvance(io, roomId);
    }
  }, delay);
}

/** Auto-submit actions for all bot players, with a small delay for realism. */
function triggerBots(io: AppServer, roomId: string): void {
  const botIds = getBotIds(roomId);
  if (botIds.length === 0) return;

  const engine = getEngine(roomId);
  if (!engine) return;

  // Small random delay (300-900ms) so bots feel less instant
  const delay = 300 + Math.floor(Math.random() * 600);
  setTimeout(() => {
    const currentEngine = getEngine(roomId);
    if (!currentEngine || currentEngine.getState().phase !== 'choose') return;

    for (const botId of botIds) {
      const action = currentEngine.getBotAction(botId);
      if (action) currentEngine.submitAction(botId, action);
    }

    broadcastGameState(io, roomId);
    scheduleRevealAndAdvance(io, roomId);
  }, delay);
}

/**
 * After all players submit (phase='reveal'), apply actions after a brief display delay,
 * then handle military auto-advance if needed.
 */
function scheduleRevealAndAdvance(io: AppServer, roomId: string): void {
  const engine = getEngine(roomId);
  if (!engine) return;
  const phase = engine.getState().phase;

  if (phase === 'reveal') {
    // Let clients show the reveal screen for 1.5s, then apply actions
    setTimeout(() => {
      const currentEngine = getEngine(roomId);
      if (!currentEngine || currentEngine.getState().phase !== 'reveal') return;
      currentEngine.applyRevealedActions();
      broadcastGameState(io, roomId);
      const newState = currentEngine.getState();
      if (newState.phase === 'military') {
        setTimeout(() => {
          currentEngine.startNextAge();
          broadcastGameState(io, roomId);
        }, 4000);
      }
    }, 1500);
  } else if (phase === 'military') {
    setTimeout(() => {
      engine.startNextAge();
      broadcastGameState(io, roomId);
    }, 4000);
  }
}
