import { GameState, PublicGameState, PublicPlayerState, PlayerState } from '@7wonders/shared';
import { GameEngine, createGameState } from '../game/gameEngine';
import { saveGame, loadGame, deleteGame } from '../db/persistence';

interface RoomPlayer {
  id: string;
  name: string;
  socketId: string;
  isBot: boolean;
}

interface Room {
  id: string;
  players: RoomPlayer[];
  engine: GameEngine | null;
  phase: 'lobby' | 'playing' | 'finished';
}

const rooms = new Map<string, Room>();

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generatePlayerId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createRoom(playerName: string, socketId: string): { roomId: string; playerId: string } {
  const roomId = generateRoomId();
  const playerId = generatePlayerId();
  rooms.set(roomId, {
    id: roomId,
    players: [{ id: playerId, name: playerName, socketId, isBot: false }],
    engine: null,
    phase: 'lobby',
  });
  return { roomId, playerId };
}

export function joinRoom(
  roomId: string,
  playerName: string,
  socketId: string,
): { playerId: string } | { error: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.phase !== 'lobby') return { error: 'Game already started' };
  if (room.players.length >= 7) return { error: 'Room is full' };

  const playerId = generatePlayerId();
  room.players.push({ id: playerId, name: playerName, socketId, isBot: false });
  return { playerId };
}

export function rejoinRoom(
  roomId: string,
  playerId: string,
  socketId: string,
): boolean {
  const room = rooms.get(roomId);
  if (!room) return false;
  const player = room.players.find(p => p.id === playerId);
  if (!player) return false;
  player.socketId = socketId;
  return true;
}

export function startGame(roomId: string, requesterId: string): GameState | { error: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.players[0].id !== requesterId) return { error: 'Only host can start' };
  if (room.players.length < 3) return { error: 'Need at least 3 players' };

  const state = createGameState(roomId, room.players.map(p => ({ id: p.id, name: p.name, isBot: p.isBot })));
  const engine = new GameEngine(state);
  engine.startAge();
  room.engine = engine;
  room.phase = 'playing';
  saveGame(roomId, engine.getState()).catch(() => {});
  return engine.getState();
}

export function getRoom(roomId: string): Room | undefined {
  return rooms.get(roomId);
}

export function getEngine(roomId: string): GameEngine | null {
  return rooms.get(roomId)?.engine ?? null;
}

/** Build the PublicGameState for a specific player. */
export function buildPublicState(state: GameState, forPlayerId: string): PublicGameState {
  const myIndex = state.players.findIndex(p => p.id === forPlayerId);
  const myState = state.players[myIndex];

  const publicPlayers: PublicPlayerState[] = state.players.map(p => {
    const { hand, pendingAction, ...rest } = p;
    return {
      ...rest,
      handSize: hand.length,
      hasChosen: p.isReady,
    };
  });

  return {
    ...state,
    players: publicPlayers,
    myState,
    myIndex,
  };
}

export function addBot(roomId: string, requesterId: string): { playerId: string } | { error: string } {
  const room = rooms.get(roomId);
  if (!room) return { error: 'Room not found' };
  if (room.players[0].id !== requesterId) return { error: 'Only host can add bots' };
  if (room.phase !== 'lobby') return { error: 'Game already started' };
  if (room.players.length >= 7) return { error: 'Room is full' };

  const n = room.players.filter(p => p.isBot).length + 1;
  const playerId = generatePlayerId();
  room.players.push({ id: playerId, name: `Bot ${n}`, socketId: `bot_${playerId}`, isBot: true });
  return { playerId };
}

export function getBotIds(roomId: string): string[] {
  return rooms.get(roomId)?.players.filter(p => p.isBot).map(p => p.id) ?? [];
}

export function getLobbyPlayers(roomId: string): { id: string; name: string; isBot?: boolean }[] {
  return rooms.get(roomId)?.players.map(p => ({ id: p.id, name: p.name, isBot: p.isBot })) ?? [];
}

/** Persist current engine state to DB. Call after every state change. */
export function persistRoom(roomId: string): void {
  const engine = rooms.get(roomId)?.engine;
  if (!engine) return;
  saveGame(roomId, engine.getState()).catch(() => {});
}

/** Try to restore a room from DB after server restart. Returns engine or null. */
export async function restoreRoom(roomId: string): Promise<GameEngine | null> {
  if (rooms.has(roomId)) return rooms.get(roomId)!.engine;
  const state = await loadGame(roomId);
  if (!state) return null;

  const engine = new GameEngine(state);
  rooms.set(roomId, {
    id: roomId,
    players: state.players.map(p => ({
      id: p.id,
      name: p.name,
      socketId: '',   // will be updated on rejoin
      isBot: p.isBot,
    })),
    engine,
    phase: state.phase === 'scoring' || state.phase === 'finished' ? 'finished' : 'playing',
  });
  return engine;
}

/** Remove room from DB when game ends. */
export function cleanupRoom(roomId: string): void {
  deleteGame(roomId).catch(() => {});
}

/** Immediately destroy a room (abandon). Removes from memory + DB. */
export function destroyRoom(roomId: string): void {
  rooms.delete(roomId);
  deleteGame(roomId).catch(() => {});
}
