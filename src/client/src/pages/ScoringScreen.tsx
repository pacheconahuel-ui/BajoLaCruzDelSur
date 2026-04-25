import { useState, useEffect } from 'react';
import { PublicGameState, PlayerScore, CardEffect } from '@7wonders/shared';
import CityTableau from '../components/CityTableau';
import WonderBoard from '../components/WonderBoard';
import { sfx } from '../utils/sfx';

// Fixed VP per stage (stages without VP give 0). Mirrors wonders.ts server-side.
// Dynamic effects like vp_from_own_color (Günün-a-Künna stage 2) are approximated as 0.
const WONDER_STAGE_VP: Record<string, number[]> = {
  colossus:      [0, 5, 7],
  lighthouse:    [0, 0, 7],
  temple:        [0, 0, 7],
  babylon:       [0, 0, 7],
  olympia:       [3, 0, 7],
  halicarnassus: [0, 0, 7],
  giza:          [0, 5, 7],
};

interface Props {
  state: PublicGameState;
  onReturnToMenu?: () => void;
}

const SCORE_COLS: { key: keyof PlayerScore; label: string; icon: string }[] = [
  { key: 'military',   label: 'Militar',   icon: '⚔️' },
  { key: 'treasury',   label: 'Tesoro',    icon: '💰' },
  { key: 'wonder',     label: 'Pueblo',    icon: '🏛' },
  { key: 'civilian',   label: 'Civil',     icon: '🔵' },
  { key: 'science',    label: 'Ciencia',   icon: '🧪' },
  { key: 'commercial', label: 'Comercio',  icon: '🟡' },
  { key: 'guilds',     label: 'Lof',       icon: '🟣' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

function getScienceBreakdown(state: PublicGameState, playerId: string): string {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return '';
  let compass = 0, gear = 0, tablet = 0;
  for (const card of player.builtStructures) {
    if (card.color !== 'green') continue;
    for (const e of card.effects as CardEffect[]) {
      if (e.type === 'science') {
        if (e.symbol === 'compass') compass++;
        else if (e.symbol === 'gear') gear++;
        else if (e.symbol === 'tablet') tablet++;
      }
    }
  }
  const sets = Math.min(compass, gear, tablet);
  const pts = compass ** 2 + gear ** 2 + tablet ** 2 + sets * 7;
  return `🧭${compass} ⚙️${gear} 📋${tablet} = ${sets > 0 ? `${sets}×7 + ` : ''}${pts}pts`;
}

export default function ScoringScreen({ state, onReturnToMenu }: Props) {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [animatedTotals, setAnimatedTotals] = useState<Record<string, number>>({});

  useEffect(() => { sfx.victory(); }, []);

  // Sort by total, then by final coins as tiebreaker (7 Wonders rules)
  const sortScores = (arr: PlayerScore[]): PlayerScore[] => {
    return [...arr].sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      const aCoins = state.players.find(p => p.id === a.playerId)?.coins ?? 0;
      const bCoins = state.players.find(p => p.id === b.playerId)?.coins ?? 0;
      return bCoins - aCoins;
    });
  };

  // Compute scores (extracted for reuse in animation)
  const computeScores = () => {
    return state.scores?.length
      ? sortScores(state.scores)
      : state.players.map(p => {
          const military = p.militaryTokens.reduce((s, t) => s + t.value, 0);
          const treasury = Math.floor(p.coins / 3);
          const stageVPs = WONDER_STAGE_VP[p.wonderId] ?? [0, 0, 0];
          const wonder = stageVPs.slice(0, p.wonderStagesBuilt).reduce((s, v) => s + v, 0);
          const civilian = p.builtStructures
            .filter(c => c.color === 'blue')
            .flatMap(c => c.effects)
            .filter(e => e.type === 'victory_points')
            .reduce((s, e) => s + (e as any).points, 0);
          const total = military + treasury + wonder + civilian;
          return { playerId: p.id, playerName: p.name, military, treasury, wonder, civilian, science: 0, commercial: 0, guilds: 0, total };
        }).sort((a, b) => b.total - a.total);
  };

  // Animate score totals on mount
  useEffect(() => {
    const scores = computeScores();
    const animationDuration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = 1 - (1 - progress) ** 2;

      const newTotals: Record<string, number> = {};
      scores.forEach((s: PlayerScore) => {
        newTotals[s.playerId] = Math.round(eased * s.total);
      });
      setAnimatedTotals(newTotals);

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  const scores = computeScores();

  const winner = scores[0];
  const maxTotal = winner?.total ?? 1;

  // Calcular mejor puntaje por categoría
  const bestPerCol: Partial<Record<keyof PlayerScore, number>> = {};
  for (const col of SCORE_COLS) {
    const vals = scores.map(s => s[col.key] as number).filter(v => v > 0);
    if (vals.length > 0) bestPerCol[col.key] = Math.max(...vals);
  }

  return (
    <div style={{
      maxWidth: 860, margin: '0 auto', padding: '28px 20px 40px',
      minHeight: '100svh', background: 'var(--color-bg)',
    }}>

      {/* ── Trophy header ── */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: 8 }}>🏆</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-gold)', marginBottom: 4 }}>
          Fin de Partida
        </h2>
        <div style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
          Ganador:&nbsp;
          <strong style={{ color: 'var(--color-gold)', fontSize: '1.1rem' }}>{winner?.playerName}</strong>
          &nbsp;con&nbsp;
          <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{winner ? (animatedTotals[winner.playerId] ?? winner.total) : 0}</strong>
          &nbsp;puntos
        </div>
      </div>

      {/* ── Podium bars ── */}
      <div style={{
        display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'flex-end',
        marginBottom: 28, padding: '0 12px',
      }}>
        {scores.slice(0, Math.min(scores.length, 5)).map((s, i) => {
          const displayTotal = animatedTotals[s.playerId] ?? s.total;
          const barH = Math.max(28, Math.round((displayTotal / maxTotal) * 100));
          const isWinner = i === 0;
          return (
            <div key={s.playerId} style={{ flex: 1, maxWidth: 140, textAlign: 'center' }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 700,
                color: isWinner ? 'var(--color-gold)' : 'var(--color-text-dim)',
                marginBottom: 4,
              }}>
                {MEDALS[i] ?? `${i + 1}.`} {s.playerName}
              </div>
              <div style={{
                height: barH,
                background: isWinner
                  ? 'linear-gradient(180deg, #f0c040, #c8650f)'
                  : 'linear-gradient(180deg, #3d3425, #252015)',
                borderRadius: '4px 4px 0 0',
                border: isWinner ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isWinner ? '1.1rem' : '0.95rem',
                fontWeight: 800,
                color: isWinner ? '#1c1410' : 'var(--color-text)',
                boxShadow: isWinner ? '0 0 16px rgba(212,160,23,0.4)' : 'none',
                transition: 'height 0.6s ease',
              }}>
                {displayTotal}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Score table ── */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        marginBottom: 24,
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 520 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface2)' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--color-text-dim)', fontWeight: 600, borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                  Jugador
                </th>
                {SCORE_COLS.map(col => (
                  <th key={col.key} style={{
                    padding: '10px 8px', textAlign: 'center',
                    color: 'var(--color-text-dim)', fontWeight: 600,
                    borderBottom: '1px solid var(--color-border)',
                    fontSize: '0.75rem', whiteSpace: 'nowrap',
                  }}>
                    {col.icon}
                  </th>
                ))}
                <th style={{
                  padding: '10px 8px', textAlign: 'center',
                  color: 'var(--color-text-dim)', fontWeight: 600,
                  borderBottom: '1px solid var(--color-border)',
                  fontSize: '0.75rem', whiteSpace: 'nowrap',
                }}>
                  💰fin
                </th>
                <th style={{
                  padding: '10px 14px', textAlign: 'center',
                  color: 'var(--color-gold)', fontWeight: 800,
                  borderBottom: '1px solid var(--color-border)',
                  fontSize: '0.9rem',
                }}>
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {scores.map((row, i) => (
                <tr key={row.playerId} style={{
                  background: i === 0
                    ? 'rgba(212,160,23,0.06)'
                    : i % 2 ? 'var(--color-surface2)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{ marginRight: 6 }}>{MEDALS[i] ?? `${i + 1}.`}</span>
                    <span style={{ fontWeight: i === 0 ? 700 : 400, color: i === 0 ? 'var(--color-gold)' : 'var(--color-text)' }}>
                      {row.playerName}
                    </span>
                  </td>
                  {SCORE_COLS.map(col => {
                    const v = row[col.key] as number;
                    const isBest = v > 0 && bestPerCol[col.key] === v;
                    const tooltip = col.key === 'science' && v > 0
                      ? getScienceBreakdown(state, row.playerId)
                      : undefined;
                    return (
                      <td key={col.key} title={tooltip} style={{
                        padding: '10px 8px', textAlign: 'center',
                        color: isBest ? '#fde68a' : v > 0 ? 'var(--color-text)' : v < 0 ? '#f87171' : 'var(--color-text-dim)',
                        fontWeight: isBest ? 800 : v !== 0 ? 500 : 400,
                        background: isBest ? 'rgba(212,160,23,0.13)' : undefined,
                        cursor: tooltip ? 'help' : 'default',
                        textDecoration: tooltip ? 'underline dotted' : 'none',
                      }}>
                        {isBest ? '⭐' : ''}{v !== 0 ? v : '—'}
                      </td>
                    );
                  })}
                  <td style={{
                    padding: '10px 8px', textAlign: 'center',
                    color: 'var(--color-text-dim)', fontSize: '0.82rem',
                  }}>
                    {state.players.find(p => p.id === row.playerId)?.coins ?? 0}
                  </td>
                  <td style={{
                    padding: '10px 14px', textAlign: 'center',
                    fontWeight: 800, fontSize: '1rem',
                    color: i === 0 ? 'var(--color-gold)' : 'var(--color-text)',
                  }}>
                    {animatedTotals[row.playerId] ?? row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: 16, flexWrap: 'wrap',
          padding: '8px 14px', borderTop: '1px solid var(--color-border)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          {SCORE_COLS.map(col => (
            <span key={col.key} style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>
              {col.icon} {col.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── City review ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          🏛 Ciudades finales
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {scores.map((s: PlayerScore, i: number) => {
            const player = state.players.find((p) => p.id === s.playerId);
            const isExpanded = expandedCity === s.playerId;
            if (!player) return null;
            return (
              <div key={s.playerId} style={{
                background: 'var(--color-surface)',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setExpandedCity(isExpanded ? null : s.playerId)}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    padding: '10px 14px', textAlign: 'left', borderRadius: 0,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: i === 0 ? 'var(--color-gold)' : 'var(--color-text)' }}>
                    {MEDALS[i] ?? `${i + 1}.`} {s.playerName}
                  </span>
                  <span style={{ color: 'var(--color-text-dim)', fontSize: '0.78rem' }}>
                    {player.builtStructures.length} estructuras · {player.wonderStagesBuilt}/3 etapas
                  </span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>
                    {isExpanded ? '▲ Ocultar' : '▼ Ver ciudad'}
                  </span>
                </button>
                {isExpanded && (
                  <div style={{ padding: '0 14px 14px' }}>
                    <div style={{ marginBottom: 10 }}>
                      <WonderBoard player={player} compact />
                    </div>
                    <CityTableau structures={player.builtStructures} size="sm" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Play again / Return ── */}
      <div style={{ textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onReturnToMenu ?? (() => window.location.reload())}
          style={{
            background: 'linear-gradient(135deg, #7a3c0a, #b94a2a)',
            color: '#fff', padding: '13px 48px', fontSize: '1rem',
            borderRadius: 8, fontWeight: 700,
            boxShadow: '0 4px 20px rgba(185,74,42,0.3)',
          }}
        >
          ⚱ Nueva Partida
        </button>
      </div>
    </div>
  );
}
