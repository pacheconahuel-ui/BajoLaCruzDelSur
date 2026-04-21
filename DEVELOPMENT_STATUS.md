# 7 Wonders Digital — Estado de Desarrollo
**Última actualización:** 2026-04-20  
**Stack:** React + TypeScript (frontend) · Node.js + Socket.io (backend) · Monorepo npm workspaces

---

## ✅ Funcionalidades Completas

### Backend / Lógica de Juego
| Sistema | Archivo | Estado |
|---------|---------|--------|
| Tipos compartidos (Card, PlayerState, GameState, WonderStage) | `src/shared/src/types/` | ✅ |
| Mazo completo Era I–III en español (~75 cartas) | `src/server/src/game/cards.ts` | ✅ |
| 7 Maravillas lado A con costos de etapas y efectos | `src/server/src/game/wonders.ts` | ✅ |
| Calculador de recursos (produce_resource, produce_choice, tradeables) | `src/server/src/game/resourceCalculator.ts` | ✅ |
| Validador de construcción (recursos, cadenas, Olimpia gratis) | `src/server/src/game/constructionValidator.ts` | ✅ |
| Deck builder — filtra por N jugadores, selecciona N+2 gremios | `src/server/src/game/deckBuilder.ts` | ✅ |
| Motor de juego (turnos, pasar manos, fases, acciones simultáneas) | `src/server/src/game/gameEngine.ts` | ✅ |
| Resolución militar por era (+1/+3/+5 victoria, −1 derrota) | `src/server/src/game/military.ts` | ✅ |
| Puntuación final (militar, tesoro, maravilla, civil, ciencia, comercio, gremios) | `src/server/src/game/scoring.ts` | ✅ |
| Comercio automático (descuento izq/der, pago a vecinos) | `src/server/src/game/constructionValidator.ts` | ✅ |
| Lobby, salas, reconexión con rejoin | `src/server/src/socket/` | ✅ |

### Frontend / UI
| Pantalla / Componente | Archivo | Estado |
|-----------------------|---------|--------|
| Lobby (crear/unirse) | `src/client/src/pages/LobbyPage.tsx` | ✅ |
| Sala de espera + código de sala | `src/client/src/App.tsx` | ✅ |
| Tablero principal (grid 3 columnas: vecino izq · yo · vecino der) | `src/client/src/pages/GamePage.tsx` | ✅ |
| Tablero de maravilla (imagen, nombre, etapas) | `src/client/src/components/WonderBoard.tsx` | ✅ |
| Ciudad tableau (columnas apiladas por color) | `src/client/src/components/CityTableau.tsx` | ✅ |
| Carta de mano seleccionable (imagen, nombre, efecto, costo, badge de comercio) | `src/client/src/components/CardView.tsx` | ✅ |
| Carta del tableau (compacta, tamaños md/sm) | `src/client/src/components/TableauCard.tsx` | ✅ |
| Panel de acción (Construir / Etapa Maravilla / Descartar / Cancelar) | dentro de `GamePage.tsx` | ✅ |
| Resolución militar entre eras (escudos, combates, PV) | `src/client/src/pages/MilitaryDisplay.tsx` | ✅ |
| Pantalla de puntaje final (barras de podio, tabla completa) | `src/client/src/pages/ScoringScreen.tsx` | ✅ |
| Guía rápida de reglas | `src/client/src/components/CheatSheet.tsx` | ✅ |
| Toast de desconexión de jugadores | `src/client/src/App.tsx` | ✅ |
| Reconexión automática con localStorage | `src/client/src/App.tsx` | ✅ |
| Calcular asequibilidad en cliente (recursos, comercio, maravilla) | `src/client/src/utils/affordability.ts` | ✅ |

### Assets Visuales
| Asset | Ruta | Estado |
|-------|------|--------|
| Imágenes de cartas por color (7 archivos) | `src/client/public/assets/cards/` | ✅ |
| Imágenes de maravillas (7 archivos) | `src/client/public/assets/wonders/` | ✅ |
| Textura de mesa de madera | `src/client/public/assets/table-bg.png` | ✅ |

---

## ✅ Bug Resuelto — Gremio de Armadores

### Gremio de Armadores — nombre hardcodeado en inglés *(RESUELTO)*
**Archivo:** `src/server/src/game/scoring.ts` — línea 102  
**Problema:** Al traducir las cartas al español, este check dejó de funcionar porque buscaba el nombre en inglés.  
**Fix aplicado:** Cambiado `'Shipowners Guild'` → `'Gremio de Armadores'` en la línea 102 de `scoring.ts`.

---

## ⏳ Pendiente — Funcionalidades Incompletas

### ~~1. Efectos especiales de Maravillas no implementados en servidor~~ ✅ RESUELTO
Estos efectos existen en los tipos pero el servidor no los ejecuta:

| Efecto | Maravilla | Stage | Archivo a modificar |
|--------|-----------|-------|---------------------|
| `build_from_discard` | Halicarnaso (etapa 2) | Stage 2 | `gameEngine.ts` → `applyWonderStageEffects()` |
| `copy_guild` | Halicarnaso (etapa 3) | Stage 3 | `gameEngine.ts` + pantalla de selección en cliente |

