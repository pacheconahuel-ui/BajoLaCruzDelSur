import { Card, PlayerState, WonderStage } from '@7wonders/shared';
import {
  getFixedResources,
  getChoiceResources,
  canCoverWithOwnResources,
  computeTradeCost,
  costToPool,
} from './resourceCalculator';

export interface BuildOption {
  canBuild: boolean;
  isFree: boolean;       // chain or Olympia free build
  coinCostToBank: number;
  tradeCost?: { leftCoins: number; rightCoins: number; totalCoins: number };
  reason?: string;
}

export interface WonderBuildOption {
  canBuild: boolean;
  stageIndex: number;    // 0-based index of next stage to build
  coinCostToBank: number;
  tradeCost?: { leftCoins: number; rightCoins: number; totalCoins: number };
  reason?: string;
}

/**
 * Returns whether the player already has a structure with the given name.
 * 7 Wonders rules: you can never build two structures with the same name.
 */
export function alreadyBuilt(player: PlayerState, cardName: string): boolean {
  return player.builtStructures.some(c => c.name === cardName);
}

/**
 * Returns whether any built structure chains into this card.
 * Uses the chainTo arrays of built structures — supports multiple predecessors.
 */
export function hasChain(player: PlayerState, card: Card): boolean {
  return player.builtStructures.some(c => c.chainTo?.includes(card.name));
}

/**
 * Full validation: can this player build this card?
 * Considers: already built, chain, Olympia free build, own resources, trade.
 */
export function validateBuildStructure(
  card: Card,
  player: PlayerState,
  leftNeighbor: PlayerState,
  rightNeighbor: PlayerState,
): BuildOption {
  if (alreadyBuilt(player, card.name)) {
    return { canBuild: false, isFree: false, coinCostToBank: 0, reason: 'Already built' };
  }

  // Free via chain
  if (hasChain(player, card)) {
    return { canBuild: true, isFree: true, coinCostToBank: 0 };
  }

  // Free via Olympia wonder stage 2
  if (player.freeBuildsLeft > 0) {
    return { canBuild: true, isFree: true, coinCostToBank: 0 };
  }

  const needed = costToPool(card.cost);

  // Aónikenk pasiva: cartas verdes de Era 1 cuestan -1 unidad de recurso
  if (player.wonderId === 'babylon' && card.color === 'green' && card.age === 1) {
    const resOrder: (keyof typeof needed)[] = ['wood', 'stone', 'clay', 'ore', 'glass', 'loom', 'papyrus'];
    for (const res of resOrder) {
      if (needed[res] > 0) { needed[res]--; break; }
    }
  }

  const bankCoins = card.cost.coins ?? 0;

  // Check if player can afford bank coin payment
  if (player.coins < bankCoins) {
    return { canBuild: false, isFree: false, coinCostToBank: bankCoins, reason: 'Not enough coins' };
  }

  // costToPool already excludes coins — use needed directly
  const fixed = getFixedResources(player);
  const choices = getChoiceResources(player);

  // Can cover entirely with own resources?
  if (canCoverWithOwnResources(fixed, choices, needed)) {
    return { canBuild: true, isFree: false, coinCostToBank: bankCoins };
  }

  // Try with trade
  const trade = computeTradeCost(player, leftNeighbor, rightNeighbor, needed);
  if (trade !== null && player.coins >= bankCoins + trade.totalCoins) {
    return {
      canBuild: true,
      isFree: false,
      coinCostToBank: bankCoins,
      tradeCost: trade,
    };
  }

  return { canBuild: false, isFree: false, coinCostToBank: bankCoins, reason: 'Not enough resources' };
}

/**
 * Can this player build the next wonder stage?
 */
export function validateBuildWonderStage(
  player: PlayerState,
  leftNeighbor: PlayerState,
  rightNeighbor: PlayerState,
  wonderStages: WonderStage[],
): WonderBuildOption {
  const stageIndex = player.wonderStagesBuilt;
  if (stageIndex >= wonderStages.length) {
    return { canBuild: false, stageIndex, coinCostToBank: 0, reason: 'Wonder complete' };
  }

  const stage = wonderStages[stageIndex];
  const needed = costToPool(stage.cost);
  const fixed = getFixedResources(player);
  const choices = getChoiceResources(player);

  if (canCoverWithOwnResources(fixed, choices, needed)) {
    return { canBuild: true, stageIndex, coinCostToBank: 0 };
  }

  const trade = computeTradeCost(player, leftNeighbor, rightNeighbor, needed);
  if (trade !== null && player.coins >= trade.totalCoins) {
    return { canBuild: true, stageIndex, coinCostToBank: 0, tradeCost: trade };
  }

  return { canBuild: false, stageIndex, coinCostToBank: 0, reason: 'Not enough resources' };
}
