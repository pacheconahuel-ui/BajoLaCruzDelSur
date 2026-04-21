import { PublicGameState, PendingAction } from './gameState';

// Events sent FROM client TO server
export interface ClientToServerEvents {
  'lobby:create': (playerName: string, callback: (roomId: string, playerId: string) => void) => void;
  'lobby:join': (roomId: string, playerName: string, callback: (error?: string, playerId?: string) => void) => void;
  'lobby:start': (callback: (error?: string) => void) => void;
  'lobby:add_bot': (callback: (error?: string) => void) => void;
  'game:action': (action: PendingAction, callback: (error?: string) => void) => void;
  'game:rejoin': (roomId: string, playerId: string, callback: (error?: string) => void) => void;
  'game:choose_from_discard': (cardId: string, callback: (error?: string) => void) => void;
  'game:abandon': (callback: (error?: string) => void) => void;
  'game:chat': (message: string) => void;
}

// Events sent FROM server TO client
export interface ServerToClientEvents {
  'lobby:updated': (players: { id: string; name: string; isBot?: boolean }[]) => void;
  'game:state': (state: PublicGameState) => void;
  'game:error': (message: string) => void;
  'game:chat': (playerName: string, message: string, timestamp: number) => void;
  'game:abandoned': (reason: string) => void;
}

// Socket data stored per socket
export interface SocketData {
  playerId: string;
  roomId: string;
  playerName: string;
}