**Cómo implementar `build_from_discard`:**
- Al aplicar los efectos de etapa en `applyWonderStageEffects()`, si el efecto es `build_from_discard`, cambiar la fase del juego a un nuevo estado `'choose_from_discard'`
- El cliente debe mostrar una pantalla con las cartas del `state.discardPile` para elegir una
- El servidor construye esa carta sin costo

**Cómo implementar `copy_guild`:**
- Al resolver la puntuación en `computeGuildScore()` en `scoring.ts`, si el jugador tiene `copy_guild`, pedir que seleccione qué gremio de vecinos copiar
- Alternativa simplificada (automática): elegir el gremio que da más puntos

### 2. Efecto `free_build_per_age` — Olimpia
El server ya aplica `freeBuildsLeft++` al construir la etapa, pero al iniciar la **siguiente era** no resetea el flag correctamente para nuevos jugadores que construyan la etapa durante esa era. Revisar `endAge()` en `gameEngine.ts`.

### 3. UI — Mejoras pendientes propuestas
| Mejora | Prioridad | Dificultad |
|--------|-----------|------------|
| Dirección del comercio en badge de carta (`←2💰` vs `→2💰`) | Media | Baja — actualizar `Affordability` para exponer `leftCoins`/`rightCoins` y pasarlos a `CardView` |
| Animación de transición entre turnos (flip de cartas al revelar) | Baja | Alta |
| Sonidos de ambiente / efectos de juego | Baja | Media |
| Responsive mobile completo | Media | Media |
| Modo oscuro / opciones de accesibilidad | Baja | Baja |

### 4. Base de datos / Persistencia
Actualmente **no hay persistencia**. Si el servidor se reinicia, las partidas se pierden. Para partidas guardadas habría que conectar PostgreSQL (ya está en el stack según el brief inicial).

---

## 📁 Archivos Modificados en las Últimas Sesiones

### Servidor
```
src/server/src/game/cards.ts           — Traducción completa al español (~75 cartas + chainTo)
src/server/src/game/gameEngine.ts      — Logs en español, comercio automático completo
src/server/src/socket/handlers.ts      — game:rejoin para reconexión
```

### Cliente — Componentes
```
src/client/src/components/CardView.tsx      — Imagen ilustración, selected scale(1.07), sin translateY
src/client/src/components/CityTableau.tsx   — Columnas apiladas, CARD_H corregido, labels completos
src/client/src/components/TableauCard.tsx   — Tamaño md aumentado (84px), imgH 52px
src/client/src/components/WonderBoard.tsx   — Imágenes de maravillas, modo compact y full
src/client/src/components/PlayerInfo.tsx    — Barra de jugadores en header
```

### Cliente — Páginas
```
src/client/src/pages/GamePage.tsx       — Layout mesa, panel acción, botón Cancelar, paddingLeft/Right mano
src/client/src/pages/ScoringScreen.tsx  — Rediseño completo con podio y tabla dorada
src/client/src/pages/MilitaryDisplay.tsx — Combates individuales (← ▲ / → ▼), PV por jugador
src/client/src/App.tsx                  — Reconexión localStorage, toast desconexión
```

### Cliente — Utilidades y Estilos
```
src/client/src/utils/icons.ts           — COLOR_IMG, effectos de comercio legibles ("→ Mat. ×1💰")
src/client/src/utils/affordability.ts   — computeWonderAffordability, WONDER_STAGE_COSTS
src/client/src/index.css               — .game-table (imagen madera), .mat-me (min-width:0),
                                         .mat-neighbor (overflow-x:clip), columnas 260px,
                                         toast animation
```

---

## 🚀 Próximos Pasos Recomendados (en orden)

1. ~~**[CRÍTICO — 5 min]** Corregir bug de Gremio de Armadores en `scoring.ts` línea 102~~ ✅ **RESUELTO**
2. ~~**[IMPORTANTE]** Implementar `build_from_discard` (Halicarnaso etapa 2)~~ ✅ RESUELTO
3. ~~**[IMPORTANTE]** Implementar `copy_guild` (Halicarnaso etapa 3)~~ ✅ RESUELTO (automático)
4. ~~**[MEJORA UX]** Mostrar dirección del comercio en badge~~ ✅ RESUELTO (`←2💰` / `→1💰`)
5. **[FUTURO]** Conectar PostgreSQL para persistencia de partidas

---

## 🏃 Cómo Levantar el Proyecto

```bash
# Desde la raíz del proyecto
npm run dev

# Esto levanta en paralelo:
#   - Cliente Vite: http://localhost:5173
#   - Servidor Node: http://localhost:3001

# Para probar multijugador local:
#   - 1 ventana normal (jugador 1)
#   - 2 ventanas incógnito (jugadores 2 y 3)
#   - Todos apuntan a http://localhost:5173
```

---

## 📐 Arquitectura del Proyecto

```
wonders-digital/
├── src/
│   ├── shared/          # @7wonders/shared — tipos TypeScript (Card, GameState, etc.)
│   ├── server/          # Node.js + Socket.io — lógica de juego, salas, eventos
│   └── client/          # React + Vite — UI, componentes, utils
│       └── public/assets/
│           ├── cards/       # card-brown.png … card-purple.png
│           ├── wonders/     # wonder-colossus.png … wonder-giza.png
│           └── table-bg.png
└── DEVELOPMENT_STATUS.md   # este archivo
```
