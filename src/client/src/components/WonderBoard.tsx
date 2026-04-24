import { PublicPlayerState, PlayerState } from '@7wonders/shared';

export const WONDER_NAMES: Record<string, string> = {
  colossus:      'Kawésqar',
  lighthouse:    'Günün-a-Künna',
  temple:        'Yámana',
  babylon:       'Aónikenk',
  olympia:       "Selk'nam",
  halicarnassus: 'Rankül',
  giza:          'Ñuke Mapu',
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

// Stage effect summary per wonder (client-side, matches wonders.ts)
const WONDER_STAGE_INFO: Record<string, string[]> = {
  colossus:      ['3★', '🛡🛡', '7★'],
  lighthouse:    ['3★', '+🪵/🪨/🧱/⚙️', '7★'],
  temple:        ['3★', '+9💰', '7★'],
  babylon:       ['3★', '+🧪 libre', '7★'],
  olympia:       ['3★', '1 gratis/era', '7★'],
  halicarnassus: ['3★', 'construir descarte', 'copiar gremio (etapa 3)'],
  giza:          ['3★', '5★', '7★'],
};

interface Props {
  player: PublicPlayerState | PlayerState;
  compact?: boolean;
}

function StageSlots({ built, total, wonderId, size }: {
  built: number; total: number; wonderId: string; size: 'sm' | 'md';
}) {
  const info = WONDER_STAGE_INFO[wonderId] ?? [];
  return (
    <div style={{ display: 'flex', gap: size === 'sm' ? 3 : 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1,
          minHeight: size === 'sm' ? 26 : 42,
          borderRadius: size === 'sm' ? 4 : 6,
          background: i < built ? 'linear-gradient(135deg, #8a9fb5, #4a5f70)' : 'rgba(255,255,255,0.05)',
          border: i < built
            ? `${size === 'sm' ? 1 : 1.5}px solid var(--color-silver)`
            : `${size === 'sm' ? 1 : 1.5}px solid rgba(255,255,255,0.12)`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '2px 3px',
          gap: 2,
          boxShadow: i < built ? '0 0 6px rgba(184,192,201,0.4)' : 'none',
          transition: 'all 0.2s',
        }}>
          <span style={{
            fontSize: size === 'sm' ? '0.58rem' : '0.72rem',
            fontWeight: 700,
            color: i < built ? '#fff' : 'var(--color-text-dim)',
          }}>
            {i < built ? '★' : i + 1}
          </span>
          {size === 'md' && info[i] && (
            <span style={{
              fontSize: '0.6rem',
              color: i < built ? 'rgba(255,255,255,0.8)' : 'var(--color-text-dim)',
              textAlign: 'center',
              lineHeight: 1.1,
            }}>
              {info[i]}
            </span>
          )}
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
    return (
      <div style={{ borderRadius: 6, border: '1px solid var(--color-gold-dim)', overflow: 'hidden' }}>
        <div style={{
          height: 80,
          backgroundImage: img ? `url(${img})` : undefined,
          backgroundColor: 'var(--color-bg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 20%, rgba(0,0,0,0.75) 100%)' }} />
          <div style={{
            position: 'absolute', bottom: 5, left: 8, right: 8,
            fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-gold)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
        </div>
        <div style={{ padding: '5px 7px', background: 'rgba(0,0,0,0.5)' }}>
          <StageSlots built={built} total={total} wonderId={player.wonderId} size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 8, border: '1px solid var(--color-gold-dim)',
      overflow: 'hidden', width: '100%',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    }}>
      {/* Banner image — taller */}
      <div style={{
        height: 130,
        backgroundImage: img ? `url(${img})` : undefined,
        backgroundColor: '#1c1610',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.85) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 12 }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
            Pueblo · {built}/{total} etapas
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif", color: 'var(--color-gold)', lineHeight: 1.2 }}>
            {name}
          </div>
        </div>
      </div>
      {/* Stages row with effect info */}
      <div style={{ padding: '7px 10px', background: 'rgba(0,0,0,0.6)' }}>
        <StageSlots built={built} total={total} wonderId={player.wonderId} size="md" />
      </div>
    </div>
  );
}
