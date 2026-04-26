import { useState } from 'react';
import { Card } from '@7wonders/shared';
import { COLOR_BG, COLOR_IMG, COLOR_ACCENT, COLOR_LABEL, formatCost, formatEffect, formatEffectReadable } from '../utils/icons';
import { getCardImageName } from '../utils/cardImageMap';

interface Props {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  dimmed?: boolean;
  compact?: boolean;
  tradeCost?: { total: number; leftCoins?: number; rightCoins?: number };
  freeReason?: 'chain' | 'olympia';
  onInfoPress?: (card: Card) => void;
}

function CardTooltip({ card, accent }: { card: Card; accent: string }) {
  const costStr = formatCost(card.cost);
  const effectLines = formatEffectReadable(card.effects).split('\n');
  return (
    <div style={{
      position: 'absolute', bottom: '105%', left: '50%',
      transform: 'translateX(-50%)',
      background: '#111820',
      border: `1px solid ${accent}`,
      borderRadius: 8,
      padding: '10px 12px',
      minWidth: 200,
      maxWidth: 260,
      zIndex: 100,
      boxShadow: `0 4px 24px rgba(0,0,0,0.8), 0 0 0 1px ${accent}44`,
      pointerEvents: 'none',
    }}>
      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', marginBottom: 6 }}>
        {card.name}
      </div>
      {effectLines.map((line, i) => (
        <div key={i} style={{ fontSize: '0.78rem', color: '#cdd6e0', lineHeight: 1.5 }}>
          {line}
        </div>
      ))}
      <div style={{
        marginTop: 6, paddingTop: 6,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Costo: {costStr}</span>
        {card.chainFrom && <span>⛓ {card.chainFrom}</span>}
      </div>
    </div>
  );
}

export default function CardView({ card, selected, onClick, disabled, dimmed, compact, tradeCost, freeReason, onInfoPress }: Props) {
  const [hovered, setHovered] = useState(false);
  const bg     = COLOR_BG[card.color];
  const img    = COLOR_IMG[card.color];
  const accent = COLOR_ACCENT[card.color];
  const label  = COLOR_LABEL[card.color];
  const costStr   = formatCost(card.cost);
  const effectStr = formatEffect(card.effects);

  if (compact) {
    return (
      <div
        title={`${card.name} | ${label} | Costo: ${costStr} | ${effectStr}`}
        style={{
          background: bg,
          borderLeft: `3px solid ${accent}`,
          borderRadius: 4,
          padding: '3px 7px',
          fontSize: '0.68rem',
          fontWeight: 600,
          color: '#fff',
          opacity: (disabled || dimmed) ? 0.45 : 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 112,
          cursor: disabled ? 'default' : 'default',
        }}
      >
        {card.name}
      </div>
    );
  }

  const isClickable = !disabled;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        border: selected ? `2px solid #fff` : `1.5px solid ${accent}`,
        borderRadius: 10,
        cursor: disabled ? 'default' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.4 : dimmed ? 0.6 : 1,
        width: 162,
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 0.14s, box-shadow 0.14s, opacity 0.14s',
        transform: selected ? 'scale(1.07)' : 'none',
        zIndex: hovered ? 50 : selected ? 10 : 1,
        boxShadow: selected
          ? `0 8px 28px rgba(0,0,0,0.9), 0 0 0 2px ${accent}, 0 0 24px ${accent}66`
          : '0 4px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
        overflow: 'visible',
        userSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      {hovered && !selected && <CardTooltip card={card} accent={accent} />}
      {/* Inner clip wrapper to keep rounded corners on card content */}
      <div style={{ borderRadius: 9, overflow: 'hidden' }}>
      {/* Illustration — top 55% of card */}
      <div style={{
        height: 132,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        position: 'relative',
      }}>
        {/* Card-specific art overlay — hides itself if image not found yet */}
        <img
          src={`/assets/cards/${getCardImageName(card.id)}.png`}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {/* Color header strip overlaid on image */}
        <div style={{
          background: `linear-gradient(180deg, ${accent}bb 0%, ${accent}66 100%)`,
          padding: '2px 6px',
          fontSize: '0.52rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(2px)',
        }}>
          {label}
        </div>
        {/* Gradient fade to card body */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 42,
          background: `linear-gradient(transparent, ${bg})`,
        }} />
      </div>

      {/* Card name */}
      <div style={{
        padding: '4px 8px 2px',
        fontSize: '0.85rem',
        fontWeight: 600,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        lineHeight: 1.2,
        color: '#fff',
        minHeight: 30,
        background: bg,
      }}>
        {card.name}
      </div>

      {/* Effect */}
      <div style={{
        padding: '0 8px 5px',
        fontSize: '0.78rem',
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 600,
        minHeight: 20,
        background: bg,
      }}>
        {effectStr}
      </div>

      {/* Cost footer */}
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        padding: '3px 8px',
        fontSize: '0.66rem',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>
          {freeReason === 'chain' ? (
            <span style={{ color: '#4ade80' }}>⛓ gratis (cadena)</span>
          ) : freeReason === 'olympia' ? (
            <span style={{ color: '#a78bfa' }}>🏛 gratis (Selk'nam)</span>
          ) : (
            costStr
          )}
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {card.chainFrom && (
            <span title={`Gratis si tenés: ${card.chainFrom}`} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6rem' }}>
              ⛓{card.chainFrom.slice(0, 8)}
            </span>
          )}
          {card.chainTo && card.chainTo.length > 0 && (
            <span title={`Desbloquea: ${card.chainTo.join(', ')}`} style={{ color: '#fcd34d', fontSize: '0.62rem' }}>
              ⛓→
            </span>
          )}
        </div>
      </div>
      </div>{/* end inner clip wrapper */}

      {/* Info button — tap to see full card details (useful on mobile) */}
      {onInfoPress && (
        <button
          onClick={e => { e.stopPropagation(); onInfoPress(card); }}
          style={{
            position: 'absolute', bottom: -6, left: -6,
            background: 'rgba(30,30,40,0.9)',
            border: `1px solid ${accent}88`,
            borderRadius: '50%',
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', color: accent, fontWeight: 800,
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            zIndex: 20,
            lineHeight: 1,
            padding: 0,
          }}
          title="Ver detalle de carta"
          aria-label="Ver detalle"
        >
          ⓘ
        </button>
      )}

      {/* Trade cost badge with direction */}
      {tradeCost && tradeCost.total > 0 && (() => {
        const l = tradeCost.leftCoins ?? 0;
        const r = tradeCost.rightCoins ?? 0;
        const label = l > 0 && r > 0
          ? `←${l} →${r}💰`
          : l > 0 ? `←${l}💰`
          : `→${r}💰`;
        return (
          <div style={{
            position: 'absolute', top: -5, right: -5,
            background: 'var(--color-accent)',
            borderRadius: 8,
            padding: '2px 5px',
            fontSize: '0.58rem', fontWeight: 700, color: '#fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </div>
        );
      })()}

      {/* Free-build badge (chain / Olympia) */}
      {freeReason && !selected && (
        <div style={{
          position: 'absolute', top: -5, left: -5,
          background: freeReason === 'chain' ? '#15803d' : '#6b21a8',
          borderRadius: 8,
          padding: '2px 5px',
          fontSize: '0.58rem', fontWeight: 700, color: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          whiteSpace: 'nowrap',
        }}>
          {freeReason === 'chain' ? '⛓ gratis' : '🏛 gratis'}
        </div>
      )}

      {/* "Can't build" overlay indicator (dimmed cards) */}
      {dimmed && !selected && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 10,
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}
