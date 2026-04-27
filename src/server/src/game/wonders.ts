import { WonderBoard } from '@7wonders/shared';

export const WONDERS: WonderBoard[] = [
  {
    id: 'colossus',
    name: 'Kawésqar — Nómadas de los Canales y Archipiélagos',
    startingResource: 'wood',
    stages: [
      {
        cost: { wood: 2 },
        effects: [{ type: 'produce_resource', resource: 'wood' }],
      },
      {
        cost: { stone: 2, glass: 1 },
        effects: [{ type: 'victory_points', points: 5 }],
      },
      {
        cost: { wood: 3, loom: 1 },
        effects: [{ type: 'victory_points', points: 7 }],
      },
    ],
  },
  {
    id: 'lighthouse',
    name: 'Günün-a-Künna — Rastros de la Pampa',
    startingResource: 'clay',
    stages: [
      {
        cost: { clay: 2 },
        effects: [{ type: 'coins', amount: 4 }],
      },
      {
        cost: { wood: 2, papyrus: 1 },
        effects: [{ type: 'vp_from_own_color', color: 'yellow', per_card: 2 }],
      },
      {
        cost: { clay: 3, loom: 1 },
        effects: [{ type: 'victory_points', points: 7 }],
      },
    ],
  },
  {
    id: 'temple',
    name: 'Yámana — Canal de Beagle',
    startingResource: 'stone',
    stages: [
      {
        cost: { stone: 2 },
        effects: [{ type: 'produce_choice', options: ['stone', 'ore'] }],
      },
      {
        cost: { clay: 2, glass: 1 },
        // Copia un símbolo de ciencia extra (equivalente temático de copy_neighbor_science)
        effects: [{ type: 'extra_science_symbol' }],
      },
      {
        cost: { stone: 3, papyrus: 1 },
        effects: [{ type: 'victory_points', points: 7 }],
      },
    ],
  },
  {
    id: 'babylon',
    name: 'Aónikenk — Gigantes de la Estepa',
    startingResource: 'ore',
    stages: [
      {
        cost: { wood: 2 },
        effects: [{ type: 'shields', count: 1 }],
      },
      {
        cost: { stone: 2, ore: 1 },
        effects: [{ type: 'shields', count: 2 }],
      },
      {
        cost: { wood: 3, glass: 1 },
        effects: [{ type: 'victory_points', points: 7 }],
      },
    ],
  },
  {
    id: 'olympia',
    name: "Selk'nam — Misterio del Hain",
    startingResource: 'clay',
    stages: [
      {
        cost: { clay: 2 },
        effects: [{ type: 'victory_points', points: 3 }],
      },
      {
        cost: { stone: 2, loom: 1 },
        // 5 puntos de victoria (Selk'nam diferenciado de Yámana que ya tiene extra_science_symbol)
        effects: [{ type: 'victory_points', points: 5 }],
      },
      {
        cost: { clay: 3, papyrus: 1 },
        effects: [{ type: 'victory_points', points: 7 }],
      },
    ],
  },
  {
    id: 'halicarnassus',
    name: 'Rankül — Monte del Caldén',
    startingResource: 'wood',
    stages: [
      {
        cost: { wood: 2 },
        effects: [{ type: 'coins', amount: 3 }],
      },
      {
        cost: { wood: 2, ore: 1 },
        effects: [{ type: 'build_from_discard' }],
      },
      {
        cost: { wood: 3, glass: 1 },
        effects: [{ type: 'victory_points', points: 7 }],
      },
    ],
  },
  {
    id: 'giza',
    name: 'Ñuke Mapu (Mapuche) — Sabiduría de la Tierra',
    startingResource: 'stone',
    stages: [
      {
        cost: { stone: 2 },
        effects: [{ type: 'produce_resource', resource: 'stone' }],
      },
      {
        cost: { clay: 2, loom: 1 },
        effects: [{ type: 'victory_points', points: 5 }],
      },
      {
        cost: { stone: 3, papyrus: 1 },
        effects: [{ type: 'victory_points', points: 7 }],
      },
    ],
  },
];
