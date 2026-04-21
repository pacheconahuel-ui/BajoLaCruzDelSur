import { PublicPlayerState, PlayerState } from '@7wonders/shared';

const WONDER_NAMES: Record<string, string> = {
  colossus:      'Coloso de Rodas',
  lighthouse:    'Faro de Alejandría',
  temple:        'Artemisa de Éfeso',
  babylon:       'Jardines de Babilonia',
  olympia:       'Zeus en Olimpia',
  halicarnassus: 'Mausoleo de Halicarnaso',
  giza:          'Pirámides de Giza',
};

const WONDER_IMG: Record<string, string> = {
  colossus:      '/assets/wonders/wonder-colossus.png',
  lighthouse:    '/assets/wonders/wonder-lighthouse.png',
  temple:        '/assets/wonders/wonder-temple.png',
  babylon:       '/assets/wonders/wonder-babylon.png',
  olympia:       '/assets/wonders/wonder-olympia.png',
  halicarnassus: '/assets/wonders/wonder-halicarnassus.png',
  giza:          '/assets/wonders/wonder-giza.png',
};

interface Props {
  player: PublicPlayerState | PlayerState;
  compact?: boolean;
}

function StageSlots({ built, total, size }: { built: number; total: number; size: 'sm' | 'md' }) {
  return (
    <div style={{ display: 'flex', gap: size === 'sm' ? 4 : 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: size === 'sm' ? 1 : undefined,
          width: size === 'sm' ? undefined : 34,
          height: size === 'sm' ? 22 : 34,
          borderRadius: size === 'sm' ? 4 : 6,
          background: i < built ? 'linear-gradient(135deg, #d4a017, #8a6a10)' : 'rgba(255,255,255,0.05)',
          border: i < built ? `${size === 'sm' ? 1 : 1.5}px solid #fcd34d` : `${size === 'sm' ? 1 : 1.5}px solid rgba(255,255,255,0.12)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size === 'sm' ? '0.6rem' : '0.75rem',
          fontWeight: 700,
          color: i < built ? '#fff' : 'var(--color-text-dim)',
          boxShadow: i < built ? '0 0 6px rgba(212,160,23,0.4)' : 'none',
          transition: 'all 0.2s',
        }}>
          {i < built ? '★' : i + 1}
        </div>
      ))}
    </div>
  );
}

export default function WonderBoard({ player, compact }: Props) {
  const built = player.wonderStagesBuilt;
  const total = 3;
  const img   = WONDER_IMG[player.wonderId];
  const name  = WONDER_NAMES[player.wonderId] ?? player.wonderId;

  if (compact) {
    // ── Neighbor mini board ──
    return (
      <div style={{
        borderRadius: 6,
        border: '1px solid var(--color-gold-dim)',
        overflow: 'hidden',
      }}>
        {/* Illustration strip with name overlay */}
        <div style={{
          height: 60,
          backgroundImage: img ? `url(${img})` : undefined,
          backgroundColor: '#1c1610',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(transparent 20%, rgba(0,0,0,0.75) 100%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 5, left: 8, right: 8,
            fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-gold)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
        </div>

        {/* Stage slots */}
        <div style={{ padding: '5px 8px', background: 'rgba(0,0,0,0.5)' }}>
          <StageSlots built={built} total={total} size="sm" />
        </div>
      </div>
    );
  }

  // ── My city full board ──
  return (
    <div style={{
      borderRadius: 8,
      border: '1px solid var(--color-gold-dim)',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    }}>
      {/* Illustration banner */}
      <div style={{
        height: 92,
        backgroundImage: img ? `url(${img})` : undefined,
        backgroundColor: '#1c1610',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.8) 100%)',
        }} />
        {/* Name + label */}
        <div style={{ position: 'absolute', bottom: 8, left: 12 }}>
          <div style={{ fontSize: '0.58rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
            Maravilla
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-gold)', lineHeight: 1.2 }}>
            {name}
          </div>
        </div>
        {/* Stage slots in banner */}
        <div style={{ position: 'absolute', bottom: 10, right: 12 }}>
          <StageSlots built={built} total={total} size="md" />
        </div>
      </div>
    </div>
  );
}
