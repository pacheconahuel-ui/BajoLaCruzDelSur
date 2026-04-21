import { useEffect, useState } from 'react';
import { PublicGameState } from '@7wonders/shared';

interface Props {
  state: PublicGameState;
}

const AGE_REWARD: Record<number, number> = { 1: 1, 2: 3, 3: 5 };

const AUTO_ADVANCE_MS = 4000;

export default function MilitaryDisplay({ state }: Props) {
  // state.age is already incremented to the NEXT age when phase='military',
  // so the age that just finished is state.age - 1.
  const justCompletedAge = (state.age - 1) as 1 | 2 | 3;
  const reward = AGE_REWARD[justCompletedAge] ?? 1;
  const n = state.players.length;

  // Visual countdown — counts down from AUTO_ADVANCE_MS to 0
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    setElapsed(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const ms = Date.now() - start;
      setElapsed(ms);
      if (ms >= AUTO_ADVANCE_MS) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [justCompletedAge]); // reset when completed age changes

  const progress = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
  const secondsLeft = Math.max(0, Math.ceil((AUTO_ADVANCE_MS - elapsed) / 1000));

  return (
    <div style={{
      maxWidth: 640, margin: '0 auto', padding: '32px 20px',
      minHeight: '100svh', background: 'var(--color-bg)',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>⚔️</div>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--color-gold)', marginBottom: 4 }}>
          Resolución Militar — Era {justCompletedAge}
        </h2>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
          Victoria: +{reward} PV &nbsp;·&nbsp; Derrota: −1 PV &nbsp;·&nbsp; Empate: sin ficha
        </p>
      </div>

      {/* Combat matchups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {state.players.map((p, i) => {
          const left  = state.players[(i - 1 + n) % n];
          const right = state.players[(i + 1) % n];
          const isMe  = i === state.myIndex;
          const ageTokens  = p.militaryTokens.filter(t => t.age === justCompletedAge);
          const victories  = ageTokens.filter(t => t.value > 0).length;
          const defeats    = ageTokens.filter(t => t.value < 0).length;
          const netPV      = ageTokens.reduce((s, t) => s + t.value, 0);

          const vsLeft  = p.shields > left.shields  ? 'win' : p.shields < left.shields  ? 'loss' : 'tie';
          const vsRight = p.shields > right.shields ? 'win' : p.shields < right.shields ? 'loss' : 'tie';

          return (
            <div key={p.id} style={{
              background: isMe ? 'linear-gradient(135deg, #1c1912, #141209)' : 'var(--color-surface)',
              borderRadius: 10,
              border: isMe ? '1.5px solid var(--color-gold-dim)' : '1px solid rgba(255,255,255,0.06)',
              padding: '12px 16px',
              boxShadow: isMe ? '0 0 16px rgba(212,160,23,0.1)' : 'none',
            }}>
              {/* Player name + shields */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isMe ? 'var(--color-gold)' : 'var(--color-text)', flex: 1 }}>
                  {isMe ? '⭐ ' : ''}{p.name}
                </span>
                <span style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>
                  🛡 {p.shields}
                </span>
              </div>

              {/* Combat results row */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* vs Left */}
                <CombatBadge dir="←" opponent={left.name} result={vsLeft} />

                {/* Net PV */}
                <div style={{
                  flex: 1, textAlign: 'center',
                  fontWeight: 800, fontSize: '1rem',
                  color: netPV > 0 ? 'var(--color-success)' : netPV < 0 ? 'var(--color-accent)' : 'var(--color-text-dim)',
                }}>
                  {netPV > 0 ? '+' : ''}{netPV} PV
                </div>

                {/* vs Right */}
                <CombatBadge dir="→" opponent={right.name} result={vsRight} />
              </div>

              {/* Token summary */}
              {(victories > 0 || defeats > 0) && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'center' }}>
                  {Array.from({ length: victories }).map((_, k) => (
                    <span key={`v${k}`} style={{
                      background: '#15803d', borderRadius: 4, padding: '2px 7px', fontSize: '0.72rem', fontWeight: 700,
                    }}>🏆 +{reward}</span>
                  ))}
                  {Array.from({ length: defeats }).map((_, k) => (
                    <span key={`d${k}`} style={{
                      background: '#991b1b', borderRadius: 4, padding: '2px 7px', fontSize: '0.72rem', fontWeight: 700,
                    }}>💀 −1</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Countdown progress bar */}
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem', marginBottom: 8 }}>
          {justCompletedAge < 3
            ? `La Era ${state.age} comenzará en ${secondsLeft}s…`
            : `Puntuación final en ${secondsLeft}s…`}
        </p>
        <div style={{
          width: '100%', height: 4, borderRadius: 2,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, var(--color-gold), #e63946)',
            transition: 'width 0.05s linear',
          }} />
        </div>
      </div>
    </div>
  );
}

function CombatBadge({ dir, opponent, result }: { dir: string; opponent: string; result: 'win' | 'loss' | 'tie' }) {
  const bg    = result === 'win' ? '#14532d' : result === 'loss' ? '#7f1d1d' : '#292524';
  const color = result === 'win' ? '#4ade80' : result === 'loss' ? '#f87171' : 'var(--color-text-dim)';
  const icon  = result === 'win' ? '▲' : result === 'loss' ? '▼' : '═';

  return (
    <div style={{
      background: bg, borderRadius: 6, padding: '4px 10px',
      fontSize: '0.72rem', fontWeight: 700, color,
      display: 'flex', alignItems: 'center', gap: 4,
      minWidth: 80, justifyContent: 'center',
    }}>
      {dir} {icon} {opponent}
    </div>
  );
}
