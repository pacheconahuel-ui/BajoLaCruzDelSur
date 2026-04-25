import { useEffect, useState } from 'react';
import { PublicGameState } from '@7wonders/shared';
import CardView from '../components/CardView';

interface Props {
  state: PublicGameState;
}

const ACTION_LABELS: Record<string, { icon: string; label: string; color: string }> = {
  build_structure:   { icon: '🏗', label: 'Construye',   color: '#3b82f6' },
  build_wonder_stage: { icon: '🏛', label: 'Avanza Pueblo', color: '#f5c542' },
  discard:           { icon: '🗑', label: 'Descarta',    color: '#6b7280' },
};

export default function RevealDisplay({ state }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const myPending = state.myState.pendingAction;
  const myCard = myPending ? state.myState.hand.find(c => c.id === myPending.cardId) ?? null : null;
  const myAction = myPending ? ACTION_LABELS[myPending.action.type] : null;

  return (
    <div style={{
      minHeight: '100svh',
      background: 'radial-gradient(ellipse at center top, #1a1206 0%, #0d0a04 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      gap: 28,
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>⚡</div>
        <h2 style={{
          fontSize: '1.8rem',
          color: 'var(--color-gold)',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          letterSpacing: '0.05em',
          marginBottom: 4,
        }}>
          ¡Todos eligieron!
        </h2>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem' }}>
          Era {state.age} · Turno {state.turn} — resolviendo acciones…
        </p>
      </div>

      {/* My chosen card (prominent) */}
      {myCard && myAction && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s',
        }}>
          <CardView card={myCard} />
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${myAction.color}44`,
            borderRadius: 20,
            padding: '5px 14px',
            fontSize: '0.82rem',
            color: myAction.color,
            fontWeight: 700,
          }}>
            {myAction.icon} {myAction.label}
          </div>
        </div>
      )}

      {/* Players list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 420 }}>
        {state.players.map((p, i) => {
          const isMe = i === state.myIndex;
          const delayMs = 80 + i * 60;
          return (
            <div
              key={p.id}
              style={{
                background: isMe ? 'rgba(212,160,23,0.08)' : 'var(--color-surface)',
                border: isMe ? '1px solid rgba(212,160,23,0.35)' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 9,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 0.3s ease ${delayMs}ms, transform 0.3s ease ${delayMs}ms`,
              }}
            >
              <span style={{
                fontSize: '0.88rem',
                fontWeight: isMe ? 700 : 400,
                color: isMe ? 'var(--color-gold)' : 'var(--color-text)',
                flex: 1,
              }}>
                {isMe ? '⭐ ' : p.isBot ? '🤖 ' : ''}{p.name}
              </span>

              {p.hasChosen ? (
                <span style={{
                  fontSize: '0.72rem',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontWeight: 600,
                }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 5px #4ade80',
                    display: 'inline-block',
                  }} />
                  Listo
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>⏳</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
