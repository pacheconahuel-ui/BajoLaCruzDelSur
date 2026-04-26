import { useState, useRef, useEffect } from 'react';
import { PublicGameState, Card, PendingAction, PublicPlayerState, MilitaryToken, TradeDecision } from '@7wonders/shared';
import { socket } from '../socket/socket';
import CardView from '../components/CardView';
import CityTableau from '../components/CityTableau';
import WonderBoard from '../components/WonderBoard';
import PlayerInfo from '../components/PlayerInfo';
import RevealDisplay from './RevealDisplay';
import MilitaryDisplay from './MilitaryDisplay';
import ScoringScreen from './ScoringScreen';
import DiscardPickerScreen from './DiscardPickerScreen';
import ExtraCardPickerScreen from './ExtraCardPickerScreen';
import { computeAffordability, computeWonderAffordability, getWonderStageCost, WonderAffordability } from '../utils/affordability';
import { formatCost } from '../utils/icons';
import CheatSheet from '../components/CheatSheet';
import type { ChatMessage } from '../App';

interface Props {
  state: PublicGameState;
  onAbandon?: () => void;
  chatMessages?: ChatMessage[];
  onChat?: (msg: string) => void;
  onReturnToMenu?: () => void;
}

/** Returns a colorized JSX row for an action log entry based on its content. */
function colorizeLog(entry: string, isLatest: boolean): JSX.Element {
  const textColor = isLatest ? 'var(--color-text)' : 'var(--color-text-dim)';
  const textOpacity = isLatest ? 1 : 0.7;

  // Era/phase headers: no dot, golden uppercase text
  if (/Era|Comienza|comienza/.test(entry)) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: textOpacity }}>
          {entry}
        </span>
      </div>
    );
  }

  let dotColor: string;
  if (/construyó/.test(entry))                          dotColor = '#3b82f6';
  else if (/descartó/.test(entry))                      dotColor = '#6b7280';
  else if (/pueblo|etapa|avanzó/.test(entry))           dotColor = 'var(--color-gold)';
  else if (/ganó|venció|derrota/.test(entry))           dotColor = '#ef4444';
  else                                                  dotColor = 'var(--color-text-dim)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      <span style={{ fontSize: '0.75rem', color: textColor, opacity: textOpacity, fontStyle: isLatest ? 'normal' : 'italic' }}>
        {entry}
      </span>
    </div>
  );
}

