import {
  GameState,
  PlayerState,
  Age,
  MilitaryToken,
  PendingAction,
  TradeDecision,
  Card,
  WonderStage,
} from '@7wonders/shared';
import { buildAgeDeck, dealHands, shuffle } from './deckBuilder';
import { WONDERS } from './wonders';
import { validateBuildStructure, validateBuildWonderStage, alreadyBuilt, hasChain } from './constructionValidator';
import { computeScores } from './scoring';
import { resolveMilitary } from './military';

export class GameEngine {
  private state: GameState;

  constructor(state: GameState) {
    this.state = state;
  }

  getState(): GameState {
    return this.state;
  }

  /** Initialize Age I: deal cards, set phase to 'choose'. */
  startAge(): void {
    const { age, players } = this.state;
    const deck = buildAgeDeck(age, players.length);
    const hands = dealHands(deck, players.length);

    this.state.handDirection = age === 2 ? 'right' : 'left';

    for (let i = 0; i < players.length; i++) {
      players[i].hand = hands[i];
      players[i].pendingAction = undefined;
      players[i].isReady = false;
    }

    this.state.turn = 1;
    this.state.phase = 'choose';
    this.addLog(`Comienza la Era ${age}.`);
  }

  /** Record a player's chosen action. Returns error string or null on success. */
  submitAction(playerId: string, action: PendingAction): string | null {
    if (this.state.phase !== 'choose') return 'Not in choose phase';

    const playerIdx = this.state.players.findIndex(p => p.id === playerId);
    if (playerIdx === -1) return 'Player not found';

    const player = this.state.players[playerIdx];
    if (player.isReady) return 'Already submitted';

    const cardInHand = player.hand.find(c => c.id === action.cardId);
    if (!cardInHand) return 'Card not in hand';

    // Validate the specific action
    const error = this.validateAction(player, cardInHand, action, playerIdx);
    if (error) return error;

    player.pendingAction = action;
    player.isReady = true;

    // If all players ready, trigger reveal
    if (this.state.players.every(p => p.isReady)) {
      this.resolveAllActions();
    }

    return null;
  }

  private validateAction(
    player: PlayerState,
    card: Card,
    action: PendingAction,
    playerIdx: number,
  ): string | null {
    const left = this.leftNeighbor(playerIdx);
    const right = this.rightNeighbor(playerIdx);

    if (action.action.type === 'build_structure') {
      const opt = validateBuildStructure(card, player, left, right);
      if (!opt.canBuild) return opt.reason ?? 'Cannot build';
      return null;
    }

    if (action.action.type === 'build_wonder_stage') {
      const wonder = WONDERS.find(w => w.id === player.wonderId)!;
      const opt = validateBuildWonderStage(player, left, right, wonder.stages);
      if (!opt.canBuild) return opt.reason ?? 'Cannot build wonder stage';
      return null;
    }

    if (action.action.type === 'discard') {
      return null; // always allowed
    }

    return 'Unknown action type';
  }

  /** Called when all players have submitted. Apply all actions, pass hands, advance turn. */
  private resolveAllActions(): void {
    this.state.phase = 'reveal';

    // Apply each player's action
    for (let i = 0; i < this.state.players.length; i++) {
      const player = this.state.players[i];
      const pending = player.pendingAction!;
      const card = player.hand.find(c => c.id === pending.cardId)!;

      this.applyAction(player, card, pending, i);

      // Remove played card from hand
      player.hand = player.hand.filter(c => c.id !== pending.cardId);
    }

    // If a wonder stage triggered choose_from_discard, pause here.
    // buildFromDiscard() will complete the age/turn flow when player picks.
    if (this.state.phase === 'choose_from_discard') {
      // Discard remaining hands (turn 6 or not — they stay empty for turn 6 anyway)
      for (const player of this.state.players) {
        if (player.hand.length > 0) {
          this.state.discardPile.push(...player.hand);
          player.hand = [];
        }
      }
      return;
    }

    // Handle last turn of age (turn 6 → discard last card, no coins)
    if (this.state.turn === 6) {
      for (const player of this.state.players) {
        if (player.hand.length > 0) {
          this.state.discardPile.push(...player.hand);
          player.hand = [];
        }
      }
      this.endAge();
      return;
    }

    // Pass hands to neighbors
    this.passHands();

    // Reset ready state
    for (const player of this.state.players) {
      player.isReady = false;
      player.pendingAction = undefined;
    }

    this.state.turn++;
    this.state.phase = 'choose';
  }

