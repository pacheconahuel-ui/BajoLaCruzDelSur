let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, vol: number, type: OscillatorType, delay = 0) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, c.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration);
}

export const sfx = {
  cardClick:  () => tone(480, 0.08, 0.07, 'sine'),
  cardSelect: () => tone(660, 0.12, 0.10, 'triangle'),
  confirm:    () => { tone(392, 0.18, 0.11, 'triangle'); tone(523, 0.18, 0.11, 'triangle', 0.09); },
  discard:    () => tone(220, 0.22, 0.09, 'sawtooth'),
  coins:      () => [0, 0.06, 0.12].forEach(d => tone(900 + d * 300, 0.14, 0.08, 'sine', d)),
  military:   () => { tone(196, 0.25, 0.12, 'square'); tone(294, 0.25, 0.10, 'square', 0.12); },
  victory:    () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.32, 0.11, 'triangle', i * 0.13)),
};
