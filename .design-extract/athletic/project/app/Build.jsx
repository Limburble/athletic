/* Build — 3-step guided setup, Field Notes treatment */

const FN_TIME_SLOTS = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150];

const FN_MUSCLES = [
  { id: 'chest',    label: 'Chest',     n: 11 },
  { id: 'back',     label: 'Back',      n: 10 },
  { id: 'tris',     label: 'Triceps',   n: 9  },
  { id: 'bis',      label: 'Biceps',    n: 9  },
  { id: 'delts',    label: 'Shoulders', n: 5  },
  { id: 'legs',     label: 'Legs',      n: 7  },
];

const FNBuild = ({ state, set, onCompile }) => {
  const { mode = 'def', dark = false, step = 0, slotIdx = 3, groups = [] } = state;
  const setMode  = (m) => set({ mode: m });
  const setStep  = (s) => set({ step: s });
  const setSlot  = (i) => set({ slotIdx: i });
  const setGroups= (g) => set({ groups: g });
  const toggle   = (id) => setGroups(groups.includes(id) ? groups.filter(x => x !== id) : [...groups, id]);

  const time     = FN_TIME_SLOTS[slotIdx];
  const canCompile = groups.length > 0;

  return (
    <div className="fn-app" data-mode={mode} data-dark={dark}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FNTopBar mode={mode} onMenu={() => set({ tab: 'settings' })} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }}>
        {/* Today header */}
        <div style={{ marginBottom: 20 }}>
          <div className="fn-serial">SESSION · {new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' }).toUpperCase()}</div>
          <div className="t-serif" style={{ fontSize: 36, marginTop: 8, lineHeight: .95 }}>
            Build the <span className="t-serif-it">session.</span>
          </div>
        </div>

        {/* Step 1 — Duration */}
        <FNStep
          n={1} title="DURATION" summary={`${time} minutes`}
          active={step === 0} done={step > 0}
          onOpen={() => setStep(0)}>
          <FNTimePicker idx={slotIdx} onChange={setSlot} />
        </FNStep>

        <div style={{ height: 12 }} />

        {/* Step 2 — Muscles */}
        <FNStep
          n={2} title="MUSCLES" summary={
            groups.length ? groups.map(g => FN_MUSCLES.find(m => m.id === g).label).join(' · ') : '— select —'
          }
          active={step === 1} done={step > 1 && groups.length > 0}
          locked={step < 1}
          onOpen={() => setStep(1)}>
          <FNMusclePicker selected={groups} onToggle={toggle} />
        </FNStep>

        <div style={{ height: 12 }} />

        {/* Step 3 — Mode */}
        <FNStep
          n={3} title="MODE" summary={mode === 'def' ? 'Definition' : 'Strength'}
          active={step === 2} done={step > 2}
          locked={step < 2 || groups.length === 0}
          onOpen={() => setStep(2)}>
          <FNModePicker mode={mode} onChange={setMode} />
        </FNStep>

        <div style={{ height: 24 }} />
      </div>

      {/* Compile CTA */}
      <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--rule)', paddingTop: 16, background: 'var(--paper)' }}>
        <button className="fn-cta accent" disabled={!canCompile} onClick={onCompile}>
          <span>{canCompile ? 'Compile workout' : 'Pick a muscle to begin'}</span>
          {canCompile && <FNIcon name="arrow" size={22} color="var(--paper)" />}
        </button>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 10,
          fontSize: 11,
        }} className="t-mono">
          <span style={{ color: 'var(--ink-2)' }}>WARMUP · MAIN · ABS</span>
          <span style={{ color: 'var(--ink-2)' }}>EST · {Math.round(time)} MIN</span>
        </div>
      </div>

      <FNDock tab="build" onTab={(t) => set({ tab: t })} mode={mode} />
    </div>
  );
};

