# Instrucciones de integración — para Claude Code

**Objetivo**: aplicar el rebrand visual "Bajo la Cruz del Sur" sobre el motor de juego ya funcional. NO tocar lógica de juego, solo capa visual y strings.

## Protocolo de trabajo

- Aplicar **un archivo por vez**, pidiendo confirmación antes de cada commit
- Hacer `git commit` granular: un commit por paso
- Correr `npm run dev` y verificar visualmente antes de cada commit
- NO tocar `src/shared/src/types/`, `gameEngine.ts`, `scoring.ts`, `resourceCalculator.ts`, `constructionValidator.ts`, `military.ts`

---

## Paso 1 — Instalar fuentes

**Archivo**: `src/client/index.html`

Agregar en `<head>`, antes del `<title>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Verificar: abrir devtools → Network → debe cargar sin 404.

---

## Paso 2 — Aplicar paleta nueva

**Archivo**: `src/client/src/index.css`

Reemplazar el bloque `:root { ... }` completo por el contenido de `visual-rebrand/PALETTE.css`.

**Mantener** el resto del archivo igual: estilos de `.game-table`, `.game-grid`, `.mat-me`, etc.

Verificar: el fondo general pasa de `#0e0c09` (marrón) a `#0f1419` (azul oscuro patagónico). Los bordes dorados pasan a plateados.

---

## Paso 3 — Actualizar labels de colores

**Archivo**: `src/client/src/utils/icons.ts`

Reemplazar `COLOR_LABEL`:

```ts
export const COLOR_LABEL: Record<CardColor, string> = {
  brown:  'Materia',
  gray:   'Oficio',
  blue:   'Rehue',
  green:  'Machi',
  yellow: 'Trueque',
  red:    'Malón',
  purple: 'Lof',
};
```

Opcional (depende de si quieren cambiar emojis):

```ts
export const RESOURCE_ICON: Record<Resource, string> = {
  wood:    '🌲',  // lenga (antes 🪵)
  stone:   '◢',   // piedra (antes 🪨)
  clay:    '◒',   // arcilla (antes 🧱)
  ore:     '╱',   // hueso (antes ⚙️)
  glass:   '◆',   // obsidiana (antes 🔮)
  loom:    '〰',  // lana (antes 🧵)
  papyrus: '▭',   // corteza (antes 📜)
};
```

> Los glifos geométricos son intencionalmente minimalistas. Si se mantienen los emojis originales, el juego sigue funcionando — solo cambia el tono visual.

---

## Paso 4 — Renombrar cartas

**Archivo**: `src/server/src/game/cards.ts`

Seguir `visual-rebrand/cards-catalog.md` al pie de la letra.

**Reglas**:
- Cambiar SOLO el campo `name`. NO cambiar `id`, `color`, `age`, `cost`, `effects`, `chainTo` estructuralmente.
- Cuando `chainTo` contiene strings que hacen referencia a nombres de otras cartas (ej: `chainTo: ['Acueducto']`), actualizar esos strings al nombre nuevo (ej: `chainTo: ['Canal de Riego']`). Ver tabla final de `cards-catalog.md`.
- Después de aplicar los cambios: `grep -r "'Acueducto'" src/` → no debería aparecer más. Repetir con cada string de la tabla de chains.

**Orden sugerido de edición**:
1. Era I brown (10 cartas)
2. Era I gray (6 cartas)
3. Era I blue (8 cartas)  ← ojo con chainTo
4. Era I green (6 cartas)
5. Era I yellow (9 cartas)
6. Era I red (6 cartas)
7. Era II completo
8. Era III completo (incluye gremios)

Tras cada era: correr `npm run dev` y construir algunas cartas para verificar que las chains siguen funcionando.

---

## Paso 5 — Renombrar pueblos (maravillas)

**Archivo**: `src/server/src/game/wonders.ts`

Seguir `visual-rebrand/wonders-catalog.md`.

**Opción conservadora** (recomendada):
- Cambiar solo el campo `name` de cada entrada.
- Mantener los `id` originales (`giza`, `babylon`, etc.).
- NO hace falta tocar paths de imágenes todavía.

