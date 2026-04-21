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
  brown:  '#7c4a1e',
  gray:   '#4a5568',
  blue:   '#1a4480',
  green:  '#166534',
  yellow: '#92400e',
  red:    '#7f1d1d',
  purple: '#4c1d95',
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
  brown:  '#a0622a',
  gray:   '#718096',
  blue:   '#2563eb',
  green:  '#16a34a',
  yellow: '#d97706',
  red:    '#dc2626',
  purple: '#7c3aed',
};

export const COLOR_LABEL: Record<CardColor, string> = {
  brown:  'Materia Prima',
  gray:   'Manufactura',
  blue:   'Civil',
  green:  'Científica',
  yellow: 'Comercial',
  red:    'Militar',
  purple: 'Guild',
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
      case 'trade_discount_left':   return `← ${e.resources.map(r => r === 'brown' ? 'Mat.' : 'Manuf.').join('/')} ×1💰`;
      case 'trade_discount_right':  return `→ ${e.resources.map(r => r === 'brown' ? 'Mat.' : 'Manuf.').join('/')} ×1💰`;
      case 'trade_discount_both':   return `↔ ${e.resources.map(r => r === 'brown' ? 'Mat.' : 'Manuf.').join('/')} ×1💰`;
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
      case 'extra_science_symbol':  return `+🧪 libre`;
      default:                      return (e as any).type;
    }
  }).join('  ');
}
