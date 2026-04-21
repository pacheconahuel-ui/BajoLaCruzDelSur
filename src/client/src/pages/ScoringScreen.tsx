import { PublicGameState, PlayerScore } from '@7wonders/shared';

interface Props {
  state: PublicGameState;
  onReturnToMenu?: () => void;
}

const SCORE_COLS: { key: keyof PlayerScore; label: string; icon: string }[] = [
  { key: 'military',   label: 'Militar',   icon: '⚔️' },
  { key: 'treasury',   label: 'Tesoro',    icon: '💰' },
  { key: 'wonder',     label: 'Maravilla', icon: '🏛' },
  { key: 'civilian',   label: 'Civil',     icon: '🏛' },
  { key: 'science',    label: 'Ciencia',   icon: '🧪' },
  { key: 'commercial', label: 'Comercio',  icon: '🟡' },
  { key: 'guilds',     label: 'Gremios',   icon: '🟣' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export default function ScoringScreen({ state, onReturnToMenu }: Props) {
  const scores: PlayerScore[] = state.scores?.length
    ? [...state.scores].sort((a, b) => b.total - a.total)
    : state.players.map(p => {
        const military = p.militaryTokens.reduce((s, t) => s + t.value, 0);
        const treasury = Math.floor(p.coins / 3);
        const wonder = p.wonderStagesBuilt * 3;
        const civilian = p.builtStructures
          .filter(c => c.color === 'blue')
          .flatMap(c => c.effects)
          .filter(e => e.type === 'victory_points')
          .reduce((s, e) => s + (e as any).points, 0);
        const total = military + treasury + wonder + civilian;
        return { playerId: p.id, playerName: p.name, military, treasury, wonder, civilian, science: 0, commercial: 0, guilds: 0, total };
      }).sort((a, b) => b.total - a.total);

  const winner = scores[0];
  const maxTotal = winner?.total ?? 1;

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
          <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{winner?.total}</strong>
          &nbsp;puntos
        </div>
      </div>

      {/* ── Podium bars ── */}
      <div style={{
        display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'flex-end',
        marginBottom: 28, padding: '0 12px',
      }}>
        {scores.slice(0, Math.min(scores.length, 5)).map((s, i) => {
          const barH = Math.max(28, Math.round((s.total / maxTotal) * 100));
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
                {s.total}
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
                    return (
                      <td key={col.key} style={{
                        padding: '10px 8px', textAlign: 'center',
                        color: v > 0 ? 'var(--color-text)' : v < 0 ? '#f87171' : 'var(--color-text-dim)',
                        fontWeight: v !== 0 ? 500 : 400,
                      }}>
                        {v !== 0 ? v : '—'}
                      </td>
                    );
                  })}
                  <td style={{
                    padding: '10px 14px', textAlign: 'center',
                    fontWeight: 800, fontSize: '1rem',
                    color: i === 0 ? 'var(--color-gold)' : 'var(--color-text)',
                  }}>
                    {row.total}
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

      {/* ── Play again / Return ── */}
      <div style={{ textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onReturnToMenu ?? (() => window.location.reload())}
          style={{
            background: 'linear-gradient(135deg, #c8650f, #e63946)',
            color: '#fff', padding: '13px 48px', fontSize: '1rem',
            borderRadius: 8, fontWeight: 700,
            boxShadow: '0 4px 20px rgba(230,57,70,0.3)',
          }}
        >
          ⚱ Nueva Partida
        </button>
      </div>
    </div>
  );
}