  private applyAction(
    player: PlayerState,
    card: Card,
    action: PendingAction,
    playerIdx: number,
  ): void {
    const left = this.leftNeighbor(playerIdx);
    const right = this.rightNeighbor(playerIdx);

    if (action.action.type === 'discard') {
      this.state.discardPile.push(card);
      player.coins += 3;
      this.addLog(`${player.name} descartó ${card.name} y ganó 3 monedas.`);
      return;
    }

    if (action.action.type === 'build_wonder_stage') {
      const wonder = WONDERS.find(w => w.id === player.wonderId)!;
      const stageIdx = player.wonderStagesBuilt;
      const stage = wonder.stages[stageIdx];

      // Apply trade: use explicit trade if provided, otherwise auto-apply computed
      const stageOpt = validateBuildWonderStage(player, left, right, wonder.stages);
      const wonderTrade = action.trade ?? stageOpt.tradeCost ?? null;
      if (wonderTrade) {
        player.coins -= wonderTrade.leftCoins + wonderTrade.rightCoins;
        left.coins += wonderTrade.leftCoins;
        right.coins += wonderTrade.rightCoins;
      }

      this.state.discardPile.push(card); // card used as stage marker goes face-down
      player.wonderStagesBuilt++;
      this.applyWonderStageEffects(player, stage);
      this.addLog(`${player.name} construyó la etapa ${stageIdx + 1} de su Maravilla.`);
      return;
    }

    if (action.action.type === 'build_structure') {
      const opt = validateBuildStructure(card, player, left, right);
      const isChainBuild = hasChain(player, card);

      // Consume Olympia free build only if it's not a free chain
      if (opt.isFree && !isChainBuild && player.freeBuildsLeft > 0) {
        player.freeBuildsLeft--;
      }

      if (!opt.isFree) {
        // Pay coins to bank
        if (card.cost.coins) player.coins -= card.cost.coins;

        // Apply trade: use explicit trade if provided, otherwise auto-apply computed trade
        const tradeToApply = action.trade ?? opt.tradeCost ?? null;
        if (tradeToApply) {
          player.coins -= tradeToApply.leftCoins + tradeToApply.rightCoins;
          left.coins += tradeToApply.leftCoins;
          right.coins += tradeToApply.rightCoins;
        }
      }

      player.builtStructures.push(card);
      this.applyCardEffects(player, card, left, right);
      this.addLog(`${player.name} construyó ${card.name}.`);
    }
  }

  private applyCardEffects(player: PlayerState, card: Card, left: PlayerState, right: PlayerState): void {
    for (const e of card.effects) {
      switch (e.type) {
        case 'coins': player.coins += e.amount; break;
        case 'shields': player.shields += e.count; break;
        case 'coins_from_brown': {
          const n = countColor(player, 'brown') +
            (e.include_neighbors ? countColor(left, 'brown') + countColor(right, 'brown') : 0);
          player.coins += e.per_brown * n;
          break;
        }
        case 'coins_from_gray': {
          const n = countColor(player, 'gray') +
            (e.include_neighbors ? countColor(left, 'gray') + countColor(right, 'gray') : 0);
          player.coins += e.per_gray * n;
          break;
        }
        case 'coins_from_yellow':
          player.coins += e.per_yellow * countColor(player, 'yellow');
          break;
        case 'coins_and_vp_from_brown':
          player.coins += e.per_card * countColor(player, 'brown');
          break;
        case 'coins_and_vp_from_gray':
          player.coins += e.per_card * countColor(player, 'gray');
          break;
        case 'coins_and_vp_from_yellow':
          player.coins += e.per_card * countColor(player, 'yellow');
          break;
        case 'coins_and_vp_from_wonder':
          player.coins += e.per_stage * player.wonderStagesBuilt;
          break;
        // produce_resource, produce_choice, trade_discount_*, etc. are read dynamically
      }
    }
  }

  private applyWonderStageEffects(player: PlayerState, stage: WonderStage): void {
    for (const effect of stage.effects) {
      if (effect.type === 'coins') player.coins += effect.amount;
      if (effect.type === 'shields') player.shields += effect.count;
      if (effect.type === 'free_build_per_age') player.freeBuildsLeft++;
      if (effect.type === 'build_from_discard') {
        // Suspend normal flow — player must pick a card from the discard pile
        this.state.phase = 'choose_from_discard';
        this.state.pendingDiscardPlayerId = player.id;
      }
      // produce_resource / produce_choice / copy_guild effects are read dynamically
    }
  }

  /** Halicarnaso etapa 2: build a card from discard pile for free. */
  buildFromDiscard(playerId: string, cardId: string): string | null {
    if (this.state.phase !== 'choose_from_discard') return 'Not in choose_from_discard phase';
    if (this.state.pendingDiscardPlayerId !== playerId) return 'Not your turn to choose from discard';

    const cardIdx = this.state.discardPile.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return 'Card not found in discard pile';

    const card = this.state.discardPile[cardIdx];
    const player = this.state.players.find(p => p.id === playerId)!;

    // Build the card for free
    this.state.discardPile.splice(cardIdx, 1);
    player.builtStructures.push(card);
    this.addLog(`${player.name} construyó ${card.name} desde el descarte (Halicarnaso).`);

    // Clear pending state
    this.state.pendingDiscardPlayerId = undefined;

    // Resume the turn flow that was interrupted in resolveAllActions
    if (this.state.turn === 6) {
      // End of age was pending
      this.endAge();
    } else {
      // Mid-age: pass hands and continue
      this.passHands();
      for (const p of this.state.players) {
        p.isReady = false;
        p.pendingAction = undefined;
      }
      this.state.turn++;
      this.state.phase = 'choose';
    }
    return null;
  }

