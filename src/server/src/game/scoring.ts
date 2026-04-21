import { GameState, PlayerState, PlayerScore } from '@7wonders/shared';
import { WONDERS } from './wonders';

export function computeScores(state: GameState): PlayerScore[] {
  const scores = state.players.map((p, i) => scorePlayer(p, i, state));
  state.scores = scores;
  return scores;
}

function scorePlayer(player: PlayerState, playerIdx: number, state: GameState): PlayerScore {
  const n = state.players.length;
  const left = state.players[(playerIdx - 1 + n) % n];
  const right = state.players[(playerIdx + 1) % n];

  const military = player.militaryTokens.reduce((sum, t) => sum + t.value, 0);
  const treasury = Math.floor(player.coins / 3);

  const wonder = WONDERS.find(w => w.id === player.wonderId)!;
  let wonderVP = 0;
  for (let i = 0; i < player.wonderStagesBuilt; i++) {
    for (const e of wonder.stages[i].effects) {
      if (e.type === 'victory_points') wonderVP += e.points;
    }
  }

  let civilian = 0;
  for (const card of player.builtStructures) {
    if (card.color !== 'blue') continue;
    for (const e of card.effects) {
      if (e.type === 'victory_points') civilian += e.points;
    }
  }

  const science = computeScienceScore(player);

  let commercial = 0;
  for (const card of player.builtStructures) {
    if (card.color !== 'yellow') continue;
    for (const e of card.effects) {
      if (e.type === 'coins_and_vp_from_brown') {
        commercial += e.vp_per_card * countColor(player, 'brown');
      } else if (e.type === 'coins_and_vp_from_gray') {
        commercial += e.vp_per_card * countColor(player, 'gray');
      } else if (e.type === 'coins_and_vp_from_yellow') {
        commercial += e.vp_per_card * countColor(player, 'yellow');
      } else if (e.type === 'coins_and_vp_from_wonder') {
        commercial += e.vp_per_stage * player.wonderStagesBuilt;
      }
    }
  }

  const guilds = computeGuildScore(player, left, right);

  const total = military + treasury + wonderVP + civilian + science + commercial + guilds;

  return { playerId: player.id, playerName: player.name, military, treasury, wonder: wonderVP, civilian, science, commercial, guilds, total };
}

function computeScienceScore(player: PlayerState): number {
  const sym = { compass: 0, gear: 0, tablet: 0 };

  for (const card of player.builtStructures) {
    if (card.color !== 'green') continue;
    for (const e of card.effects) {
      if (e.type === 'science') sym[e.symbol]++;
    }
  }

  // extra_science_symbol from Scientists Guild (built card) or Babylon wonder stage
  let extras = player.builtStructures
    .flatMap(c => c.effects)
    .filter(e => e.type === 'extra_science_symbol').length;

  const wonder = WONDERS.find(w => w.id === player.wonderId)!;
  for (let i = 0; i < player.wonderStagesBuilt; i++) {
    extras += wonder.stages[i].effects.filter(e => e.type === 'extra_science_symbol').length;
  }

  for (let i = 0; i < extras; i++) {
    const best = bestScienceSymbol(sym);
    sym[best]++;
  }

  const sets = Math.min(sym.compass, sym.gear, sym.tablet);
  return sym.compass ** 2 + sym.gear ** 2 + sym.tablet ** 2 + sets * 7;
}

function bestScienceSymbol(sym: { compass: number; gear: number; tablet: number }): 'compass' | 'gear' | 'tablet' {
  // Adding 1 to each symbol: best choice maximises the score delta
  const delta = (s: 'compass' | 'gear' | 'tablet') => (sym[s] + 1) ** 2 - sym[s] ** 2;
  const keys = ['compass', 'gear', 'tablet'] as const;
  return keys.reduce((best, k) => delta(k) > delta(best) ? k : best, 'compass' as const);
}

/** Score a single guild card as if owned by `player` (used for copy_guild too). */
function scoreGuildCard(card: { name: string; effects: { type: string; [k: string]: any }[] }, player: PlayerState, left: PlayerState, right: PlayerState): number {
  if (card.name === 'Gremio de Armadores') {
    return player.builtStructures.filter(c =>
      c.color === 'brown' || c.color === 'gray' || c.color === 'purple'
    ).length;
  }
  let vp = 0;
  for (const e of card.effects) {
    switch (e.type) {
      case 'vp_from_brown_neighbors':
        vp += e.per_card * (countColor(left, 'brown') + countColor(right, 'brown')); break;
      case 'vp_from_gray_neighbors':
        vp += e.per_card * (countColor(left, 'gray') + countColor(right, 'gray')); break;
      case 'vp_from_yellow_neighbors':
        vp += e.per_card * (countColor(left, 'yellow') + countColor(right, 'yellow')); break;
      case 'vp_from_blue_neighbors':
        vp += e.per_card * (countColor(left, 'blue') + countColor(right, 'blue')); break;
      case 'vp_from_red_neighbors':
        vp += e.per_card * (countColor(left, 'red') + countColor(right, 'red')); break;
      case 'vp_from_green_neighbors':
        vp += e.per_card * (countColor(left, 'green') + countColor(right, 'green')); break;
      case 'vp_from_wonder_stages': {
        const n = left.wonderStagesBuilt + right.wonderStagesBuilt +
          (e.include_self ? player.wonderStagesBuilt : 0);
        vp += n; break;
      }
      case 'vp_from_defeat_tokens_neighbors':
        vp += left.militaryTokens.filter(t => t.value < 0).length +
              right.militaryTokens.filter(t => t.value < 0).length;
        break;
    }
  }
  return vp;
}

function computeGuildScore(player: PlayerState, left: PlayerState, right: PlayerState): number {
  let score = 0;

  for (const card of player.builtStructures) {
    if (card.color !== 'purple') continue;
    score += scoreGuildCard(card, player, left, right);
  }

  // Halicarnaso etapa 3: copy_guild — score the best guild from neighbors automatically
  const wonder = WONDERS.find(w => w.id === player.wonderId)!;
  const hasCopyGuild = wonder.stages
    .slice(0, player.wonderStagesBuilt)
    .some(s => s.effects.some(e => e.type === 'copy_guild'));

  if (hasCopyGuild) {
    const neighborGuilds = [
      ...left.builtStructures.filter(c => c.color === 'purple'),
      ...right.builtStructures.filter(c => c.color === 'purple'),
    ];
    if (neighborGuilds.length > 0) {
      const best = Math.max(...neighborGuilds.map(g => scoreGuildCard(g, player, left, right)));
      score += best;
    }
  }

  return score;
}

function countColor(player: PlayerState, color: string): number {
  return player.builtStructures.filter(c => c.color === color).length;
}
