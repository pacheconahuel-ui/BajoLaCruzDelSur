import { Card } from '@7wonders/shared';
import { COLOR_BG, COLOR_IMG, COLOR_ACCENT, COLOR_LABEL, formatCost, formatEffect } from '../utils/icons';

interface Props {
  card: Card;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  dimmed?: boolean;
  compact?: boolean;
  tradeCost?: { total: number; leftCoins?: number; rightCoins?: number };
}

export default function CardView({ card, selected, onClick, disabled, dimmed, compact, tradeCost }: Props) {
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
        zIndex: selected ? 10 : 1,
        boxShadow: selected
          ? `0 8px 28px rgba(0,0,0,0.9), 0 0 0 2px ${accent}, 0 0 24px ${accent}66`
          : '0 4px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        userSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      {/* Illustration — top 55% of card */}
      <div style={{
        height: 132,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        position: 'relative',
      }}>
        {/* Color header strip overlaid on image */}
        <div style={{
          background: `linear-gradient(180deg, ${accent}ee 0%, ${accent}99 100%)`,
          padding: '3px 7px',
          fontSize: '0.58rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.95)',
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
        fontSize: '0.78rem',
        fontWeight: 700,
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
        <span>{costStr}</span>
        {card.chainTo && card.chainTo.length > 0 && (
          <span title={`Desbloquea: ${card.chainTo.join(', ')}`} style={{ color: '#fcd34d', fontSize: '0.62rem' }}>
            ⛓
          </span>
        )}
      </div>

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
            background: '#c8650f',
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
