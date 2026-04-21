import { Card, CardEffect, PlayerState, PublicPlayerState, Resource, ResourceCost } from '@7wonders/shared';

type ResourcePool = Record<Resource, number>;
type ChoicePool = Resource[][];

const WONDER_STARTING: Record<string, Resource> = {
  colossus: 'ore',
  lighthouse: 'papyrus',
  temple: 'papyrus',
  babylon: 'clay',
  olympia: 'wood',
  halicarnassus: 'loom',
  giza: 'stone',
};

function emptyPool(): ResourcePool {
  return { wood: 0, stone: 0, clay: 0, ore: 0, glass: 0, loom: 0, papyrus: 0 };
}

function getFixedResources(player: PlayerState | PublicPlayerState): ResourcePool {
  const pool = emptyPool();
  const startRes = WONDER_STARTING[player.wonderId];
  if (startRes) pool[startRes]++;
  // Wonder stage production effects
  const stageProduction = WONDER_STAGE_PRODUCTION[player.wonderId] ?? [];
  for (let i = 0; i < player.wonderStagesBuilt; i++) {
    for (const eff of stageProduction[i] ?? []) {
      if (eff.fixed) pool[eff.fixed]++;
    }
  }
  for (const card of player.builtStructures) {
    for (const e of card.effects as CardEffect[]) {
      if (e.type === 'produce_resource') pool[e.resource]++;
    }
  }
  return pool;
}

function getChoiceResources(player: PlayerState | PublicPlayerState): ChoicePool {
  const choices: ChoicePool = [];
  // Wonder stage choice production effects
  const stageProduction = WONDER_STAGE_PRODUCTION[player.wonderId] ?? [];
  for (let i = 0; i < player.wonderStagesBuilt; i++) {
    for (const eff of stageProduction[i] ?? []) {
      if (eff.choice) choices.push(eff.choice);
    }
  }
  for (const card of player.builtStructures) {
    for (const e of card.effects as CardEffect[]) {
      if (e.type === 'produce_choice') choices.push(e.options as Resource[]);
    }
  }
  return choices;
}

