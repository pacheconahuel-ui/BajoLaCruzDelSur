import { useState, useEffect, useCallback } from 'react';
import { PublicGameState } from '@7wonders/shared';
import { socket } from './socket/socket';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';

export interface ChatMessage {
  playerName: string;
  text: string;
  time: number;
}

type AppScreen = 'lobby' | 'waiting' | 'game';

const SESSION_KEY = '7w_session';

function saveSession(roomId: string, playerId: string) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ roomId, playerId })); } catch { /* ignore */ }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

function loadSession(): { roomId: string; playerId: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('lobby');
  const [roomId, setRoomId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [gameState, setGameState] = useState<PublicGameState | null>(null);
  const [lobbyPlayers, setLobbyPlayers] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    let hasConnectedOnce = false;
    function onConnect() {
      // Attempt to rejoin a previous session on (re)connect
      const saved = loadSession();
      if (saved) {
        socket.emit('game:rejoin', saved.roomId, saved.playerId, (err) => {
          if (err) {
            clearSession();
          } else {
            setRoomId(saved.roomId);
            setPlayerId(saved.playerId);
            setScreen('waiting'); // game:state will override to 'game' if active
            if (hasConnectedOnce) showToast('✅ Reconectado a la partida');
          }
        });
      }
      hasConnectedOnce = true;
    }

    socket.on('connect', onConnect);

    socket.on('lobby:updated', players => {
      setLobbyPlayers(players);
    });

    socket.on('game:state', state => {
      setGameState(state);
      setScreen('game');
      // Clear session when the game ends (scoring is the terminal phase)
      if (state.phase === 'finished' || state.phase === 'scoring') clearSession();
    });

    socket.on('game:error', msg => {
      setError(msg);
      showToast(msg);
    });

    socket.on('game:chat', (playerName, text, time) => {
      setChatMessages(prev => [...prev.slice(-99), { playerName, text, time }]);
    });

    socket.on('game:abandoned', reason => {
      showToast(reason);
      clearSession();
      setChatMessages([]);
      setGameState(null);
      setScreen('lobby');
    });

    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('lobby:updated');
      socket.off('game:state');
      socket.off('game:error');
      socket.off('game:chat');
      socket.off('game:abandoned');
      socket.disconnect();
    };
  }, []);

  function handleCreate(playerName: string) {
    socket.emit('lobby:create', playerName, (id, pid) => {
      setRoomId(id);
      setPlayerId(pid);
      setScreen('waiting');
      saveSession(id, pid);
    });
  }

  function handleJoin(roomCode: string, playerName: string) {
    socket.emit('lobby:join', roomCode, playerName, (err, pid) => {
      if (err) { setError(err); return; }
      setRoomId(roomCode);
      setPlayerId(pid ?? '');
      setScreen('waiting');
      saveSession(roomCode, pid ?? '');
    });
  }

  function handleStartGame() {
    socket.emit('lobby:start', (err) => {
      if (err) setError(err);
    });
  }

  function handleAbandon() {
    socket.emit('game:abandon', (err) => {
      if (err) showToast(err ?? 'Error al abandonar');
      // server will broadcast game:abandoned to everyone including us
    });
  }

  function handleChat(msg: string) {
    socket.emit('game:chat', msg);
  }

  function handleReturnToMenu() {
    clearSession();
    setChatMessages([]);
    setGameState(null);
    setScreen('lobby');
  }

  if (screen === 'lobby') {
    return <LobbyPage onCreate={handleCreate} onJoin={handleJoin} error={error} />;
  }

  if (screen === 'waiting') {
    return (
      <>
        <WaitingRoom
          roomId={roomId}
          players={lobbyPlayers}
          playerId={playerId}
          isHost={lobbyPlayers[0]?.id === playerId}
          onStart={handleStartGame}
          error={error}
        />
        {toast && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--color-surface)', border: '1px solid var(--color-accent)',
            borderRadius: 8, padding: '10px 20px',
            color: 'var(--color-text)', fontSize: '0.85rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            zIndex: 999, maxWidth: 360, textAlign: 'center',
          }}>
            {toast}
          </div>
        )}
      </>
    );
  }

  if (screen === 'game' && gameState) {
    return (
      <>
        <GamePage
          state={gameState}
          onAbandon={handleAbandon}
          onChat={handleChat}
          chatMessages={chatMessages}
          onReturnToMenu={handleReturnToMenu}
        />
        {toast && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--color-surface)', border: '1px solid var(--color-accent)',
            borderRadius: 8, padding: '10px 20px',
            color: 'var(--color-text)', fontSize: '0.85rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            zIndex: 999, maxWidth: 360, textAlign: 'center',
            animation: 'fadeInUp 0.2s ease',
          }}>
            ⚡ {toast}
          </div>
        )}
      </>
    );
  }

  return null;
}

