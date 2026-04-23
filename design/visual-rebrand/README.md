# Visual Rebrand — Bajo la Cruz del Sur

Este paquete contiene todo lo necesario para aplicar el rebrand visual sobre el motor de juego ya funcional. **No toca la lógica del juego.** Solo texto, paleta, tipografía, ilustraciones y nombres.

## Orden de aplicación (para Claude Code)

1. Leer `BRANDING.md` — entender el mapeo conceptual.
2. Aplicar `PALETTE.css` en `src/client/src/index.css` (reemplaza `:root`).
3. Agregar imports de Google Fonts según `typography.md`.
4. Actualizar `COLOR_LABEL` en `src/client/src/utils/icons.ts` con los nuevos labels.
5. Renombrar cartas en `src/server/src/game/cards.ts` según `cards-catalog.md`.
6. Renombrar maravillas en `src/server/src/game/wonders.ts` según `wonders-catalog.md`.
7. Reemplazar imágenes en `src/client/public/assets/` (ver `illustrations/MANIFEST.json`).
8. Ajustar iconos de recursos en `icons.ts` — emoji mapping opcional.

## Estructura del paquete

```
visual-rebrand/
├── README.md                      # este archivo
├── INSTRUCTIONS.md                # paso a paso detallado
├── BRANDING.md                    # concepto + mapeo
├── PALETTE.css                    # variables CSS nuevas
├── typography.md                  # fuentes y specs
├── cards-catalog.md               # 75 cartas renombradas
├── wonders-catalog.md             # 7 pueblos (maravillas)
├── components-reference/          # .jsx del prototype como referencia
│   ├── tokens.jsx
│   ├── glyphs.jsx
│   ├── card.jsx
│   ├── capital.jsx
│   ├── tableau.jsx
│   └── INTEGRATION.md
└── illustrations/
    ├── MANIFEST.json              # mapeo carta → archivo
    └── README.md                  # cómo generar las ilustraciones
```

## Filosofía

El motor de juego no cambia. Las mecánicas son idénticas al 7 Wonders original. Lo único que cambia es la **capa semántica y visual**: ambientación patagónica con pueblos originarios, paleta de plata/lana/piedra, tipografía humanista con serif, y tono narrativo austral.

Cada carta del juego base tiene un equivalente directo en este rebrand. Claude Code debe mantener el mapeo **1:1** — no inventar efectos nuevos, no cambiar costos, no alterar chains.
