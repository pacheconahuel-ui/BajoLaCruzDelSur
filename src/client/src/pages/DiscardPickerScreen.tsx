import { useState } from 'react';
import { PublicGameState, Card, PublicPlayerState } from '@7wonders/shared';
import { socket } from '../socket/socket';
import CardView from '../components/CardView';

interface Props {
  state: PublicGameState;
}

export default function DiscardPickerScreen({ state }: Props) {
  const [selected, setSelected] = useState<Card | null>(null);
  const [error, setError] = useState('');

  const isMyTurn = state.pendingDiscardPlayerId === state.myState.id;
  const chooserName = state.players.find((p: PublicPlayerState) => p.id === state.pendingDiscardPlayerId)?.name ?? '...';
  const isEmpty = state.discardPile.length === 0;

  function confirm() {
    if (!selected) return;
    socket.emit('game:choose_from_discard', selected.id, (err?: string) => {
      if (err) { setError(err); return; }
    });
  }

  function skip() {
    socket.emit('game:skip_discard_pick', (err?: string) => {
      if (err) { setError(err); return; }
    });
  }

  return (
    <div style={{
      minHeight: '100svh', background: '#1c1408',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 16px', gap: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.6rem', color: '#f5c542', fontWeight: 700, marginBottom: 6 }}>
          🏛 Rankül — Construir desde el descarte
        </div>
        {isMyTurn ? (
          <div style={{ color: '#d1c08a', fontSize: '1rem' }}>
            {isEmpty
              ? 'El descarte está vacío — no hay cartas para construir'
              : 'Elegí una carta del descarte para construirla gratis'}
          </div>
        ) : (
          <div style={{ color: '#a09060', fontSize: '1rem' }}>
            <strong style={{ color: '#f5c542' }}>{chooserName}</strong> está eligiendo una carta del descarte…
          </div>
        )}
      </div>

      {isEmpty ? (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 12,
          padding: '32px 48px', color: '#a09060', fontSize: '1rem', textAlign: 'center',
        }}>
          📭 Pila de descarte vacía
        </div>
      ) : (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          justifyContent: 'center', maxWidth: 1000, overflowY: 'auto', maxHeight: '60vh',
        }}>
          {state.discardPile.map(card => (
            <div
              key={card.id}
              onClick={() => isMyTurn && setSelected(prev => prev?.id === card.id ? null : card)}
              style={{ cursor: isMyTurn ? 'pointer' : 'default', opacity: isMyTurn ? 1 : 0.55 }}
            >
              <CardView card={card} selected={selected?.id === card.id} />
            </div>
          ))}
        </div>
      )}

      {isMyTurn && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {error && <div style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}

          {!isEmpty && (
            <button
              onClick={confirm}
              disabled={!selected}
              style={{
                padding: '10px 32px', borderRadius: 8,
                background: selected ? '#92400e' : '#3a3020',
                color: selected ? '#fff' : '#6b5a3a',
                fontWeight: 700, fontSize: '1rem',
              }}
            >
              {selected ? `Construir ${selected.name}` : 'Seleccioná una carta'}
            </button>
          )}

          {isEmpty && (
            <button
              onClick={skip}
              style={{
                padding: '10px 32px', borderRadius: 8,
                background: '#5a3a1a', color: '#f5c542',
                fontWeight: 700, fontSize: '1rem',
              }}
            >
              Continuar sin construir →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
