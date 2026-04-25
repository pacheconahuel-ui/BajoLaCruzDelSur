export type CardColor =
  | 'brown'   // Raw Materials
  | 'gray'    // Manufactured Goods
  | 'blue'    // Civilian Structures
  | 'green'   // Scientific Structures
  | 'yellow'  // Commercial Structures
  | 'red'     // Military Structures
  | 'purple'; // Guilds

export type Resource = 'wood' | 'stone' | 'clay' | 'ore' | 'glass' | 'loom' | 'papyrus';

export type ScienceSymbol = 'compass' | 'gear' | 'tablet';

export type ResourceChoice = Resource[]; // player picks one per turn

export interface ResourceCost {
  wood?: number;
  stone?: number;
  clay?: number;
  ore?: number;
  glass?: number;
  loom?: number;
  papyrus?: number;
  coins?: number;
}

export type CardEffect =
  | { type: 'produce_resource'; resource: Resource }
  | { type: 'produce_choice'; options: Resource[] }
  | { type: 'victory_points'; points: number }
  | { type: 'shields'; count: number }
  | { type: 'science'; symbol: ScienceSymbol }
  | { type: 'coins'; amount: number }
  | { type: 'coins_from_brown'; per_brown: number; include_neighbors: boolean }
  | { type: 'coins_from_gray'; per_gray: number; include_neighbors: boolean }
  | { type: 'coins_from_yellow'; per_yellow: number }
  | { type: 'trade_discount_left'; resources: ('brown' | 'gray')[] }
  | { type: 'trade_discount_right'; resources: ('brown' | 'gray')[] }
  | { type: 'trade_discount_both'; resources: ('brown' | 'gray')[] }
  | { type: 'free_build_per_age' }
  | { type: 'build_from_discard' }
  | { type: 'copy_guild' }
  | { type: 'vp_from_brown_neighbors'; per_card: number }
  | { type: 'vp_from_gray_neighbors'; per_card: number }
  | { type: 'vp_from_yellow_neighbors'; per_card: number }
  | { type: 'vp_from_blue_neighbors'; per_card: number }
  | { type: 'vp_from_red_neighbors'; per_card: number }
  | { type: 'vp_from_green_neighbors'; per_card: number }
  | { type: 'vp_from_wonder_stages'; include_self: boolean }
  | { type: 'vp_from_defeat_tokens_neighbors' }
  | { type: 'vp_from_own_brown_gray_purple' }
  | { type: 'extra_science_symbol' }
  | { type: 'vp_from_own_color'; color: CardColor; per_card: number }
  | { type: 'coins_and_vp_from_brown'; per_card: number; vp_per_card: number }
  | { type: 'coins_and_vp_from_gray'; per_card: number; vp_per_card: number }
  | { type: 'coins_and_vp_from_yellow'; per_card: number; vp_per_card: number }
  | { type: 'coins_and_vp_from_wonder'; per_stage: number; vp_per_stage: number };

export interface Card {
  id: string;
  name: string;
  color: CardColor;
  age: 1 | 2 | 3;
  minPlayers: number[];  // e.g. [3,5] means one copy for 3+ and another for 5+
  cost: ResourceCost;
  chainFrom?: string;   // card name that enables free build
  chainTo?: string[];   // card names this enables for free build
  effects: CardEffect[];
}
