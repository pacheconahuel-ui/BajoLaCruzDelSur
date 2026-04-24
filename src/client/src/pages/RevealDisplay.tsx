import { PublicGameState } from '@7wonders/shared';
import CardView from '../components/CardView';

interface Props {
  state: PublicGameState;
}

export default function RevealDisplay({ state }: Props) {
  return (
    <div style={{
      maxWidth: 700,
      margin: '60px auto',
      padding: '0 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚡</div>
      <h2 style={{ fontSize: '1.6rem', marginBottom: 6, color: 'var(--color-gold)' }}>
        Era {state.age} · Turno {state.turn}
      </h2>
      <p style={{ color: 'var(--color-text-dim)', marginBottom: 24, fontSize: '0.85rem' }}>
        Todos eligieron — resolviendo acciones…
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {state.players.map((p, i) => {
          const isMe = i === state.myIndex;
          const myCard = isMe && state.myState.pendingAction
            ? state.myState.hand.find(c => c.id === state.myState.pendingAction!.cardId)
            : null;
          const myActionType = isMe && state.myState.pendingAction
            ? state.myState.pendingAction.action.type
            : null;
          return (
            <div
              key={p.id}
              style={{
                background: isMe
                  ? 'linear-gradient(135deg, #1c1912, #141209)'
                  : 'var(--color-surface)',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                border: isMe
                  ? '1.5px solid var(--color-gold-dim)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isMe ? '0 0 12px rgba(212,160,23,0.08)' : 'none',
                textAlign: 'left',
              }}
            >
              {/* Player name */}
              <div style={{
                fontWeight: 700,
                minWidth: 100,
                fontSize: '0.9rem',
                color: isMe ? 'var(--color-gold)' : 'var(--color-text)',
              }}>
                {isMe ? '⭐ ' : ''}{p.name}
              </div>

              {/* Action display */}
              {myCard && myActionType ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CardView card={myCard} compact />
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>
                    {myActionType === 'build_structure' ? '🏗 Construye'
                     : myActionType === 'build_wonder_stage' ? '🏛 Pueblo'
                     : '🗑 Descarta'}
                  </span>
                </div>
              ) : p.hasChosen ? (
                <div style={{
                  fontSize: '0.8rem', color: '#4ade80', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 6px #4ade80',
                  }} />
                  Eligió — resolviendo…
                </div>
              ) : (
                <div style={{
                  fontSize: '0.8rem', color: 'var(--color-text-dim)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span>⏳ Pensando…</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
