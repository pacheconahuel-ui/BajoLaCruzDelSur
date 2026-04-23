// Confederación del Sur — Mano de cartas (abanico)
function Hand({ cards = [], onPick, onHover, selectedIdx = null, affordability = {}, radius = 520, spread = 28 }) {
  const P = window.SS.palette;
  const T = window.SS.type;
  const n = cards.length;
  const angleStep = n > 1 ? spread / (n - 1) : 0;
  const base = -spread / 2;

  return (
    <div style={{position:'relative', width: 820, height: 340,
      display:'flex', justifyContent:'center', alignItems:'flex-end'}}>
      {cards.map((c, i) => {
        const angle = base + i * angleStep;
        const rad = (angle * Math.PI) / 180;
        const cx = Math.sin(rad) * radius;
        const cy = -Math.cos(rad) * radius + radius;
        const affordable = affordability[i] !== false;
        const selected = selectedIdx === i;
        const state = selected ? 'selected' : (!affordable ? 'unaffordable' : 'default');
        return (
          <div key={i}
            onClick={() => onPick && onPick(i)}
            onMouseEnter={() => onHover && onHover(i)}
            onMouseLeave={() => onHover && onHover(null)}
            style={{
              position:'absolute', bottom: 0,
              transform: `translate(${cx}px, ${cy - (selected ? 36 : 0)}px) rotate(${angle}deg)`,
              transformOrigin: 'bottom center',
              transition: 'transform 0.22s cubic-bezier(0.2, 0.8, 0.3, 1)',
              cursor: 'pointer', zIndex: selected ? 20 : i,
            }}>
            <Card {...c} state={state} width={160} height={232}/>
          </div>
        );
      })}
    </div>
  );
}

window.Hand = Hand;