/* Step shell */
const FNStep = ({ n, title, summary, active, done, locked, onOpen, children }) => {
  const state = active ? 'active' : done ? 'done' : locked ? 'locked' : '';
  return (
    <div className={`fn-step ${state}`}>
      <div className="tap" onClick={!active ? onOpen : undefined}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 18px',
          borderBottom: active ? '1px solid var(--rule)' : 'none',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="t-mono" style={{
            fontSize: 11, color: active ? 'var(--accent-hi)' : 'var(--ink-3)',
            letterSpacing: '0.18em',
          }}>0{n}</span>
          <span className="t-label" style={{ color: active ? 'var(--ink-1)' : 'var(--ink-2)' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="t-mono" style={{
            fontSize: 13, fontWeight: 500,
            color: active ? 'var(--ink-1)' : 'var(--ink-2)',
          }}>{summary}</span>
          {done && <FNIcon name="check" size={14} color="var(--accent-hi)" strokeWidth={2} />}
          {!active && !locked && <FNIcon name="chevR" size={14} color="var(--ink-3)" />}
        </div>
      </div>
      {active && <div style={{ padding: '18px' }}>{children}</div>}
    </div>
  );
};

/* Time picker — horizontal scroll snap, big mono number */
const FNTimePicker = ({ idx, onChange }) => {
  return (
    <div>
      {/* readout */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span className="t-mono" style={{ fontSize: 64, fontWeight: 300, letterSpacing: '-0.04em' }}>
          {FN_TIME_SLOTS[idx]}
        </span>
        <span className="t-serif-it" style={{ fontSize: 20, color: 'var(--ink-2)', marginLeft: 6 }}>min</span>
      </div>

      {/* tick scale */}
      <div style={{ position: 'relative', padding: '4px 0 0' }}>
        <div className="rule" />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 12px' }}>
          {FN_TIME_SLOTS.map((t, i) => (
            <div key={i} className="tap" onClick={() => onChange(i)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
              <div style={{
                width: 1, height: i === idx ? 14 : 7,
                background: i === idx ? 'var(--accent-hi)' : 'var(--rule-strong)',
                transition: 'all .2s var(--ease)',
              }} />
              <span className="t-mono" style={{
                fontSize: 10,
                color: i === idx ? 'var(--accent-hi)' : 'var(--ink-3)',
                fontWeight: i === idx ? 600 : 400,
              }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* +/- nudge */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 6 }}>
        <button onClick={() => onChange(Math.max(0, idx - 1))} className="tap"
          style={{ width: 40, height: 36, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 2 }}>
          <FNIcon name="minus" size={16} color="var(--ink-1)" />
        </button>
        <button onClick={() => onChange(Math.min(FN_TIME_SLOTS.length - 1, idx + 1))} className="tap"
          style={{ width: 40, height: 36, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 2 }}>
          <FNIcon name="plus" size={16} color="var(--ink-1)" />
        </button>
      </div>
    </div>
  );
};

/* Muscle picker — grid of cells with selection state */
const FNMusclePicker = ({ selected, onToggle }) => {
  return (
    <div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1,
        background: 'var(--rule)',
        border: '1px solid var(--rule)',
      }}>
        {FN_MUSCLES.map((m, i) => {
          const on = selected.includes(m.id);
          return (
            <div key={m.id} className="tap" onClick={() => onToggle(m.id)}
              style={{
                background: on ? 'var(--ink-1)' : 'var(--card)',
                color: on ? 'var(--paper)' : 'var(--ink-1)',
                padding: '16px 12px',
                position: 'relative',
                transition: 'all .2s var(--ease)',
              }}>
              <div className="t-mono" style={{ fontSize: 9,
                color: on ? 'rgba(241,236,224,0.5)' : 'var(--ink-3)',
                letterSpacing: '0.16em', marginBottom: 4,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>{m.label}</div>
              <div className="t-mono" style={{ fontSize: 10, marginTop: 2,
                color: on ? 'rgba(241,236,224,0.5)' : 'var(--ink-2)',
              }}>
                {m.n} ex
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        marginTop: 10, fontSize: 11,
      }} className="t-mono">
        <span style={{ color: 'var(--ink-2)' }}>{selected.length} SELECTED</span>
        <span className="tap" style={{ color: 'var(--accent-hi)' }}
          onClick={() => onToggle('__clear__') /* handled below */ }>
        </span>
      </div>
    </div>
  );
};

/* Mode picker */
const FNModePicker = ({ mode, onChange }) => {
  const modes = [
    {
      id: 'def', label: 'Definition', note: 'compound → isolation',
      lines: ['8–15 reps', '60–90s rest', 'hypertrophy'],
    },
    {
      id: 'str', label: 'Strength', note: 'heaviest first',
      lines: ['3–6 reps', '2–3 min rest', 'force production'],
    },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {modes.map(m => {
        const on = mode === m.id;
        return (
          <div key={m.id} className="tap" onClick={() => onChange(m.id)}
            style={{
              border: on ? '1px solid var(--ink-1)' : '1px solid var(--rule)',
              background: on ? 'var(--ink-1)' : 'transparent',
              color: on ? 'var(--paper)' : 'var(--ink-1)',
              padding: '16px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all .2s var(--ease)',
            }}>
            <div>
              <div className="t-serif" style={{ fontSize: 24, fontWeight: 600 }}>{m.label}</div>
              <div className="t-mono" style={{ fontSize: 10, marginTop: 4,
                color: on ? 'rgba(241,236,224,0.6)' : 'var(--ink-2)',
              }}>{m.note.toUpperCase()}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'right' }}>
              {m.lines.map((l, i) => (
                <span key={i} className="t-mono" style={{
                  fontSize: 11,
                  color: on ? 'rgba(241,236,224,0.85)' : 'var(--ink-2)',
                }}>{l}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { FNBuild, FN_TIME_SLOTS, FN_MUSCLES });
