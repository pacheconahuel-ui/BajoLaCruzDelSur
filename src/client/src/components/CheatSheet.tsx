export default function CheatSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay-bg" onClick={onClose}>
      <div className="overlay-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--color-gold)' }}>📋 Machete — Guía de íconos</h2>
          <button onClick={onClose} style={{ background: 'var(--color-surface2)', color: 'var(--color-text-dim)', padding: '4px 12px', fontSize: '0.85rem' }}>
            ✕ Cerrar
          </button>
        </div>

        {/* Turn flow */}
        <Section title="🔄 Cómo es un turno">
          <ol style={{ paddingLeft: 18, lineHeight: 2, fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
            <li><b style={{ color: 'var(--color-text)' }}>Todos eligen a la vez</b> — cada jugador toca una carta de su mano</li>
            <li>Elegís qué hacer: <b style={{ color: 'var(--color-text)' }}>Construir / Pueblo / Descartar</b> y confirmás</li>
            <li>Cuando <b style={{ color: 'var(--color-text)' }}>todos confirmaron</b>, el turno avanza y las manos se pasan al vecino</li>
            <li>6 turnos por era, 3 eras en total</li>
          </ol>
        </Section>

        {/* Actions */}
        <Section title="🎯 Acciones disponibles cada turno">
          <Row icon="🏗" label="Construir" desc="La carta entra a tu ciudad y da su efecto para siempre. Puede costar recursos (ver abajo)." />
          <Row icon="🏛" label="Pueblo (etapa X)" desc="Sacrificás cualquier carta para avanzar tu Pueblo al próximo nivel. La carta desaparece, pero el pueblo da un bonus especial. Las etapas son en orden (1→2→3)." />
          <Row icon="🗑" label="Descartar (+3💰)" desc="Tirás la carta y ganás 3 monedas. SIEMPRE disponible, incluso si no podés construir." />
        </Section>

        {/* Resources */}
        <Section title="🪵 Recursos — materias primas (cartas marrones)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
            {[
              ['🪵', 'Madera', 'Wood'],
              ['🪨', 'Piedra', 'Stone'],
              ['🧱', 'Arcilla', 'Clay'],
              ['⚙️', 'Mineral', 'Ore'],
            ].map(([icon, es, en]) => (
              <div key={en} style={{ background: 'var(--color-surface2)', borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{es}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{en}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="🔮 Recursos — manufacturas (cartas grises)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6 }}>
            {[
              ['🔮', 'Obsidiana', 'Vidrio volcánico'],
              ['🧵', 'Witral', 'Tejido Mapuche'],
              ['📜', 'Cuero', 'Cuero de guanaco'],
            ].map(([icon, es, en]) => (
              <div key={en} style={{ background: 'var(--color-surface2)', borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{es}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)' }}>{en}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Card colors */}
        <Section title="🎨 Tipos de carta (por color)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              ['#7c4a1e', '🪵 Marrones', 'Producen materias primas (madera, piedra, arcilla, mineral)'],
              ['#4a5568', '📦 Grises', 'Producen manufacturas (obsidiana, witral, cuero)'],
              ['#1a4480', '🔵 Azules', 'Dan puntos de victoria ⭐ directamente'],
              ['#166534', '🟢 Verdes', 'Dan símbolos científicos — puntúan al final'],
              ['#92400e', '🟡 Amarillas', 'Comercio: descuentos, monedas, producción comodín'],
              ['#7f1d1d', '🔴 Rojas', 'Dan escudos 🛡 para batallas militares'],
              ['#4c1d95', '🟣 Moradas', 'Lof — puntúan según lo que construyeron tus vecinos'],
            ].map(([color, label, desc]) => (
              <div key={label as string} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 14, minWidth: 14, height: 14, marginTop: 3, borderRadius: 3, background: color as string }} />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.83rem' }}>{label as string} </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>{desc as string}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Key icons */}
        <Section title="⭐ Íconos clave">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Row icon="⭐" label="Puntos de victoria" desc="Lo que gana el juego. Se suman todos al final." />
            <Row icon="🛡" label="Escudos militares" desc="Al final de cada era, el que tenga más escudos que su vecino gana tokens de victoria. Empate = nada. Derrota = -1 PV." />
            <Row icon="💰" label="Monedas" desc="Para pagar comercio (comprar recursos a vecinos). También valen 1 PV por cada 3 monedas al final." />
            <Row icon="🧭⚙📋" label="Ciencia" desc="Los 3 símbolos científicos. Cada uno cuadrado = puntos. Tener 1 de cada uno = +7 PV adicionales." />
            <Row icon="⛓" label="Cadena" desc="Esta carta desbloquea otra gratis en la próxima era. Hover sobre el ícono para ver cuál." />
            <Row icon="+2💰" label="Comercio (naranja)" desc="No tenés el recurso necesario. El juego lo compra automáticamente a un vecino por X monedas. Esas monedas van al vecino." />
          </div>
        </Section>

        {/* Scoring */}
        <Section title="🏆 Cómo ganar puntos">
          <div style={{ fontSize: '0.83rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}>
            <div>🔵 <b style={{ color: 'var(--color-text)' }}>Civil</b> — PV de cartas azules</div>
            <div>⚔️ <b style={{ color: 'var(--color-text)' }}>Militar</b> — Suma de tokens de victoria/derrota</div>
            <div>💰 <b style={{ color: 'var(--color-text)' }}>Tesoro</b> — floor(monedas ÷ 3)</div>
            <div>🏛 <b style={{ color: 'var(--color-text)' }}>Pueblo</b> — PV de etapas construidas</div>
            <div>🔬 <b style={{ color: 'var(--color-text)' }}>Ciencia</b> — compass² + gear² + tablet² + sets×7</div>
            <div>🟡 <b style={{ color: 'var(--color-text)' }}>Comercio</b> — PV de algunas cartas amarillas (Era III)</div>
            <div>🟣 <b style={{ color: 'var(--color-text)' }}>Lof</b> — PV de cartas moradas (Era III)</div>
          </div>
        </Section>

        <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--color-surface2)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--color-text-dim)', lineHeight: 1.6 }}>
          💡 <b style={{ color: 'var(--color-gold)' }}>Turno 1 tip:</b> Construí cartas de recursos primero (marrones/grises gratuitas) y alguna azul barata. Si una carta tiene naranja "+X💰", significa que te falta un recurso y lo comprás a un vecino.
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ icon, label, desc }: { icon: string; label: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 4 }}>
      <span style={{ fontSize: '1rem', minWidth: 28, textAlign: 'center', marginTop: 1 }}>{icon}</span>
      <div>
        <span style={{ fontWeight: 700, fontSize: '0.83rem' }}>{label} — </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>{desc}</span>
      </div>
    </div>
  );
}
