import { Card, Resource, ResourceCost, PlayerState } from '@7wonders/shared';
import { WONDERS } from './wonders';

export type ResourcePool = Record<Resource, number>;
export type ChoicePool = Resource[][];  // each entry = one card offering a choice

function emptyPool(): ResourcePool {
  return { wood: 0, stone: 0, clay: 0, ore: 0, glass: 0, loom: 0, papyrus: 0 };
}

/** Fixed resources produced by a player (from wonder starting resource + fixed-produce cards). */
export function getFixedResources(player: PlayerState): ResourcePool {
  const pool = emptyPool();

  // Wonder starting resource
  const wonder = WONDERS.find(w => w.id === player.wonderId);
  if (wonder) pool[wonder.startingResource]++;

  // Ñuke Mapu pasiva: +1 piedra adicional al recurso inicial
  if (player.wonderId === 'giza') pool.stone++;

  // Wonder stage effects (stages built)
  for (let i = 0; i < player.wonderStagesBuilt; i++) {
    const stage = wonder?.stages[i];
    if (!stage) continue;
    for (const effect of stage.effects) {
      if (effect.type === 'produce_resource') pool[effect.resource]++;
    }
  }

  // Built structure effects
  for (const card of player.builtStructures) {
    for (const effect of card.effects) {
      if (effect.type === 'produce_resource') pool[effect.resource]++;
    }
  }

  return pool;
}

/** Choice-producing cards for a player (each entry is a set of options). */
export function getChoiceResources(player: PlayerState): ChoicePool {
  const choices: ChoicePool = [];

  // Wonder stage choice effects
  const wonder = WONDERS.find(w => w.id === player.wonderId);
  for (let i = 0; i < player.wonderStagesBuilt; i++) {
    const stage = wonder?.stages[i];
    if (!stage) continue;
    for (const effect of stage.effects) {
      if (effect.type === 'produce_choice') choices.push(effect.options as Resource[]);
    }
  }

  for (const card of player.builtStructures) {
    for (const effect of card.effects) {
      if (effect.type === 'produce_choice') choices.push(effect.options as Resource[]);
    }
  }

  return choices;
}

/**
 * Determines if a player can cover a given resource cost purely with their own production
 * (fixed + choices), without any trade.
 *
 * Uses a recursive backtracking approach to try all possible choice assignments.
 * This handles the "1 Clay OR 1 Ore" optional resource correctly.
 */
export function canCoverWithOwnResources(
  fixed: ResourcePool,
  choices: ChoicePool,
  needed: ResourcePool,
): boolean {
  // Compute remaining needs after applying fixed resources
  const remaining: ResourcePool = { ...needed };
  for (const res of Object.keys(remaining) as Resource[]) {
    remaining[res] = Math.max(0, remaining[res] - fixed[res]);
  }

  if (allZero(remaining)) return true;
  if (choices.length === 0) return false;

  // Try each option for the first choice card, recurse for the rest
  const [first, ...rest] = choices;
  for (const option of first) {
    const newRemaining = { ...remaining };
    if (newRemaining[option] > 0) newRemaining[option]--;
    if (canCoverWithOwnResources(emptyPool(), rest, newRemaining)) return true;
  }
  // Also try not using this choice (if the option doesn't help)
  return canCoverWithOwnResources(emptyPool(), rest, remaining);
}

function allZero(pool: ResourcePool): boolean {
  return Object.values(pool).every(v => v === 0);
}

/**
 * Returns the tradeable resources (brown + gray) available from a neighbor.
 * Yellow card production and wonder non-tradeable resources are excluded.
 */
export function getTradeableResources(neighbor: PlayerState): ResourcePool {
  const pool = emptyPool();

  // Wonder starting resource is tradeable
  const wonder = WONDERS.find(w => w.id === neighbor.wonderId);
  if (wonder) pool[wonder.startingResource]++;

  for (const card of neighbor.builtStructures) {
    if (card.color !== 'brown' && card.color !== 'gray') continue;
    for (const effect of card.effects) {
      if (effect.type === 'produce_resource') pool[effect.resource]++;
      // Choice resources from brown/gray are tradeable
      if (effect.type === 'produce_choice') {
        // We count each choice option as 1 potential unit for commerce display purposes.
        // Actual trade resolution picks the option dynamically.
        for (const opt of effect.options) pool[opt]++;
      }
    }
  }

  return pool;
}

/**
 * Cost per resource unit when buying from a specific neighbor direction.
 * Base cost is 2. East/West Trading Post and Marketplace reduce it to 1.
 */
