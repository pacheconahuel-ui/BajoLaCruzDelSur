import { useState } from 'react';
import { PublicGameState, Card, PendingAction, PublicPlayerState } from '@7wonders/shared';
import { socket } from '../socket/socket';
import CardView from '../components/CardView';
import CityTableau from '../components/CityTableau';
import WonderBoard from '../components/WonderBoard';
import PlayerInfo from '../components/PlayerInfo';
import RevealDisplay from './RevealDisplay';
import MilitaryDisplay from './MilitaryDisplay';
import ScoringScreen from './ScoringScreen';
import DiscardPickerScreen from './DiscardPickerScreen';
import { computeAffordability, computeWonderAffordability, getWonderStageCost, WonderAffordability } from '../utils/affordability';
import { formatCost } from '../utils/icons';
import CheatSheet from '../components/CheatSheet';

interface Props {
  state: PublicGameState;
}

export default function GamePage({ state }: Props) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [actionType, setActionType] = useState<'build_structure' | 'build_wonder_stage' | 'discard' | null>(null);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [mobileTab, setMobileTab] = useState<'me' | 'left' | 'right'>('me');

  function cancelSelection() {
    setSelectedCard(null);
    setActionType(null);
    setError('');
  }

  const me = state.myState;
  const myIndex = state.myIndex;
  const n = state.players.length;
  const leftNeighbor  = state.players[(myIndex - 1 + n) % n];
  const rightNeighbor = state.players[(myIndex + 1) % n];

  function submitAction() {
    if (!selectedCard || !actionType) return;
    const action: PendingAction = { cardId: selectedCard.id, action: { type: actionType } };
    socket.emit('game:action', action, (err) => {
      if (err) { setError(err); return; }
      setSelectedCard(null);
      setActionType(null);
      setError('');
    });
  }

  if (state.phase === 'reveal' || state.phase === 'action') return <RevealDisplay state={state} />;
  if (state.phase === 'military') return <MilitaryDisplay state={state} />;
  if (state.phase === 'scoring' || state.phase === 'finished') return <ScoringScreen state={state} />;
  if (state.phase === 'choose_from_discard') return <DiscardPickerScreen state={state} />;

  const waiting = me.isReady;

  return (
    <div style={{ padding: '8px 10px', maxWidth: 1200, margin: '0 auto', paddingBottom: 24 }}>

      {/* ── Header bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--color-surface)', borderRadius: 8,
        padding: '7px 12px', marginBottom: 8, flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-gold)' }}>
          ⚱ Era {state.age}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
          Turno {state.turn}/6 · {state.handDirection === 'left' ? '← izquierda' : '→ derecha'}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.8rem', color: waiting ? 'var(--color-success)' : 'var(--color-gold)' }}>
            {waiting ? '⏳ Esperando…' : '🃏 Tu turno'}
          </span>
          <button
            onClick={() => setShowHelp(true)}
            style={{ background: 'var(--color-surface2)', color: 'var(--color-text-dim)', padding: '4px 10px', fontSize: '0.8rem', borderRadius: 20 }}
          >
            ? Ayuda
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
          {/* Wonder board */}
          <div style={{ marginBottom: 10 }}>
            <WonderBoard player={me} compact />
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
                      // Never fully disabled — player can always discard.
                      // We dim the card visually if unaffordable, but keep it clickable.
                      dimmed={!aff.canBuild}
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

      {/* ── Log ── */}
      {state.log.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #131008, #0d0b06)',
          borderRadius: 8, padding: '8px 12px',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.4)',
        }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-dim)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            📜 Registro
          </div>
          {[...state.log].reverse().slice(0, 4).map((entry, i) => (
            <div key={i} style={{
              fontSize: '0.75rem', padding: '3px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              color: i === 0 ? 'var(--color-text)' : 'var(--color-text-dim)',
              fontStyle: i === 0 ? 'normal' : 'italic',
            }}>
              {i === 0 ? '▶ ' : '  '}{entry}
            </div>
          ))}
        </div>
      )}

      {/* ── Cheat sheet overlay ── */}
      {showHelp && <CheatSheet onClose={() => setShowHelp(false)} />}
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
          💰{player.coins} 🛡{player.shields}
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
            title={`Sacrificás esta carta para construir la etapa ${wonderStagesBuilt + 1} de tu Maravilla. Costo: ${wonderStageCostStr ?? '—'}`}
            style={{
              background: actionType === 'build_wonder_stage' ? '#b8860b' : 'var(--color-surface)',
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
          Sin recursos para construir esta carta — podés descartarla (+3💰) o usarla para tu Maravilla.
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

