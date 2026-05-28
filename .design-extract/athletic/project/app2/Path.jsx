/* The Path — choose tonight's route. One question at a time, calm. */

const SA_TIMES = [15, 30, 45, 60, 75, 90, 105, 120];
const SA_MUSCLES = [
  { id: 'chest',  label: 'Chest',     hint: '11 paths' },
  { id: 'back',   label: 'Back',      hint: '10 paths' },
  { id: 'tris',   label: 'Triceps',   hint: '9 paths'  },
  { id: 'bis',    label: 'Biceps',    hint: '9 paths'  },
  { id: 'delts',  label: 'Shoulders', hint: '5 paths'  },
  { id: 'legs',   label: 'Legs',      hint: '7 paths'  },
];

const SaPath = ({ state, set, onCompose }) => {
  const { mode = 'def' } = state;
  const [time, setTime] = React.useState(state.time ?? 60);
  const [groups, setGroups] = React.useState(state.groups ?? ['chest', 'back']);
  const [mod, setMod] = React.useState(mode);

  const toggle = (id) => setGroups(groups.includes(id) ? groups.filter(x => x !== id) : [...groups, id]);

  const canCompose = groups.length > 0;

  // Update parent mode so aura shifts colors live
  React.useEffect(() => { set({ mode: mod }); }, [mod]);

  return (
    <div className="sa-app" data-sa-mode={mod}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      {/* Subtle back nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-tap" onClick={() => set({ tab: 'tonight' })}>
          <SaIcon name="back" size={20} color="var(--sa-ink-2)" />
        </span>
        <span className="sa-label">The Path · Compose</span>
        <span style={{ width: 20 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 140px' }}>
        {/* Header — sets the tone */}
        <div className="sa-enter" style={{ marginBottom: 36 }}>
          <div className="sa-serif" style={{ fontSize: 32, marginBottom: 8 }}>
            How long, <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>tonight?</em>
          </div>
          <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.5 }}>
            Take as long as you need. The room is here either way.
          </div>
        </div>

        {/* Time — soft radial scale */}
        <SaTimeDial value={time} onChange={setTime} />

        <div style={{ height: 40 }} />

        {/* Muscles */}
        <div className="sa-enter" style={{ marginBottom: 16, animationDelay: '0.1s' }}>
          <div className="sa-serif" style={{ fontSize: 26, marginBottom: 6 }}>
            What needs <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>care?</em>
          </div>
          <div className="sa-label" style={{ fontSize: 9 }}>SELECT ANY</div>
        </div>
        <div className="sa-enter" style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
          marginBottom: 40,
          animationDelay: '0.15s',
        }}>
          {SA_MUSCLES.map(m => {
            const on = groups.includes(m.id);
            return (
              <span key={m.id} className={`sa-pill ${on ? 'on' : ''}`}
                onClick={() => toggle(m.id)}
                style={{
                  padding: '12px 18px',
                  background: on ? 'var(--sa-accent)' : 'transparent',
                  color: on ? '#14110e' : 'var(--sa-ink-1)',
                  borderColor: on ? 'var(--sa-accent)' : 'var(--sa-rule-hi)',
                  fontSize: 14,
                  boxShadow: on ? '0 4px 18px var(--sa-accent-glow)' : 'none',
                }}>
                {m.label}
              </span>
            );
          })}
        </div>

        {/* Mode — quiet toggle */}
        <div className="sa-enter" style={{ marginBottom: 16, animationDelay: '0.2s' }}>
          <div className="sa-serif" style={{ fontSize: 26, marginBottom: 6 }}>
            And at what <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>tempo?</em>
          </div>
        </div>
        <div className="sa-enter" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          animationDelay: '0.25s',
        }}>
          {[
            { id: 'def', label: 'Definition', body: 'Hypertrophy · 8–15 reps · 60–90s' },
            { id: 'str', label: 'Strength',   body: 'Force · 3–6 reps · 2–3 min' },
          ].map(m => {
            const on = mod === m.id;
            return (
              <div key={m.id} className="sa-tap" onClick={() => setMod(m.id)}
                style={{
                  padding: '20px 18px',
                  background: on ? 'var(--sa-bg-3)' : 'transparent',
                  border: '1px solid ' + (on ? 'var(--sa-accent)' : 'var(--sa-rule)'),
                  borderRadius: 22,
                  transition: 'all 0.55s var(--sa-settle)',
                  boxShadow: on ? '0 0 0 1px var(--sa-accent), 0 6px 28px var(--sa-accent-glow)' : 'none',
                }}>
                <div style={{
                  fontFamily: 'Newsreader, serif',
                  fontWeight: 400,
                  fontSize: 20,
                  marginBottom: 4,
                  color: on ? 'var(--sa-accent)' : 'var(--sa-ink-1)',
                }}>{m.label}</div>
                <div style={{ fontSize: 11, color: 'var(--sa-ink-3)', lineHeight: 1.45 }}>{m.body}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compose CTA — floating dock */}
      <SaFloatingDock>
        <button className="sa-cta" disabled={!canCompose}
          onClick={() => onCompose({ time, groups, mode: mod })}>
          {canCompose ? <>Compose tonight <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span></>
                      : 'Choose a focus first'}
        </button>
      </SaFloatingDock>
    </div>
  );
};

/* Time dial — a soft horizontal scale, ultra-light Newsreader number */
const SaTimeDial = ({ value, onChange }) => {
  const idx = SA_TIMES.indexOf(value);

  return (
    <div className="sa-enter" style={{ marginBottom: 24 }}>
      {/* Number */}
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <div style={{
          fontFamily: 'Newsreader, serif',
          fontWeight: 200,
          fontSize: 132,
          letterSpacing: '-0.06em',
          lineHeight: 0.9,
          color: 'var(--sa-ink-1)',
        }}>
          {value}
        </div>
        <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-2)', marginTop: 2 }}>
          minutes
        </div>
      </div>

      <div style={{ height: 24 }} />

      {/* Soft tick scale — with hour markers in bottom labels */}
      <div style={{ position: 'relative', height: 60, marginTop: 6 }}>
        {/* Center marker line */}
        <div style={{
          position: 'absolute', top: 0, height: 26,
          left: '50%', width: 1,
          background: 'var(--sa-accent)',
          boxShadow: '0 0 12px var(--sa-accent-glow)',
          transform: 'translateX(-0.5px)',
        }} />

        {/* Tick row */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '0 0 6px', height: 28,
        }}>
          {SA_TIMES.map((t, i) => {
            const active = t === value;
            const near = Math.abs(i - idx) <= 1;
            const isHour = t % 60 === 0;
            return (
              <div key={t} className="sa-tap" onClick={() => onChange(t)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 6,
                }}>
                <div style={{
                  width: isHour ? 2 : 1,
                  height: active ? 22 : isHour ? 18 : near ? 14 : 8,
                  background: active ? 'var(--sa-accent)'
                    : isHour ? 'var(--sa-ink-2)' : 'var(--sa-ink-4)',
                  transition: 'all 0.55s var(--sa-settle)',
                  opacity: active ? 1 : isHour ? 0.85 : near ? 0.75 : 0.4,
                }} />
              </div>
            );
          })}
        </div>

        {/* Minute labels (below) */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '6px 0 0',
        }}>
          {SA_TIMES.map((t) => {
            const isHour = t % 60 === 0;
            const label = isHour ? `${t / 60}h` : String(t % 60);
            return (
              <div key={t} className="sa-mono" style={{
                flex: 1, textAlign: 'center',
                fontSize: 10,
                fontWeight: isHour ? 400 : 300,
                color: t === value ? 'var(--sa-accent)'
                  : isHour ? 'var(--sa-ink-2)' : 'var(--sa-ink-3)',
                transition: 'color 0.55s var(--sa-settle)',
              }}>{label}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { SaPath, SA_TIMES, SA_MUSCLES });
