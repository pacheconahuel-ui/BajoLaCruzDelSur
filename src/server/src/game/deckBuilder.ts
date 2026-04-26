import { Card } from '@7wonders/shared';
import { AGE1_CARDS, AGE2_CARDS, AGE3_CARDS } from './cards';

/** Fisher-Yates shuffle (in-place). */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build the deck for a given age and player count.
 * Age III: guilds are filtered to exactly playerCount + 2 random cards.
 * Result: always exactly playerCount × 7 cards.
 *
 * Each entry in a card's minPlayers array contributes ONE copy of that card
 * (e.g. minPlayers:[3,5] → 1 copy for 3-4p, 2 copies for 5+p).
 */
export function buildAgeDeck(age: 1 | 2 | 3, playerCount: number): Card[] {
  const allCards = age === 1 ? AGE1_CARDS : age === 2 ? AGE2_CARDS : AGE3_CARDS;
  const target = playerCount * 7;

  // flatMap: one copy per qualifying minPlayers entry (gives unique IDs for dupes)
  const eligible = allCards.flatMap(c => {
    const copies = c.minPlayers.filter(min => playerCount >= min);
    return copies.map((_, idx) =>
      idx === 0 ? { ...c } : { ...c, id: `${c.id}_c${idx}` }
    );
  });

  if (age === 3) {
    const guilds = eligible.filter(c => c.color === 'purple');
    const nonGuilds = eligible.filter(c => c.color !== 'purple');

    shuffle(guilds);
    const selectedGuilds = guilds.slice(0, Math.min(playerCount + 2, guilds.length));

    const deck = [...nonGuilds, ...selectedGuilds];
    shuffle(deck);
    return ensureSize(deck, target);
  }

  shuffle(eligible);
  return ensureSize(eligible, target);
}

/**
 * Guarantee exactly `target` cards.
 * Trims if there are too many; pads with cycled copies (unique IDs) if too few.
 */
function ensureSize(deck: Card[], target: number): Card[] {
  if (deck.length === target) return deck;
  if (deck.length > target) return deck.slice(0, target);

  // Undercount — pad by cycling through the deck with suffixed IDs
  const result = [...deck];
  let cycle = 1;
  for (let i = 0; result.length < target; i++) {
    const src = deck[i % deck.length];
    if (i > 0 && i % deck.length === 0) cycle++;
    result.push({ ...src, id: `${src.id}_x${cycle}` });
  }
  return result;
}

/**
 * Deal cards from the deck into hands of exactly 7 for each player.
 */
export function dealHands(deck: Card[], playerCount: number): Card[][] {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  for (let i = 0; i < deck.length; i++) {
    hands[i % playerCount].push(deck[i]);
  }
  return hands;
}
