// Confederación del Sur — Tableau (ciudad del jugador)
// Las cartas construidas se organizan en columnas por familia, apiladas como tejas.

function Tableau({ builds = {}, compact = false, title = 'Tu ciudad' }) {
  const P = window.SS.palette;
  const T = window.SS.type;
  const families = Object.keys(window.SS.families);
  const colW = compact ? 88 : 120;
  const cardH = compact ? 160 : 220;
  const overlap = compact ? 32 : 44;

  return (
    <div style={{
      background: P.night,
      backgroundImage: window.SS.nightTexture + `, ${P.night}`,
      padding: compact ? 14 : 20,
      clipPath: window.SS.chamfer(8),
      boxShadow: window.SS.shadow.card,
      color: P.bone,
      fontFamily: T.body,
      position:'relative',
    }}>
      {title && (
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline',
          marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${P.slate}`}}>
          <div style={{fontFamily: T.display, fontSize: compact ? 14 : 18, fontWeight: 600, letterSpacing: -0.2}}>
            {title}
          </div>
          <div style={{fontSize: 10, letterSpacing: 2, textTransform:'uppercase', color: P.silver, opacity: 0.7}}>
            {Object.values(builds).flat().length} edificios
          </div>
        </div>
      )}
      <div style={{display:'grid', gridTemplateColumns: `repeat(${families.length}, ${colW}px)`, gap: 6}}>
        {families.map(fam => {
          const F = window.SS.families[fam];
          const cards = builds[fam] || [];
          const colHeight = cardH + Math.max(0, cards.length - 1) * overlap;
          return (
            <div key={fam} style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <div style={{
                width: '100%', textAlign:'center',
                fontSize: 9, letterSpacing: 2, textTransform:'uppercase',
                fontWeight: 600, color: F.tint, paddingBottom: 6,
                borderBottom: `2px solid ${F.base}`,
              }}>
                {F.label} <span style={{opacity:0.6, fontFamily: T.body}}>· {cards.length}</span>
              </div>
              <div style={{
                position:'relative', width: colW, height: colHeight + 12, marginTop: 10,
              }}>
                {cards.length === 0 && (
                  <div style={{
                    position:'absolute', top: 0, left: 4, right: 4, height: cardH,
                    border: `1px dashed ${P.slate}`, clipPath: window.SS.chamfer(5),
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: P.stone, fontSize: 10, letterSpacing: 1.5, textTransform:'uppercase',
                    opacity: 0.6,
                  }}>vacío</div>
                )}
                {cards.map((c, i) => (
                  <div key={i} style={{position:'absolute', top: i * overlap, left: 0,
                    transform: `rotate(${((i % 2) * 2 - 1) * 0.4}deg)`,
                    transformOrigin: 'top center',
                  }}>
                    <Card {...c} width={colW} height={cardH}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.Tableau = Tableau;
