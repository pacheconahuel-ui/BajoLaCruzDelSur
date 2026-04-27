import { Card, CardColor } from '@7wonders/shared';
import TableauCard from './TableauCard';

const COLOR_ORDER: CardColor[] = ['brown', 'gray', 'blue', 'green', 'yellow', 'red', 'purple'];

// Full labels for md (main city), short for sm (neighbor panels)
const COLOR_LABEL_MD: Record<CardColor, string> = {
  brown:  'Materia',
  gray:   'Manufactura',
  blue:   'Civil',
  green:  'Ciencia',
  yellow: 'Comercial',
  red:    'Militar',
  purple: 'Lof',
};

const COLOR_LABEL_SM: Record<CardColor, string> = {
  brown:  'MAT.',
  gray:   'MAN.',
  blue:   'CIV.',
  green:  'CIE.',
  yellow: 'COM.',
  red:    'MIL.',
  purple: 'GLD.',
};

// Visible peek per card when stacked
const OVERLAP: Record<'md' | 'sm', number> = { md: 40, sm: 25 };

// md: 78 + 42 + 28 + 4 = ~152px   sm: 48 + 30 + 22 + 4 = ~104px
const CARD_H: Record<'md' | 'sm', number> = { md: 152, sm: 104 };

const COL_W: Record<'md' | 'sm', number> = { md: 122, sm: 76 };

interface Props {
  structures: Card[];
  size?: 'md' | 'sm';
  onCardPress?: (card: Card) => void;
}

export default function CityTableau({ structures, size = 'md', onCardPress }: Props) {
  const byColor: Partial<Record<CardColor, Card[]>> = {};
  for (const card of structures) {
    (byColor[card.color] ??= []).push(card);
  }

  const overlap  = OVERLAP[size];
  const cardH    = CARD_H[size];
  const colW     = COL_W[size];
  const labels   = size === 'md' ? COLOR_LABEL_MD : COLOR_LABEL_SM;
  const labelSz  = size === 'md' ? '0.6rem' : '0.5rem';

  if (structures.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem', fontStyle: 'italic', margin: '4px 0' }}>
        Ciudad vacía
      </p>
    );
  }

  return (
    <div style={{
      display: 'flex',
      gap: size === 'md' ? 8 : 5,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      maxWidth: '100%',
    }}>
      {COLOR_ORDER.map(color => {
        const cards = byColor[color];
        if (!cards?.length) return null;

        // Container height = bottom edge of last card
        const stackH = (cards.length - 1) * overlap + cardH;

        return (
          <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Column label */}
            <div style={{
              fontSize: labelSz,
              color: 'var(--color-text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 3,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              {labels[color]} {cards.length}
            </div>

            {/* Stacked cards — height exactly fits all cards */}
            <div style={{ position: 'relative', height: stackH, width: colW, flexShrink: 0 }}>
              {cards.map((card, i) => (
                <div
                  key={card.id}
                  style={{
                    position: 'absolute',
                    top: i * overlap,
                    left: 0,
                    zIndex: i + 1,
                  }}
                >
                  <TableauCard card={card} size={size} onClick={onCardPress ? () => onCardPress(card) : undefined} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