**Opción completa** (hacer después si querés):
- Cambiar `id` a nombre nuevo (`nukemapu`, `aonikenk`, etc.)
- Renombrar archivos en `src/client/public/assets/wonders/`
- Actualizar todas las referencias al id

---

## Paso 6 — Integrar ilustraciones

**Carpeta**: `src/client/public/assets/cards/`

Reemplazar las 7 imágenes `card-{color}.png` por las nuevas ilustraciones (una por familia):

```
card-brown.png   ← ilustración base "Materia"
card-gray.png    ← "Oficio" (telar, platería)
card-blue.png    ← "Rehue" (rehue / kamaruko)
card-green.png   ← "Machi" (lawentuchefe)
card-yellow.png  ← "Trueque" (caravana)
card-red.png     ← "Malón" (guerreros)
card-purple.png  ← "Lof" (familia, asamblea)
```

**Mantener**: nombres de archivo idénticos. El código no cambia — solo se reemplazan los PNGs.

Si se quiere **una ilustración por carta individual** (no solo por familia), hay que refactorizar `CardView.tsx` para leer una imagen específica:

```tsx
const img = `/assets/cards/${card.id}.png`;  // fallback a COLOR_IMG[card.color] si no existe
```

Eso es opcional y va en una fase posterior.

**Fondo de mesa**: reemplazar `src/client/public/assets/table-bg.png` por una textura coherente (cuero patagónico, lana cruda, piedra). Mantener resolución y aspect ratio similares.

---

## Paso 7 — Tipografía en componentes

**Archivo**: `src/client/src/components/CardView.tsx`

En el bloque del **nombre de la carta** (ya existente), agregar:

```tsx
// Card name
<div style={{
  padding: '4px 8px 2px',
  fontSize: '0.82rem',
  fontFamily: "'Cormorant Garamond', serif",   // ← añadir esta línea
  fontWeight: 600,
  lineHeight: 1.15,
  color: '#fff',
  minHeight: 30,
  background: bg,
}}>
  {card.name}
</div>
```

En el **label de familia** ("RehUE", "MATERIA"):

```tsx
<div style={{
  // ...lo existente
  fontSize: '0.58rem',
  fontFamily: "'DM Sans', sans-serif",         // ← añadir
  fontWeight: 700,
  letterSpacing: '0.12em',                     // ← aumentar tracking
  textTransform: 'uppercase',
  // ...
}}>
  {label}
</div>
```

Replicar el criterio en `WonderBoard.tsx`, `ScoringScreen.tsx`, `LobbyPage.tsx`.

---

## Paso 8 — Título del juego

**Buscar** en el código: `7 Wonders`, `7 Wonders Digital`, `wonders-digital`.

Reemplazar los **títulos visibles al usuario** por `Bajo la Cruz del Sur` (o `BAJO LA CRUZ DEL SUR` para el display principal):

- `src/client/index.html` → `<title>`
- `LobbyPage.tsx` → título del lobby
- `App.tsx` → cualquier header

**NO cambiar**:
- Nombre del paquete en `package.json` (es referencia interna)
- Imports de `@7wonders/shared` (ese scope interno queda igual)
- Nombres de archivo o rutas

---

## Checklist final

Antes de cerrar la sesión:

- [ ] `npm run dev` levanta sin errores
- [ ] Lobby muestra nuevo título y fuente serif
- [ ] Partida nueva: las cartas muestran nombres nuevos
- [ ] Los colores de carta son los patagónicos (no oro/marrón mediterráneo)
- [ ] Una cadena construida gratis (ej: Vertiente Termal → Canal de Riego) sigue funcionando
- [ ] Resolución militar muestra escudos con el nuevo tema rojo ñire
- [ ] Scoring screen respeta la paleta nueva
- [ ] Reconexión sigue funcionando

---

## Referencias

- `components-reference/` — código JSX del prototipo (no compilar, solo leer como referencia visual)
- `illustrations/MANIFEST.json` — mapeo detallado carta ↔ archivo
- `BRANDING.md` — filosofía y detalles conceptuales
