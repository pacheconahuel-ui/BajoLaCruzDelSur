import { useState } from 'react';

const TABS = ['Intro', 'Pueblos', 'Turno', 'Recursos', 'Puntuación', 'Consejos'] as const;
type Tab = typeof TABS[number];

export default function HowToPlayPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('Intro');

  return (
    <div style={{
      minHeight: '100svh', background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button
          onClick={onBack}
          style={{ background: 'var(--color-surface2)', color: 'var(--color-text-dim)', padding: '6px 14px', fontSize: '0.88rem' }}
        >
          ← Volver
        </button>
        <div>
          <h1 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '0.04em' }}>
            Bajo la Cruz del Sur — Guía de juego
          </h1>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '2px solid var(--color-surface2)',
        background: 'var(--color-surface)', padding: '0 20px', gap: 4,
        overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'transparent', borderRadius: 0,
              color: tab === t ? 'var(--color-gold)' : 'var(--color-text-dim)',
              borderBottom: tab === t ? '2px solid var(--color-gold)' : '2px solid transparent',
              marginBottom: -2, padding: '10px 18px',
              fontWeight: tab === t ? 700 : 400, fontSize: '0.9rem',
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
        {tab === 'Intro'      && <TabIntro />}
        {tab === 'Pueblos'    && <TabPueblos />}
        {tab === 'Turno'      && <TabTurno />}
        {tab === 'Recursos'   && <TabRecursos />}
        {tab === 'Puntuación' && <TabPuntuacion />}
        {tab === 'Consejos'   && <TabConsejos />}
      </div>
    </div>
  );
}

/* ─── Tab: Intro ─────────────────────────────────────────────── */
function TabIntro() {
  return (
    <div>
      <H2>¿De qué trata el juego?</H2>
      <P>
        <b>Bajo la Cruz del Sur</b> es un juego de construcción de civilizaciones para 3 a 7 jugadores
        ambientado en la Patagonia andina. Cada jugador lidera un pueblo originario y durante tres eras
        construye estructuras, desarrolla ciencia, comercia con vecinos y se defiende de conflictos.
      </P>
      <P>
        Al final de la Tercera Era, el pueblo con más puntos de victoria gana.
      </P>

      <H2>Estructura general</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <EraCard era={1} name="Raíces Ancestrales" desc="Cartas baratas, primeros recursos. La base de tu civilización." color="#6b3a14" />
        <EraCard era={2} name="Florecimiento del Lof" desc="Estructuras más poderosas. El comercio se vuelve clave." color="#1a3a6e" />
        <EraCard era={3} name="El Gran Malón" desc="Gremios (Lof), última cosecha de ciencia y puntos militares decisivos." color="#2e1f44" />
      </div>

      <H2>Tu pueblo (maravilla)</H2>
      <P>
        Cada jugador tiene un <b>Pueblo originario</b> único con 3 etapas. Para avanzar una etapa,
        descartás cualquier carta de tu mano (en lugar de construirla). Cada etapa otorga un poder especial.
      </P>
      <Tip>El Pueblo es tuyo — nadie puede quitártelo ni bloquearte.</Tip>
    </div>
  );
}

/* ─── Tab: Pueblos ───────────────────────────────────────────── */
const PUEBLOS_INFO = [
  {
    nombre: 'Kawésqar', id: 'colossus', recurso: '🌲 Madera',
    pasiva: 'Señores del Mar',
    detalle: 'Comprás recursos de producción (marrones) a vecinos por 1💰 en lugar de 2💰.',
    etapas: ['+🌲 produce madera', '5 ⭐', '7 ⭐'],
  },
  {
    nombre: 'Günün-a-Künna', id: 'lighthouse', recurso: '🧱 Arcilla',
    pasiva: 'Horizonte Abierto',
    detalle: 'Empezás con 4💰 en lugar de 3💰.',
    etapas: ['+4💰', '2⭐ por cada carta amarilla tuya', '7⭐'],
  },
  {
    nombre: 'Yámana', id: 'temple', recurso: '🪨 Piedra',
    pasiva: 'Fuego Eterno',
    detalle: 'Cada vez que construís una etapa de tu Pueblo, recibís +1💰 extra.',
    etapas: ['produce 🪨 o ⚙️', '🧪 símbolo científico libre', '7⭐'],
  },
  {
    nombre: 'Aónikenk', id: 'babylon', recurso: '🌲 Madera',
    pasiva: 'Memoria Ancestral',
    detalle: 'Las cartas de Ciencia (verdes) de Era I te cuestan 1 recurso menos al construir.',
    etapas: ['🛡 1 escudo', '🛡🛡 2 escudos', '7⭐'],
  },
  {
    nombre: "Selk'nam", id: 'olympia', recurso: '🧱 Arcilla',
    pasiva: 'Espíritu del Hain',
    detalle: 'Una vez por Era podés construir una carta sin pagar sus recursos (solo comercio si aplica).',
    etapas: ['3⭐', '🧪 símbolo científico libre', '7⭐'],
  },
  {
    nombre: 'Rankül', id: 'halicarnassus', recurso: '🌲 Madera',
    pasiva: 'Resistencia Ranquel',
    detalle: 'Las derrotas militares valen 0 puntos en lugar de -1. Nunca perdés PV por guerra.',
    etapas: ['+3💰', '♻ construir carta del descarte gratis', '7⭐'],
  },
  {
    nombre: 'Ñuke Mapu', id: 'giza', recurso: '🪨 Piedra',
    pasiva: 'Mapu Sagrado',
    detalle: 'Producís 2 Piedra desde el inicio (1 del recurso base + 1 extra pasivo).',
    etapas: ['+🪨 produce piedra extra', '5⭐', '7⭐'],
  },
];

