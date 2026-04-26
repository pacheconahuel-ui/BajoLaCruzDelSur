import { useState } from 'react';
import { PublicGameState, Card, PublicPlayerState } from '@7wonders/shared';
import { socket } from '../socket/socket';
import CardView from '../components/CardView';

interface Props {
  state: PublicGameState;
}

export default function ExtraCardPickerScreen({ state }: Props) {
  const [selected, setSelected] = useState<Card | null>(null);
  const [actionType, setActionType] = useState<'build' | 'discard'>('build');
  const [error, setError] = useState('');

  const me = state.myState;
  const isMyTurn = state.pendingExtraCardPlayerId === me.id;
  const chooserName = state.players.find((p: PublicPlayerState) => p.id === state.pendingExtraCardPlayerId)?.name ?? '...';
  const hand = me.hand ?? [];

  function confirm() {
    if (!selected) return;
    socket.emit('game:choose_extra_card', selected.id, actionType, (err?: string) => {
      if (err) { setError(err); return; }
    });
  }

  function skip() {
    socket.emit('game:choose_extra_card', null, 'build', (err?: string) => {
      if (err) { setError(err); return; }
    });
  }

  return (
    <div style={{
      minHeight: '100svh', background: '#1a0f1e',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 16px', gap: 24,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.6rem', color: '#f5c542', fontWeight: 700, marginBottom: 6 }}>
          🔥 Ofrenda del Fuego — Yámana
        </div>
        {isMyTurn ? (
          <div style={{ color: '#d1c08a', fontSize: '1rem' }}>
            Podés jugar una carta extra de tu mano gratis (o descartarla por +3 💰)
          </div>
        ) : (
          <div style={{ color: '#a09060', fontSize: '1rem' }}>
            <strong style={{ color: '#f5c542' }}>{chooserName}</strong> está eligiendo su carta extra (Ofrenda del Fuego)…
          </div>
        )}
      </div>

      {isMyTurn && hand.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['build', 'discard'] as const).map(a => (
              <button
                key={a}
                onClick={() => setActionType(a)}
                style={{
                  padding: '8px 22px', borderRadius: 8, fontWeight: 700,
                  background: actionType === a ? (a === 'build' ? '#1e4d2a' : '#4a2010') : '#2a2020',
                  color: actionType === a ? '#fff' : '#888',
                  border: actionType === a ? '1px solid #4ade80' : '1px solid #444',
                  cursor: 'pointer',
                }}
              >
                {a === 'build' ? '🏗 Construir gratis' : '🗑 Descartar (+3 💰)'}
              </button>
            ))}
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10,
            justifyContent: 'center', maxWidth: 1000, overflowY: 'auto', maxHeight: '55vh',
          }}>
            {hand.map((card: Card) => (
              <div
                key={card.id}
                onClick={() => setSelected(prev => prev?.id === card.id ? null : card)}
                style={{ cursor: 'pointer' }}
              >
                <CardView card={card} selected={selected?.id === card.id} />
              </div>
            ))}
          </div>

          {error && <div style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={confirm}
              disabled={!selected}
              style={{
                padding: '10px 32px', borderRadius: 8,
                background: selected ? (actionType === 'build' ? '#14532d' : '#7c2d12') : '#3a3020',
                color: selected ? '#fff' : '#6b5a3a',
                fontWeight: 700, fontSize: '1rem', cursor: selected ? 'pointer' : 'default',
              }}
            >
              {!selected
                ? 'Seleccioná una carta'
                : actionType === 'build'
                  ? `Construir ${selected.name} gratis`
                  : `Descartar ${selected.name} (+3 💰)`}
            </button>
            <button
              onClick={skip}
              style={{
                padding: '10px 22px', borderRadius: 8,
                background: '#2a2020', color: '#a09060',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                border: '1px solid #444',
              }}
            >
              Pasar →
            </button>
          </div>
        </>
      )}

      {isMyTurn && hand.length === 0 && (
        <div style={{ color: '#a09060', fontSize: '1rem', textAlign: 'center' }}>
          <p>No tenés cartas en la mano para jugar.</p>
          <button
            onClick={skip}
            style={{
              marginTop: 16, padding: '10px 28px', borderRadius: 8,
              background: '#5a3a1a', color: '#f5c542', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            }}
          >
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}