function WaitingRoom({
  roomId, players, playerId, isHost, onStart, error,
}: {
  roomId: string;
  players: { id: string; name: string; isBot?: boolean }[];
  playerId: string;
  isHost: boolean;
  onStart: () => void;
  error: string;
}) {
  const [copied, setCopied] = useState(false);

  function addBot() {
    socket.emit('lobby:add_bot', (err?: string) => {
      if (err) console.error(err);
    });
  }

  function copyCode() {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback: select the code text
    });
  }

  return (
    <div className="lobby-wrap">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: '2rem', marginBottom: 4 }}>⚱</div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-gold)' }}>Sala de espera</h2>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ background: 'var(--color-surface2)', borderRadius: 8, padding: '8px 20px' }}>
            <span style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem' }}>Código: </span>
            <strong style={{ fontSize: '1.6rem', letterSpacing: 5, color: 'var(--color-gold)', fontFamily: 'monospace' }}>{roomId}</strong>
          </div>
          <button
            onClick={copyCode}
            title="Copiar código"
            style={{
              background: copied ? '#1a3d2a' : 'var(--color-surface2)',
              color: copied ? 'var(--color-success)' : 'var(--color-text-dim)',
              padding: '8px 14px', fontSize: '0.85rem', borderRadius: 8,
              border: `1px solid ${copied ? 'var(--color-success)' : 'var(--color-border)'}`,
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </button>
        </div>
        <p style={{ marginTop: 8, color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>
          Compartí este código con tus amigos (misma red: usá tu IP local)
        </p>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 8, padding: 14, marginBottom: 16, border: '1px solid var(--color-border)' }}>
        <p style={{ marginBottom: 10, color: 'var(--color-text-dim)', fontSize: '0.82rem' }}>
          Jugadores ({players.length}/7 — mínimo 3):
        </p>
        {players.map((p, i) => (
          <div key={p.id} style={{
            padding: '7px 0', borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', gap: 8,
            color: p.id === playerId ? 'var(--color-gold)' : p.isBot ? 'var(--color-text-dim)' : 'var(--color-text)',
            fontWeight: p.id === playerId ? 700 : 400,
          }}>
            <span>{p.isBot ? '🤖' : i === 0 ? '👑' : '•'}</span>
            <span>{p.name}</span>
            {i === 0 && !p.isBot && <span style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', marginLeft: 'auto' }}>host</span>}
          </div>
        ))}
      </div>

      {isHost && players.length < 7 && (
        <button
          onClick={addBot}
          style={{
            width: '100%', padding: 10, fontSize: '0.9rem', marginBottom: 10,
            background: 'var(--color-surface2)',
            color: 'var(--color-text-dim)',
            border: '1px dashed var(--color-border)',
          }}
        >
          🤖 Agregar Bot ({players.length}/7)
        </button>
      )}

      {error && <p style={{ color: 'var(--color-accent)', marginBottom: 12, textAlign: 'center' }}>✗ {error}</p>}

      {isHost ? (
        <button
          onClick={onStart}
          disabled={players.length < 3}
          style={{
            width: '100%', padding: 14, fontSize: '1rem',
            background: players.length >= 3
              ? 'linear-gradient(135deg, #7a3c0a, #b94a2a)'
              : 'var(--color-surface2)',
            color: '#fff',
            boxShadow: players.length >= 3 ? '0 4px 20px rgba(185,74,42,0.3)' : 'none',
          }}
        >
          {players.length < 3 ? `Esperando jugadores (${players.length}/3 mínimo)` : '⚱ Iniciar partida'}
        </button>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--color-text-dim)', padding: 16 }}>
          Esperando que el host inicie la partida…
        </p>
      )}
    </div>
  );
}
