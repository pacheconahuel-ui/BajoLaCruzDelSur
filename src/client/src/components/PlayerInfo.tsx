import { PublicPlayerState, CardEffect, MilitaryToken } from '@7wonders/shared';

// Wonder stage fixed VPs (client-side copy matching wonders.ts).
// Dynamic effects (vp_from_own_color, extra_science_symbol, produce_*, shields, coins) count as 0 here
// since they're excluded from this rough mid-game estimate anyway.
const WONDER_STAGE_VP: Record<string, number[]> = {
  colossus:      [0, 5, 7],   // +wood, 5★, 7★
  lighthouse:    [0, 0, 7],   // +4💰, 2★/🟡(dynamic), 7★
  temple:        [0, 0, 7],   // +🪨/⚙️ (🔥+3💰+carta), 🧪 libre (🔥), 7★ (🔥)
  babylon:       [0, 0, 7],   // 🛡, 🛡🛡, 7★ — rec. inicial: Obsidiana (⚙️)
  olympia:       [3, 0, 7],   // 3★, 🧪 libre, 7★
  halicarnassus: [0, 0, 7],   // +3💰, ♻ del descarte, 7★
  giza:          [0, 5, 7],   // +🪨, 5★, 7★
};

/** Quick visible-point estimate (excludes science, guilds, and commercial-VP cards). */
function estimateScore(p: PublicPlayerState): number {
  let vp = 0;
  // Card VPs
  for (const card of p.builtStructures) {
    for (const e of card.effects as CardEffect[]) {
      if (e.type === 'victory_points') vp += e.points;
    }
  }
  // Wonder stage VPs
  const stageVPs = WONDER_STAGE_VP[p.wonderId] ?? [];
  for (let i = 0; i < p.wonderStagesBuilt && i < stageVPs.length; i++) {
    vp += stageVPs[i];
  }
  const military = p.militaryTokens.reduce((s: number, t: MilitaryToken) => s + t.value, 0);
  const treasury = Math.floor(p.coins / 3);
  return vp + military + treasury;
}

interface Props {
  player: PublicPlayerState;
  isMe?: boolean;
}

export default function PlayerInfo({ player, isMe }: Props) {
  const pts = estimateScore(player);
  return (
    <div style={{
      background: isMe ? 'linear-gradient(135deg, #1a1610, #252015)' : 'var(--color-surface)',
      borderRadius: 8,
      padding: '6px 10px',
      border: isMe ? '1px solid var(--color-gold-dim)' : '1px solid var(--color-border)',
      boxShadow: (!player.hasChosen && !player.isBot) ? '0 0 0 2px rgba(212,160,23,0.3)' : 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: '0.8rem',
      flex: '1 1 auto',
      minWidth: 0,
    }}>
      <div style={{ fontWeight: 700, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
        {player.isBot ? '🤖 ' : isMe ? '⭐ ' : ''}
        <span style={{ color: isMe ? 'var(--color-gold)' : 'var(--color-text)' }}>{player.name}</span>
        {player.hasChosen && <span style={{ marginLeft: 5, color: '#4ade80', fontSize: '0.85rem' }}>✓</span>}
      </div>
      <span title="Monedas" style={{ whiteSpace: 'nowrap' }}>💰{player.coins}</span>
      <span title="Escudos militares" style={{ whiteSpace: 'nowrap' }}>🛡{player.shields}</span>
      {player.freeBuildsLeft > 0 && (
        <span title="Olympia: podés construir 1 carta gratis esta era" style={{ whiteSpace: 'nowrap', fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700 }}>
          🏛 ×{player.freeBuildsLeft}
        </span>
      )}
      <span
        title="Puntos visibles estimados (civil + militar + tesoro + etapas maravilla). No incluye ciencia ni gremios."
        style={{ whiteSpace: 'nowrap', color: 'var(--color-gold)', fontWeight: 700 }}
      >
        {pts}⭐
      </span>
    </div>
  );
}
