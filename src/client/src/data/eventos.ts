// EventoEra is the shared EraEvent type. The actual event data lives on the server
// (src/server/src/game/eraEvents.ts) and is broadcast through game state.
// This re-export keeps EraEventBanner's import path stable.
export type { EraEvent as EventoEra } from '@7wonders/shared';
