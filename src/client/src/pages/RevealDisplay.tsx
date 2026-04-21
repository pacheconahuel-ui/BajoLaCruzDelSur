import { PublicGameState } from '@7wonders/shared';
import CardView from '../components/CardView';

interface Props {
  state: PublicGameState;
}

export default function RevealDisplay({ state }: Props) {
  // Extract what each player did from the most recent log entries
  // Log format: "X construyó Y." / "X descartó Y y ganó…" / "X construyó la etapa N…"
  const logActions: Record<string, string> = {};
  for (const entry of state.log) {
    const buildMatch = entry.match(/^(.+?) construyó (.+?)\./);
    const discardMatch = entry.match(/^(.+?) descartó (.+?) y ganó/);
    const wonderMatch = entry.match(/^(.+?) construyó la etapa (\d+) de su Maravilla/);
    const discardPickMatch = entry.match(/^(.+?) construyó (.+?) desde el descarte/);

    if (buildMatch) logActions[buildMatch[1]] = `🏗 ${buildMatch[2]}`;
    else if (discardMatch) logActions[discardMatch[1]] = `🗑 ${discardMatch[2]} (+3💰)`;
    else if (wonderMatch) logActions[wonderMatch[1]] = `🏛 Etapa ${wonderMatch[2]} de Maravilla`;
    else if (discardPickMatch) logActions[discardPickMatch[1]] = `📜 ${discardPickMatch[2]} (descarte)`;
  }

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
          const logAction = logActions[p.name];

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
                     : myActionType === 'build_wonder_stage' ? '🏛 Maravilla'
                     : '🗑 Descarta'}
                  </span>
                </div>
              ) : logAction ? (
                <div style={{
                  fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: 500,
                }}>
                  {logAction}
                </div>
              ) : (
                <div style={{
                  fontSize: '0.8rem', color: '#4ade80', fontWeight: 600,
                }}>
                  ✓ Listo
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