export default function GamePage({ state, onAbandon, chatMessages = [], onChat, onReturnToMenu }: Props) {
  const [selectedCard, setSelectedCard]   = useState<Card | null>(null);
  const [actionType, setActionType]       = useState<'build_structure' | 'build_wonder_stage' | 'discard' | null>(null);
  const [error, setError]                 = useState('');
  const [showHelp, setShowHelp]           = useState(false);
  const [mobileTab, setMobileTab]         = useState<'me' | 'left' | 'right'>('me');
  const [showAbandon, setShowAbandon]     = useState(false);
  const [showStats, setShowStats]         = useState(false);
  const [showMilitary, setShowMilitary]   = useState(false);
  const [chatInput, setChatInput]         = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  function cancelSelection() {
    setSelectedCard(null);
    setActionType(null);
    setError('');
  }

  const me           = state.myState;
  const myIndex      = state.myIndex;
  const n            = state.players.length;
  const leftNeighbor  = state.players[(myIndex - 1 + n) % n];
  const rightNeighbor = state.players[(myIndex + 1) % n];

  function submitAction() {
    if (!selectedCard || !actionType) return;

    let trade: TradeDecision | undefined;
    if (actionType === 'build_structure') {
      const aff = computeAffordability(selectedCard, me, leftNeighbor, rightNeighbor);
      if (aff.tradeCostTotal > 0 && aff.canBuild) {
        trade = { leftCoins: aff.leftCoins, rightCoins: aff.rightCoins };
      }
    } else if (actionType === 'build_wonder_stage') {
      const wAff = computeWonderAffordability(me.wonderId, me.wonderStagesBuilt, me, leftNeighbor, rightNeighbor);
      if (wAff?.tradeCostTotal > 0 && wAff.canBuild) {
        trade = { leftCoins: wAff.leftCoins ?? 0, rightCoins: wAff.rightCoins ?? 0 };
      }
    }

    const action: PendingAction = { cardId: selectedCard.id, action: { type: actionType }, trade };
    socket.emit('game:action', action, (err) => {
      if (err) { setError(err); return; }
      setSelectedCard(null);
      setActionType(null);
      setError('');
    });
  }

  function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg) return;
    onChat?.(msg);
    setChatInput('');
  }

  if (state.phase === 'reveal' || state.phase === 'action') return <RevealDisplay state={state} />;
  if (state.phase === 'military') return <MilitaryDisplay state={state} />;
  if (state.phase === 'scoring' || state.phase === 'finished') {
    return <ScoringScreen state={state} onReturnToMenu={onReturnToMenu} />;
  }
  if (state.phase === 'choose_from_discard') {
    // If it's my turn to pick from discard, show the picker screen
    if (state.pendingDiscardPlayerId === state.myState.id) {
      return <DiscardPickerScreen state={state} />;
    }
    // Otherwise show a waiting message
    const pickerName = state.players.find(p => p.id === state.pendingDiscardPlayerId)?.name ?? '…';
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>📜</div>
        <h2 style={{ color: 'var(--color-gold)', marginBottom: 8 }}>Rankül activa</h2>
        <p style={{ color: 'var(--color-text-dim)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--color-text)' }}>{pickerName}</strong> está eligiendo
          una carta del descarte (Etapa 2 de su Pueblo).
        </p>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem', marginTop: 12 }}>
          El turno continuará cuando elija…
        </p>
      </div>
    );
  }

  if (state.phase === 'choose_extra_card') {
    // If it's my turn to play an extra card, show the picker screen
    if (state.pendingExtraCardPlayerId === state.myState.id) {
      return <ExtraCardPickerScreen state={state} />;
    }
    // Otherwise show a waiting message
    const pickerName = state.players.find(p => p.id === state.pendingExtraCardPlayerId)?.name ?? '…';
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔥</div>
        <h2 style={{ color: 'var(--color-gold)', marginBottom: 8 }}>Ofrenda del Fuego — Yámana</h2>
        <p style={{ color: 'var(--color-text-dim)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--color-text)' }}>{pickerName}</strong> está eligiendo
          su carta extra (Ofrenda del Fuego de Yámana).
        </p>
        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.82rem', marginTop: 12 }}>
          El turno continuará cuando elija…
        </p>
      </div>
    );
  }

  const waiting = me.isReady;

  // Check if any era has completed military tokens
  const hasAnyMilitary = state.players.some(p => p.militaryTokens.length > 0);

  return (
    <div style={{ padding: '6px 10px', maxWidth: 1600, margin: '0 auto', paddingBottom: 16 }}>

      {/* ── Game title ── */}
      <div style={{
        textAlign: 'center', paddingBottom: 4, paddingTop: 4, marginBottom: 4,
      }}>
        <span style={{
          fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-gold)',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          letterSpacing: '0.08em',
          textShadow: '0 0 18px rgba(184,192,201,0.35)',
        }}>
          Bajo la Cruz del Sur
        </span>
      </div>

      {/* ── Header bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--color-surface)', borderRadius: 8,
        padding: '7px 12px', marginBottom: 8, flexWrap: 'wrap',
      }}>
        {/* Era indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-gold)' }}>
            Era {state.age}
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3].map(era => (
              <div key={era} style={{
                width: 18, height: 6, borderRadius: 3,
                background: era < state.age
                  ? 'var(--color-gold)'
                  : era === state.age
                    ? 'var(--color-gold)'
                    : 'var(--color-surface2)',
                opacity: era < state.age ? 0.35 : 1,
                border: era === state.age ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                boxShadow: era === state.age ? '0 0 6px rgba(184,192,201,0.4)' : 'none',
              }} />
            ))}
          </div>
        </div>
        {/* Turn progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
            Turno {state.turn}/6
          </span>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5,6].map(t => (
              <div key={t} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: t <= state.turn ? 'var(--color-gold)' : 'var(--color-surface2)',
                opacity: t < state.turn ? 0.45 : 1,
                border: t === state.turn ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
              }} />
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
          {state.handDirection === 'left' ? '← izquierda' : '→ derecha'}
        </span>
        <span style={{ fontSize: '0.8rem', color: waiting ? 'var(--color-success)' : 'var(--color-gold)' }}>
          {waiting ? '⏳ Esperando…' : '🃏 Tu turno'}
        </span>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Live stats button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowStats(s => !s); setShowMilitary(false); }}
              style={{ background: 'var(--color-surface2)', color: 'var(--color-text-dim)', padding: '4px 10px', fontSize: '0.78rem', borderRadius: 20 }}
            >
              📊 Stats {showStats ? '▲' : '▼'}
            </button>
            {showStats && (
              <StatsDropdown players={state.players} onClose={() => setShowStats(false)} />
            )}
          </div>

          {/* Military history button */}
          {hasAnyMilitary && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowMilitary(s => !s); setShowStats(false); }}
                style={{ background: 'var(--color-surface2)', color: 'var(--color-text-dim)', padding: '4px 10px', fontSize: '0.78rem', borderRadius: 20 }}
              >
                ⚔ Batallas {showMilitary ? '▲' : '▼'}
              </button>
              {showMilitary && (
                <MilitaryHistoryDropdown players={state.players} onClose={() => setShowMilitary(false)} />
              )}
            </div>
          )}

          <button
            onClick={() => setShowHelp(true)}
            style={{ background: 'var(--color-surface2)', color: 'var(--color-text-dim)', padding: '4px 10px', fontSize: '0.78rem', borderRadius: 20 }}
          >
            ? Ayuda
          </button>

          {/* Abandon button */}
          <button
            onClick={() => setShowAbandon(true)}
            style={{ background: '#3a1414', color: '#f87171', padding: '4px 10px', fontSize: '0.78rem', borderRadius: 20, border: '1px solid #7f2929' }}
          >
            🚪 Salir
          </button>
        </div>
      </div>

      {/* ── Player status row ── */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
        {state.players.map((p, i) => (
          <PlayerInfo key={p.id} player={p} isMe={i === myIndex} />
        ))}
      </div>

      {/* ── Mobile tab bar ── */}
      <div className="mobile-tabs">
        <button
          className={mobileTab === 'left' ? 'active' : ''}
          onClick={() => setMobileTab('left')}
        >← {leftNeighbor.name}</button>
        <button
          className={mobileTab === 'me' ? 'active' : ''}
          onClick={() => setMobileTab('me')}
        >🏛 Yo</button>
        <button
          className={mobileTab === 'right' ? 'active' : ''}
          onClick={() => setMobileTab('right')}
        >{rightNeighbor.name} →</button>
      </div>

      {/* ── Main grid: neighbors + my area ── */}
      <div className="game-table" style={{ marginBottom: 8 }}>
        <div className="game-grid">

          {/* Left neighbor */}
          <div className={`mobile-panel ${mobileTab === 'left' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <NeighborCity title={`← ${leftNeighbor.name}`} player={leftNeighbor} />
          </div>

          {/* My city (centre) */}
          <div className={`mat-me mobile-panel ${mobileTab === 'me' ? 'mobile-visible' : 'mobile-hidden'}`}>
            {/* Wonder board — full view for the current player */}
            <div style={{ marginBottom: 10 }}>
              <WonderBoard player={me} />
            </div>

            {/* Built structures */}
            {me.builtStructures.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ciudad · {me.builtStructures.length} estructuras
                </div>
                <CityTableau structures={me.builtStructures} size="md" />
              </div>
            )}

            {/* ── Hand ── */}
            {!waiting && (
              <>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginBottom: 6 }}>
                  Mi mano ({me.hand.length} cartas) — toca una para seleccionarla
                </div>
                <div className="hand-scroll" style={{ marginBottom: 22, paddingTop: 8, paddingRight: 24, paddingLeft: 8, paddingBottom: 16 }}>
                  {me.hand.map(card => {
                    const aff = computeAffordability(card, me, leftNeighbor, rightNeighbor);
                    return (
                      <CardView
                        key={card.id}
                        card={card}
                        selected={selectedCard?.id === card.id}
                        dimmed={!aff.canBuild && !aff.isFree}
                        freeReason={aff.isFree ? aff.freeReason : undefined}
                        tradeCost={aff.tradeCostTotal > 0 ? { total: aff.tradeCostTotal, leftCoins: aff.leftCoins, rightCoins: aff.rightCoins } : undefined}
                        onClick={() => {
                          setSelectedCard(card);
                          setActionType(null);
                          setError('');
                        }}
                      />
                    );
                  })}
                </div>

                {selectedCard && (() => {
                  const wonderStageCost = getWonderStageCost(me.wonderId, me.wonderStagesBuilt);
                  const wonderAff = wonderStageCost
                    ? computeWonderAffordability(me.wonderId, me.wonderStagesBuilt, me, leftNeighbor, rightNeighbor)
                    : null;
                  return (
                    <ActionPanel
                      card={selectedCard}
                      wonderStagesBuilt={me.wonderStagesBuilt}
                      aff={computeAffordability(selectedCard, me, leftNeighbor, rightNeighbor)}
                      wonderAff={wonderAff}
                      wonderStageCostStr={wonderStageCost ? formatCost(wonderStageCost) : null}
                      actionType={actionType}
                      onAction={setActionType}
                      onConfirm={submitAction}
                      onCancel={cancelSelection}
                      error={error}
                    />
                  );
                })()}
              </>
            )}

            {waiting && (
              <div style={{ textAlign: 'center', padding: 16, color: 'var(--color-text-dim)' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--color-success)', marginBottom: 8 }}>✓ Acción enviada</div>
                <WaitingDots players={state.players} myIndex={myIndex} />
              </div>
            )}
          </div>

          {/* Right neighbor */}
          <div className={`mobile-panel ${mobileTab === 'right' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <NeighborCity title={`${rightNeighbor.name} →`} player={rightNeighbor} />
          </div>
        </div>{/* end game-grid */}
      </div>{/* end game-table */}

      {/* ── Bottom panel: Chat + Log ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 10,
      }}>
        {/* Chat panel */}
        <div style={{
          background: 'linear-gradient(135deg, #131008, #0d0b06)',
          borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          minHeight: 140, maxHeight: 200,
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', padding: '7px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            💬 Chat
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px', scrollbarWidth: 'thin' }}>
            {chatMessages.length === 0 ? (
              <div style={{ color: 'var(--color-text-dim)', fontSize: '0.72rem', fontStyle: 'italic', padding: '6px 0' }}>
                Nadie ha escrito aún…
              </div>
            ) : (
              chatMessages.map((m, i) => {
                const isSystem = m.playerName === '⚡ Sistema';
                return (
                  <div key={i} style={{ fontSize: '0.75rem', padding: '2px 0', color: isSystem ? 'var(--color-text-dim)' : 'var(--color-text)', fontStyle: isSystem ? 'italic' : 'normal' }}>
                    {!isSystem && <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>{m.playerName}: </span>}
                    <span>{m.text}</span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendChat} style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '4px 8px', gap: 6 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Escribe un mensaje…"
              maxLength={200}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4, padding: '4px 8px', fontSize: '0.75rem',
                color: 'var(--color-text)', fontFamily: 'inherit',
              }}
            />
            <button
              type="submit"
              style={{ background: 'var(--color-surface2)', color: 'var(--color-text-dim)', padding: '4px 10px', fontSize: '0.72rem', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ↵
            </button>
          </form>
        </div>

        {/* Log panel */}
        <div style={{
          background: 'linear-gradient(135deg, #131008, #0d0b06)',
          borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.4)',
          minHeight: 140, maxHeight: 200, overflowY: 'auto',
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', padding: '7px 12px 4px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            📜 Registro
          </div>
          <div style={{ padding: '4px 12px' }}>
            {state.log.length === 0 ? (
              <div style={{ color: 'var(--color-text-dim)', fontSize: '0.72rem', fontStyle: 'italic', padding: '6px 0' }}>Sin eventos aún.</div>
            ) : (
              [...state.log].reverse().slice(0, 14).map((entry, i) => (
                <div key={i}>{colorizeLog(entry, i === 0)}</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', padding: '6px 0 2px', color: 'var(--color-text-dim)', fontSize: '0.65rem', letterSpacing: '0.04em' }}>
        © By Pipo · Bajo la Cruz del Sur
      </div>

      {/* ── Cheat sheet overlay ── */}
      {showHelp && <CheatSheet onClose={() => setShowHelp(false)} />}

      {/* ── Abandon confirmation modal ── */}
      {showAbandon && (
        <div className="overlay-bg" onClick={() => setShowAbandon(false)}>
          <div className="overlay-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 360, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🚪</div>
            <h3 style={{ color: 'var(--color-gold)', marginBottom: 8, fontSize: '1.1rem' }}>¿Abandonar la partida?</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.5 }}>
              Todos los jugadores serán enviados al menú principal. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setShowAbandon(false)}
                style={{ background: 'var(--color-surface2)', color: 'var(--color-text)', padding: '10px 24px' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowAbandon(false); onAbandon?.(); }}
                style={{ background: '#7f2929', color: '#fff', padding: '10px 24px', fontWeight: 700 }}
              >
                🚪 Sí, abandonar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Stats dropdown ─────────────────────────────────────────────────────── */
function StatsDropdown({ players, onClose }: { players: PublicPlayerState[]; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'absolute', top: '110%', right: 0, zIndex: 50,
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 8, padding: '10px 14px', minWidth: 280,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
      onMouseLeave={onClose}
    >
      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        📊 Estadísticas visibles
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '3px 6px', color: 'var(--color-text-dim)', fontWeight: 600 }}>Jugador</th>
            <th style={{ textAlign: 'center', padding: '3px 6px', color: 'var(--color-text-dim)', fontWeight: 600 }}>💰</th>
            <th style={{ textAlign: 'center', padding: '3px 6px', color: 'var(--color-text-dim)', fontWeight: 600 }}>🛡</th>
            <th style={{ textAlign: 'center', padding: '3px 6px', color: 'var(--color-text-dim)', fontWeight: 600 }}>🏛</th>
            <th style={{ textAlign: 'center', padding: '3px 6px', color: 'var(--color-text-dim)', fontWeight: 600 }}>🃏</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => {
            const militaryTotal = p.militaryTokens.reduce((s, t) => s + t.value, 0);
            return (
              <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '4px 6px', color: 'var(--color-text)', fontWeight: 500, whiteSpace: 'nowrap', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </td>
                <td style={{ padding: '4px 6px', textAlign: 'center', color: '#fcd34d' }}>{p.coins}</td>
                <td style={{ padding: '4px 6px', textAlign: 'center', color: '#93c5fd' }}>{p.shields}</td>
                <td style={{ padding: '4px 6px', textAlign: 'center', color: 'var(--color-gold)' }}>{p.wonderStagesBuilt}</td>
                <td style={{ padding: '4px 6px', textAlign: 'center', color: militaryTotal >= 0 ? '#4ade80' : '#f87171' }}>
                  {militaryTotal > 0 ? `+${militaryTotal}` : militaryTotal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)', marginTop: 6, lineHeight: 1.4 }}>
        🏛 Etapas maravilla · 🃏 Puntos militares netos
      </div>
    </div>
  );
}

/* ── Military history dropdown ──────────────────────────────────────────── */
function MilitaryHistoryDropdown({ players, onClose }: { players: PublicPlayerState[]; onClose: () => void }) {
  type Age = 1 | 2 | 3;
  const completedAges = ([1, 2, 3] as Age[]).filter(age =>
    players.some(p => p.militaryTokens.some((t: MilitaryToken) => t.age === age))
  );

  return (
    <div
      style={{
        position: 'absolute', top: '110%', right: 0, zIndex: 50,
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 8, padding: '10px 14px', minWidth: 300,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
      onMouseLeave={onClose}
    >
      <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        ⚔ Historial de batallas
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '3px 6px', color: 'var(--color-text-dim)', fontWeight: 600 }}>Jugador</th>
            {completedAges.map(age => (
              <th key={age} style={{ textAlign: 'center', padding: '3px 8px', color: 'var(--color-gold)', fontWeight: 600 }}>
                Era {age}
              </th>
            ))}
            <th style={{ textAlign: 'center', padding: '3px 6px', color: 'var(--color-text-dim)', fontWeight: 600 }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => {
            const total = p.militaryTokens.reduce((s, t) => s + t.value, 0);
            return (
              <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '4px 6px', color: 'var(--color-text)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {p.name}
                </td>
                {completedAges.map(age => {
                  const ageTokens = p.militaryTokens.filter((t: MilitaryToken) => t.age === age);
                  const ageSum = ageTokens.reduce((s, t) => s + t.value, 0);
                  const wins = ageTokens.filter(t => t.value > 0).length;
                  const losses = ageTokens.filter(t => t.value < 0).length;
                  return (
                    <td key={age} style={{
                      padding: '4px 8px', textAlign: 'center',
                      color: ageSum > 0 ? '#4ade80' : ageSum < 0 ? '#f87171' : 'var(--color-text-dim)',
                      fontWeight: 600,
                    }}>
                      {ageTokens.length === 0 ? '—' : (
                        <span title={`${wins}V / ${losses}D`}>
                          {ageSum > 0 ? '+' : ''}{ageSum}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td style={{
                  padding: '4px 6px', textAlign: 'center',
                  fontWeight: 700,
                  color: total > 0 ? '#4ade80' : total < 0 ? '#f87171' : 'var(--color-text-dim)',
                }}>
                  {total > 0 ? `+${total}` : total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Neighbor city panel ────────────────────────────────────────────────── */
function NeighborCity({ title, player }: { title: string; player: PublicPlayerState }) {
  return (
    <div className="mat-neighbor">
      {/* Header */}
      <div style={{
        fontSize: '0.78rem', fontWeight: 700, marginBottom: 8,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ color: player.hasChosen ? 'var(--color-success)' : 'var(--color-text)' }}>
          {title} {player.hasChosen ? '✓' : '⋯'}
        </span>
        <span style={{ color: 'var(--color-text-dim)', fontWeight: 400, fontSize: '0.72rem' }}>
          💰{player.coins} 🛡{player.shields} 🃏{player.handSize}
        </span>
      </div>

      {/* Wonder strip */}
      <div style={{ marginBottom: 8 }}>
        <WonderBoard player={player} compact />
      </div>

      {/* City */}
      <CityTableau structures={player.builtStructures} size="sm" />
    </div>
  );
}

/* ── Waiting dots ───────────────────────────────────────────────────────── */
function WaitingDots({ players, myIndex }: { players: { name: string; hasChosen: boolean }[]; myIndex: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 6, flexWrap: 'wrap' }}>
      {players.map((p, i) => (
        <span key={i} style={{
          padding: '3px 9px', borderRadius: 20, fontSize: '0.76rem',
          background: p.hasChosen ? '#1a3d2a' : 'var(--color-surface2)',
          border: i === myIndex ? '1px solid var(--color-gold)' : '1px solid transparent',
          color: p.hasChosen ? 'var(--color-success)' : 'var(--color-text-dim)',
        }}>
          {p.hasChosen ? '✓ ' : '⏳ '}{p.name}
        </span>
      ))}
    </div>
  );
}

/* ── Action panel ───────────────────────────────────────────────────────── */
function ActionPanel({
  card, wonderStagesBuilt, aff, wonderAff, wonderStageCostStr,
  actionType, onAction, onConfirm, onCancel, error,
}: {
  card: Card;
  wonderStagesBuilt: number;
  aff: { canBuild: boolean; isFree: boolean; tradeCostTotal: number; leftCoins: number; rightCoins: number };
  wonderAff: WonderAffordability | null;
  wonderStageCostStr: string | null;
  actionType: 'build_structure' | 'build_wonder_stage' | 'discard' | null;
  onAction: (t: 'build_structure' | 'build_wonder_stage' | 'discard') => void;
  onConfirm: () => void;
  onCancel: () => void;
  error: string;
}) {
  const tradeDir = aff.tradeCostTotal > 0
    ? (aff.leftCoins > 0 && aff.rightCoins > 0
        ? `←${aff.leftCoins} →${aff.rightCoins}💰`
        : aff.leftCoins > 0 ? `←${aff.leftCoins}💰` : `→${aff.rightCoins}💰`)
    : '';
  const buildLabel = aff.isFree
    ? '🏗 Construir (gratis)'
    : aff.tradeCostTotal > 0
    ? `🏗 Construir (${tradeDir} comercio)`
    : aff.canBuild
    ? '🏗 Construir'
    : '🏗 Construir (sin recursos)';

  const wonderLabel = wonderStageCostStr
    ? `🏛 Etapa ${wonderStagesBuilt + 1} · ${wonderStageCostStr}${wonderAff?.tradeCostTotal ? ` +${wonderAff.tradeCostTotal}💰` : ''}`
    : `🏛 Etapa ${wonderStagesBuilt + 1}`;

  return (
    <div style={{
      background: 'var(--color-surface2)', borderRadius: 8,
      padding: '10px 12px', border: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-gold)', flex: 1 }}>
          {card.name}
        </div>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent', color: 'var(--color-text-dim)',
            padding: '2px 8px', fontSize: '0.78rem', borderRadius: 4,
            border: '1px solid var(--color-border)',
          }}
        >
          ✕ Cancelar
        </button>
      </div>

      <div className="action-btns">
        {/* Build structure */}
        <button
          onClick={() => onAction('build_structure')}
          style={{
            background: actionType === 'build_structure' ? 'var(--color-accent)' : 'var(--color-surface)',
            color: '#fff', padding: '7px 13px', fontSize: '0.82rem',
            opacity: aff.canBuild || actionType === 'build_structure' ? 1 : 0.55,
          }}
        >
          {buildLabel}
        </button>

        {/* Build wonder */}
        {wonderStagesBuilt < 3 && (
          <button
            onClick={() => onAction('build_wonder_stage')}
            title={`Sacrificás esta carta para construir la etapa ${wonderStagesBuilt + 1} de tu Pueblo. Costo: ${wonderStageCostStr ?? '—'}`}
            style={{
              background: actionType === 'build_wonder_stage' ? 'var(--color-silver-dim)' : 'var(--color-surface)',
              color: '#fff', padding: '7px 13px', fontSize: '0.82rem',
              opacity: wonderAff?.canBuild === false && actionType !== 'build_wonder_stage' ? 0.55 : 1,
            }}
          >
            {wonderLabel}
          </button>
        )}

        {/* Discard */}
        <button
          onClick={() => onAction('discard')}
          style={{
            background: actionType === 'discard' ? '#444' : 'var(--color-surface)',
            color: 'var(--color-text-dim)', padding: '7px 13px', fontSize: '0.82rem',
          }}
        >
          🗑 Descartar (+3💰)
        </button>

        {actionType && (
          <button
            onClick={onConfirm}
            style={{ background: '#1a6b35', color: '#fff', padding: '7px 18px', fontWeight: 700, fontSize: '0.85rem' }}
          >
            ✓ Confirmar
          </button>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--color-accent)' }}>
          ✗ {error}
        </div>
      )}

      {!aff.canBuild && !error && actionType !== 'build_wonder_stage' && (
        <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
          Sin recursos para construir esta carta — podés descartarla (+3💰) o usarla para tu Pueblo.
        </div>
      )}
      {actionType === 'build_wonder_stage' && wonderAff && !wonderAff.canBuild && !error && (
        <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#d97706' }}>
          ⚠ Necesitás {wonderStageCostStr} para construir esta etapa. Construí cartas de recursos primero.
        </div>
      )}
    </div>
  );
}
