# Ilustraciones — Bajo la Cruz del Sur

Carpeta para las imágenes generadas que van a reemplazar los assets actuales en `src/client/public/assets/`.

## Estrategia sugerida (fases)

### Fase 1 — Una ilustración por familia (7 imágenes)
Reemplaza los 7 `card-{color}.png` existentes. Es el mínimo viable para que la UI se vea completamente re-temática.

**Archivos a generar**:
- `card-brown.png` (Materia)
- `card-gray.png` (Oficio)
- `card-blue.png` (Rehue)
- `card-green.png` (Machi)
- `card-yellow.png` (Trueque)
- `card-red.png` (Malón)
- `card-purple.png` (Lof)

### Fase 2 — Pueblos (Capitales)
Reemplaza los 5 wonders existentes + agrega los 2 faltantes. Ver `MANIFEST.json` → `wonders`.

### Fase 3 (opcional) — Una ilustración por carta
Si se quiere profundidad visual máxima: una imagen única por cada una de las ~75 cartas. Requiere refactor menor en `CardView.tsx` (ver `MANIFEST.json` → `future_expansion`).

## Prompt maestro (nano banana / midjourney)

```
Flat editorial illustration of [ESCENA], Mapuche and Patagonian indigenous
aesthetic, hand-drawn ink outlines, muted earth tones palette:
deep oxblood red (#8b2a22), indigo blue (#2b5a8a), cream white (#ece3d0),
bone beige, forest green, dark brown. Subtle paper texture background (cream
#ece3d0). Decorative geometric border frame inspired by Mapuche textile
patterns (guardas, rhombi, eight-pointed stars, stepped chakana), red and
blue symmetrical motifs on all four sides. Scene shows indigenous figures
in traditional ponchos with geometric trims, braided hair, [ACCIÓN]. Flat
colors, no 3D, no gradients, no photorealism, no modern elements,
square 1:1 format. Caption ribbon at bottom with [NOMBRE] in small caps.
```

## Entrega

Cuando tengas las imágenes, reemplazalas directamente en:

```
src/client/public/assets/cards/card-*.png
src/client/public/assets/wonders/wonder-*.png
src/client/public/assets/table-bg.png
```

El código no necesita cambios si mantenés los nombres de archivo.
