# Catálogo de Cartas — Bajo la Cruz del Sur

Mapeo 1:1 desde `src/server/src/game/cards.ts`. **Los IDs internos NO cambian** — solo el campo `name` (string visible).

Este archivo lista cada carta del juego con:
- ID actual (NO modificar)
- Nombre actual en `cards.ts`
- **Nombre nuevo** (Bajo la Cruz del Sur)
- Chain hacia (actualizado al nombre nuevo)

---

## ERA I

### Materia (brown — crudo del monte y el mar)

| ID | Nombre actual | **Nombre nuevo** | chainTo nuevo |
|---|---|---|---|
| `lumber_yard_*` | Maderería | **Bosque de Lenga** | — |
| `stone_pit_*` | Pozo de Piedra | **Cantera** | — |
| `clay_pool_*` | Pozo de Arcilla | **Greda del Río** | — |
| `ore_vein_*` | Veta de Mineral | **Veta de Hueso** | — |
| `tree_farm` | Granja Forestal | **Claro del Monte** | — |
| `excavation` | Excavación | **Excavación** | — |
| `clay_pit` | Hoyo de Arcilla | **Barranca de Greda** | — |
| `timber_yard` | Patio Maderero | **Corral de Troncos** | — |
| `forest_cave` | Cueva del Bosque | **Cueva del Bosque** | — |
| `mine` | Mina | **Mina** | — |

### Oficio (gray — hecho con manos)

| ID | Actual | **Nuevo** |
|---|---|---|
| `loom_*` / `a2_loom_*` | Telar | **Telar** |
| `glassworks_*` / `a2_glassworks_*` | Vidriera | **Obsidiana** |
| `press_*` / `a2_press_*` | Imprenta | **Taller de Corteza** |

### Rehue (blue — lugar sagrado / civil)

| ID | Actual | **Nuevo** | chainTo |
|---|---|---|---|
| `pawnshop_*` | Casa de Empeño | **Casa del Trueque** | — |
| `baths_*` | Baños | **Vertiente Termal** | Canal de Riego |
| `altar_*` | Altar | **Rehue** | Kamaruko |
| `theater_*` | Teatro | **Ruka de Reunión** | Kemu-Kemu |

### Machi (green — saber del tiempo / ciencia)

| ID | Actual | **Nuevo** | chainTo |
|---|---|---|---|
| `apothecary_*` | Boticario | **Lawentuchefe** (herbolaria) | Tropa de Caballos, Sanadora |
| `workshop_*` | Taller | **Taller de la Machi** | Arquero, Logia de la Luna |
| `scriptorium_*` | Scriptorium | **Quipucamayoc** | Consejo, Escuela del Sur |

### Trueque (yellow — comercio)

| ID | Actual | **Nuevo** | chainTo |
|---|---|---|---|
| `east_trading_post_*` | Puesto Oriental | **Posta del Este** | Tambo |
| `west_trading_post_*` | Puesto Occidental | **Posta del Oeste** | Tambo |
| `marketplace_*` | Mercado | **Mercado de la Pampa** | Caravana |
| `tavern_*` | Taberna | **Casa del Mate** | — |

### Malón (red — militar)

| ID | Actual | **Nuevo** |
|---|---|---|
| `stockade_*` | Empalizada | **Empalizada** |
| `barracks_*` | Cuartel | **Toldería de Guerreros** |
| `guard_tower_*` | Torre de Guardia | **Atalaya** |

---

## ERA II

### Materia

| ID | Actual | **Nuevo** |
|---|---|---|
| `a2_sawmill_*` | Aserradero | **Aserradero de Lenga** |
| `a2_quarry_*` | Cantera | **Cantera Mayor** |
| `a2_brickyard_*` | Ladrillar | **Adobera** |
| `a2_foundry_*` | Fundición | **Osario** (taller de hueso) |

### Rehue (blue)

| ID | Actual | **Nuevo** | chainTo |
|---|---|---|---|
| `a2_aqueduct_*` | Acueducto | **Canal de Riego** | — |
| `a2_temple_*` | Templo | **Kamaruko** (ceremonia anual) | Nguillatún |
| `a2_statue_*` | Estatua | **Kemu-Kemu** (monumento ancestral) | Jardín del Sur |
| `a2_courthouse_*` | Juzgado | **Consejo de Lonkos** | — |

### Machi (green)

| ID | Actual | **Nuevo** | chainTo |
|---|---|---|---|
| `a2_dispensary_*` | Farmacia | **Sanadora** | Ring de Lucha, Círculo de Ancianos |
| `a2_laboratory_*` | Laboratorio | **Logia de la Luna** | Taller de Lanzas, Observatorio del Cielo |
| `a2_library_*` | Biblioteca | **Archivo de Quipus** | Asamblea, Universidad del Sur |
| `a2_school_*` | Escuela | **Escuela del Sur** | Academia del Saber, Estudio del Cielo |

### Trueque (yellow)

