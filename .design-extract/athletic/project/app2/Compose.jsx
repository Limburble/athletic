/* Compose — the itinerary. Not a prescription — a path through the evening. */

const SA_COMPOSED = {
  warmup: [
    { n: 'A walk on the treadmill',     d: '5 minutes',         note: 'wake the body' },
    { n: 'Light banded shoulder work',  d: '2 sets of 15',      note: 'open the chain' },
  ],
  main: [
    { group: 'Chest', items: [
      { n: 'Smith machine bench press', sets: '4 sets · 8 reps',  rest: '90s rest', mood: 'compound' },
      { n: 'Incline dumbbell press',    sets: '3 sets · 10 reps', rest: '75s rest', mood: 'upper chest' },
      { n: 'Pec deck fly',              sets: '3 sets · 12 reps', rest: '60s rest', mood: 'finisher' },
    ]},
    { group: 'Back', items: [
      { n: 'Lat pulldown · wide grip',  sets: '4 sets · 10 reps', rest: '75s rest', mood: 'width' },
      { n: 'Seated cable row',          sets: '3 sets · 10 reps', rest: '75s rest', mood: 'thickness' },
    ]},
  ],
  abs: {
    name: 'Heavy plate · core',
    items: [
      { n: 'Weighted crunch',  sets: '4 sets · 10 reps' },
      { n: 'Russian twist',    sets: '3 sets · 20 reps' },
      { n: 'Ab wheel rollout', sets: '3 sets · 8 reps'  },
    ],
  },
};

const SaCompose = ({ state, set, onStart, onBack }) => {
  const { mode = 'def' } = state;
  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-tap" onClick={onBack}>
          <SaIcon name="back" size={20} color="var(--sa-ink-2)" />
        </span>
        <SaModeTag mode={mode} />
        <span style={{ width: 20 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 28px 140px' }}>
        {/* Title */}
        <div className="sa-enter" style={{ marginBottom: 32 }}>
          <div className="sa-label" style={{ marginBottom: 12 }}>Tonight's itinerary</div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, marginBottom: 6 }}>
            Chest and back,
          </div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, color: 'var(--sa-ink-2)' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>sixty minutes.</em>
          </div>
        </div>

        {/* Pill stats */}
        <div className="sa-enter" style={{
          display: 'flex', gap: 8, marginBottom: 36, animationDelay: '0.1s',
        }}>
          <div style={{ flex: 1, padding: '14px 16px', background: 'var(--sa-bg-2)',
            borderRadius: 18, border: '1px solid var(--sa-rule)' }}>
            <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginBottom: 6 }}>EXERCISES</div>
            <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 22 }}>8</div>
          </div>
          <div style={{ flex: 1, padding: '14px 16px', background: 'var(--sa-bg-2)',
            borderRadius: 18, border: '1px solid var(--sa-rule)' }}>
            <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginBottom: 6 }}>SETS</div>
            <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 22 }}>24</div>
          </div>
          <div style={{ flex: 1, padding: '14px 16px', background: 'var(--sa-bg-2)',
            borderRadius: 18, border: '1px solid var(--sa-rule)' }}>
            <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginBottom: 6 }}>FINISH</div>
            <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 16, paddingTop: 4 }}>~8:50pm</div>
          </div>
        </div>

        {/* Phases */}
        <SaPhase n="I" label="Wake the body" subtitle="5 minutes · warmup" delay={0.15}>
          {SA_COMPOSED.warmup.map((w, i) => (
            <SaItineraryRow key={i} title={w.n} meta={w.d} sub={w.note} />
          ))}
        </SaPhase>

        <SaPhase n="II" label="The work" subtitle="45 minutes · main block" delay={0.2}>
          {SA_COMPOSED.main.map((g, gi) => (
            <div key={gi} style={{ marginBottom: gi < SA_COMPOSED.main.length - 1 ? 20 : 0 }}>
              <div className="sa-serif-it" style={{ fontSize: 17, color: 'var(--sa-accent)', marginBottom: 10, marginTop: 6 }}>
                {g.group.toLowerCase()}.
              </div>
              {g.items.map((ex, ei) => (
                <SaItineraryRow key={ei} title={ex.n} meta={ex.sets} sub={`${ex.rest} · ${ex.mood}`} />
              ))}
            </div>
          ))}
        </SaPhase>

        <SaPhase n="III" label="The floor" subtitle="8 minutes · core" delay={0.25}>
          <div className="sa-serif-it" style={{ fontSize: 17, color: 'var(--sa-accent)', marginBottom: 10, marginTop: 6 }}>
            {SA_COMPOSED.abs.name.toLowerCase()}.
          </div>
          {SA_COMPOSED.abs.items.map((ex, ei) => (
            <SaItineraryRow key={ei} title={ex.n} meta={ex.sets} />
          ))}
        </SaPhase>

        {/* Coach line */}
        <div className="sa-enter" style={{
          margin: '32px 0 16px', padding: '24px 22px',
          background: 'linear-gradient(180deg, var(--sa-accent-aura), transparent)',
          border: '1px solid var(--sa-rule)',
          borderRadius: 22,
          animationDelay: '0.3s',
        }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 10 }}>A NOTE FOR TONIGHT</div>
          <div className="sa-serif-it" style={{ fontSize: 17, lineHeight: 1.45, color: 'var(--sa-ink-1)' }}>
            One rep shy of failure early, push the last set. Steady pace.
            <br/>The sauna is open until ten.
          </div>
        </div>
      </div>

      <SaFloatingDock>
        <button className="sa-cta" onClick={onStart}>
          Settle in
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  );
};

/* Phase block — Roman numeral, label, hairline rule, body */
const SaPhase = ({ n, label, subtitle, children, delay = 0 }) => (
  <div className="sa-enter" style={{ marginBottom: 32, animationDelay: `${delay}s` }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
      <span className="sa-serif-it" style={{ fontSize: 22, color: 'var(--sa-accent)' }}>{n}.</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontWeight: 400, fontSize: 18, color: 'var(--sa-ink-1)',
        }}>{label}</div>
        <div className="sa-label" style={{ fontSize: 9, marginTop: 2 }}>{subtitle}</div>
      </div>
    </div>
    <div className="sa-rule" style={{ marginBottom: 10 }} />
    {children}
  </div>
);

const SaItineraryRow = ({ title, meta, sub }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    padding: '12px 0',
    borderBottom: '1px solid var(--sa-rule)',
  }}>
    <div style={{ flex: 1 }}>
      <div style={{
        fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 16,
        color: 'var(--sa-ink-1)', marginBottom: sub ? 3 : 0,
        letterSpacing: '-0.005em',
      }}>{title}</div>
      {sub && <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)' }}>{sub.toUpperCase()}</div>}
    </div>
    <div style={{
      fontFamily: 'Geist Mono, monospace', fontSize: 11, fontWeight: 300,
      color: 'var(--sa-ink-2)', letterSpacing: '0.03em',
    }}>
      {meta}
    </div>
  </div>
);

Object.assign(window, { SaCompose });