function TabPueblos() {
  return (
    <div>
      <H2>Los 7 Pueblos originarios</H2>
      <P>
        Al iniciar la partida, a cada jugador se le asigna un Pueblo al azar. Cada uno tiene
        un <b>recurso inicial</b>, una <b>habilidad pasiva única</b> (activa desde el turno 1)
        y <b>3 etapas</b> de Hito que se desbloquean sacrificando cartas.
      </P>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PUEBLOS_INFO.map(p => (
          <div key={p.id} style={{
            background: 'var(--color-surface)', borderRadius: 10,
            border: '1px solid var(--color-border)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 14px', borderBottom: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-gold)' }}>{p.nombre}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginTop: 1 }}>
                  Recurso inicial: {p.recurso}
                </div>
              </div>
              <div style={{
                background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)',
                borderRadius: 6, padding: '3px 8px', fontSize: '0.72rem',
                color: 'var(--color-gold)', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                {p.pasiva}
              </div>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{
                fontSize: '0.82rem', color: 'var(--color-text)',
                marginBottom: 10, lineHeight: 1.5,
                borderLeft: '3px solid var(--color-gold)',
                paddingLeft: 10,
              }}>
                {p.detalle}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {p.etapas.map((e, i) => (
                  <div key={i} style={{
                    flex: 1, background: 'var(--color-surface2)', borderRadius: 6,
                    padding: '5px 7px', textAlign: 'center',
                    fontSize: '0.7rem', color: 'var(--color-text-dim)', lineHeight: 1.4,
                  }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Etapa {i + 1}</div>
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Tip style={{ marginTop: 16 }}>
        Las pasivas están siempre activas — no necesitás construir ninguna etapa para beneficiarte de ellas.
      </Tip>
    </div>
  );
}

/* ─── Tab: Turno ─────────────────────────────────────────────── */
function TabTurno() {
  return (
    <div>
      <H2>¿Cómo funciona un turno?</H2>
      <P>Cada era tiene <b>6 turnos</b>. En cada turno, todos los jugadores eligen en simultáneo.</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <Step n={1} title="Mirá tu mano" desc="Tenés varias cartas. Solo podés jugar una por turno." />
        <Step n={2} title="Elegí una carta" desc="Tocala para seleccionarla. Podés cambiar de opinión hasta que confirmes." />
        <Step n={3} title="Elegí la acción" desc="Con la carta seleccionada, elegís qué hacer:" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <ActionCard
          icon="🏗"
          title="Construir"
          color="#1a4480"
          desc="La carta pasa a tu ciudad y da su efecto permanentemente. Puede costar recursos o monedas."
        />
        <ActionCard
          icon="🏛"
          title="Etapa del Pueblo"
          color="#2c4a33"
          desc="Sacrificás la carta para avanzar tu Pueblo al siguiente nivel. La carta desaparece, pero ganas el bonus del Pueblo."
        />
        <ActionCard
          icon="🗑"
          title="Descartar (+3💰)"
          color="#4a3000"
          desc="Tirás la carta y ganás 3 monedas. Siempre disponible, incluso si no podés construir nada."
        />
      </div>

      <Step n={4} title="Confirmá" desc="Una vez confirmado, esperás a que todos los demás terminen." />
      <Step n={5} title="Las manos rotan" desc="Al final de cada turno, tu mano de cartas pasa a un vecino. En la Era 1 van a la izquierda, en la Era 2 a la derecha, en la Era 3 a la izquierda." />

      <H2>Comercio automático</H2>
      <P>
        Si te falta un recurso para construir una carta, el juego puede comprarlo automáticamente
        al vecino que lo tenga. Verás el costo en naranja sobre la carta (<b>+2💰</b> por ejemplo).
        Esas monedas van al vecino, no se pierden.
      </P>
      <Tip>El descuento de compra a vecinos solo aplica si tenés cartas amarillas de trueque.</Tip>
    </div>
  );
}

/* ─── Tab: Recursos ──────────────────────────────────────────── */
function TabRecursos() {
  return (
    <div>
      <H2>Tipos de carta</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <CardType color="#6b3a14" label="Marrones — Materia prima" desc="Producen recursos básicos: madera 🪵, piedra 🪨, arcilla 🧱, mineral ⚙️. Son el motor de tu economía." />
        <CardType color="#3d4a5c" label="Grises — Manufactura" desc="Producen materiales elaborados: obsidiana 🔮, witral 🧵, cuero 📜. Requeridas para cartas avanzadas." />
        <CardType color="#1a3a6e" label="Azules — Rehue" desc="Dan puntos de victoria ⭐ directamente. Fáciles de entender, siempre útiles." />
        <CardType color="#2c4a33" label="Verdes — Machi" desc="Dan símbolos científicos 🧭⚙📋. Puntúan exponencialmente al final." />
        <CardType color="#7a3c0a" label="Amarillas — Trueque" desc="Comercio: descuentos en compras a vecinos, monedas extra, producción comodín." />
        <CardType color="#6b1c14" label="Rojas — Malón" desc="Dan escudos 🛡 para batallas militares al final de cada era." />
        <CardType color="#2e1f44" label="Moradas — Lof" desc="Solo aparecen en la Era III. Puntúan según lo que construyeron tus vecinos. Muy poderosas." />
      </div>

      <H2>Cadenas de construcción ⛓</H2>
      <P>
        Algunas cartas tienen una cadena: si ya tenés cierta carta en tu ciudad, podés construir
        la siguiente <b>gratis</b> (sin pagar recursos ni monedas). El ícono ⛓ indica que esta carta
        desbloquea otra en la próxima era.
      </P>
      <Tip>Mirá las cadenas al inicio de cada era para planificar qué construir gratis.</Tip>

      <H2>Ciencia — cómo puntúa</H2>
      <P>
        Los símbolos científicos puntúan así al final del juego:
      </P>
      <div style={{ background: 'var(--color-surface2)', borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 2 }}>
        <div>🧭 compass² + ⚙️ gear² + 📋 tablet²</div>
        <div>+ 7 × (sets completos de los 3 símbolos)</div>
      </div>
      <P style={{ marginTop: 10 }}>
        Ejemplo: 3🧭 + 2⚙️ + 1📋 = 9 + 4 + 1 + 7 = <b>21 puntos</b>.
        Tener muchos del mismo símbolo o sets completos multiplica mucho.
      </P>
    </div>
  );
}

/* ─── Tab: Puntuación ────────────────────────────────────────── */
function TabPuntuacion() {
  return (
    <div>
      <H2>¿Cómo gano puntos?</H2>
      <P>Al final de la Era III se cuentan todas las categorías:</P>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        <ScoreRow icon="⚔️" cat="Militar" desc="Suma de tokens ganados en batallas militares (al final de cada era). Cada derrota resta 1 punto." />
        <ScoreRow icon="💰" cat="Tesoro" desc="Cada 3 monedas que tengas al final = 1 punto. Vale la pena no gastar todo." />
        <ScoreRow icon="🏛" cat="Pueblo" desc="Puntos de las etapas de tu Pueblo construidas. Varían por pueblo." />
        <ScoreRow icon="🔵" cat="Civil" desc="Suma de los puntos ⭐ de todas tus cartas azules." />
        <ScoreRow icon="🧪" cat="Ciencia" desc="Puntaje de tus símbolos científicos (ver pestaña Recursos)." />
        <ScoreRow icon="🟡" cat="Comercio" desc="Puntos de cartas amarillas de Era III que dan PV." />
        <ScoreRow icon="🟣" cat="Lof" desc="Puntos de cartas moradas (Lof) de Era III según las cartas de tus vecinos." />
      </div>

      <H2>Batallas militares</H2>
      <P>
        Al final de <b>cada era</b>, comparás tus escudos 🛡 con los de cada vecino (izquierda y derecha):
      </P>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px', background: 'var(--color-surface2)', borderRadius: 6 }}>
          <span style={{ fontSize: '1.2rem' }}>🏆</span>
          <div><b>Ganás</b> → token de +{' '}<span style={{ color: 'var(--color-gold)' }}>+1/+3/+5</span> según la era (I/II/III)</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px', background: 'var(--color-surface2)', borderRadius: 6 }}>
          <span style={{ fontSize: '1.2rem' }}>🤝</span>
          <div><b>Empate</b> → nadie gana nada</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px', background: 'var(--color-surface2)', borderRadius: 6 }}>
          <span style={{ fontSize: '1.2rem' }}>💀</span>
          <div><b>Perdés</b> → token de <span style={{ color: '#f87171' }}>-1 punto</span> (en todas las eras) · <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>Rankül: siempre 0</span></div>
        </div>
      </div>
      <Tip>No necesitás dominar lo militar — a veces 1-2 escudos alcanzan para no perder puntos.</Tip>

      <H2>Desempate</H2>
      <P>Si dos jugadores terminan con el mismo puntaje total, gana el que tiene más monedas al final.</P>
    </div>
  );
}

/* ─── Tab: Consejos ──────────────────────────────────────────── */
function TabConsejos() {
  return (
    <div>
      <H2>Primera partida</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <Tip>🪵 Construí recursos primero (cartas marrones gratuitas en Era I). Sin recursos, no podés construir casi nada.</Tip>
        <Tip>🔵 Una carta azul barata por turno suma muchos puntos al final sin esfuerzo.</Tip>
        <Tip>🗑 Descartar (+3💰) siempre es válido. Si tu mano es mala, tomá las monedas y esperá.</Tip>
        <Tip>🏛 No ignores el Pueblo — avanzarlo es gratis (solo costás una carta) y los bonuses son poderosos.</Tip>
        <Tip>⛓ Revisá las cadenas: construir ciertas cartas en Era I te da acceso gratis a mejores cartas en Era II.</Tip>
      </div>

      <H2>Estrategias avanzadas</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <Tip>🧪 La ciencia escala exponencialmente. Si conseguís 3+ del mismo símbolo, es una estrategia ganadora.</Tip>
        <Tip>💰 El trueque (cartas amarillas) te hace independiente de tus vecinos. Muy fuerte en partidas con 5+ jugadores.</Tip>
        <Tip>🟣 Los Lof (morados) en Era III dependen de lo que construyeron tus vecinos — mirá qué les conviene antes de elegirlos.</Tip>
        <Tip>👀 Observá qué pasan tus vecinos. Las cartas que no elegís van al siguiente jugador — a veces conviene pasar algo malo a propósito.</Tip>
      </div>

      <H2>Errores comunes</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ErrorTip>❌ Guardar monedas sin usarlas — el comercio es la clave para construir cartas caras.</ErrorTip>
        <ErrorTip>❌ Ignorar lo militar completamente — incluso 2 escudos evitan perder -1 PV por era.</ErrorTip>
        <ErrorTip>❌ Construir todo sin estrategia — es mejor especializarse (ciencia, o civil, o militar) que hacer un poco de todo mediocre.</ErrorTip>
        <ErrorTip>❌ Olvidar el Pueblo — muchos jugadores nuevos nunca avanzan etapas y se pierden de bonuses decisivos.</ErrorTip>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, marginTop: 20 }}>
      {children}
    </h2>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: '0.88rem', color: 'var(--color-text-dim)', lineHeight: 1.7, marginBottom: 12, ...style }}>{children}</p>;
}

function Tip({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(184,192,201,0.06)', border: '1px solid rgba(184,192,201,0.15)', borderLeft: '3px solid var(--color-gold)', borderRadius: 6, padding: '8px 12px', fontSize: '0.84rem', color: 'var(--color-text)', lineHeight: 1.6, ...style }}>
      {children}
    </div>
  );
}

function ErrorTip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderLeft: '3px solid #f87171', borderRadius: 6, padding: '8px 12px', fontSize: '0.84rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function EraCard({ era, name, desc, color }: { era: number; name: string; desc: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: '#fff', flexShrink: 0 }}>{era}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>{desc}</div>
      </div>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-gold)', color: '#1c1410', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</div>
      <div>
        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{title} — </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>{desc}</span>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, color, desc }: { icon: string; title: string; color: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 14px', background: color, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{desc}</div>
      </div>
    </div>
  );
}

function CardType({ color, label, desc }: { color: string; label: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 14, minWidth: 14, height: 14, marginTop: 3, borderRadius: 3, background: color }} />
      <div>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{label} — </span>
        <span style={{ fontSize: '0.83rem', color: 'var(--color-text-dim)' }}>{desc}</span>
      </div>
    </div>
  );
}

function ScoreRow({ icon, cat, desc }: { icon: string; cat: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
      <span style={{ fontSize: '1.2rem', flexShrink: 0, width: 28, textAlign: 'center' }}>{icon}</span>
      <div>
        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-gold)' }}>{cat} — </span>
        <span style={{ fontSize: '0.83rem', color: 'var(--color-text-dim)' }}>{desc}</span>
      </div>
    </div>
  );
}
