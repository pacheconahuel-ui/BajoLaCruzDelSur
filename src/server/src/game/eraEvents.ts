import { EraEvent, Age } from '@7wonders/shared';

const ERA1_EVENTS: EraEvent[] = [
  {
    id: 'e1_sequia',
    nombre: 'Sequía en la Estepa',
    icono: '🌵',
    tipo: 'clima',
    descripcion: 'Las lluvias tardaron en llegar. Los ríos bajaron y los bosques de lenga sufrieron. Los pueblos debieron buscar madera más lejos de lo habitual.',
    efecto: 'Los recursos de madera escasean. Los pueblos que ya los poseen parten con ventaja en los intercambios.',
  },
  {
    id: 'e1_erupcion',
    nombre: 'Cenizas del Volcán del Sur',
    icono: '🌋',
    tipo: 'clima',
    descripcion: 'Un volcán al sur de los territorios entró en erupción. La ceniza cubrió los pasos cordilleranos durante semanas, tiñendo el cielo de gris.',
    efecto: 'Las rutas de intercambio se complicaron. Quien tenga sus propios recursos no depende de nadie.',
  },
  {
    id: 'e1_parlamento',
    nombre: 'Gran Parlamento de Lonkos',
    icono: '🤝',
    tipo: 'politico',
    descripcion: 'Por primera vez en generaciones, los lonkos de distintos pueblos se reunieron bajo el mismo cielo para dialogar, estableciendo normas de convivencia y zonas de caza compartidas.',
    efecto: 'El diálogo abre caminos. Las estructuras civiles y de intercambio se construyen con mayor facilidad.',
  },
  {
    id: 'e1_infiltracion',
    nombre: 'Tensión entre Clanes',
    icono: '⚔️',
    tipo: 'militar',
    descripcion: 'Viejas disputas por territorio de caza resurgieron entre dos clanes vecinos. Los guerreros comenzaron a tallar nuevas puntas de lanza y a practicar sus formaciones.',
    efecto: 'Los escudos y la preparación militar toman protagonismo desde el primer turno.',
  },
  {
    id: 'e1_nguillatun',
    nombre: 'Nguillatun de Primavera',
    icono: '🎭',
    tipo: 'cultural',
    descripcion: 'La gran ceremonia de renovación del pacto entre el pueblo y la Madre Tierra convocó a cientos de personas. Días de música, danza y oración llenaron los valles de sonido.',
    efecto: 'La tierra renovó su alianza con los pueblos. La ciencia y la cultura florecen en tiempos de paz.',
  },
];

const ERA2_EVENTS: EraEvent[] = [
  {
    id: 'e2_naufragio',
    nombre: 'Naufragio en los Canales',
    icono: '⛵',
    tipo: 'politico',
    descripcion: 'Un barco de madera rara varó en los canales fueguinos. Los restos del naufragio — herramientas, telas, objetos de metal — cambiaron de manos rápidamente entre los pueblos costeros.',
    efecto: 'Objetos desconocidos llegaron al intercambio. El trueque tomó dimensiones nunca vistas.',
  },
  {
    id: 'e2_gran_mallon',
    nombre: 'El Gran Malón',
    icono: '🐴',
    tipo: 'militar',
    descripcion: 'Una coalición de jinetes organizó el malón más grande en décadas. Las rutas de intercambio quedaron cortadas durante semanas mientras el conflicto se definía.',
    efecto: 'El poder militar determina quién puede moverse libremente por la región.',
  },
  {
    id: 'e2_caravana',
    nombre: 'Caravana del Norte',
    icono: '🐪',
    tipo: 'cultural',
    descripcion: 'Mercaderes del norte llegaron con bienes exóticos, noticias de tierras lejanas y nuevas técnicas de trabajo con cuero y metal. El intercambio de saberes fue tan valioso como el de bienes.',
    efecto: 'El trueque floreció. Las cartas amarillas de intercambio valen más en este contexto.',
  },
  {
    id: 'e2_invierno',
    nombre: 'Invierno Austral Extremo',
    icono: '❄️',
    tipo: 'clima',
    descripcion: 'Un frío sin precedentes cubrió la Patagonia. Los pasos cordilleranos se cerraron meses antes de lo esperado. Solo los pueblos con reservas y refugios sólidos sobrevivieron bien.',
    efecto: 'La piedra y la arcilla se vuelven los recursos más cotizados. Las estructuras ya construidas son un escudo.',
  },
  {
    id: 'e2_misioneros',
    nombre: 'Llegada de las Primeras Misiones',
    icono: '✝️',
    tipo: 'politico',
    descripcion: 'Pequeños grupos de extranjeros llegaron con cruces y palabras nuevas. Algunos pueblos los recibieron con curiosidad; otros, con desconfianza. Ninguno quedó indiferente.',
    efecto: 'El contacto con lo desconocido aceleró ciertos cambios y congeló otros. El saber ancestral se volvió más valioso.',
  },
];

const ERA3_EVENTS: EraEvent[] = [
  {
    id: 'e3_tratado',
    nombre: 'Tratado de las Pampas',
    icono: '📜',
    tipo: 'politico',
    descripcion: 'Después de décadas de conflicto, representantes de ambos mundos firmaron un acuerdo provisional. Los pueblos con más monedas pudieron negociar mejores condiciones.',
    efecto: 'La diplomacia y la economía definen el legado final. El tesoro acumulado pesa más que nunca.',
  },
  {
    id: 'e3_calbuco',
    nombre: 'Gran Erupción del Calbuco',
    icono: '🌋',
    tipo: 'clima',
    descripcion: 'El Calbuco despertó con una violencia inesperada. Las cenizas oscurecieron el cielo cordillerano durante días. Los ríos se llenaron de barro y los animales migraron hacia el este.',
    efecto: 'Los caminos quedaron cortados. Solo lo ya construido resiste: cada estructura vale más al final.',
  },
  {
    id: 'e3_resistencia',
    nombre: 'La Última Resistencia',
    icono: '🏹',
    tipo: 'militar',
    descripcion: 'Las comunidades unieron sus fuerzas en un último esfuerzo por defender sus territorios. Los que habían forjado alianzas militares durante años lideraron la resistencia.',
    efecto: 'Los escudos acumulados en todas las eras resuenan en este momento final.',
  },
  {
    id: 'e3_memoria',
    nombre: 'La Memoria de los Sabios',
    icono: '📚',
    tipo: 'cultural',
    descripcion: 'Los ancianos transmitieron el conocimiento acumulado por generaciones. Los jóvenes aprendieron a leer los cielos, el viento y las piedras. El saber sobrevivió donde el poder no pudo.',
    efecto: 'Los símbolos científicos resuenan esta era. El conocimiento es el legado más duradero.',
  },
  {
    id: 'e3_exodo',
    nombre: 'El Gran Éxodo',
    icono: '🚶',
    tipo: 'politico',
    descripcion: 'Las presiones externas forzaron movimientos masivos de población. Comunidades enteras se desplazaron hacia nuevos territorios, llevando consigo sus saberes y su identidad.',
    efecto: 'Las ciudades ya construidas perduran. Las gremios y Lof que documentaron todo esto narran la historia.',
  },
];

const ERA_EVENTS: Record<Age, EraEvent[]> = {
  1: ERA1_EVENTS,
  2: ERA2_EVENTS,
  3: ERA3_EVENTS,
};

/** Pick a random era event for the given age. */
export function pickEraEvent(age: Age): EraEvent {
  const pool = ERA_EVENTS[age];
  return pool[Math.floor(Math.random() * pool.length)];
}
