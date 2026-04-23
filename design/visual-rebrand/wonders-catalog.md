# Catálogo de Pueblos (Capitales) — Bajo la Cruz del Sur

Reemplaza las 7 Maravillas del mundo antiguo por los **7 Pueblos de la Confederación del Sur**. Cada Pueblo equivale a una "Capital" — mantiene la misma estructura de 3 etapas, recurso inicial, costos y efectos.

Archivo a modificar: `src/server/src/game/wonders.ts`

> Los `id` internos pueden mantenerse (colossus, lighthouse, etc.) para no romper referencias, **o** renombrarse a los IDs nuevos. Si se renombran, hay que actualizar todas las referencias (incluidos `public/assets/wonders/wonder-*.png`).

---

## Mapeo directo

| ID actual | Nombre actual | **ID nuevo (recomendado)** | **Nombre nuevo** | Pueblo (etnónimo) | Recurso inicial |
|---|---|---|---|---|---|
| `colossus` | The Colossus of Rhodes | `kaweskar` | **Kawésqar** (Alacalufe) | canales fueguinos | `ore` → Hueso |
| `lighthouse` | The Lighthouse of Alexandria | `gununa` | **Günün-a-Künna** | Patagonia norte | `papyrus` → Corteza |
| `temple` | The Temple of Artemis | `yamana` | **Yámana** (Yaghan) | Canal Beagle | `papyrus` → Corteza |
| `babylon` | Hanging Gardens of Babylon | `aonikenk` | **Aónikenk** (Tehuelche) | Patagonia austral | `clay` → Arcilla |
| `olympia` | Statue of Zeus | `selknam` | **Selk'nam** (Ona) | Tierra del Fuego | `wood` → Lenga |
| `halicarnassus` | Mausoleum of Halicarnassus | `rankul` | **Rankül** (Ranquel) | Pampa central | `loom` → Lana |
| `giza` | Pyramids of Giza | `nukemapu` | **Ñuke Mapu** (Mapuche) | Araucanía / Neuquén | `stone` → Piedra |

---

## Etapas — nombres narrativos sugeridos

Son **cosméticos** (labels para el cliente). La mecánica no cambia.

### Ñuke Mapu (antes Giza) — `stone`

| Etapa | Mecánica | Nombre sugerido |
|---|---|---|
| 1 | +3 PV | **Fundar la Ruka Mayor** |
| 2 | +5 PV | **Elevar el Rehue** |
| 3 | +7 PV | **Coronar el Pueblo** |

### Aónikenk (antes Babylon) — `clay`

| 1 | +3 PV | **Levantar los Toldos** |
| 2 | +símbolo ciencia libre | **Consejo de Machis** |
| 3 | +7 PV | **Gran Asamblea** |

### Selk'nam (antes Olympia) — `wood`

| 1 | +3 PV | **Encender el Hain** |
| 2 | free build/era | **Ofrenda del Lof** |
| 3 | +7 PV | **Pueblo Inmortal** |

### Kawésqar (antes Colossus) — `ore`

| 1 | +3 PV | **Tallar la Canoa** |
| 2 | +2 escudos | **Armar la Flota** |
| 3 | +7 PV | **Guardianes del Canal** |

### Yámana (antes Ephesos) — `papyrus`

| 1 | +3 PV | **Fogón del Beagle** |
| 2 | +9 monedas | **Posta de Trueque** |
| 3 | +7 PV | **Rito del Chiexaus** |

### Günün-a-Künna (antes Alexandria/Lighthouse) — `papyrus`

| 1 | +3 PV | **Encender el Fogón Guía** |
| 2 | produce recurso elegido | **Dominio del Viento** |
| 3 | +7 PV | **Faro del Sur** |

### Rankül (antes Halicarnassus) — `loom`

| 1 | +3 PV | **Tejer la Memoria** |
| 2 | build from discard | **Recuperar lo Perdido** |
| 3 | copy guild | **Heredar el Linaje** |

---

## Imágenes de capitales

Los archivos actuales en `src/client/public/assets/wonders/` son:

```
wonder-babylon.png       → reemplazar por  wonder-aonikenk.png
wonder-giza.png          → reemplazar por  wonder-nukemapu.png
wonder-halicarnassus.png → reemplazar por  wonder-rankul.png
wonder-lighthouse.png    → reemplazar por  wonder-gununa.png
wonder-olympia.png       → reemplazar por  wonder-selknam.png
(faltantes)              → agregar         wonder-kaweskar.png
                                           wonder-yamana.png
```

**Prompt base para nano banana (ilustraciones de capitales)**:

> Flat editorial illustration of [PUEBLO] settlement, Mapuche/Patagonian indigenous aesthetic, hand-drawn ink outlines, muted earth-tones palette (oxblood #8b2a22, indigo #2b5a8a, cream #ece3d0, forest green), paper texture background, decorative geometric Mapuche border frame on four sides, central scene shows the settlement with: [ESCENA]. Flat colors, no 3D, no gradients, no photorealism, square 1:1, caption ribbon at bottom with settlement name in small caps.

Escenas específicas:
- **Ñuke Mapu**: ruka mapuche grande con humo, rehue tallado delante, montañas nevadas detrás, figuras con ponchos geométricos.
- **Aónikenk**: toldos de cuero de guanaco en la estepa, caballos en segundo plano, figuras altas con capas pintadas.
- **Selk'nam**: hombres pintados de blanco/rojo/negro (ceremonia Hain), bosque subantártico, fogón central.
- **Kawésqar**: canoas largas en canales con glaciares al fondo, figuras con capas de piel de nutria.
- **Yámana**: ruka cónica de ramas cerca del agua, fogón, canoa tallada, bosque de lenga.
- **Günün-a-Künna**: campamento en la costa patagónica, viento, fogón alto como faro.
- **Rankül**: toldos en la pampa, caballos, figuras tejiendo con boleadoras colgando.

---

## Cambios en `wonders.ts`

```ts
export const WONDERS: WonderBoard[] = [
  {
    id: 'nukemapu',                                 // antes 'giza'
    name: 'Ñuke Mapu',                              // antes 'The Pyramids of Giza'
    startingResource: 'stone',                      // SIN CAMBIOS
    stages: [                                       // SIN CAMBIOS en costos/efectos
      { cost: { stone: 2 }, effects: [...] },
      { cost: { wood: 3 },  effects: [...] },
      { cost: { stone: 4 }, effects: [...] },
    ],
  },
  // ... resto igual
];
```

Si se cambia el `id`, actualizar:
- `WonderBoard` type (shared) si define una unión literal
- Cualquier lookup por id en cliente
- Path de asset: `WONDERS_IMG[id]` en `icons.ts` o donde corresponda

**Alternativa más segura**: mantener `id: 'giza'` y solo cambiar `name`. Menos riesgo, mismo resultado visual.
