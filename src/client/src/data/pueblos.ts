import { WonderId } from '@7wonders/shared';

export interface PuebloData {
  wonderId: WonderId;
  nombre: string;
  pueblo: string;
  descripcion: string;
  recursoInicial: string;
  habilidadPasiva: string;
  habilidadDetalle: string;
  imagen: string;
  color: string;
}

export const PUEBLOS: PuebloData[] = [
  {
    wonderId: 'colossus',
    nombre: 'Kawésqar',
    pueblo: 'Nómadas del Canal de Beagle',
    descripcion: 'Navegantes expertos de los canales fueguinos, maestros de la supervivencia en los mares del fin del mundo.',
    recursoInicial: 'Madera',
    habilidadPasiva: 'Señores del Mar',
    habilidadDetalle: 'Cuando comerciás recursos de producción (madera, piedra, arcilla, mineral) con vecinos, pagás solo 1 moneda en lugar de 2.',
    imagen: '/assets/wonders/wonder-kawesqar.png',
    color: '#1a4a6e',
  },
  {
    wonderId: 'lighthouse',
    nombre: 'Günün-a-Künna',
    pueblo: 'Pueblo del Interior Patagónico',
    descripcion: 'Cazadores-recolectores de las mesetas patagónicas, conocedores del viento y la distancia.',
    recursoInicial: 'Arcilla',
    habilidadPasiva: 'Horizonte Abierto',
    habilidadDetalle: 'Al inicio de la partida recibís 1 moneda extra (empezás con 4 en lugar de 3).',
    imagen: '/assets/wonders/wonder-gunun-a-kunna.png',
    color: '#4a3a1a',
  },
  {
    wonderId: 'temple',
    nombre: 'Yámana',
    pueblo: 'Pueblo del Fuego Eterno',
    descripcion: 'Habitantes de Tierra del Fuego, guardianes del fuego sagrado que nunca se apaga.',
    recursoInicial: 'Piedra',
    habilidadPasiva: 'Fuego Eterno',
    habilidadDetalle: 'Cuando construís una etapa de tu Hito, recibís 1 moneda adicional como ofrenda.',
    imagen: '/assets/wonders/wonder-yamana.png',
    color: '#6e2a1a',
  },
  {
    wonderId: 'babylon',
    nombre: 'Aónikenk',
    pueblo: 'Tehuelches del Sur',
    descripcion: 'Los gigantes patagónicos, famosos por su altura y fuerza. Dueños de las llanuras del sur.',
    recursoInicial: 'Arcilla',
    habilidadPasiva: 'Memoria Ancestral',
    habilidadDetalle: 'Los Saberes Ancestrales (cartas verdes) te cuestan 1 recurso menos al construir.',
    imagen: '/assets/wonders/wonder-aonikenk.png',
    color: '#2a4a2a',
  },
  {
    wonderId: 'olympia',
    nombre: "Selk'nam",
    pueblo: 'Pueblo del Hain Sagrado',
    descripcion: 'Cazadores de la gran isla, guardianes de las ceremonias del Hain y los espíritus Kloketen.',
    recursoInicial: 'Arcilla',
    habilidadPasiva: 'Espíritu del Hain',
    habilidadDetalle: 'Una vez por Era podés construir una carta sin pagar su costo de recursos (solo monedas de comercio si aplica).',
    imagen: '/assets/wonders/wonder-selknam.png',
    color: '#3a2a4a',
  },
  {
    wonderId: 'halicarnassus',
    nombre: 'Rankül',
    pueblo: 'Ranqueles de la Pampa',
    descripcion: 'Guerreros de la pampa central, maestros de la resistencia y la guerra de guerrillas.',
    recursoInicial: 'Madera',
    habilidadPasiva: 'Resistencia Ranquel',
    habilidadDetalle: 'Las fichas de derrota militar solo te restan 0 puntos en lugar de -1 (nunca perdés por guerra).',
    imagen: '/assets/wonders/wonder-rankul.png',
    color: '#4a1a1a',
  },
  {
    wonderId: 'giza',
    nombre: 'Ñuke Mapu',
    pueblo: 'Mapuche — Gente de la Tierra',
    descripcion: 'Guardianes de la Madre Tierra, el pueblo más numeroso y resistente de la Patagonia.',
    recursoInicial: 'Piedra',
    habilidadPasiva: 'Mapu Sagrado',
    habilidadDetalle: 'Empezás con 1 Piedra adicional (producís 2 Piedra desde el inicio en lugar de 1).',
    imagen: '/assets/wonders/wonder-nuke-mapu.png',
    color: '#1a3a1a',
  },
];

export const PUEBLOS_BY_ID: Record<WonderId, PuebloData> = Object.fromEntries(
  PUEBLOS.map(p => [p.wonderId, p])
) as Record<WonderId, PuebloData>;
