// Confederación del Sur — Carta
function Card({
  family = 'materia',
  name = 'Cantera',
  era = 'I',
  cost = null,
  chainIn = null,
  chainOut = [],
  effect = null,
  width = 220,
  height = 320,
  state = 'default',
  seed = null,
}) {
  const P = window.SS.palette;
  const F = window.SS.families[family];
  const T = window.SS.type;
  const cham = window.SS.chamfer(10);

  if (state === 'back') {
    const eraFill = { I: P.slate, II: P.night2, III: P.night }[era] || P.slate;
    return (
      <div style={{width, height, clipPath: cham, background: eraFill, position:'relative',
        boxShadow: window.SS.shadow.card, fontFamily: T.display}}>
        <div style={{position:'absolute', inset:8, border:`1px solid ${P.silver}66`, clipPath: window.SS.chamfer(6)}}/>
        <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', color: P.silver, gap: 12}}>
          <CardGlyph seed={'era'+era} color={P.silver} size={80}/>
          <div style={{fontFamily: T.display, fontSize: 32, fontWeight: 600, letterSpacing: 4}}>{era}</div>
          <div style={{fontFamily: T.body, fontSize: 10, letterSpacing: 3, textTransform:'uppercase', opacity:0.7}}>Era</div>
        </div>
      </div>
    );
  }

  const dim = state === 'dim' || state === 'unaffordable';
  const selected = state === 'selected';
  const outerShadow = selected
    ? '0 0 0 3px ' + P.silverHi + ', ' + window.SS.shadow.lift
    : window.SS.shadow.card;

  const band = (
    <div style={{
      position:'relative',
      background: `linear-gradient(180deg, ${F.fill} 0%, ${F.base} 100%)`,
      color: F.wash,
      padding: '10px 14px 12px',
      fontFamily: T.display,
      clipPath: `polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%, 0 10px)`,
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
        <div style={{fontSize: 10, fontFamily: T.body, letterSpacing: 2, textTransform:'uppercase', opacity: 0.8}}>
          {F.label}
        </div>
        <div style={{fontFamily: T.display, fontSize: 11, letterSpacing: 2, opacity: 0.7}}>· {era} ·</div>
      </div>
      <div style={{fontSize: 22, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.05, marginTop: 2,
        textShadow: `0 1px 0 ${F.ink}55`}}>{name}</div>
    </div>
  );

  const CostChip = () => {
    if (!cost || (!cost.coins && (!cost.resources || !cost.resources.length))) {
      return (
        <div style={{position:'absolute', top: 8, right: 8, zIndex: 2,
          padding: '2px 8px', background: P.linen, color: P.ink,
          fontFamily: T.body, fontSize: 9, letterSpacing: 1.5, textTransform:'uppercase',
          clipPath: window.SS.chamfer(3), boxShadow: window.SS.shadow.soft, fontWeight: 600}}>
          Libre
        </div>
      );
    }
    return (
      <div style={{position:'absolute', top: -6, left: 10, zIndex: 2,
        padding: '4px 8px 5px', background: P.linen, color: P.ink,
        display:'flex', alignItems:'center', gap: 4,
        clipPath: window.SS.chamfer(3), boxShadow: window.SS.shadow.soft,
        border: `1px solid ${P.linenDeep}`}}>
        {cost.coins > 0 && (
          <div style={{display:'flex', alignItems:'center', gap: 2, fontFamily: T.body, fontSize: 11, fontWeight: 600}}>
            {cost.coins}
            <ResourceGlyph kind="moneda" size={14} color={P.stone}/>
          </div>
        )}
        {cost.resources && cost.resources.map((r,i) => (
          <ResourceGlyph key={i} kind={r} size={16} color={P.ink}/>
        ))}
      </div>
    );
  };

  const effectGlyph = () => {
    if (!effect) return null;
    if (effect.kind === 'produce') return <ResourceGlyph kind={effect.resource} size={64} color={F.base}/>;
    if (effect.kind === 'choice') return (
      <div style={{display:'flex', alignItems:'center', gap: 8}}>
        <ResourceGlyph kind={effect.resources[0]} size={42} color={F.base}/>
        <div style={{fontFamily: T.display, fontSize: 20, color: F.base, fontStyle:'italic'}}>ó</div>
        <ResourceGlyph kind={effect.resources[1]} size={42} color={F.base}/>
      </div>
    );
    if (effect.kind === 'points') return (
      <div style={{display:'flex', alignItems:'center', gap: 4}}>
        <div style={{fontFamily: T.display, fontSize: 52, fontWeight: 600, color: F.base, lineHeight: 1}}>{effect.value}</div>
        <ResourceGlyph kind="punto" size={38} color={F.base}/>
      </div>
    );
    if (effect.kind === 'shields') return (
      <div style={{display:'flex', alignItems:'center', gap: 4}}>
        <div style={{fontFamily: T.display, fontSize: 46, fontWeight: 600, color: F.base, lineHeight: 1}}>{effect.value}</div>
        <ResourceGlyph kind="escudo" size={44} color={F.base}/>
      </div>
    );
    if (effect.kind === 'coins') return (
      <div style={{display:'flex', alignItems:'center', gap: 4}}>
        <div style={{fontFamily: T.display, fontSize: 46, fontWeight: 600, color: F.base, lineHeight: 1}}>+{effect.value}</div>
        <ResourceGlyph kind="moneda" size={36} color={F.base}/>
      </div>
    );
    if (effect.kind === 'science') return <ResourceGlyph kind={effect.value} size={64} color={F.base}/>;
    return <CardGlyph seed={seed || name} color={F.base} size={72}/>;
  };

  const chainBar = chainOut && chainOut.length > 0 && (
    <div style={{display:'flex', alignItems:'center', gap: 4, marginTop: 6, justifyContent:'center',
      fontFamily: T.body, fontSize: 9, letterSpacing: 1, textTransform:'uppercase', color: P.inkSoft}}>
      <span style={{opacity: 0.5}}>→</span>
      {chainOut.map((c,i) => (
        <span key={i} style={{
          width: 14, height: 14, display:'inline-flex', alignItems:'center', justifyContent:'center',
          background: window.SS.families[c].fill, color: window.SS.families[c].wash,
          fontFamily: T.display, fontSize: 10,
        }}>{c[0].toUpperCase()}</span>
      ))}
    </div>
  );

  return (
    <div style={{
      width, height, position:'relative',
      clipPath: cham,
      background: P.linen,
      backgroundImage: window.SS.linenTexture,
      backgroundSize: '200px',
      boxShadow: outerShadow,
      opacity: dim ? 0.45 : 1,
      filter: state === 'unaffordable' ? 'saturate(0.4)' : 'none',
      transition: 'box-shadow 0.18s, transform 0.18s, opacity 0.18s',
      transform: selected ? 'translateY(-4px)' : 'none',
      fontFamily: T.body,
      color: P.ink,
      display:'flex', flexDirection:'column',
    }}>
      <div style={{position:'absolute', inset: 4, border: `1px solid ${F.tint}`,
        clipPath: window.SS.chamfer(6), pointerEvents:'none', zIndex: 1}}/>
      {band}
      <CostChip/>
      <div style={{flex: 1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
        padding: '8px 12px'}}>
        <div style={{position:'absolute', inset: 0, display:'flex', alignItems:'center', justifyContent:'center', opacity: 0.09}}>
          <CardGlyph seed={seed || name} color={F.base} size={Math.min(width*0.8, height*0.45)}/>
        </div>
        <div style={{position:'relative', zIndex: 1}}>{effectGlyph()}</div>
      </div>
      <div style={{padding: '6px 10px 10px', borderTop: `1px dashed ${F.tint}`, textAlign:'center'}}>
        <div style={{fontFamily: T.body, fontSize: 9, letterSpacing: 2, textTransform:'uppercase', color: F.base, fontWeight: 600}}>
          {F.sub}
        </div>
        {chainBar}
      </div>
    </div>
  );
}

window.Card = Card;
