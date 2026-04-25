import { GameState, MilitaryToken } from '@7wonders/shared';

export function resolveMilitary(state: GameState): void {
  const { players, age } = state;
  const n = players.length;
  const victoryValue = age === 1 ? 1 : age === 2 ? 3 : 5;

  for (let i = 0; i < n; i++) {
    const player = players[i];
    const left = players[(i - 1 + n) % n];
    const right = players[(i + 1) % n];

    for (const neighbor of [left, right]) {
      let token: MilitaryToken;
      if (player.shields > neighbor.shields) {
        token = { age, value: victoryValue as 1 | 3 | 5 };
      } else if (player.shields < neighbor.shields) {
        // Rankül pasiva: derrota militar vale 0 en lugar de -1
        token = { age, value: player.wonderId === 'halicarnassus' ? 0 : -1 };
      } else {
        continue; // tie → no token
      }
      player.militaryTokens.push(token);
    }
  }
}
