// Confederación del Sur — Tablero de pueblo (reemplaza maravilla)
function Capital({
  name = 'Ñuke Mapu',
  pueblo = 'Mapuche',
  region = 'Araucanía',
  width = 420,
  height = 200,
  stages = [
    { cost: ['piedra','piedra'], effect: { kind: 'points', value: 3 }, built: false },
    { cost: ['madera','madera','madera'], effect: { kind: 'coins', value: 7 }, built: false },
    { cost: ['hueso','hueso','lana'], effect: { kind: 'points', value: 7 }, built: false },
  ],
  coins = 3,
  shieldsWon = 0,
  shieldsLost = 0,
}) {
  const P = window.SS.palette;
  const T = window.SS.type;
  const cham = window.SS.chamfer(12);

  return (
    <div style={{
      width, height, clipPath: cham,
      background: `linear-gradient(180deg, ${P.slate} 0%, ${P.night2} 100%)`,
      backgroundImage: window.SS.nightTexture + `, linear-gradient(180deg, ${P.slate} 0%, ${P.night2} 100%)`,
      boxShadow: window.SS.shadow.card,
      position:'relative',
      fontFamily: T.body, color: P.bone,
      padding: 12, display:'flex', flexDirection:'column',
    }}>
      <div style={{position:'absolute', inset: 6, border: `1px solid ${P.silver}44`, clipPath: window.SS.chamfer(8)}}/>

      <div style={{position:'relative', display:'flex', alignItems:'flex-start', justifyContent:'space-between',
        padding: '4px 6px 8px', zIndex: 1}}>
        <div>
          <div style={{fontFamily: T.body, fontSize: 9, letterSpacing: 3, textTransform:'uppercase', color: P.silver, opacity: 0.85}}>
            {pueblo} · {region}
          </div>
          <div style={{fontFamily: T.display, fontSize: 26, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1}}>
            {name}
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 4, background: P.night, padding: '4px 10px',
          clipPath: window.SS.chamfer(3), border: `1px solid ${P.silver}55`}}>
          <ResourceGlyph kind="moneda" size={16} color={P.silver}/>
          <div style={{fontFamily: T.display, fontSize: 18, fontWeight: 600, color: P.silverHi, fontVariantNumeric:'tabular-nums'}}>{coins}</div>
        </div>
      </div>

      <div style={{flex: 1, position:'relative', display:'flex', gap: 8, padding: '4px 2px'}}>
        {stages.map((stage, i) => (
          <Stage key={i} stage={stage} index={i}/>
        ))}
      </div>

      <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: '6px 6px 2px', fontSize: 10, color: P.bone, opacity: 0.9, zIndex: 1}}>
        <div style={{display:'flex', gap: 8, alignItems:'center'}}>
          {[...Array(shieldsWon)].map((_,i) => (
            <div key={'w'+i} style={{
              width: 18, height: 22, background: P.lichen, clipPath: window.SS.chamfer(3),
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily: T.display, fontSize: 10, fontWeight: 700, color: P.bone
            }}>+</div>
          ))}
          {[...Array(shieldsLost)].map((_,i) => (
            <div key={'l'+i} style={{
              width: 18, height: 22, background: P.ember, clipPath: window.SS.chamfer(3),
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily: T.display, fontSize: 10, fontWeight: 700, color: P.bone
            }}>−</div>
          ))}
        </div>
        <div style={{fontFamily: T.body, letterSpacing: 2, textTransform:'uppercase', fontSize: 8, opacity: 0.6}}>
          Fichas de malón
        </div>
      </div>
    </div>
  );
}

function Stage({ stage, index }) {
  const P = window.SS.palette;
  const T = window.SS.type;
  const built = stage.built;
  return (
    <div style={{
      flex: 1, position:'relative',
      background: built ? `linear-gradient(180deg, ${P.silverHi} 0%, ${P.silver} 100%)` : P.night,
      clipPath: window.SS.chamfer(5),
      padding: '8px 6px',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between',
      color: built ? P.ink : P.bone,
      border: `1px solid ${built ? P.silver : P.slate}`,
      opacity: built ? 1 : 0.9,
    }}>
      <div style={{fontFamily: T.display, fontSize: 11, letterSpacing: 2, opacity: 0.7, fontWeight: 600}}>
        {['I','II','III'][index]}
      </div>
      <div style={{display:'flex', alignItems:'center', gap: 2}}>
        {stage.effect.kind === 'points' && (<>
          <div style={{fontFamily: T.display, fontSize: 22, fontWeight: 700}}>{stage.effect.value}</div>
          <ResourceGlyph kind="punto" size={18} color={built ? P.ink : P.silver}/>
        </>)}
        {stage.effect.kind === 'coins' && (<>
          <div style={{fontFamily: T.display, fontSize: 22, fontWeight: 700}}>+{stage.effect.value}</div>
          <ResourceGlyph kind="moneda" size={16} color={built ? P.ink : P.silver}/>
        </>)}
        {stage.effect.kind === 'shields' && (<>
          <div style={{fontFamily: T.display, fontSize: 22, fontWeight: 700}}>{stage.effect.value}</div>
          <ResourceGlyph kind="escudo" size={18} color={built ? P.ink : P.silver}/>
        </>)}
      </div>
      <div style={{display:'flex', gap: 2, alignItems:'center', padding: '2px 4px',
        background: built ? 'rgba(0,0,0,0.15)' : P.night2, clipPath: window.SS.chamfer(2),
        border: `1px solid ${built ? P.silver : P.slate}`}}>
        {stage.cost.map((c,i) => (
          <ResourceGlyph key={i} kind={c} size={12} color={built ? P.ink : P.bone}/>
        ))}
      </div>
    </div>
  );
}

window.Capital = Capital;