| ID | Actual | **Nuevo** |
|---|---|---|
| `a2_forum_*` | Foro | **Tambo** (posta de descanso) |
| `a2_caravansery_*` | Caravansería | **Caravana del Lof** |
| `a2_vineyard_*` | Viñedo | **Viña Patagónica** |
| `a2_bazar_*` | Bazar | **Feria de Trueque** |

### Malón (red)

| ID | Actual | **Nuevo** |
|---|---|---|
| `a2_walls_*` | Murallas | **Muralla de Piedra** |
| `a2_training_ground_*` | Campo de Entrenamiento | **Campo de Adiestramiento** |
| `a2_stables_*` | Establos | **Tropa de Caballos** |
| `a2_archery_range_*` | Campo de Tiro | **Arquero** |

---

## ERA III

### Rehue (blue)

| ID | Actual | **Nuevo** |
|---|---|---|
| `a3_pantheon_*` | Panteón | **Nguillatún** (ceremonia mayor) |
| `a3_gardens_*` | Jardines | **Jardín del Sur** |
| `a3_town_hall_*` | Ayuntamiento | **Asamblea del Pueblo** |
| `a3_palace_*` | Palacio | **Ruka del Lonko Mayor** |
| `a3_senate_*` | Senado | **Asamblea Grande** |

### Machi (green)

| ID | Actual | **Nuevo** |
|---|---|---|
| `a3_lodge_*` | Logia | **Círculo de Ancianos** |
| `a3_observatory_*` | Observatorio | **Observatorio del Cielo** |
| `a3_university_*` | Universidad | **Universidad del Sur** |
| `a3_academy_*` | Academia | **Academia del Saber** |
| `a3_study_*` | Estudio | **Estudio del Cielo** |

### Trueque (yellow)

| ID | Actual | **Nuevo** |
|---|---|---|
| `a3_haven_*` | Puerto | **Caleta** |
| `a3_lighthouse_*` | Faro | **Fogón Guía** |
| `a3_chamber_*` | Cámara de Comercio | **Cámara del Trueque** |
| `a3_arena_*` | Arena | **Ring de Lucha** |

### Malón (red)

| ID | Actual | **Nuevo** |
|---|---|---|
| `a3_fortifications_*` | Fortificaciones | **Fortificación del Malón** |
| `a3_circus_*` | Circo | **Ruedo de Guerra** |
| `a3_arsenal_*` | Arsenal | **Tolderia de Armas** |
| `a3_siege_workshop_*` | Taller de Asedio | **Taller de Lanzas** |

### Lof (purple — gremios)

| ID | Actual | **Nuevo** |
|---|---|---|
| `g_workers` | Gremio de Trabajadores | **Lof de Trabajadores** |
| `g_craftsmens` | Gremio de Artesanos | **Lof de Artesanos** |
| `g_traders` | Gremio de Comerciantes | **Lof de Comerciantes** |
| `g_philosophers` | Gremio de Filósofos | **Lof de Machis** |
| `g_spies` | Gremio de Espías | **Lof de Rastreadores** |
| `g_magistrates` | Gremio de Magistrados | **Lof de Lonkos** |
| `g_shipowners` | Gremio de Armadores | **Lof de Canoeros** |
| `g_strategists` | Gremio de Estrategas | **Lof de Toquis** (jefes de guerra) |
| `g_scientists` | Gremio de Científicos | **Lof de Kimche** (sabios) |
| `g_builders` | Gremio de Constructores | **Lof de Constructores** |

---

## Campos `chainTo` — mapeo rápido

Claude Code tiene que actualizar los valores de `chainTo: [...]` porque hacen referencia al nombre (no al ID):

| `chainTo` actual | **Nuevo** |
|---|---|
| `'Acueducto'` | `'Canal de Riego'` |
| `'Templo'` | `'Kamaruko'` |
| `'Estatua'` | `'Kemu-Kemu'` |
| `'Establos'` | `'Tropa de Caballos'` |
| `'Farmacia'` | `'Sanadora'` |
| `'Campo de Tiro'` | `'Arquero'` |
| `'Laboratorio'` | `'Logia de la Luna'` |
| `'Juzgado'` | `'Consejo de Lonkos'` |
| `'Biblioteca'` | `'Archivo de Quipus'` |
| `'Foro'` | `'Tambo'` |
| `'Caravansería'` | `'Caravana del Lof'` |
| `'Panteón'` | `'Nguillatún'` |
| `'Jardines'` | `'Jardín del Sur'` |
| `'Arena'` | `'Ring de Lucha'` |
| `'Logia'` | `'Círculo de Ancianos'` |
| `'Taller de Asedio'` | `'Taller de Lanzas'` |
| `'Observatorio'` | `'Observatorio del Cielo'` |
| `'Senado'` | `'Asamblea Grande'` |
| `'Universidad'` | `'Universidad del Sur'` |
| `'Academia'` | `'Academia del Saber'` |
| `'Estudio'` | `'Estudio del Cielo'` |
| `'Circo'` | `'Ruedo de Guerra'` |
| `'Fortificaciones'` | `'Fortificación del Malón'` |

> **Importante**: la comparación de chains se hace por string — si un nombre cambia, su `chainTo` tiene que cambiar también. Revisar con find/replace en todo el repo (cliente + server).
