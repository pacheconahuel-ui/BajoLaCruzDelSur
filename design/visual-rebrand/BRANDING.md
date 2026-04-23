# Branding — Bajo la Cruz del Sur

## Concepto

**Bajo la Cruz del Sur** es una re-ambientación de 7 Wonders hacia una estética de pueblos originarios patagónicos y sudamericanos. No es una parodia ni un homenaje — es un traslado narrativo completo donde cada elemento del juego original tiene un equivalente culturalmente coherente.

**El juego es el mismo.** Las cartas tienen los mismos efectos, los mismos costos, las mismas cadenas. Solo cambian los nombres, las ilustraciones, la paleta y la tipografía.

---

## Mapeo conceptual 7 Wonders → Bajo la Cruz del Sur

### Colores → Familias

| 7W Original | Color | Confederación del Sur | Subtítulo |
|---|---|---|---|
| Brown (raw materials) | Marrón tierra | **Materia** (Crudo) | Del monte y el mar |
| Gray (manufactured) | Gris basalto | **Oficio** | Hecho con manos |
| Blue (civic) | Azul patagónico | **Rehue** | Lugar sagrado |
| Green (science) | Verde líquen | **Machi** | Saber del tiempo |
| Yellow (commercial) | Ocre / plata quemada | **Trueque** | Caminos y carga |
| Red (military) | Rojo ñire | **Malón** | Lanza y escudo |
| Purple (guilds) | Violeta | **Lof** | Linaje y familia |

### Recursos

| 7W | Nuevo nombre | Glifo sugerido |
|---|---|---|
| wood | **Lenga** (madera) | 🌲 |
| stone | **Piedra** | ◢ |
| clay | **Arcilla** | ◒ |
| ore | **Hueso** | ╱ |
| loom | **Lana** | 〰 |
| glass | **Obsidiana** | ◆ |
| papyrus | **Corteza** | ▭ |

### Maravillas → 7 Pueblos (Capitales)

| 7W (Giza, Babilonia, etc) | Pueblo | Región | Ethnónimo |
|---|---|---|---|
| Giza | **Ñuke Mapu** | Araucanía · Neuquén | Mapuche |
| Babylon | **Aónikenk** | Patagonia austral | Tehuelche |
| Olympia | **Selk'nam** | Tierra del Fuego | Selk'nam (Ona) |
| Rhodes | **Kawésqar** | Canales fueguinos | Kawésqar (Alacalufe) |
| Ephesos | **Yámana** | Canal Beagle | Yámana (Yaghan) |
| Halikarnassos | **Rankül** | Pampa central | Ranquel |
| Alexandria | **Günün-a-Künna** | Patagonia norte | Tehuelche septentrional |

> **Nota cultural**: los pueblos listados son reales. Las mecánicas de sus "capitales" son las mismas que las maravillas originales — no representamos prácticas ancestrales específicas. Es una ambientación respetuosa pero claramente lúdica.

---

## Tono de voz

- **Copy**: austero, informativo, sin adornos. "Telar" en vez de "El noble telar de los artesanos".
- **Narración de cartas**: descripción física de lo que la carta representa, no invocaciones épicas.
- **Botones**: verbos directos ("Construir", "Alzar etapa", "Descartar").
- **Sin emoji decorativo** en UI — solo en copy auxiliar si fuera necesario.

---

## Paleta visual

**Fondos**
- Night (fondo general): `#0f1419`
- Slate (piedra volcánica): `#2b3847`
- Linen (lana cruda): `#ece3d0`
- Bone (hueso blanqueado): `#e8ddc6`

**Acentos**
- Silver (plata mapuche): `#b8c0c9`
- Ember (rojo ñire): `#b94a2a`
- Sky (azul patagónico): `#2b5a8a`
- Lichen (verde): `#6e8559`
- Earth (cuero curtido): `#7a4a28`

Ver `PALETTE.css` para los hex exactos con las variables del proyecto.

---

## Tipografía

- **Display / títulos**: `Cormorant Garamond` (serif humanista con carácter arcaico)
- **Body / UI**: `DM Sans` (sans humanista, legible a tamaño pequeño)

Ambas fuentes son de Google Fonts, libres. Ver `typography.md`.

---

## Qué NO cambiar

- Estructura de componentes React
- Lógica de juego (server)
- Tipos en `@7wonders/shared`
- Nombres de archivo de los componentes
- IDs internos de cartas (mantener `stone_pit` como ID aunque el label sea "Cantera")
- Socket events

El rebrand es **cosmético y narrativo**. El motor queda intacto.
