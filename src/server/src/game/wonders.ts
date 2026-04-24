import { WonderBoard } from '@7wonders/shared';

export const WONDERS: WonderBoard[] = [
  {
    id: 'colossus',
    name: 'Kawésqar',
    startingResource: 'ore',
    stages: [
      { cost: { ore: 2 }, effects: [{ type: 'victory_points', points: 3 }] },
      { cost: { ore: 3 }, effects: [{ type: 'shields', count: 2 }] },
      { cost: { ore: 4 }, effects: [{ type: 'victory_points', points: 7 }] },
    ],
  },
  {
    id: 'lighthouse',
    name: 'Günün-a-Künna',
    startingResource: 'papyrus',
    stages: [
      { cost: { stone: 2 }, effects: [{ type: 'victory_points', points: 3 }] },
      {
        cost: { ore: 2, glass: 1 },
        // Produces any raw material of choice each turn (not tradeable)
        effects: [{ type: 'produce_choice', options: ['wood', 'stone', 'clay', 'ore'] }],
      },
      { cost: { glass: 2, papyrus: 1 }, effects: [{ type: 'victory_points', points: 7 }] },
    ],
  },
  {
    id: 'temple',
    name: 'Yámana',
    startingResource: 'papyrus',
    stages: [
      { cost: { stone: 2 }, effects: [{ type: 'victory_points', points: 3 }] },
      { cost: { papyrus: 2 }, effects: [{ type: 'coins', amount: 9 }] },
      { cost: { stone: 3, papyrus: 2 }, effects: [{ type: 'victory_points', points: 7 }] },
    ],
  },
  {
    id: 'babylon',
    name: 'Aónikenk',
    startingResource: 'clay',
    stages: [
      { cost: { clay: 2 }, effects: [{ type: 'victory_points', points: 3 }] },
      { cost: { clay: 3 }, effects: [{ type: 'extra_science_symbol' }] },
      { cost: { clay: 2, papyrus: 3 }, effects: [{ type: 'victory_points', points: 7 }] },
    ],
  },
  {
    id: 'olympia',
    name: "Selk'nam",
    startingResource: 'wood',
    stages: [
      { cost: { wood: 2 }, effects: [{ type: 'victory_points', points: 3 }] },
      { cost: { loom: 2, stone: 1 }, effects: [{ type: 'free_build_per_age' }] },
      { cost: { stone: 2, ore: 1 }, effects: [{ type: 'victory_points', points: 7 }] },
    ],
  },
  {
    id: 'halicarnassus',
    name: 'Rankül',
    startingResource: 'loom',
    stages: [
      { cost: { loom: 2 }, effects: [{ type: 'victory_points', points: 3 }] },
      { cost: { ore: 3, loom: 1 }, effects: [{ type: 'build_from_discard' }] },
      { cost: { glass: 2, ore: 2 }, effects: [{ type: 'copy_guild' }] },
    ],
  },
  {
    id: 'giza',
    name: 'Ñuke Mapu',
    startingResource: 'stone',
    stages: [
      { cost: { stone: 2 }, effects: [{ type: 'victory_points', points: 3 }] },
      { cost: { wood: 3 }, effects: [{ type: 'victory_points', points: 5 }] },
      { cost: { stone: 4 }, effects: [{ type: 'victory_points', points: 7 }] },
    ],
  },
];
