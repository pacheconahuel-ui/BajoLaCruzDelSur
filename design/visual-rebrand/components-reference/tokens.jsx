// Confederación del Sur — Design Tokens
// Temática: pueblos originarios de Patagonia y cono sur.
// Mapuche, Tehuelche, Selk'nam, Yámana, Kawésqar, Rankül, Günün-a-künna.
// Visual: plata, lana, cuero, piedra, hueso. No oro, no imperio.

const palette = {
  // Fondos
  linen:     '#ece3d0',     // lana cruda sin teñir (fondo carta)
  linenDeep: '#dccfb4',
  night:     '#0f1419',     // noche patagónica
  night2:    '#1a2430',
  slate:     '#2b3847',     // piedra de volcán
  stone:     '#55606d',     // basalto
  bone:      '#e8ddc6',     // hueso blanqueado
  ink:       '#12161b',
  inkSoft:   '#3e4a5a',

  // Acentos (pigmentos naturales del sur)
  silver:    '#b8c0c9',     // plata mapuche
  silverHi:  '#d8dee4',
  ember:     '#b94a2a',     // rojo ñire / urucú
  sky:       '#2b5a8a',     // azul patagónico profundo
  lichen:    '#6e8559',     // líquen / ñire verde
  earth:     '#7a4a28',     // cuero curtido
};

// ── Las 7 familias (misma semántica que 7W, paleta re-pigmentada) ────
// Inspiración: pigmentos de cueros teñidos, lanas vegetales, piedras y minerales
// del sur. Ninguna "familia" representa un pueblo — son tipos de carta compartidos
// por todos los jugadores. Los PUEBLOS son las 7 capitales (WonderBoards).
const families = {
  materia: {                 // crudo — del monte, la piedra, el mar
    id: 'materia',
    label: 'Crudo',
    sub: 'Del monte y el mar',
    ink:    '#2a1e14',
    base:   '#7a4a28',
    fill:   '#956034',
    tint:   '#c9a277',
    wash:   '#ece0cc',
    glyph:  '▲',
  },
  oficio: {                  // manufactura — lo hecho por manos
    id: 'oficio',
    label: 'Oficio',
    sub: 'Hecho con manos',
    ink:    '#1d2026',
    base:   '#55606d',
    fill:   '#6f7a87',
    tint:   '#a8b1bb',
    wash:   '#dde1e6',
    glyph:  '◆',
  },
  templo: {                  // ruka / rehue — espacio sagrado (civil)
    id: 'templo',
    label: 'Rehue',
    sub: 'Lugar sagrado',
    ink:    '#0a1a2e',
    base:   '#2b5a8a',
    fill:   '#3e72a8',
    tint:   '#7ea3c8',
    wash:   '#cfdded',
    glyph:  '☰',
  },
  sabiduria: {               // machi / saber del tiempo (ciencia)
    id: 'sabiduria',
    label: 'Machi',
    sub: 'Saber del tiempo',
    ink:    '#14241a',
    base:   '#3b5e3a',
    fill:   '#507a4d',
    tint:   '#8fad89',
    wash:   '#d3dfc9',
    glyph:  '✺',
  },
  mercado: {                 // trueque — comercio entre pueblos
    id: 'mercado',
    label: 'Trueque',
    sub: 'Caminos y carga',
    ink:    '#3a2410',
    base:   '#a26a20',
    fill:   '#c08428',
    tint:   '#d8b265',
    wash:   '#efdfb0',
    glyph:  '◐',
  },
  guerra: {                  // malón — milicia / guerra
    id: 'guerra',
    label: 'Malón',
    sub: 'Lanza y escudo',
    ink:    '#2e0c0a',
    base:   '#8b2a22',
    fill:   '#a83a2c',
    tint:   '#d47e70',
    wash:   '#eed0cb',
    glyph:  '◈',
  },
  linaje: {                  // lof / linaje — gremios
    id: 'linaje',
    label: 'Lof',
    sub: 'Linaje y familia',
    ink:    '#1a1224',
    base:   '#4a3668',
    fill:   '#624882',
    tint:   '#a08fbb',
    wash:   '#dcd2e5',
    glyph:  '✦',
  },
};

// ── Recursos ─────────────────────────────────────────────
// Materias del sur: piedra, madera (lenga/ñire), cuero, hueso.
// Oficios: lana tejida, plata, cestería.
const resources = {
  piedra:    { id: 'piedra',    label: 'Piedra',    family: 'materia' },
  madera:    { id: 'madera',    label: 'Lenga',     family: 'materia' },
  cuero:     { id: 'cuero',     label: 'Cuero',     family: 'materia' },
  hueso:     { id: 'hueso',     label: 'Hueso',     family: 'materia' },
  lana:      { id: 'lana',      label: 'Lana',      family: 'oficio' },
  plata:     { id: 'plata',     label: 'Plata',     family: 'oficio' },
  cesto:     { id: 'cesto',     label: 'Cestería',  family: 'oficio' },
};

// ── Tipografía ───────────────────────────────────────────
// Display: serif con algo de peso arcaico — Cormorant va bien.
// Body: DM Sans (humanista, legible).
const type = {
  display: '"Cormorant Garamond", "Cormorant", Georgia, serif',
  body:    '"DM Sans", "Inter", system-ui, sans-serif',
  mono:    '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
  glyph:   '"Cormorant Garamond", serif',
};

const space = { xs: 4, sm: 8, md: 12, lg: 20, xl: 32, xxl: 56 };

const radius = { none: 0, card: 2, pill: 999 };

const shadow = {
  soft:  '0 1px 2px rgba(10,14,20,0.25), 0 4px 12px rgba(10,14,20,0.14)',
  card:  '0 2px 4px rgba(10,14,20,0.3), 0 8px 24px rgba(10,14,20,0.22)',
  lift:  '0 4px 8px rgba(10,14,20,0.35), 0 16px 48px rgba(10,14,20,0.28)',
  press: 'inset 0 1px 3px rgba(10,14,20,0.4)',
  glow:  '0 0 0 2px rgba(184,192,201,0.6), 0 0 24px rgba(184,192,201,0.35)',
};

// esquinas — menos geométrico que antes, casi rectas con un chamfer muy sutil
const chamfer = (c = 8) =>
  `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`;

// Textura de lana cruda (fondo de carta)
const linenTexture =
  'url("data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='5'/>
        <feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0 0.3  0 0 0 0.1 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`
  ) +
  '")';

const nightTexture =
  'url("data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' seed='9'/>
        <feColorMatrix values='0 0 0 0 0.08  0 0 0 0 0.11  0 0 0 0 0.14  0 0 0 0.5 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`
  ) +
  '")';

window.SS = {
  palette, families, resources, type, space, radius, shadow, chamfer,
  linenTexture, nightTexture,
  // alias para compatibilidad con código existente
  amateTexture: linenTexture,
  obsidianTexture: nightTexture,
};
