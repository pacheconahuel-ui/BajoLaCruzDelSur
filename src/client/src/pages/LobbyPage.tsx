import { useState } from 'react';

interface Props {
  onCreate: (name: string) => void;
  onJoin: (roomCode: string, name: string) => void;
  error: string;
}

export default function LobbyPage({ onCreate, onJoin, error }: Props) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [tab, setTab] = useState<'create' | 'join'>('create');

  function handleCreate() { if (name.trim()) onCreate(name.trim()); }
  function handleJoin()   { if (name.trim() && roomCode.trim()) onJoin(roomCode.trim().toUpperCase(), name.trim()); }

  return (
    <div className="lobby-wrap">

      {/* Logo / title */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontSize: '1.7rem', color: 'var(--color-silver)', letterSpacing: '-0.02em' }}>
          Bajo la Cruz del Sur
        </h1>
        <p style={{ color: 'var(--color-text-dim)', marginTop: 4, fontSize: '0.9rem' }}>
          Partida multijugador · 3–7 jugadores
        </p>
      </div>

      {/* Name input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 6, color: 'var(--color-text-dim)', fontSize: '0.88rem' }}>
          Tu nombre
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ej: Lonko"
          maxLength={20}
          autoFocus
          onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--color-surface2)', marginBottom: 20 }}>
        {(['create', 'join'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, background: 'transparent',
              color: tab === t ? 'var(--color-gold)' : 'var(--color-text-dim)',
              borderBottom: tab === t ? '2px solid var(--color-gold)' : '2px solid transparent',
              marginBottom: -2, borderRadius: 0,
              fontWeight: tab === t ? 700 : 400, fontSize: '0.95rem',
              padding: '8px 0',
            }}
          >
            {t === 'create' ? '+ Nueva sala' : '→ Unirse a sala'}
          </button>
        ))}
      </div>

      {/* Room code (join tab) */}
      {tab === 'join' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, color: 'var(--color-text-dim)', fontSize: '0.88rem' }}>
            Código de sala
          </label>
          <input
            value={roomCode}
            onChange={e => setRoomCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={6}
            autoFocus
            style={{ letterSpacing: 5, fontWeight: 800, fontSize: '1.3rem', textAlign: 'center' }}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--color-accent)', marginBottom: 12, fontSize: '0.9rem', textAlign: 'center' }}>
          ✗ {error}
        </p>
      )}

      <button
        onClick={tab === 'create' ? handleCreate : handleJoin}
        disabled={!name.trim() || (tab === 'join' && roomCode.length < 4)}
        style={{
          width: '100%', padding: '14px',
          background: 'linear-gradient(135deg, #7a3c0a, #b94a2a)',
          color: '#fff', fontSize: '1rem',
          boxShadow: '0 4px 20px rgba(185,74,42,0.3)',
        }}
      >
        {tab === 'create' ? 'Crear sala →' : 'Unirse a la sala →'}
      </button>

      <p style={{ marginTop: 24, color: 'var(--color-text-dim)', fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.6 }}>
        Compartí el código con tus amigos.<br />
        El juego comienza cuando el host hace click en "Iniciar".
      </p>
    </div>
  );
}
