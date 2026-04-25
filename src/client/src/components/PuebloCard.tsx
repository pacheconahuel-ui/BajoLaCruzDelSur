import { PuebloData } from '../data/pueblos';

interface Props {
  pueblo: PuebloData;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export default function PuebloCard({ pueblo, selected = false, compact = false, onClick }: Props) {
  if (compact) {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 8, cursor: onClick ? 'pointer' : 'default',
          background: selected ? `${pueblo.color}44` : 'var(--color-surface2)',
          border: `1px solid ${selected ? pueblo.color : 'var(--color-border)'}`,
          transition: 'all 0.15s',
        }}
      >
        <img
          src={pueblo.imagen}
          alt={pueblo.nombre}
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {pueblo.nombre}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)' }}>{pueblo.recursoInicial}</div>
        </div>
        {selected && (
          <span style={{ marginLeft: 'auto', color: 'var(--color-success)', fontSize: '0.85rem' }}>✓</span>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 10, overflow: 'hidden', cursor: onClick ? 'pointer' : 'default',
        border: `2px solid ${selected ? pueblo.color : 'var(--color-border)'}`,
        background: selected ? `${pueblo.color}22` : 'var(--color-surface)',
        transition: 'all 0.18s',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: selected ? `0 0 20px ${pueblo.color}55` : '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Imagen del Hito */}
      <div style={{ position: 'relative', height: 120, overflow: 'hidden', background: `${pueblo.color}33` }}>
        <img
          src={pueblo.imagen}
          alt={pueblo.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))',
        }} />
        <div style={{
          position: 'absolute', bottom: 8, left: 10, right: 10,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1.1rem', fontWeight: 700, color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          {pueblo.nombre}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginBottom: 6 }}>
          {pueblo.pueblo}
        </div>

        {/* Recurso inicial */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'var(--color-surface2)', borderRadius: 4, padding: '2px 8px',
          fontSize: '0.72rem', color: 'var(--color-text-dim)', marginBottom: 8,
        }}>
          🧱 Recurso inicial: <strong style={{ color: 'var(--color-text)' }}>{pueblo.recursoInicial}</strong>
        </div>

        {/* Habilidad pasiva */}
        <div style={{
          background: `${pueblo.color}22`, borderRadius: 6, padding: '8px 10px',
          border: `1px solid ${pueblo.color}55`,
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-dim)', marginBottom: 2 }}>
            Habilidad Pasiva
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
            ⚡ {pueblo.habilidadPasiva}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', lineHeight: 1.4 }}>
            {pueblo.habilidadDetalle}
          </div>
        </div>

        {selected && (
          <div style={{
            marginTop: 8, textAlign: 'center', fontSize: '0.8rem',
            color: 'var(--color-success)', fontWeight: 700,
          }}>
            ✓ Seleccionado
          </div>
        )}
      </div>
    </div>
  );
}
