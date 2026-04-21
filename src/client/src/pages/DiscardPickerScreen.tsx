import { useState } from 'react';
import { PublicGameState, Card } from '@7wonders/shared';
import { socket } from '../socket/socket';
import CardView from '../components/CardView';

interface Props {
  state: PublicGameState;
}

export default function DiscardPickerScreen({ state }: Props) {
  const [selected, setSelected] = useState<Card | null>(null);
  const [error, setError] = useState('');

  const isMyTurn = state.pendingDiscardPlayerId === state.myState.id;
  const chooserName = state.players.find(p => p.id === state.pendingDiscardPlayerId)?.name ?? '...';

  function confirm() {
    if (!selected) return;
    socket.emit('game:choose_from_discard', selected.id, (err?: string) => {
      if (err) { setError(err); return; }
    });
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#1c1408',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 16px', gap: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.6rem', color: '#f5c542', fontWeight: 700, marginBottom: 6 }}>
          🏛 Halicarnaso — Construir desde el descarte
        </div>
        {isMyTurn ? (
          <div style={{ color: '#d1c08a', fontSize: '1rem' }}>
            Elegí una carta del descarte para construirla gratis
          </div>
        ) : (
          <div style={{ color: '#a09060', fontSize: '1rem' }}>
            <strong style={{ color: '#f5c542' }}>{chooserName}</strong> está eligiendo una carta del descarte…
          </div>
        )}
      </div>

      {state.discardPile.length === 0 ? (
        <div style={{ color: '#a09060', fontSize: '0.9rem' }}>El descarte está vacío.</div>
      ) : (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          justifyContent: 'center', maxWidth: 900,
        }}>
          {state.discardPile.map(card => (
            <div
              key={card.id}
              onClick={() => isMyTurn && setSelected(prev => prev?.id === card.id ? null : card)}
              style={{ cursor: isMyTurn ? 'pointer' : 'default', opacity: isMyTurn ? 1 : 0.55 }}
            >
              <CardView
                card={card}
                selected={selected?.id === card.id}
              />
            </div>
          ))}
        </div>
      )}

      {isMyTurn && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {error && <div style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}
          <button
            onClick={confirm}
            disabled={!selected}
            style={{
              padding: '10px 32px', borderRadius: 8, border: 'none',
              background: selected ? '#92400e' : '#3a3020',
              color: selected ? '#fff' : '#6b5a3a',
              fontWeight: 700, fontSize: '1rem', cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            {selected ? `Construir ${selected.name}` : 'Seleccioná una carta'}
          </button>
        </div>
      )}
    </div>
  );
}
