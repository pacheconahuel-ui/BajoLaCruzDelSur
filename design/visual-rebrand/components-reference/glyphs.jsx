// Confederación del Sur — Glifos
// Geometría inspirada en kultrún mapuche, guardas textiles, platería.
// Nada figurativo de personajes humanos.

function ResourceGlyph({ kind, size = 28, color = 'currentColor', bg = null }) {
  const s = size;
  const sw = Math.max(1.2, s * 0.06);
  const paths = {
    piedra: (
      <g fill={color}>
        <path d="M4 22 L8 10 L14 7 L22 9 L28 18 L24 26 L8 26 Z" fillOpacity="0.25"/>
        <path d="M4 22 L8 10 L14 7 L22 9 L28 18 L24 26 L8 26 Z" fill="none" stroke={color} strokeWidth={sw}/>
      </g>
    ),
    madera: (
      // Lenga — tronco con vetas
      <g fill="none" stroke={color} strokeWidth={sw}>
        <rect x="6" y="5" width="20" height="22" fill={color} fillOpacity="0.2"/>
        <rect x="6" y="5" width="20" height="22"/>
        <path d="M10 5 L10 27 M16 5 L16 27 M22 5 L22 27" strokeWidth={sw*0.6} opacity="0.7"/>
      </g>
    ),
    cuero: (
      // Cuero estirado — forma irregular
      <g fill="none" stroke={color} strokeWidth={sw}>
        <path d="M8 6 L22 4 L27 12 L26 22 L18 27 L7 24 L4 14 Z" fill={color} fillOpacity="0.22"/>
        <path d="M8 6 L22 4 L27 12 L26 22 L18 27 L7 24 L4 14 Z"/>
        <circle cx="9" cy="10" r="1" fill={color}/>
        <circle cx="23" cy="22" r="1" fill={color}/>
      </g>
    ),
    hueso: (
      // Hueso estilizado
      <g fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round">
        <path d="M6 9 Q3 9 3 6 Q3 3 6 3 Q9 3 9 6 L23 6 Q23 3 26 3 Q29 3 29 6 Q29 9 26 9 L26 23 Q29 23 29 26 Q29 29 26 29 Q23 29 23 26 L9 26 Q9 29 6 29 Q3 29 3 26 Q3 23 6 23 Z"
          fill={color} fillOpacity="0.2"/>
        <path d="M9 9 L9 23 M23 9 L23 23"/>
      </g>
    ),
    lana: (
      // Tejido — trama
      <g fill="none" stroke={color} strokeWidth={sw}>
        <rect x="5" y="5" width="22" height="22" fill={color} fillOpacity="0.15"/>
        <path d="M5 11 L27 11 M5 16 L27 16 M5 21 L27 21"/>
        <path d="M10 5 L10 27 M16 5 L16 27 M22 5 L22 27" strokeWidth={sw*0.7}/>
        <path d="M5 5 L27 5 M5 27 L27 27"/>
      </g>
    ),
    plata: (
      // Trariwe / placa pectoral — rombo con círculos
      <g fill="none" stroke={color} strokeWidth={sw}>
        <path d="M16 3 L27 16 L16 29 L5 16 Z" fill={color} fillOpacity="0.22"/>
        <path d="M16 3 L27 16 L16 29 L5 16 Z"/>
        <circle cx="16" cy="16" r="3" fill={color}/>
        <circle cx="16" cy="9" r="1.2" fill={color}/>
        <circle cx="16" cy="23" r="1.2" fill={color}/>
        <circle cx="9" cy="16" r="1.2" fill={color}/>
        <circle cx="23" cy="16" r="1.2" fill={color}/>
      </g>
    ),
    cesto: (
      // Canasta trenzada
      <g fill="none" stroke={color} strokeWidth={sw}>
        <path d="M6 12 L26 12 L24 26 L8 26 Z" fill={color} fillOpacity="0.2"/>
        <path d="M6 12 L26 12 L24 26 L8 26 Z"/>
        <path d="M10 12 L11 26 M16 12 L16 26 M22 12 L21 26" strokeWidth={sw*0.7}/>
        <path d="M7 17 L25 17 M7 21 L25 21" strokeWidth={sw*0.7}/>
        <path d="M4 12 Q16 7 28 12" fill="none"/>
      </g>
    ),

    // Semánticos
    moneda: (
      // Concha / trozo de plata como moneda
      <g fill="none" stroke={color} strokeWidth={sw}>
        <circle cx="16" cy="16" r="11" fill={color} fillOpacity="0.22"/>
        <circle cx="16" cy="16" r="11"/>
        <path d="M11 12 L21 12 M11 16 L21 16 M11 20 L21 20" strokeWidth={sw*0.7}/>
      </g>
    ),
    escudo: (
      // Escudo / rodela de cuero
      <g fill={color}>
        <path d="M16 3 L26 7 L26 16 Q26 24 16 29 Q6 24 6 16 L6 7 Z" fillOpacity="0.3"/>
        <path d="M16 3 L26 7 L26 16 Q26 24 16 29 Q6 24 6 16 L6 7 Z" fill="none" stroke={color} strokeWidth={sw}/>
        <circle cx="16" cy="15" r="3" fill={color}/>
      </g>
    ),
    punto: (
      // Estrella de 8 puntas (wüñelfe — lucero del alba)
      <g fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="miter">
        <path d="M16 3 L18 12 L26 8 L22 16 L29 19 L20 20 L22 28 L16 22 L10 28 L12 20 L3 19 L10 16 L6 8 L14 12 Z" fill={color} fillOpacity="0.25"/>
        <path d="M16 3 L18 12 L26 8 L22 16 L29 19 L20 20 L22 28 L16 22 L10 28 L12 20 L3 19 L10 16 L6 8 L14 12 Z"/>
      </g>
    ),
    ciencia_a: (
      // Kultrún — tambor con cruz
      <g fill="none" stroke={color} strokeWidth={sw}>
        <circle cx="16" cy="16" r="11" fill={color} fillOpacity="0.18"/>
        <circle cx="16" cy="16" r="11"/>
        <path d="M16 5 L16 27 M5 16 L27 16"/>
      </g>
    ),
    ciencia_b: (
      // Chakana / escalonado
      <g fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="miter">
        <path d="M12 4 L20 4 L20 10 L26 10 L26 20 L20 20 L20 28 L12 28 L12 20 L6 20 L6 10 L12 10 Z" fill={color} fillOpacity="0.2"/>
        <path d="M12 4 L20 4 L20 10 L26 10 L26 20 L20 20 L20 28 L12 28 L12 20 L6 20 L6 10 L12 10 Z"/>
        <circle cx="16" cy="16" r="2" fill={color}/>
      </g>
    ),
    ciencia_c: (
      // Espiral (greca)
      <g fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="miter">
        <path d="M4 28 L4 4 L28 4 L28 28 L10 28 L10 10 L22 10 L22 22 L16 22 L16 16"/>
      </g>
    ),
  };
  return (
    <svg width={s} height={s} viewBox="0 0 32 32" style={{display:'block'}}>
      {bg && <rect x="0" y="0" width="32" height="32" fill={bg}/>}
      {paths[kind] || <circle cx="16" cy="16" r="10" fill="none" stroke={color} strokeWidth={sw}/>}
    </svg>
  );
}

