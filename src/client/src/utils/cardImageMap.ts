// Mapeo de card IDs a nombres de archivo de imagen (sin extensión)
// Archivos en /assets/cards/
const CARD_IMAGE_MAP: Record<string, string> = {
  // Marrones — Materias primas
  lumber_yard_3:        'Bosque de Lenga',
  lumber_yard_4:        'Bosque de Lenga',
  stone_pit_3:          'Cantera',
  stone_pit_5:          'Cantera',
  clay_pool_3:          'Greda del Río',
  clay_pool_5:          'Greda del Río',
  ore_vein_3:           'Veta de Hueso',
  ore_vein_4:           'Veta de Hueso',
  tree_farm:            'Claro del Monte',
  excavation:           'Excavación',
  clay_pit:             'Barranca de Greda',
  timber_yard:          'Corral de Troncos',
  forest_cave:          'Cueva del Bosque',
  mine:                 'Mina',

  // Grises — Manufacturas
  loom_3:               'Witral',
  loom_6:               'Witral del Gran Telar',
  glassworks_3:         'Obsidiana',
  glassworks_6:         'Obsidiana',
  press_3:              'Taller de Corteza',
  press_6:              'Taller de Corteza',

  // Azules — Civiles
  baths_3:              'Corral de Acopio en Pirca',
  baths_7:              'Corral de Acopio en Pirca',
  altar_3:              'Rehue del Lago',
  altar_5:              'Rehue del Lago',
  theater_3:            'Lof (Centro Comunitario)',
  theater_6:            'Lof (Centro Comunitario)',

  // Verdes — Ciencia
  apothecary_3:         'Herbolaria de la Machi',
  apothecary_5:         'Herbolaria de la Machi',
  workshop_3:           'Taller de Obsidiana Maestra',
  workshop_7:           'Taller de Obsidiana Maestra',
  scriptorium_3:        'Memoria Oral',
  scriptorium_4:        'Memoria Oral',

  // Amarillos — Comerciales
  east_trading_post_3:  'Paso de Montaña',
  east_trading_post_7:  'Paso de Montaña',
  west_trading_post_3:  'Paso de Montaña',
  west_trading_post_6:  'Paso de Montaña',
  marketplace_3:        'Platería Mapuche',
  marketplace_7:        'Platería Mapuche',
  pawnshop_4:           'Trueque de Sal',
  pawnshop_7:           'Trueque de Sal',
  tavern_4:             'Circulo de piedras',
  tavern_5:             'Circulo de piedras',
  tavern_7:             'Circulo de piedras',

  // Rojos — Militares
  stockade_3:           'Pirca de Defensa',
  stockade_7:           'Pirca de Defensa',
  barracks_3:           'Lanceros de Práctica',
  barracks_5:           'Lanceros de Práctica',
  guard_tower_3:        'Taller de Boleadoras',
  guard_tower_4:        'Taller de Boleadoras',

  // ── Era 1 — cartas personalizadas ────────────────────────────────────────

  // Rojos Era 1
  puesto_guerreros_3:        'Pirca de Defensa',
  atalaya_madera_3:          'Taller de Boleadoras',
  caballeriza_rastrillada:   'Lanceros de Práctica',
  fortin_empalizada_rio:     'Pirca de Defensa',

  // Verdes Era 1
  curandero_3:               'Cueva Ancestral',
  taller_arqueria_3:         'Taller de Obsidiana Maestra',
  piedras_pintadas_3:        'Memoria Oral',

  // Amarillos Era 1
  feria_trueque_3:           'Trueque de Sal',
  arriero_monte_3:           'Paso de Montaña',
  embarcadero_lago_3:        'Balsa de Juncos',
  pulperia_del_camino:       'Circulo de piedras',

  // Grises Era 1
  taller_pan_pinyon:         'Horno de Piñón y Trigo',
  corral_acopio_pirca:       'Taller de Corteza',
  tranquera_lenga_reforzada: 'Tranquera de Lenga',
  maestria_obsidiana_volcanica: 'Taller de Obsidiana Maestra',
  witral_gran_telar:         'Witral del Gran Telar',

  // Azules Era 1
  altar_piedras_3:           'Rehue del Lago',

  // ── Era 2 — cartas personalizadas ────────────────────────────────────────

  // Marrones Era 2
  bosque_alerces_milenarios: 'Bosque de Lenga',
  cantera_granito_sur:       'Cantera',
  yacimiento_arcilla_roja:   'Alfareria',
  veta_cobre_profunda:       'Veta de Hueso',

  // Grises Era 2
  tejeduria_mantas_finas:    'Witral',
  taller_puntas_obsidiana:   'Obsidiana',
  curtiembre_cuero_fino:     'Taller de Corteza',
  artesania_cuero_crudo:     'Taller de Corteza',

  // Azules Era 2
  maloca_ceremonial:         'Arbol Sagrado',
  parlamento_de_lonkos:      'Asamblea de Lonkos',
  menhir_de_los_antiguos:    'Rehue del Lago',
  escuela_de_la_naturaleza:  'Lof (Centro Comunitario)',
  sitio_sagrado_copihue:     'Arbol Sagrado',

  // Rojos Era 2
  lanceros_de_la_estepa:     'Lanceros de Práctica',
  pirca_de_fortificacion:    'Pirca de Defensa',
  puesto_guardia_desierto:   'Taller de Boleadoras',
  mirador_de_los_andes:      'Pirca de Defensa',
  tropa_boleadoras:          'Taller de Boleadoras',

  // Verdes Era 2
  observatorio_cruz_del_sur: 'Observación Estelar',
  taller_boleadoras_lazos:   'Taller de Obsidiana Maestra',
  circulo_historias_orales:  'Memoria Oral',
  practica_de_arqueria:      'Herbolaria de la Machi',
  huerto_hierbas_curativas:  'Herbolaria de la Machi',

  // Amarillos Era 2
  ruta_sal_y_oro:            'Paso de Montaña',
  feria_de_primavera:        'Trueque de Sal',
  pulperia_de_frontera:      'Circulo de piedras',
  deposito_de_vituallas:     'Platería Mapuche',
  mercado_de_las_carretas:   'Paso de Montaña',

  // ── Era 3 — gremios (purple) ──────────────────────────────────────────────
  logia_tejedores:           'Cesteria',
  logia_astronomos:          'Observación Estelar',
  hermandad_rastreadores:    'Taller de Boleadoras',
  alianza_navegantes:        'Balsa de Juncos',
  cofradia_defensores:       'Pirca de Defensa',
  union_pulperos:            'Platería Mapuche',
  hermandad_canteros:        'Cantera',
};

export function getCardImageName(cardId: string): string {
  return CARD_IMAGE_MAP[cardId] ?? cardId;
}
