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
      // Selk'nam pasiva: 1 construcción gratis por era (sin necesitar construir el hito)
      if (players[i].wonderId === 'olympia') players[i].freeBuildsLeft++;
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

    // If all players ready, enter 'reveal' phase so clients can show a brief reveal moment.
    // The handler is responsible for calling applyRevealedActions() after the display delay.
    if (this.state.players.every(p => p.isReady)) {
      this.state.phase = 'reveal';
    }

    return null;
  }

  /** Apply all pending actions and advance the turn (called after the reveal display delay). */
  applyRevealedActions(): void {
    if (this.state.phase !== 'reveal') return;
    this.resolveAllActions();
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

  /** Apply all pending actions, pass hands, and advance the turn. Phase must be 'reveal'. */
  private resolveAllActions(): void {
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
    if ((this.state.phase as string) === 'choose_from_discard') {
      // On turn 6, hands are finished — discard them all before the pick
      // On turns 1-5, hands are NOT discarded; they will be passed to neighbors after the pick
      if (this.state.turn === 6) {
        for (const player of this.state.players) {
          if (player.hand.length > 0) {
            this.state.discardPile.push(...player.hand);
            player.hand = [];
          }
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

      // Always recompute trade server-side (ignore client-provided trade to prevent cheating)
      const stageOpt = validateBuildWonderStage(player, left, right, wonder.stages);
      if (stageOpt.tradeCost) {
        player.coins -= stageOpt.tradeCost.leftCoins + stageOpt.tradeCost.rightCoins;
        left.coins += stageOpt.tradeCost.leftCoins;
        right.coins += stageOpt.tradeCost.rightCoins;
      }

      this.state.discardPile.push(card); // card used as stage marker goes face-down
      player.wonderStagesBuilt++;
      this.applyWonderStageEffects(player, stage);
      // Yámana pasiva: +1 moneda al construir cada etapa del hito
      if (player.wonderId === 'temple') player.coins++;
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

        // Always recompute trade server-side (ignore client-provided trade to prevent cheating)
        if (opt.tradeCost) {
          player.coins -= opt.tradeCost.leftCoins + opt.tradeCost.rightCoins;
          left.coins += opt.tradeCost.leftCoins;
          right.coins += opt.tradeCost.rightCoins;
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
        // coins_and_vp_from_* are end-of-game effects — coins applied in applyEndGameCoins()
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

  /** Halicarnaso etapa 2: skip picking (only valid when discard pile is empty). */
  skipDiscardPick(playerId: string): string | null {
    if (this.state.phase !== 'choose_from_discard') return 'Not in choose_from_discard phase';
    if (this.state.pendingDiscardPlayerId !== playerId) return 'Not your turn to choose from discard';
    if (this.state.discardPile.length > 0) return 'Discard pile is not empty — you must pick a card';

    this.state.pendingDiscardPlayerId = undefined;
    this.addLog(`${this.state.players.find(p => p.id === playerId)?.name ?? playerId} no pudo construir desde el descarte (pila vacía).`);

    if (this.state.turn === 6) {
      this.endAge();
    } else {
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

  /** Halicarnaso etapa 2: build a card from discard pile for free. */
  buildFromDiscard(playerId: string, cardId: string): string | null {
    if (this.state.phase !== 'choose_from_discard') return 'Not in choose_from_discard phase';
    if (this.state.pendingDiscardPlayerId !== playerId) return 'Not your turn to choose from discard';

    const cardIdx = this.state.discardPile.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return 'Card not found in discard pile';

    const card = this.state.discardPile[cardIdx];
    const player = this.state.players.find(p => p.id === playerId)!;

    // Build the card for free (effects must still apply)
    this.state.discardPile.splice(cardIdx, 1);
    player.builtStructures.push(card);
    const playerIdx = this.state.players.findIndex(p => p.id === playerId);
    this.applyCardEffects(player, card, this.leftNeighbor(playerIdx), this.rightNeighbor(playerIdx));
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
    const completedAge = this.state.age;
    resolveMilitary(this.state);

    // Record which age just resolved (used by client MilitaryDisplay)
    this.state.militaryAge = completedAge;

    if (this.state.age === 3) {
      // Show age 3 military display before scoring (startNextAge will compute scores)
      this.state.phase = 'military';
      this.addLog('Era 3 terminada. Batallas finales resueltas.');
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
      this.addLog(`Era ${completedAge} terminada. Batallas resueltas.`);
    }
  }

  /** Advance from 'military' display phase: start next age or compute final scores. */
  startNextAge(): void {
    if (this.state.phase !== 'military') return;
    if (this.state.age === 3) {
      // Age 3 military display done → apply end-of-game commercial coins then score
      this.state.phase = 'scoring';
      this.applyEndGameCoins();
      computeScores(this.state);
      this.addLog('¡Fin del juego! Puntajes finales calculados.');
    } else {
      this.startAge();
    }
  }

  /**
   * Apply end-of-game coin awards from commercial cards (Haven, Lighthouse,
   * Chamber of Commerce, Arena). These count final board state, not build-time state.
   */
  private applyEndGameCoins(): void {
    const n = this.state.players.length;
    this.state.players.forEach((player, i) => {
      const left = this.state.players[(i - 1 + n) % n];
      const right = this.state.players[(i + 1) % n];
      for (const card of player.builtStructures) {
        for (const e of card.effects) {
          switch (e.type) {
            case 'coins_and_vp_from_brown':
              player.coins += e.per_card * countColor(player, 'brown'); break;
            case 'coins_and_vp_from_gray':
              // Chamber of Commerce: counts NEIGHBORS' gray cards (not own)
              player.coins += e.per_card * (countColor(left, 'gray') + countColor(right, 'gray')); break;
            case 'coins_and_vp_from_yellow':
              player.coins += e.per_card * countColor(player, 'yellow'); break;
            case 'coins_and_vp_from_wonder':
              player.coins += e.per_stage * player.wonderStagesBuilt; break;
          }
        }
      }
    });
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
    if (this.state.log.length > 40) this.state.log.shift();
  }

  /** Generate a strategic action for a bot player. */
  getBotAction(playerId: string): PendingAction | null {
    if (this.state.phase !== 'choose') return null;
    const playerIdx = this.state.players.findIndex(p => p.id === playerId);
    if (playerIdx === -1) return null;
    const player = this.state.players[playerIdx];
    if (player.isReady) return null;

    const left  = this.leftNeighbor(playerIdx);
    const right = this.rightNeighbor(playerIdx);
    const wonder = WONDERS.find(w => w.id === player.wonderId)!;
    const age = this.state.age;

    // Count existing science symbols for synergy bonus
    const sciCounts = { compass: 0, gear: 0, tablet: 0 };
    for (const c of player.builtStructures) {
      for (const e of c.effects) {
        if (e.type === 'science') sciCounts[e.symbol as keyof typeof sciCounts]++;
      }
    }
    // Existing shields for threat assessment
    // Rankül (halicarnassus): defeats cost 0 VP, so military losses don't matter
    const myShields = player.shields;
    const leftShields = left.shields;
    const rightShields = right.shields;
    const threatBonus = (player.wonderId !== 'halicarnassus' && (myShields <= leftShields || myShields <= rightShields)) ? 3 : 0;

    // Cards already in the chain pipeline (have a chainTo card in the hand)
    const handNames = new Set(player.hand.map(c => c.name));
    const chainsToHandCard = (card: Card): boolean =>
      (card.chainTo ?? []).some(name => handNames.has(name));

    // Score each card's strategic value (higher = prefer it)
    const cardValue = (card: Card): number => {
      let v = 0;
      for (const e of card.effects) {
        switch (e.type) {
          case 'victory_points':
            v += e.points * (age === 3 ? 4 : 3);
            break;
          case 'shields':
            // Extra value if we're losing to a neighbor
            v += e.count * ((age === 3 ? 4 : 3) + threatBonus);
            break;
          case 'science': {
            // Quadratic scoring: value depends on current count of this symbol
            const sym = e.symbol as keyof typeof sciCounts;
            const cur = sciCounts[sym];
            const marginalVP = (cur + 1) ** 2 - cur ** 2; // marginal VP from +1 of this type
            const setBonus = (cur === Math.min(sciCounts.compass, sciCounts.gear, sciCounts.tablet)) ? 7 : 0;
            v += (marginalVP + setBonus) * 1.5;
            break;
          }
          case 'produce_resource': v += age === 1 ? 6 : 3; break;
          case 'produce_choice':   v += age === 1 ? 5 : 2; break;
          case 'coins':            v += e.amount * 1.5; break;
          case 'coins_and_vp_from_brown':
          case 'coins_and_vp_from_gray':
          case 'coins_and_vp_from_yellow':
          case 'coins_and_vp_from_wonder': v += age === 3 ? 6 : 4; break;
          case 'trade_discount_left':
          case 'trade_discount_right':
          // Kawésqar: brown resources already cost 1 — trade cards less valuable
          case 'trade_discount_both': {
            const baseTrade = age === 1 ? 5 : (age === 2 ? 3 : 1);
            v += (player.wonderId === 'colossus') ? Math.max(1, baseTrade - 2) : baseTrade;
            break;
          }
          case 'extra_science_symbol': v += 12; break;
          // Guild cards: use simple VP estimate
          case 'vp_from_brown_neighbors':
          case 'vp_from_gray_neighbors':
          case 'vp_from_yellow_neighbors':
          case 'vp_from_blue_neighbors':
          case 'vp_from_red_neighbors':
          case 'vp_from_green_neighbors':
          case 'vp_from_wonder_stages':
          case 'vp_from_defeat_tokens_neighbors':
          case 'vp_from_own_brown_gray_purple': v += 6; break;
          default: v += 1;
        }
      }
      // Bonus if this card enables a chain for a card we could play later
      if (chainsToHandCard(card)) v += 4;
      // Slight randomness so bots aren't identical
      v += Math.random() * 2;
      return v;
    };

    // Collect affordable structures sorted by value (descending)
    const affordable: { card: Card; trade?: TradeDecision }[] = [];
    for (const card of player.hand) {
      const opt = validateBuildStructure(card, player, left, right);
      if (opt.canBuild) {
        const trade = opt.tradeCost
          ? { leftCoins: opt.tradeCost.leftCoins, rightCoins: opt.tradeCost.rightCoins }
          : undefined;
        affordable.push({ card, trade });
      }
    }
    affordable.sort((a, b) => cardValue(b.card) - cardValue(a.card));

    // Try to build wonder stage
    if (player.wonderStagesBuilt < wonder.stages.length) {
      const opt = validateBuildWonderStage(player, left, right, wonder.stages);
      if (opt.canBuild) {
        const trade = opt.tradeCost
          ? { leftCoins: opt.tradeCost.leftCoins, rightCoins: opt.tradeCost.rightCoins }
          : undefined;
        const topCardValue = affordable.length > 0 ? cardValue(affordable[0].card) : 0;
        const stageIdx = player.wonderStagesBuilt;
        const stage = wonder.stages[stageIdx];
        // Estimate the wonder stage value
        let stageValue = 0;
        for (const e of stage.effects) {
          if (e.type === 'victory_points') stageValue += e.points * (age === 3 ? 4 : 3);
          else if (e.type === 'shields') stageValue += e.count * ((age === 3 ? 5 : 3) + threatBonus);
          else if (e.type === 'coins') stageValue += e.amount;
          else if (e.type === 'extra_science_symbol') stageValue += 12;
          else if (e.type === 'free_build_per_age') stageValue += (age === 1 ? 10 : 6);
          else if (e.type === 'build_from_discard') stageValue += 8;
          else if (e.type === 'copy_guild') stageValue += 7;
          else if (e.type === 'produce_choice') stageValue += age === 1 ? 6 : 3;
          else stageValue += 3;
        }
        // Yámana (temple): each wonder stage gives +1 coin as a bonus
        if (player.wonderId === 'temple') stageValue += 1;
        // Build wonder stage if it's more valuable than best available card, or 15% chance
        if (stageValue >= topCardValue || Math.random() < 0.15) {
          // Sacrifice the least valuable card in hand
          const sacrifice = [...player.hand].sort((a, b) => cardValue(a) - cardValue(b))[0];
          return { cardId: sacrifice.id, action: { type: 'build_wonder_stage' }, trade };
        }
      }
    }

    // Build the highest-value affordable structure
    if (affordable.length > 0) {
      const { card, trade } = affordable[0];
      return { cardId: card.id, action: { type: 'build_structure' }, trade };
    }

    // Fallback: discard the card with the least value
    const worstCard = [...player.hand].sort((a, b) => cardValue(a) - cardValue(b))[0];
    return { cardId: worstCard.id, action: { type: 'discard' } };
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
    // Günün-a-Künna pasiva: +1 moneda inicial
    const startingCoins = wonder.id === 'lighthouse' ? 4 : 3;
    return {
      id: p.id,
      name: p.name,
      wonderId: wonder.id,
      wonderStagesBuilt: 0,
      coins: startingCoins,
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