// Pattern de fondo para cartas — grecas, guardas, geometrías textiles
function CardGlyph({ seed = 'x', color = '#000', size = 120 }) {
  const h = [...seed].reduce((a,c)=>a*31+c.charCodeAt(0),7) & 0xff;
  const pick = h % 8;
  const c = { fill: 'none', stroke: color, strokeWidth: 1.2, strokeLinejoin:'miter', strokeLinecap:'square' };
  const patterns = [
    // 0: guarda escalonada textil
    <g {...c}>
      <path d="M2 22 L6 22 L6 18 L10 18 L10 14 L14 14 L14 10 L18 10 L18 14 L22 14 L22 18 L26 18 L26 22 L30 22 L30 26 L2 26 Z" fill={color} fillOpacity="0.16"/>
      <path d="M2 22 L6 22 L6 18 L10 18 L10 14 L14 14 L14 10 L18 10 L18 14 L22 14 L22 18 L26 18 L26 22 L30 22 L30 26 L2 26 Z"/>
    </g>,
    // 1: kultrún
    <g {...c}>
      <circle cx="16" cy="16" r="12" fill={color} fillOpacity="0.12"/>
      <circle cx="16" cy="16" r="12"/>
      <path d="M16 4 L16 28 M4 16 L28 16"/>
      <circle cx="16" cy="16" r="2" fill={color}/>
    </g>,
    // 2: greca continua
    <g {...c}>
      <path d="M2 8 L8 8 L8 14 L14 14 L14 8 L20 8 L20 14 L26 14 L26 8 L30 8 M2 24 L8 24 L8 18 L14 18 L14 24 L20 24 L20 18 L26 18 L26 24 L30 24"/>
    </g>,
    // 3: rombos concéntricos (Selk'nam)
    <g {...c}>
      <path d="M16 2 L30 16 L16 30 L2 16 Z" fill={color} fillOpacity="0.1"/>
      <path d="M16 2 L30 16 L16 30 L2 16 Z"/>
      <path d="M16 7 L25 16 L16 25 L7 16 Z" fill={color} fillOpacity="0.15"/>
      <path d="M16 7 L25 16 L16 25 L7 16 Z"/>
      <path d="M16 12 L20 16 L16 20 L12 16 Z" fill={color}/>
    </g>,
    // 4: ojo fueguino
    <g {...c}>
      <path d="M2 16 Q16 6 30 16 Q16 26 2 16 Z" fill={color} fillOpacity="0.15"/>
      <path d="M2 16 Q16 6 30 16 Q16 26 2 16 Z"/>
      <circle cx="16" cy="16" r="4" fill={color}/>
    </g>,
    // 5: trariwe — platería alargada
    <g {...c}>
      <path d="M4 14 L28 14 L28 18 L4 18 Z" fill={color} fillOpacity="0.15"/>
      <path d="M4 14 L28 14 L28 18 L4 18 Z"/>
      <circle cx="8" cy="16" r="2" fill={color}/>
      <circle cx="16" cy="16" r="2" fill={color}/>
      <circle cx="24" cy="16" r="2" fill={color}/>
    </g>,
    // 6: chakana escalonada
    <g {...c}>
      <path d="M12 4 L20 4 L20 10 L26 10 L26 20 L20 20 L20 28 L12 28 L12 20 L6 20 L6 10 L12 10 Z" fill={color} fillOpacity="0.14"/>
      <path d="M12 4 L20 4 L20 10 L26 10 L26 20 L20 20 L20 28 L12 28 L12 20 L6 20 L6 10 L12 10 Z"/>
    </g>,
    // 7: triángulos alternados (guarda textil)
    <g {...c}>
      <path d="M2 20 L6 12 L10 20 L14 12 L18 20 L22 12 L26 20 L30 12" fill={color} fillOpacity="0.18"/>
      <path d="M2 20 L6 12 L10 20 L14 12 L18 20 L22 12 L26 20 L30 12"/>
      <path d="M2 20 L30 20"/>
    </g>,
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{display:'block'}}>
      {patterns[pick]}
    </svg>
  );
}

window.ResourceGlyph = ResourceGlyph;
window.CardGlyph = CardGlyph;