function costToPool(cost: ResourceCost): ResourcePool {
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

function allZero(pool: ResourcePool): boolean {
  return Object.values(pool).every(v => v === 0);
}

function canCover(fixed: ResourcePool, choices: ChoicePool, needed: ResourcePool): boolean {
  const remaining: ResourcePool = { ...needed };
  for (const res of Object.keys(remaining) as Resource[]) {
    remaining[res] = Math.max(0, remaining[res] - fixed[res]);
  }
  if (allZero(remaining)) return true;
  if (choices.length === 0) return false;
  const [first, ...rest] = choices;
  for (const opt of first) {
    const nr = { ...remaining };
    if (nr[opt] > 0) nr[opt]--;
    if (canCover(emptyPool(), rest, nr)) return true;
  }
  return canCover(emptyPool(), rest, remaining);
}

function hasChain(player: PlayerState, card: Card): boolean {
  return player.builtStructures.some(c => c.chainTo?.includes(card.name));
}

function tradeCostFor(buyer: PlayerState, dir: 'left' | 'right', color: 'brown' | 'gray'): number {
  for (const card of buyer.builtStructures) {
    for (const e of card.effects as CardEffect[]) {
      if (
        (e.type === 'trade_discount_both' && e.resources.includes(color)) ||
        (dir === 'left' && e.type === 'trade_discount_left' && e.resources.includes(color)) ||
        (dir === 'right' && e.type === 'trade_discount_right' && e.resources.includes(color))
      ) return 1;
    }
  }
  return 2;
}

function getTradeableFixed(neighbor: PlayerState | PublicPlayerState): ResourcePool {
  const pool = emptyPool();
  const startRes = WONDER_STARTING[neighbor.wonderId];
  if (startRes) pool[startRes]++;
  for (const card of neighbor.builtStructures) {
    if (card.color !== 'brown' && card.color !== 'gray') continue;
    for (const e of card.effects as CardEffect[]) {
      if (e.type === 'produce_resource') pool[e.resource]++;
      if (e.type === 'produce_choice') {
        for (const opt of e.options) pool[opt as Resource]++;
      }
    }
  }
  return pool;
}

// Wonder stage costs (client-side copy so we don't need to round-trip to server)
const WONDER_STAGE_COSTS: Record<string, ResourceCost[]> = {
  colossus:      [{ ore: 2 }, { ore: 3 }, { ore: 4 }],
  lighthouse:    [{ stone: 2 }, { ore: 2, glass: 1 }, { glass: 2, papyrus: 1 }],
  temple:        [{ stone: 2 }, { papyrus: 2 }, { stone: 3, papyrus: 2 }],
  babylon:       [{ clay: 2 }, { clay: 3 }, { clay: 2, papyrus: 3 }],
  olympia:       [{ wood: 2 }, { loom: 2, stone: 1 }, { stone: 2, ore: 1 }],
  halicarnassus: [{ loom: 2 }, { ore: 3, loom: 1 }, { glass: 2, ore: 2 }],
  giza:          [{ stone: 2 }, { wood: 3 }, { stone: 4 }],
};

/**
 * Production granted by built wonder stages (mirrors wonders.ts on the server).
 * Each entry is an array of per-stage effects: 'fixed:wood', 'choice:wood/stone/...'
 */
const WONDER_STAGE_PRODUCTION: Record<string, Array<{ fixed?: Resource; choice?: Resource[] }[]>> = {
  colossus:      [[], [], []],
  lighthouse:    [[], [{ choice: ['wood', 'stone', 'clay', 'ore'] }], []],
  temple:        [[], [], []],
  babylon:       [[], [], []],
  olympia:       [[], [], []],
  halicarnassus: [[], [], []],
  giza:          [[], [], []],
};

export function getWonderStageCost(wonderId: string, stageIndex: number): ResourceCost | null {
  return WONDER_STAGE_COSTS[wonderId]?.[stageIndex] ?? null;
}

export interface Affordability {
  canBuild: boolean;
  isFree: boolean;           // chain or Olympia free build
  freeReason?: 'chain' | 'olympia'; // why it's free
  tradeCostTotal: number;    // 0 if own resources cover it
  leftCoins: number;         // coins paid to left neighbor
  rightCoins: number;        // coins paid to right neighbor
}

export interface WonderAffordability {
  canBuild: boolean;
  tradeCostTotal: number;
  leftCoins?: number;
  rightCoins?: number;
}

export function computeAffordability(
  card: Card,
  player: PlayerState,
  left: PlayerState | PublicPlayerState,
  right: PlayerState | PublicPlayerState,
): Affordability {
  // Already built?
  if (player.builtStructures.some(c => c.name === card.name)) {
    return { canBuild: false, isFree: false, tradeCostTotal: 0, leftCoins: 0, rightCoins: 0 };
  }

  // Free via chain
  if (hasChain(player, card)) {
    return { canBuild: true, isFree: true, freeReason: 'chain', tradeCostTotal: 0, leftCoins: 0, rightCoins: 0 };
  }

  // Free via Olympia
  if (player.freeBuildsLeft > 0) {
    return { canBuild: true, isFree: true, freeReason: 'olympia', tradeCostTotal: 0, leftCoins: 0, rightCoins: 0 };
  }

  const bankCoins = card.cost.coins ?? 0;
  if (player.coins < bankCoins) {
    return { canBuild: false, isFree: false, tradeCostTotal: 0, leftCoins: 0, rightCoins: 0 };
  }

  const needed = costToPool(card.cost);
  const fixed = getFixedResources(player);
  const choices = getChoiceResources(player);

  if (canCover(fixed, choices, needed)) {
    return { canBuild: true, isFree: false, tradeCostTotal: 0, leftCoins: 0, rightCoins: 0 };
  }

  // Compute trade cost (simplified: greedy own resources then trade)
  const remaining: ResourcePool = { ...needed };
  for (const res of Object.keys(remaining) as Resource[]) {
    remaining[res] = Math.max(0, remaining[res] - fixed[res]);
  }
  for (const choice of choices) {
    for (const opt of choice) {
      if (remaining[opt as Resource] > 0) { remaining[opt as Resource]--; break; }
    }
  }

  if (allZero(remaining)) {
    return { canBuild: true, isFree: false, tradeCostTotal: 0, leftCoins: 0, rightCoins: 0 };
  }

  const leftT = getTradeableFixed(left);
  const rightT = getTradeableFixed(right);
  let leftCoins = 0;
  let rightCoins = 0;

  for (const res of Object.keys(remaining) as Resource[]) {
    let need = remaining[res];
    if (need === 0) continue;
    const color: 'brown' | 'gray' = ['wood', 'stone', 'clay', 'ore'].includes(res) ? 'brown' : 'gray';
    const lc = tradeCostFor(player, 'left', color);
    const rc = tradeCostFor(player, 'right', color);

    while (need > 0) {
      if (leftT[res] > 0 && (lc <= rc || rightT[res] === 0)) {
        leftCoins += lc; leftT[res]--; need--;
      } else if (rightT[res] > 0) {
        rightCoins += rc; rightT[res]--; need--;
      } else {
        return { canBuild: false, isFree: false, tradeCostTotal: leftCoins + rightCoins, leftCoins, rightCoins };
      }
    }
  }

  const totalTrade = leftCoins + rightCoins;
  const totalCost = bankCoins + totalTrade;
  if (player.coins < totalCost) {
    return { canBuild: false, isFree: false, tradeCostTotal: totalTrade, leftCoins, rightCoins };
  }

  return { canBuild: true, isFree: false, tradeCostTotal: totalTrade, leftCoins, rightCoins };
}

export function computeWonderAffordability(
  wonderId: string,
  stageIndex: number,
  player: PlayerState,
  left: PlayerState | PublicPlayerState,
  right: PlayerState | PublicPlayerState,
): WonderAffordability {
  const stageCost = WONDER_STAGE_COSTS[wonderId]?.[stageIndex];
  if (!stageCost) return { canBuild: false, tradeCostTotal: 0 };

  const needed = costToPool(stageCost);
  const fixed = getFixedResources(player);
  const choices = getChoiceResources(player);

  if (canCover(fixed, choices, needed)) {
    return { canBuild: true, tradeCostTotal: 0 };
  }

  // Greedy trade calculation
  const remaining: ResourcePool = { ...needed };
  for (const res of Object.keys(remaining) as Resource[]) {
    remaining[res] = Math.max(0, remaining[res] - fixed[res]);
  }
  for (const choice of choices) {
    for (const opt of choice) {
      if (remaining[opt as Resource] > 0) { remaining[opt as Resource]--; break; }
    }
  }

  if (allZero(remaining)) return { canBuild: true, tradeCostTotal: 0 };

  const leftT = getTradeableFixed(left);
  const rightT = getTradeableFixed(right);
  let leftCoins = 0;
  let rightCoins = 0;

  for (const res of Object.keys(remaining) as Resource[]) {
    let need = remaining[res];
    if (need === 0) continue;
    const color: 'brown' | 'gray' = ['wood', 'stone', 'clay', 'ore'].includes(res) ? 'brown' : 'gray';
    const lc = tradeCostFor(player, 'left', color);
    const rc = tradeCostFor(player, 'right', color);

    while (need > 0) {
      if (leftT[res] > 0 && (lc <= rc || rightT[res] === 0)) {
        leftCoins += lc; leftT[res]--; need--;
      } else if (rightT[res] > 0) {
        rightCoins += rc; rightT[res]--; need--;
      } else {
        return { canBuild: false, tradeCostTotal: leftCoins + rightCoins, leftCoins, rightCoins };
      }
    }
  }

  const totalTrade = leftCoins + rightCoins;
  if (player.coins < totalTrade) return { canBuild: false, tradeCostTotal: totalTrade, leftCoins, rightCoins };
  return { canBuild: true, tradeCostTotal: totalTrade, leftCoins, rightCoins };
}