  private passHands(): void {
    const { players, handDirection } = this.state;
    const n = players.length;
    const oldHands = players.map(p => [...p.hand]);

    if (handDirection === 'left') {
      // Pass to the left = player i gets hand from player (i+1) % n
      for (let i = 0; i < n; i++) {
        players[i].hand = oldHands[(i + 1) % n];
      }
    } else {
      // Pass to the right = player i gets hand from player (i-1+n) % n
      for (let i = 0; i < n; i++) {
        players[i].hand = oldHands[(i - 1 + n) % n];
      }
    }
  }

  private endAge(): void {
    resolveMilitary(this.state);

    if (this.state.age === 3) {
      this.state.phase = 'scoring';
      computeScores(this.state);
      this.addLog('¡Fin del juego! Puntajes finales calculados.');
    } else {
      this.state.age = (this.state.age + 1) as Age;
      // Re-grant Olympia free build for new age if player has stage 2 built
      for (const player of this.state.players) {
        const wonder = WONDERS.find(w => w.id === player.wonderId)!;
        const hasFreeBuild = wonder.stages
          .slice(0, player.wonderStagesBuilt)
          .some(s => s.effects.some(e => e.type === 'free_build_per_age'));
        player.freeBuildsLeft = hasFreeBuild ? 1 : 0;
      }
      this.state.phase = 'military';
      this.addLog(`Era ${this.state.age - 1} terminada. Batallas resueltas.`);
    }
  }

  /** Advance from 'military' display phase to next age. */
  startNextAge(): void {
    if (this.state.phase !== 'military') return;
    this.startAge();
  }

  private leftNeighbor(playerIdx: number): PlayerState {
    const n = this.state.players.length;
    return this.state.players[(playerIdx - 1 + n) % n];
  }

  private rightNeighbor(playerIdx: number): PlayerState {
    const n = this.state.players.length;
    return this.state.players[(playerIdx + 1) % n];
  }

  private addLog(msg: string): void {
    this.state.log.push(msg);
    if (this.state.log.length > 20) this.state.log.shift();
  }

  /** Generate a random valid action for a bot player. */
  getBotAction(playerId: string): PendingAction | null {
    if (this.state.phase !== 'choose') return null;
    const playerIdx = this.state.players.findIndex(p => p.id === playerId);
    if (playerIdx === -1) return null;
    const player = this.state.players[playerIdx];
    if (player.isReady) return null;

    const left  = this.leftNeighbor(playerIdx);
    const right = this.rightNeighbor(playerIdx);

    // Shuffle hand for randomness
    const hand = [...player.hand].sort(() => Math.random() - 0.5);

    // Try to build wonder stage first (25% chance if affordable)
    const wonder = WONDERS.find(w => w.id === player.wonderId)!;
    if (Math.random() < 0.25 && player.wonderStagesBuilt < wonder.stages.length) {
      const opt = validateBuildWonderStage(player, left, right, wonder.stages);
      if (opt.canBuild) {
        const trade = opt.tradeCost ? { leftCoins: opt.tradeCost.leftCoins, rightCoins: opt.tradeCost.rightCoins } : undefined;
        return { cardId: hand[0].id, action: { type: 'build_wonder_stage' }, trade };
      }
    }

    // Try to build a structure
    for (const card of hand) {
      const opt = validateBuildStructure(card, player, left, right);
      if (opt.canBuild) {
        const trade = opt.tradeCost ? { leftCoins: opt.tradeCost.leftCoins, rightCoins: opt.tradeCost.rightCoins } : undefined;
        return { cardId: card.id, action: { type: 'build_structure' }, trade };
      }
    }

    // Fallback: discard the first card
    return { cardId: hand[0].id, action: { type: 'discard' } };
  }
}

function countColor(player: PlayerState, color: string): number {
  return player.builtStructures.filter(c => c.color === color).length;
}

/** Factory: create a new GameState for a room ready to start. */
export function createGameState(
  roomId: string,
  players: { id: string; name: string; isBot?: boolean }[],
): GameState {
  const wonderIds = shuffle([...WONDERS.map(w => w.id)]).slice(0, players.length);

  const playerStates: PlayerState[] = players.map((p, i) => {
    const wonder = WONDERS.find(w => w.id === wonderIds[i])!;
    return {
      id: p.id,
      name: p.name,
      wonderId: wonder.id,
      wonderStagesBuilt: 0,
      coins: 3,
      hand: [],
      builtStructures: [],
      militaryTokens: [],
      shields: 0,
      isReady: false,
      pendingAction: undefined,
      tradeDiscounts: { left: [], right: [] },
      freeBuildsLeft: 0,
      isBot: p.isBot ?? false,
    };
  });

  const state: GameState = {
    roomId,
    age: 1,
    turn: 1,
    phase: 'waiting_for_players',
    handDirection: 'left',
    players: playerStates,
    discardPile: [],
    log: [],
  };

  return state;
}
