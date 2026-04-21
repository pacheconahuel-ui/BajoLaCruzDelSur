import { Card } from '@7wonders/shared';
import { COLOR_BG, COLOR_IMG, COLOR_ACCENT, COLOR_LABEL, formatCost, formatEffect } from '../utils/icons';

interface Props {
  card: Card;
  size?: 'md' | 'sm';
}

export default function TableauCard({ card, size = 'md' }: Props) {
  const bg     = COLOR_BG[card.color];
  const accent = COLOR_ACCENT[card.color];
  const label  = COLOR_LABEL[card.color];
  const costStr   = formatCost(card.cost);
  const effectStr = formatEffect(card.effects);

  const img         = COLOR_IMG[card.color];
  const w           = size === 'md' ? 96 : 62;
  const imgH        = size === 'md' ? 60 : 36;
  const nameSize    = size === 'md' ? '0.68rem' : '0.58rem';
  const effectSize  = size === 'md' ? '0.66rem' : '0.56rem';
  const footerPad   = size === 'md' ? '3px 6px 5px' : '2px 4px 3px';
  const minNameH    = size === 'md' ? 32 : 22;

  return (
    <div
      title={`${card.name} | ${label} | Costo: ${costStr} | ${effectStr}`}
      style={{
        width: w,
        background: bg,
        borderRadius: 5,
        border: `1.5px solid ${accent}`,
        overflow: 'hidden',
        boxShadow: '0 4px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Illustration */}
      <div style={{
        height: imgH,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        position: 'relative',
      }}>
        {/* Color label on top of image */}
        <div style={{
          background: `${accent}dd`,
          padding: size === 'md' ? '2px 6px' : '2px 4px',
          fontSize: '0.5rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.95)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </div>
        {/* Fade to bg */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 14,
          background: `linear-gradient(transparent, ${bg})`,
        }} />
      </div>

      {/* Card name */}
      <div style={{
        padding: size === 'md' ? '3px 6px 2px' : '2px 5px 1px',
        fontSize: nameSize,
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1.25,
        minHeight: minNameH,
        background: bg,
      }}>
        {card.name}
      </div>

      {/* Effect row */}
      <div style={{
        padding: footerPad,
        fontSize: effectSize,
        color: 'rgba(255,255,255,0.88)',
        fontWeight: 600,
        borderTop: `1px solid rgba(255,255,255,0.1)`,
        background: bg,
      }}>
        {effectStr || '—'}
      </div>
    </div>
  );
}
