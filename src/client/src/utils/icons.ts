import { CardColor, CardEffect, Resource } from '@7wonders/shared';

export const RESOURCE_ICON: Record<Resource, string> = {
  wood:    '🪵',
  stone:   '🪨',
  clay:    '🧱',
  ore:     '⚙️',
  glass:   '🔮',
  loom:    '🧵',
  papyrus: '📜',
};

export const SCIENCE_ICON: Record<string, string> = {
  compass: '🧭',
  gear:    '⚙',
  tablet:  '📋',
};

export const COLOR_BG: Record<CardColor, string> = {
  brown:  '#6b3a14',
  gray:   '#3d4a5c',
  blue:   '#1a3a6e',
  green:  '#2c4a33',
  yellow: '#7a3c0a',
  red:    '#6b1c14',
  purple: '#2e1f44',
};

export const COLOR_IMG: Record<CardColor, string> = {
  brown:  '/assets/cards/card-brown.png',
  gray:   '/assets/cards/card-gray.png',
  blue:   '/assets/cards/card-blue.png',
  green:  '/assets/cards/card-green.png',
  yellow: '/assets/cards/card-yellow.png',
  red:    '/assets/cards/card-red.png',
  purple: '/assets/cards/card-purple.png',
};

export const COLOR_ACCENT: Record<CardColor, string> = {
  brown:  '#956034',
  gray:   '#6f7a87',
  blue:   '#2b5a8a',
  green:  '#507a4d',
  yellow: '#c08428',
  red:    '#a83a2c',
  purple: '#624882',
};

export const COLOR_LABEL: Record<CardColor, string> = {
  brown:  'Materia',
  gray:   'Oficio',
  blue:   'Rehue',
  green:  'Machi',
  yellow: 'Trueque',
  red:    'Malón',
  purple: 'Lof',
};

export function formatCost(cost: { wood?: number; stone?: number; clay?: number; ore?: number; glass?: number; loom?: number; papyrus?: number; coins?: number }): string {
  const parts: string[] = [];
  if (cost.coins)   parts.push(`${cost.coins}💰`);
  if (cost.wood)    parts.push(`${cost.wood > 1 ? cost.wood : ''}${RESOURCE_ICON.wood}`);
  if (cost.stone)   parts.push(`${cost.stone > 1 ? cost.stone : ''}${RESOURCE_ICON.stone}`);
  if (cost.clay)    parts.push(`${cost.clay > 1 ? cost.clay : ''}${RESOURCE_ICON.clay}`);
  if (cost.ore)     parts.push(`${cost.ore > 1 ? cost.ore : ''}${RESOURCE_ICON.ore}`);
  if (cost.glass)   parts.push(`${cost.glass > 1 ? cost.glass : ''}${RESOURCE_ICON.glass}`);
  if (cost.loom)    parts.push(`${cost.loom > 1 ? cost.loom : ''}${RESOURCE_ICON.loom}`);
  if (cost.papyrus) parts.push(`${cost.papyrus > 1 ? cost.papyrus : ''}${RESOURCE_ICON.papyrus}`);
  return parts.length ? parts.join(' ') : '—';
}

