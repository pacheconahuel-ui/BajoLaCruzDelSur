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
};

export function getCardImageName(cardId: string): string {
  return CARD_IMAGE_MAP[cardId] ?? cardId;
}
