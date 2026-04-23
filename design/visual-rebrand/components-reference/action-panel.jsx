// Confederación del Sur — Panel de acción (al elegir una carta)
function ActionPanel({ card, onBuild, onWonder, onDiscard, onCancel, affordable = { build: true, wonder: true } }) {
  const P = window.SS.palette;
  const T = window.SS.type;
  if (!card) return null;
  const F = window.SS.families[card.family];

  const Btn = ({ label, sub, glyph, onClick, primary, disabled }) => (
    <button onClick={!disabled ? onClick : undefined} disabled={disabled}
      style={{
        flex: 1,
        background: disabled ? P.slate : (primary ? F.fill : P.night2),
        border: `1px solid ${disabled ? P.stone : (primary ? F.tint : P.silver+'55')}`,
        color: disabled ? P.stone : (primary ? F.wash : P.bone),
        clipPath: window.SS.chamfer(5),
        padding: '12px 14px',
        fontFamily: T.body,
        textAlign:'left',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'transform 0.12s, box-shadow 0.12s',
        boxShadow: primary && !disabled ? window.SS.shadow.soft : 'none',
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform='translateY(-1px)')}
      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
      <div style={{display:'flex', alignItems:'baseline', gap: 8, marginBottom: 2}}>
        <span style={{fontFamily: T.display, fontSize: 11, letterSpacing: 3, textTransform:'uppercase', opacity: 0.8}}>{glyph}</span>
        <span style={{fontFamily: T.display, fontSize: 18, fontWeight: 600}}>{label}</span>
      </div>
      <div style={{fontSize: 10, letterSpacing: 1, opacity: 0.8, lineHeight: 1.4}}>{sub}</div>
    </button>
  );

  return (
    <div style={{
      background: P.night,
      backgroundImage: window.SS.nightTexture + `, ${P.night}`,
      padding: 16,
      clipPath: window.SS.chamfer(6),
      boxShadow: window.SS.shadow.lift,
      color: P.bone, fontFamily: T.body,
      width: 420,
      border: `1px solid ${P.silver}33`,
    }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12}}>
        <div>
          <div style={{fontSize: 9, letterSpacing: 2.5, textTransform:'uppercase', color: P.silver, opacity: 0.75}}>
            Decisión
          </div>
          <div style={{fontFamily: T.display, fontSize: 20, fontWeight: 600, lineHeight: 1.1}}>
            {card.name}
          </div>
        </div>
        <button onClick={onCancel} style={{
          background:'transparent', border:`1px solid ${P.slate}`, color: P.silver,
          width: 28, height: 28, cursor:'pointer', fontSize: 14,
        }}>✕</button>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap: 8}}>
        <Btn label="Construir" sub="Añade el edificio a tu ciudad y activa su efecto." glyph="I"
          onClick={onBuild} primary disabled={!affordable.build}/>
        <Btn label="Alzar etapa" sub="Descarta esta carta para construir la siguiente etapa de tu capital." glyph="II"
          onClick={onWonder} disabled={!affordable.wonder}/>
        <Btn label="Descartar" sub="Recibe 3 piezas de plata del tesoro común." glyph="III"
          onClick={onDiscard}/>
      </div>
    </div>
  );
}

window.ActionPanel = ActionPanel;