export function tradeCostFor(
  buyer: PlayerState,
  direction: 'left' | 'right',
  resourceColor: 'brown' | 'gray',
): number {
  // Kawésqar pasiva: recursos marrones cuestan 1 moneda (recursos grises precio normal)
  const base = (buyer.wonderId === 'colossus' && resourceColor === 'brown') ? 1 : 2;

  for (const card of buyer.builtStructures) {
    for (const effect of card.effects) {
      if (
        (effect.type === 'trade_discount_both' && effect.resources.includes(resourceColor)) ||
        (direction === 'left' && effect.type === 'trade_discount_left' && effect.resources.includes(resourceColor)) ||
        (direction === 'right' && effect.type === 'trade_discount_right' && effect.resources.includes(resourceColor))
      ) {
        return 1;
      }
    }
  }
  return base;
}

/**
 * Given a needed resource cost, compute the minimum coin cost to trade
 * for missing resources from left and right neighbors, considering discounts.
 *
 * Returns null if it's impossible even with full trading.
 * Returns { leftCoins, rightCoins, possible } otherwise.
 */
export function computeTradeCost(
  buyer: PlayerState,
  leftNeighbor: PlayerState,
  rightNeighbor: PlayerState,
  neededCost: ResourcePool,
): { leftCoins: number; rightCoins: number; totalCoins: number } | null {
  const fixed = getFixedResources(buyer);
  const choices = getChoiceResources(buyer);

  // Work out what's still needed after own production
  const remaining: ResourcePool = { ...neededCost };

  // Try to satisfy as much as possible with own production first (greedy)
  for (const res of Object.keys(remaining) as Resource[]) {
    const own = Math.min(remaining[res], fixed[res]);
    remaining[res] -= own;
  }

  // Apply choices greedily to remaining needs
  for (const choice of choices) {
    for (const opt of choice) {
      if (remaining[opt] > 0) {
        remaining[opt]--;
        break;
      }
    }
  }

  if (allZero(remaining)) return { leftCoins: 0, rightCoins: 0, totalCoins: 0 };

  const leftTradeable = getTradeableResources(leftNeighbor);
  const rightTradeable = getTradeableResources(rightNeighbor);

  // Try to buy remaining from neighbors (prefer cheaper neighbor first)
  let leftCoins = 0;
  let rightCoins = 0;

  for (const res of Object.keys(remaining) as Resource[]) {
    let need = remaining[res];
    if (need === 0) continue;

    const resColor: 'brown' | 'gray' =
      ['wood', 'stone', 'clay', 'ore'].includes(res) ? 'brown' : 'gray';

    const leftCost = tradeCostFor(buyer, 'left', resColor);
    const rightCost = tradeCostFor(buyer, 'right', resColor);

    // Buy from cheaper side first; if equal, prefer left
    const preferLeft = leftCost <= rightCost;

    // First try preferred neighbor
    if (preferLeft) {
      const canBuyLeft = Math.min(need, leftTradeable[res]);
      leftCoins += canBuyLeft * leftCost;
      leftTradeable[res] -= canBuyLeft;
      need -= canBuyLeft;
    } else {
      const canBuyRight = Math.min(need, rightTradeable[res]);
      rightCoins += canBuyRight * rightCost;
      rightTradeable[res] -= canBuyRight;
      need -= canBuyRight;
    }

    // Then try other neighbor for remainder
    if (need > 0) {
      if (preferLeft) {
        const canBuyRight = Math.min(need, rightTradeable[res]);
        rightCoins += canBuyRight * rightCost;
        rightTradeable[res] -= canBuyRight;
        need -= canBuyRight;
      } else {
        const canBuyLeft = Math.min(need, leftTradeable[res]);
        leftCoins += canBuyLeft * leftCost;
        leftTradeable[res] -= canBuyLeft;
        need -= canBuyLeft;
      }
    }

    if (need > 0) return null; // impossible to cover this resource
  }

  return { leftCoins, rightCoins, totalCoins: leftCoins + rightCoins };
}

/** Convert a ResourceCost to a ResourcePool (zeroing undefined fields). */
export function costToPool(cost: ResourceCost): ResourcePool {
  return {
    wood: cost.wood ?? 0,
    stone: cost.stone ?? 0,
    clay: cost.clay ?? 0,
    ore: cost.ore ?? 0,
    glass: cost.glass ?? 0,
    loom: cost.loom ?? 0,
    papyrus: cost.papyrus ?? 0,
  };
}
