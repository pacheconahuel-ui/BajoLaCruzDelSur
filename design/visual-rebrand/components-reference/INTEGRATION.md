# Componentes de referencia — Prototype

Esta carpeta contiene los archivos `.jsx` del prototipo visual original. **No se compilan ni se importan** en el proyecto — son solo material de referencia visual para Claude Code.

## Qué mirar en cada archivo

| Archivo | Para qué sirve | Equivale en el repo |
|---|---|---|
| `tokens.jsx` | Tokens de diseño: paleta, tipografía, sombras, radios | `index.css` (:root) |
| `glyphs.jsx` | SVG de recursos, familias, símbolos de ciencia | `icons.ts` |
| `card.jsx` | Anatomía de carta — header familia, nombre, costo, efecto, estados | `CardView.tsx` |
| `tableau.jsx` | Ciudad del jugador — columnas por color | `CityTableau.tsx` |
| `capital.jsx` | Pueblo/Maravilla con 3 etapas | `WonderBoard.tsx` |
| `hand.jsx` | Mano de cartas del jugador | sección `hand-scroll` en `GamePage.tsx` |
| `action-panel.jsx` | Botones Construir/Etapa/Descartar | panel en `GamePage.tsx` |
| `game-table.jsx` | Layout general de mesa (vecino-izq · yo · vecino-der) | `GamePage.tsx` + `.game-grid` |

## Qué NO copiar

- Los componentes usan un sistema de tokens propio (inline styles con tokens de `tokens.jsx`). El repo real usa CSS variables en `index.css`. **No portar los tokens JSX** — ya están traducidos en `PALETTE.css`.
- Las props y estructuras de datos del prototipo son simplificadas. El repo real usa tipos de `@7wonders/shared` — respetar esos tipos.
- Los handlers de eventos del prototipo son dummy. Mantener los handlers reales del repo.

## Qué SÍ extraer

- **Jerarquía visual**: orden de elementos dentro de la carta (header familia → ilustración → nombre → efecto → costo).
- **Proporciones**: tamaños relativos entre componentes (la ilustración ocupa ~55% de la carta, el header de familia ~10%, etc.).
- **Estados**: cómo se ve una carta "selected", "can't afford", "free (chain)", "free (olympia)".
- **Tipografía**: qué elementos van en serif (Cormorant) y cuáles en sans (DM Sans).
- **Espaciado y paddings**: para que la densidad visual coincida.

## Filosofía

El repo ya tiene los componentes estructurados y funcionando. **No reescribir** `CardView.tsx` desde cero — solo ajustar colores, fuentes, y agregar la ilustración de fondo siguiendo la anatomía del prototipo.