export function formatEffectReadable(effects: CardEffect[]): string {
  return effects.map(e => {
    switch (e.type) {
      case 'produce_resource':      return `Produce ${RESOURCE_ICON[e.resource]}`;
      case 'produce_choice':        return `Produce ${e.options.map(o => RESOURCE_ICON[o]).join(' o ')}`;
      case 'victory_points':        return `${e.points} puntos de victoria`;
      case 'shields':               return `${e.count} escudo${e.count > 1 ? 's' : ''} militar${e.count > 1 ? 'es' : ''}`;
      case 'science':               return `Símbolo científico: ${SCIENCE_ICON[e.symbol]}`;
      case 'coins':                 return `+${e.amount} monedas`;
      case 'coins_from_brown':      return `+1💰 por cada carta Materia propia`;
      case 'coins_from_gray':       return `+2💰 por cada carta Oficio propia`;
      case 'coins_from_yellow':     return `+1💰 por cada carta Comercio propia`;
      case 'coins_and_vp_from_brown':  return `+1💰 y +1★ por carta Materia propia`;
      case 'coins_and_vp_from_gray':   return `+2💰 y +2★ por carta Oficio propia`;
      case 'coins_and_vp_from_yellow': return `+1💰 y +1★ por carta Comercio propia`;
      case 'coins_and_vp_from_wonder': return `+3💰 y +1★ por etapa de Pueblo`;
      case 'trade_discount_left':   return `Compras a la izquierda cuestan 1💰`;
      case 'trade_discount_right':  return `Compras a la derecha cuestan 1💰`;
      case 'trade_discount_both':   return `Compras a ambos vecinos cuestan 1💰`;
      case 'free_build_per_age':    return `Construye 1 carta gratis por Era`;
      case 'build_from_discard':    return `Construye gratis una carta del descarte`;
      case 'copy_guild':            return `Copia un Lof de un vecino`;
      case 'vp_from_brown_neighbors':  return `1★ por carta Materia de vecinos`;
      case 'vp_from_gray_neighbors':   return `1★ por carta Oficio de vecinos`;
      case 'vp_from_yellow_neighbors': return `1★ por carta Comercio de vecinos`;
      case 'vp_from_blue_neighbors':   return `1★ por carta Rehue de vecinos`;
      case 'vp_from_red_neighbors':    return `1★ por carta Malón de vecinos`;
      case 'vp_from_green_neighbors':  return `1★ por carta Machi de vecinos`;
      case 'vp_from_wonder_stages':    return e.include_self ? `1★ por etapa de Pueblo (todos)` : `1★ por etapa de Pueblo de vecinos`;
      case 'vp_from_defeat_tokens_neighbors': return `1★ por ficha de derrota de vecinos`;
      case 'vp_from_own_brown_gray_purple':   return `1★ por carta Materia/Oficio/Lof propias`;
      case 'extra_science_symbol':  return `Símbolo científico comodín`;
      default:                      return (e as any).type;
    }
  }).join('\n');
}

export function formatEffect(effects: CardEffect[]): string {
  return effects.map(e => {
    switch (e.type) {
      case 'produce_resource':      return `+${RESOURCE_ICON[e.resource]}`;
      case 'produce_choice':        return `+${e.options.map(o => RESOURCE_ICON[o]).join('/')}`;
      case 'victory_points':        return `${e.points}★`;
      case 'shields':               return `${e.count}🛡`;
      case 'science':               return `${SCIENCE_ICON[e.symbol]}`;
      case 'coins':                 return `+${e.amount}💰`;
      case 'coins_from_brown':      return `+💰/🪵`;
      case 'coins_from_gray':       return `+💰×2/📦`;
      case 'coins_from_yellow':     return `+💰/🟡`;
      case 'coins_and_vp_from_brown':  return `+💰+★/🪵`;
      case 'coins_and_vp_from_gray':   return `+2💰+2★/📦`;
      case 'coins_and_vp_from_yellow': return `+💰+★/🟡`;
      case 'coins_and_vp_from_wonder': return `+3💰+★/🏛`;
      case 'trade_discount_left':   return `← ${e.resources.map(r => r === 'brown' ? 'Materia' : 'Oficio').join('/')} ×1💰`;
      case 'trade_discount_right':  return `→ ${e.resources.map(r => r === 'brown' ? 'Materia' : 'Oficio').join('/')} ×1💰`;
      case 'trade_discount_both':   return `↔ ${e.resources.map(r => r === 'brown' ? 'Materia' : 'Oficio').join('/')} ×1💰`;
      case 'free_build_per_age':    return `1 gratis/era`;
      case 'build_from_discard':    return `construir descarte`;
      case 'copy_guild':            return `copiar guild`;
      case 'vp_from_brown_neighbors':  return `★/🪵 vecinos`;
      case 'vp_from_gray_neighbors':   return `★/📦 vecinos`;
      case 'vp_from_yellow_neighbors': return `★/🟡 vecinos`;
      case 'vp_from_blue_neighbors':   return `★/🔵 vecinos`;
      case 'vp_from_red_neighbors':    return `★/🔴 vecinos`;
      case 'vp_from_green_neighbors':  return `★/🟢 vecinos`;
      case 'vp_from_wonder_stages':    return e.include_self ? `★/etapa (todos)` : `★/etapa vecinos`;
      case 'vp_from_defeat_tokens_neighbors': return `★/derrota vecinos`;
      case 'vp_from_own_brown_gray_purple':   return `★/🪵📦🟣 propias`;
      case 'extra_science_symbol':  return `+🧪 libre`;
      default:                      return (e as any).type;
    }
  }).join('  ');
}
