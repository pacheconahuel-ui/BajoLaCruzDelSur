import { useState } from 'react';
import { EventoEra } from '../data/eventos';

interface Props {
  evento: EventoEra;
  era: 1 | 2 | 3;
  isNew?: boolean;
}

const ERA_NOMBRES: Record<number, string> = {
  1: 'Raíces Ancestrales',
  2: 'Encuentro y Resistencia',
  3: 'Soberanía y Legado',
};

const TIPO_COLOR: Record<EventoEra['tipo'], string> = {
  clima:    '#1a4a6e',
  politico: '#3a2a4a',
  cultural: '#2a4a2a',
  militar:  '#4a1a1a',
};

const TIPO_LABEL: Record<EventoEra['tipo'], string> = {
  clima:    'Evento Climático',
  politico: 'Evento Político',
  cultural: 'Evento Cultural',
  militar:  'Evento Militar',
};

export default function EraEventBanner({ evento, era, isNew = false }: Props) {
  const [expanded, setExpanded] = useState(isNew);
  const color = TIPO_COLOR[evento.tipo];

  return (
    <div
      style={{
        borderRadius: 8, overflow: 'hidden',
        border: `1px solid ${color}88`,
        background: `${color}33`,
        marginBottom: 8,
        animation: isNew ? 'fadeInUp 0.4s ease' : undefined,
      }}
    >
      {/* Header siempre visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'transparent', color: 'inherit',
          padding: '7px 12px', textAlign: 'left', borderRadius: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>{evento.icono}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Era {era} · {ERA_NOMBRES[era]} · {TIPO_LABEL[evento.tipo]}
            </span>
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {evento.nombre}
          </div>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', flexShrink: 0 }}>
          {expanded ? '▲' : '▼'} Efecto
        </span>
      </button>

      {/* Detalle expandible */}
      {expanded && (
        <div style={{ padding: '0 12px 10px', borderTop: `1px solid ${color}44` }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', marginBottom: 6, lineHeight: 1.5 }}>
            {evento.descripcion}
          </p>
          <div style={{
            background: `${color}44`, borderRadius: 5, padding: '6px 10px',
            fontSize: '0.8rem', color: 'var(--color-text)', lineHeight: 1.4,
            border: `1px solid ${color}66`,
          }}>
            <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>⚡ Efecto: </span>
            {evento.efecto}
          </div>
        </div>
      )}
    </div>
  );
}
