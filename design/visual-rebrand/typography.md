# Tipografía — Bajo la Cruz del Sur

## Fuentes

| Rol | Familia | Fallback |
|---|---|---|
| Display / títulos / nombres de cartas | **Cormorant Garamond** (500/600/700) | `Georgia, serif` |
| Body / UI / botones / stats | **DM Sans** (400/500/600/700) | `system-ui, sans-serif` |
| Mono (logs, códigos de sala) | `JetBrains Mono` opcional | `ui-monospace, monospace` |

Ambas son de Google Fonts, libres para uso comercial y sin conflicto de licencia.

## Instalación

### Opción A — Import en `index.html` (recomendado)

Agregar en `src/client/index.html` dentro del `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Opción B — Import en CSS

En `src/client/src/index.css`, al principio:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
```

## Uso recomendado

- **Nombres de carta**: Cormorant Garamond 600, tamaño prominente
- **Efectos de carta**: DM Sans 500, tamaño chico
- **Botones**: DM Sans 600, uppercase, letter-spacing +0.05em
- **Labels de sección**: DM Sans 600, uppercase, tamaño 9-11px, letter-spacing +0.15em
- **Stats numéricos** (puntos, monedas): Cormorant Garamond 700 para que destaque
- **Texto corrido / copy**: DM Sans 400

## Escalas

```
Título principal:   28-36px  Cormorant 600
Título secundario:  20-24px  Cormorant 600
Nombre carta:       14-18px  Cormorant 600
Cuerpo:             14px     DM Sans 400
Label pequeño:      9-11px   DM Sans 600 uppercase tracked
Stat destacado:     22-32px  Cormorant 700
```

## Detalle

Evitar oscilar entre ambas fuentes en una misma línea. Elegir una por nivel de jerarquía y mantenerla.
