// Confederación del Sur — Mesa completa v2 (cartas grandes + otros visibles)

function OtherPlayerPanel({ player, position = 'left', revealed = null, highlight = false }) {
  const P = window.SS.palette;
  const T = window.SS.type;
  const F = revealed ? window.SS.families[revealed.family] : null;
  const families = Object.keys(window.SS.families);

  return (
    <div style={{
      background: P.night2, padding: 12,
      clipPath: window.SS.chamfer(5),
      border: `1px solid ${highlight ? P.silverHi : P.slate}`,
      boxShadow: highlight ? window.SS.shadow.glow : 'none',
      color: P.bone, fontFamily: T.body, width: 250,
      transition: 'box-shadow 0.3s, border 0.3s',
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
        <div style={{width: 10, height: 10, background: player.color, borderRadius: '50%'}}/>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontFamily: T.display, fontSize: 15, fontWeight: 600, lineHeight: 1,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{player.name}</div>
          <div style={{fontSize: 9, letterSpacing: 1.5, textTransform:'uppercase', color: P.silver, opacity:0.7,
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{player.pueblo}</div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{display:'flex', gap: 8, fontSize: 11, alignItems:'center',
        background: P.night, padding: '6px 8px', clipPath: window.SS.chamfer(3), marginBottom: 10}}>
        <div style={{display:'flex', alignItems:'center', gap: 3}}>
          <ResourceGlyph kind="moneda" size={13} color={P.silver}/>
          <span style={{fontFamily: T.display, fontWeight: 600}}>{player.coins}</span>
        </div>
        <div style={{width:1, height: 14, background: P.slate}}/>
        <div style={{display:'flex', alignItems:'center', gap: 3}}>
          <ResourceGlyph kind="escudo" size={13} color={P.silver}/>
          <span style={{fontFamily: T.display, fontWeight: 600}}>{player.shields}</span>
        </div>
        <div style={{width:1, height: 14, background: P.slate}}/>
        <div style={{display:'flex', alignItems:'center', gap: 3}}>
          <ResourceGlyph kind="punto" size={13} color={P.silver}/>
          <span style={{fontFamily: T.display, fontWeight: 600}}>{player.vp}</span>
        </div>
      </div>

      {/* Mini tableau — 7 columnas de colores con contadores */}
      <div style={{display:'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 10}}>
        {families.map(fam => {
          const Ff = window.SS.families[fam];
          const count = (player.builds && player.builds[fam]) || 0;
          return (
            <div key={fam} style={{
              height: 46, background: count > 0 ? Ff.fill : P.night,
              border: `1px solid ${count > 0 ? Ff.tint : P.slate}`,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end',
              padding: '3px 2px',
            }}>
              <div style={{flex:1}}/>
              <div style={{fontFamily: T.display, fontSize: 13, fontWeight: 700,
                color: count > 0 ? Ff.wash : P.stone, lineHeight: 1}}>{count || '·'}</div>
            </div>
          );
        })}
      </div>

      {/* Wonder stages */}
      <div style={{display:'flex', gap: 3, marginBottom: 10}}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            flex: 1, height: 14, background: i < (player.wonderStages || 0) ? P.silverHi : P.night,
            border: `1px solid ${i < (player.wonderStages || 0) ? P.silver : P.slate}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily: T.display, fontSize: 9, fontWeight: 700,
            color: i < (player.wonderStages || 0) ? P.ink : P.stone,
          }}>{['I','II','III'][i]}</div>
        ))}
      </div>

      {/* Played card slot */}
      <div style={{height: 40, background: P.night, clipPath: window.SS.chamfer(3),
        display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden',
        border: `1px solid ${P.slate}`}}>
        {revealed ? (
          <div style={{display:'flex', alignItems:'center', gap: 6, padding:'0 8px', width:'100%',
            animation: 'reveal-in 0.5s ease-out both'}}>
            <div style={{width: 6, height: 28, background: F.fill, flexShrink: 0}}/>
            <div style={{fontFamily: T.display, fontSize: 12, fontWeight: 600, color: P.bone, lineHeight: 1.1,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{revealed.name}</div>
          </div>
        ) : (
          <div style={{fontSize: 9, letterSpacing: 2, textTransform:'uppercase',
            color: player.chosen ? P.silverHi : P.stone, transition: 'color 0.3s'}}>
            {player.chosen ? '✓ Elegida' : 'Pensando…'}
          </div>
        )}
      </div>
    </div>
  );
}

function GameTable() {
  const [hand, setHand] = React.useState(() => [
    { family:'materia', name:'Cantera', era:'II', effect:{kind:'produce', resource:'piedra'}, cost:null, seed:'c1' },
    { family:'materia', name:'Bosque de Lenga', era:'II', effect:{kind:'produce', resource:'madera'}, cost:null, seed:'c2' },
    { family:'oficio', name:'Telar', era:'II', effect:{kind:'produce', resource:'lana'}, cost:{resources:['cuero']}, seed:'c3' },
    { family:'templo', name:'Rehue del Lago', era:'II', effect:{kind:'points', value:4}, cost:{resources:['piedra']}, chainOut:['templo'], seed:'c4' },
    { family:'mercado', name:'Caravana del Lof', era:'II', effect:{kind:'coins', value:5}, cost:null, seed:'c5' },
    { family:'guerra', name:'Guarnición', era:'II', effect:{kind:'shields', value:2}, cost:{resources:['hueso','madera']}, seed:'c6' },
    { family:'sabiduria', name:'Casa Machi', era:'II', effect:{kind:'science', value:'ciencia_a'}, cost:{resources:['hueso','hueso']}, seed:'c7' },
  ]);
  const [selectedIdx, setSelectedIdx] = React.useState(null);
  const [phase, setPhase] = React.useState('choose');
  const [builds, setBuilds] = React.useState({
    materia: [
      { family:'materia', name:'Cantera Vieja', era:'I', effect:{kind:'produce',resource:'piedra'}, cost:null, seed:'b1' },
      { family:'materia', name:'Claro del Monte', era:'I', effect:{kind:'produce',resource:'madera'}, cost:null, seed:'b2' },
    ],
    oficio: [
      { family:'oficio', name:'Curtiembre', era:'I', effect:{kind:'produce',resource:'cuero'}, cost:null, seed:'b3' },
    ],
    templo: [],
    sabiduria: [],
    mercado: [
      { family:'mercado', name:'Trocadero', era:'I', effect:{kind:'coins', value:3}, cost:null, seed:'b5' },
    ],
    guerra: [
      { family:'guerra', name:'Ronda', era:'I', effect:{kind:'shields', value:1}, cost:{resources:['madera']}, seed:'b6' },
    ],
    linaje: [],
  });
  const [coins, setCoins] = React.useState(6);
  const [revealedOther, setRevealedOther] = React.useState({});

  const others = [
    { id:'p2', name:'Amanda', pueblo:'Tehuelche · Aónikenk', coins: 4, shields: 1, vp: 8, color:'#b8935a',
      chosen: true, wonderStages: 1,
      builds: { materia: 3, oficio: 1, templo: 0, sabiduria: 1, mercado: 2, guerra: 1, linaje: 0 } },
    { id:'p3', name:'Iván', pueblo:"Selk'nam", coins: 7, shields: 0, vp: 11, color:'#e0d6bf',
      chosen: true, wonderStages: 2,
      builds: { materia: 2, oficio: 2, templo: 2, sabiduria: 0, mercado: 1, guerra: 0, linaje: 2 } },
    { id:'p4', name:'Lu', pueblo:'Rankül', coins: 2, shields: 3, vp: 6, color:'#b94a2a',
      chosen: false, wonderStages: 1,
      builds: { materia: 2, oficio: 0, templo: 0, sabiduria: 0, mercado: 0, guerra: 4, linaje: 1 } },
  ];

  const affordability = React.useMemo(() => {
    const map = {};
    hand.forEach((c, i) => {
      let ok = true;
      if (c.cost) {
        if (c.cost.coins && c.cost.coins > coins) ok = false;
        const have = new Set(['piedra','madera','cuero']);
        (c.cost.resources || []).forEach(r => { if (!have.has(r)) ok = false; });
      }
      map[i] = ok;
    });
    return map;
  }, [hand, coins]);

  const selected = selectedIdx != null ? hand[selectedIdx] : null;

  const commit = (action) => {
    setPhase('committed');
    setTimeout(() => {
      setPhase('reveal');
      const revealMap = {
        p2: { family:'oficio', name:'Cestería Qom' },
        p3: { family:'guerra', name:'Lanza Hain' },
        p4: { family:'templo', name:'Rehue Ranquel' },
      };
      Object.entries(revealMap).forEach(([id, card], i) => {
        setTimeout(() => setRevealedOther(prev => ({...prev, [id]: card})), 200 * (i + 1));
      });
      setTimeout(() => setPhase('resolve'), 1000);
      setTimeout(() => {
        if (action === 'build' && selected) {
          setBuilds(prev => ({ ...prev, [selected.family]: [...(prev[selected.family] || []), selected] }));
          if (selected.effect?.kind === 'coins') setCoins(c => c + selected.effect.value);
        } else if (action === 'discard') {
          setCoins(c => c + 3);
        }
        setHand(prev => prev.filter((_, i) => i !== selectedIdx));
        setSelectedIdx(null);
        setRevealedOther({});
        setPhase('choose');
      }, 2400);
    }, 350);
  };

  const P = window.SS.palette;
  const T = window.SS.type;

  // Layout: 3 columns — left (other1), center (tableau + hand), right (other2 + other3)
  return (
    <div style={{
      width: 1600, height: 1000,
      background: P.night,
      backgroundImage: window.SS.nightTexture + `, radial-gradient(ellipse at center top, ${P.night2} 0%, ${P.night} 60%)`,
      padding: 24, fontFamily: T.body, color: P.bone, position:'relative', overflow:'hidden',
      display:'grid', gridTemplateColumns: '270px 1fr 270px', gridTemplateRows: 'auto 1fr auto', gap: 18,
    }}>
      <style>{`
        @keyframes reveal-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(184,192,201,0.4); } 50% { box-shadow: 0 0 0 16px rgba(184,192,201,0); } }
      `}</style>

      {/* TOP: Era indicator (left), Top player (center), Phase (right) */}
      <div style={{
        background: P.night2, padding: '14px 18px', clipPath: window.SS.chamfer(4),
        border: `1px solid ${P.silver}33`, display:'flex', alignItems:'center', gap: 16}}>
        <div>
          <div style={{fontSize: 9, letterSpacing: 2, textTransform:'uppercase', color: P.silver, opacity:0.7}}>Era</div>
          <div style={{fontFamily: T.display, fontSize: 30, fontWeight: 600, lineHeight: 1}}>II</div>
        </div>
        <div style={{flex:1, borderLeft:`1px solid ${P.slate}`, paddingLeft: 14}}>
          <div style={{fontSize: 10, color: P.linenDeep, opacity: 0.85}}>Ronda 3 · 4 cartas</div>
          <div style={{fontSize: 10, color: P.linenDeep, opacity: 0.6, marginTop: 2}}>Dirección →</div>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <OtherPlayerPanel player={{...others[1], chosen: others[1].chosen || phase !== 'choose'}}
          highlight={phase === 'reveal' && !!revealedOther[others[1].id]}
          revealed={phase === 'reveal' || phase === 'resolve' ? revealedOther[others[1].id] : null}/>
      </div>

      <div style={{
        background: phase !== 'choose' ? P.silverHi : P.night2,
        color: phase !== 'choose' ? P.ink : P.bone,
        padding: '14px 20px', clipPath: window.SS.chamfer(4),
        border: `1px solid ${P.silver}55`,
        transition: 'all 0.3s',
        animation: phase === 'committed' ? 'pulse-glow 1.4s infinite' : 'none',
        display:'flex', flexDirection:'column', justifyContent:'center',
      }}>
        <div style={{fontSize: 9, letterSpacing: 2, textTransform:'uppercase', opacity:0.8}}>Fase</div>
        <div style={{fontFamily: T.display, fontSize: 20, fontWeight: 600, lineHeight: 1.1}}>
          {phase === 'choose' && 'Elige tu carta'}
          {phase === 'committed' && 'Esperando al resto…'}
          {phase === 'reveal' && 'Revelación'}
          {phase === 'resolve' && 'Resolviendo'}
        </div>
      </div>

      {/* MIDDLE ROW */}
      {/* Left player */}
      <div style={{display:'flex', alignItems:'center'}}>
        <OtherPlayerPanel player={{...others[0], chosen: others[0].chosen || phase !== 'choose'}}
          highlight={phase === 'reveal' && !!revealedOther[others[0].id]}
          revealed={phase === 'reveal' || phase === 'resolve' ? revealedOther[others[0].id] : null}/>
      </div>

      {/* Center — tableau + capital */}
      <div style={{display:'flex', flexDirection:'column', gap: 14, alignItems:'center', minWidth: 0}}>
        <div style={{width:'100%'}}>
          <Tableau builds={builds} title="Tu ciudad · Ñuke Mapu (Mapuche)"/>
        </div>
        <Capital name="Ñuke Mapu" pueblo="Mapuche" region="Araucanía · Neuquén" coins={coins}
          shieldsWon={1} shieldsLost={0}
          stages={[
            { cost:['piedra','piedra'], effect:{kind:'points', value:3}, built: true },
            { cost:['madera','madera','madera'], effect:{kind:'coins', value:7}, built: false },
            { cost:['hueso','hueso','lana'], effect:{kind:'points', value:7}, built: false },
          ]}
          width={640} height={176}/>
      </div>

      {/* Right player */}
      <div style={{display:'flex', alignItems:'center'}}>
        <OtherPlayerPanel player={{...others[2], chosen: others[2].chosen || phase !== 'choose'}}
          highlight={phase === 'reveal' && !!revealedOther[others[2].id]}
          revealed={phase === 'reveal' || phase === 'resolve' ? revealedOther[others[2].id] : null}/>
      </div>

      {/* BOTTOM ROW — Hand + Action */}
      <div/>
      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'center', gap: 20, minWidth: 0}}>
        <div style={{flex: 1, display:'flex', justifyContent:'center', minWidth: 0}}>
          {phase === 'choose' && (
            <Hand cards={hand} onPick={setSelectedIdx} selectedIdx={selectedIdx}
              affordability={affordability} radius={700} spread={24}/>
          )}
          {phase !== 'choose' && (
            <div style={{width: 900, height: 360, display:'flex', alignItems:'center', justifyContent:'center'}}>
              {selected && (
                <div style={{
                  animation: phase === 'reveal' || phase === 'resolve' ? 'reveal-in 0.5s ease-out' : 'none',
                  transform: phase === 'committed' ? 'translateY(20px) scale(0.92)' : 'none',
                  opacity: phase === 'committed' ? 0.7 : 1,
                  transition: 'all 0.3s',
                }}>
                  <Card {...selected} width={240} height={348}/>
                </div>
              )}
            </div>
          )}
        </div>
        {selected && phase === 'choose' && (
          <div style={{paddingBottom: 10}}>
            <ActionPanel card={selected}
              affordable={{ build: affordability[selectedIdx], wonder: coins >= 2 }}
              onBuild={() => commit('build')}
              onWonder={() => commit('wonder')}
              onDiscard={() => commit('discard')}
              onCancel={() => setSelectedIdx(null)}/>
          </div>
        )}
      </div>
      <div/>
    </div>
  );
}

window.GameTable = GameTable;
