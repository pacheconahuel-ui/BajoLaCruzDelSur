import { Card, Resource } from './card';
import { WonderId } from './wonder';

export type Age = 1 | 2 | 3;

export type TurnPhase =
  | 'waiting_for_players'  // lobby, not all players connected
  | 'choose'               // players are picking a card
  | 'reveal'               // cards are being revealed (brief animation phase)
  | 'action'               // server processing actions (auto, no input needed)
  | 'choose_from_discard'  // Rankül etapa 2: one player picks a card from discard pile
  | 'choose_extra_card'    // Yámana "Ofrenda del Fuego": one player plays a bonus card from hand
  | 'military'             // end-of-age military resolution display
  | 'scoring'              // final scoring screen
  | 'finished';            // game over

export type PlayerAction =
  | { type: 'build_structure' }
  | { type: 'build_wonder_stage' }
  | { type: 'discard' };

export interface TradeDecision {
  leftCoins: number;    // coins paid to left neighbor
  rightCoins: number;   // coins paid to right neighbor
}

export interface PendingAction {
  cardId: string;
  action: PlayerAction;
  trade?: TradeDecision;
}

export interface MilitaryToken {
  age: Age;
  value: 1 | 3 | 5 | -1 | 0;
}

export interface PlayerState {
  id: string;
  name: string;
  wonderId: WonderId;
  wonderStagesBuilt: number;  // 0-3
  coins: number;
  hand: Card[];
  builtStructures: Card[];
  militaryTokens: MilitaryToken[];
  // Derived fields (calculated server-side, sent to clients)
  shields: number;
  pendingAction?: PendingAction;  // set during 'choose' phase, cleared after reveal
  isReady: boolean;               // true when player has chosen this turn
  tradeDiscounts: {
    left: ('brown' | 'gray')[];
    right: ('brown' | 'gray')[];
  };
  freeBuildsLeft: number;         // from Olympia wonder effect
  isBot: boolean;                 // true for AI players
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  military: number;
  treasury: number;
  wonder: number;
  civilian: number;
  science: number;
  commercial: number;
  guilds: number;
  total: number;
}

export interface GameState {
  roomId: string;
  age: Age;
  turn: number;        // 1-6
  phase: TurnPhase;
  handDirection: 'left' | 'right';
  players: PlayerState[];
  discardPile: Card[];
  log: string[];       // human-readable event log (last 20 entries)
  scores?: PlayerScore[];
  pendingDiscardPlayerId?: string;   // set during 'choose_from_discard' phase
  pendingExtraCardPlayerId?: string; // set during 'choose_extra_card' phase (Yámana Ofrenda del Fuego)
  militaryAge?: Age;   // the age whose military was just resolved (set during 'military' phase)
}

// Subset of player state safe to send to other players (hides hand contents)
export interface PublicPlayerState extends Omit<PlayerState, 'hand' | 'pendingAction'> {
  handSize: number;
  hasChosen: boolean;  // true if pendingAction is set (but not what they chose)
}

export interface PublicGameState extends Omit<GameState, 'players'> {
  players: PublicPlayerState[];
  myState: PlayerState;  // full state for the receiving player only
  myIndex: number;
  scores?: PlayerScore[];
}
