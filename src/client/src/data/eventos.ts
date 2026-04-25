export interface EventoEra {
  id: string;
  nombre: string;
  descripcion: string;
  efecto: string;
  era: 1 | 2 | 3 | 'any';
  tipo: 'clima' | 'politico' | 'cultural' | 'militar';
  icono: string;
}

// Pool de eventos por era — se elige 1 aleatorio al inicio de cada era
export const EVENTOS_ERA1: EventoEra[] = [
  {
    id: 'e1_lluvia_andina',
    nombre: 'Lluvias Andinas',
    descripcion: 'Las lluvias torrenciales del oeste dificultan el transporte de materiales.',
    efecto: 'La Madera y la Piedra cuestan +1 moneda en comercio esta Era.',
    era: 1, tipo: 'clima', icono: '🌧',
  },
  {
    id: 'e1_viento_pampero',
    nombre: 'Viento Pampero',
    descripcion: 'El viento del sur barre las llanuras, acelerando el transporte.',
    efecto: 'El comercio con el vecino de la izquierda cuesta 1 moneda menos esta Era.',
    era: 1, tipo: 'clima', icono: '💨',
  },
  {
    id: 'e1_abundancia_guanaco',
    nombre: 'Abundancia del Guanaco',
    descripcion: 'Las manadas de guanacos brindan cuero y alimento en abundancia.',
    efecto: 'Las cartas de recursos marrones (materias primas) cuestan 1 moneda menos al comprar.',
    era: 1, tipo: 'cultural', icono: '🦙',
  },
  {
    id: 'e1_sequia',
    nombre: 'Gran Sequía',
    descripcion: 'La falta de agua afecta los cultivos y la ganadería.',
    efecto: 'Los jugadores con menos de 4 monedas al final del turno pierden 1 punto de Prestigio.',
    era: 1, tipo: 'clima', icono: '☀️',
  },
  {
    id: 'e1_paz_intertribal',
    nombre: 'Paz Intertribal',
    descripcion: 'Los pueblos acuerdan una tregua temporal para comerciar libremente.',
    efecto: 'Esta Era, el poder militar no genera fichas de derrota (solo de victoria).',
    era: 1, tipo: 'politico', icono: '🕊',
  },
  {
    id: 'e1_erupcin_volcan',
    nombre: 'Erupción del Volcán',
    descripcion: 'Un volcán patagónico entra en actividad, dispersando ceniza por la región.',
    efecto: 'Las cartas de Saberes Ancestrales (verdes) dan +1 punto de Prestigio adicional esta Era.',
    era: 1, tipo: 'clima', icono: '🌋',
  },
];

export const EVENTOS_ERA2: EventoEra[] = [
  {
    id: 'e2_cruce_andes',
    nombre: 'Cruce de los Andes',
    descripcion: 'Las rutas a través de los Andes se abren, facilitando el comercio transcordillerano.',
    efecto: 'Las cartas militares (rojas) dan +1 escudo adicional si tenés al menos 1 Madera.',
    era: 2, tipo: 'politico', icono: '⛰',
  },
  {
    id: 'e2_inundacion_parana',
    nombre: 'Inundación del Río Grande',
    descripcion: 'Las crecidas de los ríos patagónicos interrumpen el comercio regional.',
    efecto: 'La Madera cuesta +1 moneda en comercio. Las cartas azules (Cabildos) dan +1 punto.',
    era: 2, tipo: 'clima', icono: '🌊',
  },
  {
    id: 'e2_feria_comercial',
    nombre: 'Gran Feria del Sur',
    descripcion: 'Mercaderes de todo el Cono Sur se reúnen para intercambiar bienes.',
    efecto: 'Las cartas amarillas (Pulperías/Rutas) generan 1 moneda extra al construirlas.',
    era: 2, tipo: 'cultural', icono: '🏪',
  },
  {
    id: 'e2_tension_territorial',
    nombre: 'Tensión Territorial',
    descripcion: 'Los conflictos por tierras se intensifican entre los pueblos vecinos.',
    efecto: 'Los puntos de victoria militar valen el doble esta Era (+2/+6/+10 en lugar de +1/+3/+5).',
    era: 2, tipo: 'militar', icono: '⚔',
  },
  {
    id: 'e2_cosecha_abundante',
    nombre: 'Cosecha Abundante',
    descripcion: 'Una temporada excepcional llena los graneros y fortalece a las comunidades.',
    efecto: 'Cada jugador recibe 1 moneda extra al inicio de cada turno esta Era.',
    era: 2, tipo: 'clima', icono: '🌾',
  },
];

export const EVENTOS_ERA3: EventoEra[] = [
  {
    id: 'e3_soberania_nacional',
    nombre: 'Soberanía Nacional',
    descripcion: 'Los pueblos proclaman su soberanía. Las grandes instituciones cobran más valor.',
    efecto: 'Las Logias/Alianzas (cartas moradas) dan +2 puntos adicionales cada una.',
    era: 3, tipo: 'politico', icono: '🏛',
  },
  {
    id: 'e3_gran_alianza',
    nombre: 'Gran Alianza del Sur',
    descripcion: 'Los pueblos del sur forman una confederación para resistir amenazas externas.',
    efecto: 'El jugador con más escudos al final recibe +3 puntos de Prestigio adicionales.',
    era: 3, tipo: 'politico', icono: '🤝',
  },
  {
    id: 'e3_edad_de_oro',
    nombre: 'Edad de Oro Patagónica',
    descripcion: 'Un período de prosperidad y florecimiento cultural sin precedentes.',
    efecto: 'Los Saberes Ancestrales (verdes) dan +2 puntos adicionales por símbolo completo.',
    era: 3, tipo: 'cultural', icono: '✨',
  },
  {
    id: 'e3_memoria_de_los_ancestros',
    nombre: 'Memoria de los Ancestros',
    descripcion: 'Los ancianos transmiten el conocimiento acumulado de generaciones.',
    efecto: 'Cada etapa de Hito (Maravilla) construida vale +1 punto adicional al final.',
    era: 3, tipo: 'cultural', icono: '📜',
  },
  {
    id: 'e3_vientos_del_cambio',
    nombre: 'Vientos del Cambio',
    descripcion: 'Nuevas ideas y tecnologías llegan desde el norte transformando las sociedades.',
    efecto: 'Los Bienes de Valor (grises) cuestan 0 monedas en comercio esta Era.',
    era: 3, tipo: 'clima', icono: '🌬',
  },
];

export function sortearEvento(era: 1 | 2 | 3, seed?: number): EventoEra {
  const pool = era === 1 ? EVENTOS_ERA1 : era === 2 ? EVENTOS_ERA2 : EVENTOS_ERA3;
  const idx = seed !== undefined
    ? seed % pool.length
    : Math.floor(Math.random() * pool.length);
  return pool[idx];
}
