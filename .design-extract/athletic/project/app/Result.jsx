/* Result — compiled workout — looks like a coach's prescription sheet */

const FN_SAMPLE_WORKOUT = {
  warmup: [
    { n: 'Treadmill walk',  d: '5 min',         z: '60% HR' },
    { n: 'Banded shoulders', d: '2 sets × 15',  z: '' },
  ],
  main: [
    // Chest
    { group: 'CHEST', items: [
      { n: 'Smith machine bench press', sets: '4 × 8',  rest: '90s', note: 'compound — open the chain' },
      { n: 'Incline dumbbell press',    sets: '3 × 10', rest: '75s', note: 'upper-chest emphasis' },
      { n: 'Pec deck fly',              sets: '3 × 12', rest: '60s', note: 'isolation finisher' },
    ]},
    { group: 'BACK', items: [
      { n: 'Lat pulldown — wide grip',  sets: '4 × 10', rest: '75s', note: 'lat width' },
      { n: 'Seated cable row',          sets: '3 × 10', rest: '75s', note: 'mid-back thickness' },
    ]},
  ],
  abs: {
    session: 'Heavy Plate Day',
    items: [
      { n: 'Weighted crunch · 35lb plate', sets: '4 × 10', rest: '60s' },
      { n: 'Russian twist · 25lb plate',   sets: '3 × 20', rest: '45s' },
      { n: 'Ab wheel rollout',             sets: '3 × 8',  rest: '60s' },
    ],
  },
  notes: 'Hypertrophy day. Stay one rep shy of failure on first set, push to failure on last.',
};

const FNResult = ({ state, set, onStart, onReset }) => {
  const { mode = 'def', dark = false } = state;
  const wk = FN_SAMPLE_WORKOUT;
  const [open, setOpen] = React.useState({});
  const toggle = (k) => setOpen({ ...open, [k]: !open[k] });

  const totalSets = wk.main.reduce((s, g) => s + g.items.length, 0) + wk.abs.items.length;
  const totalEx   = totalSets;

  return (
    <div className="fn-app" data-mode={mode} data-dark={dark}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FNTopBar mode={mode} onMenu={() => set({ tab: 'settings' })}
        right={
          <span className="tap" onClick={onReset}>
            <FNIcon name="close" size={18} color="var(--ink-2)" />
          </span>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }}>
        {/* Masthead */}
        <div style={{ marginBottom: 22 }}>
          <div className="fn-serial">PRESCRIPTION · WED, MAY 27</div>
          <div className="t-serif" style={{ fontSize: 38, marginTop: 8, lineHeight: .95 }}>
            Chest & <span className="t-serif-it">back</span>,<br/>
            <span style={{ color: 'var(--accent-hi)' }}>definition.</span>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid var(--rule)', background: 'var(--card)',
          marginBottom: 28,
        }}>
          {[
            { k: 'TIME',  v: '60', sub: 'min' },
            { k: 'EX',    v: totalEx, sub: '' },
            { k: 'SETS',  v: '24', sub: '' },
            { k: 'MODE',  v: 'DEF', sub: '' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '14px 8px',
              borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
              textAlign: 'center',
            }}>
              <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.18em' }}>{s.k}</div>
              <div className="t-mono" style={{ fontSize: 22, fontWeight: 300, color: 'var(--ink-1)', marginTop: 4 }}>{s.v}</div>
              {s.sub && <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Warmup */}
        <FNHead num={1} title="WARMUP" right={<span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>~5 MIN</span>} />
        <div style={{ marginBottom: 30 }}>
          {wk.warmup.map((w, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 0', borderBottom: '1px solid var(--rule)',
            }}>
              <span style={{ fontSize: 14 }}>{w.n}</span>
              <span className="t-mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{w.d} {w.z && `· ${w.z}`}</span>
            </div>
          ))}
        </div>

        {/* Main */}
        <FNHead num={2} title="MAIN BLOCK" right={<span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>~45 MIN</span>} />
        <div style={{ marginBottom: 30 }}>
          {wk.main.map((g, gi) => (
            <div key={gi} style={{ marginBottom: gi < wk.main.length - 1 ? 18 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span className="t-serif-it" style={{ fontSize: 19, color: 'var(--accent-hi)' }}>{g.group.toLowerCase()}.</span>
                <span className="t-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.16em' }}>
                  {g.items.length} EXERCISES
                </span>
              </div>
              {g.items.map((ex, ei) => {
                const k = `${gi}-${ei}`;
                const isOpen = open[k];
                return (
                  <div key={ei} style={{ borderBottom: '1px solid var(--rule)' }}>
                    <div className="tap" onClick={() => toggle(k)}
                      style={{ display: 'flex', alignItems: 'center',
                        padding: '12px 0', gap: 12,
                      }}>
                      <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-3)', minWidth: 22 }}>
                        {String(ei + 1).padStart(2, '0')}
                      </span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{ex.n}</span>
                      <span className="t-mono" style={{ fontSize: 12, color: 'var(--ink-1)' }}>{ex.sets}</span>
                      <FNIcon name={isOpen ? 'chevU' : 'chevD'} size={12} color="var(--ink-3)" />
                    </div>
                    {isOpen && (
                      <div className="fn-fade" style={{
                        padding: '0 0 14px 34px',
                        display: 'flex', flexDirection: 'column', gap: 6,
                      }}>
                        <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                          <span className="t-serif-it">{ex.note}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 18 }}>
                          <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                            REST · <span style={{ color: 'var(--ink-1)' }}>{ex.rest}</span>
                          </span>
                          <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
                            RPE · <span style={{ color: 'var(--ink-1)' }}>7–8</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Abs */}
        <FNHead num={3} title="CORE" right={<span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>~8 MIN</span>} />
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span className="t-serif-it" style={{ fontSize: 19, color: 'var(--accent-hi)' }}>{wk.abs.session.toLowerCase()}.</span>
          </div>
          {wk.abs.items.map((ex, ei) => (
            <div key={ei} style={{
              display: 'flex', alignItems: 'center', padding: '12px 0',
              gap: 12, borderBottom: '1px solid var(--rule)',
            }}>
              <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-3)', minWidth: 22 }}>
                {String(ei + 1).padStart(2, '0')}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{ex.n}</span>
              <span className="t-mono" style={{ fontSize: 12 }}>{ex.sets}</span>
            </div>
          ))}
        </div>

        {/* Pre-config HIIT button */}
        <button className="tap" onClick={onStart}
          style={{
            width: '100%', marginTop: 8,
            padding: '14px 16px',
            background: 'transparent',
            border: '1px dashed var(--rule-strong)',
            color: 'var(--accent-hi)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <span className="t-mono" style={{ fontSize: 10, letterSpacing: '0.16em' }}>QUEUE TO TIMER</span>
            <span className="t-serif-it" style={{ fontSize: 14, color: 'var(--ink-1)' }}>40s work · 20s rest · 4 rounds</span>
          </div>
          <FNIcon name="arrow" size={18} color="var(--accent-hi)" />
        </button>

        {/* Coach notes */}
        <div style={{ marginTop: 28, padding: '16px 16px', background: 'var(--paper-2)' }}>
          <div className="t-label" style={{ marginBottom: 6 }}>NOTE FROM COACH</div>
          <div className="t-serif-it" style={{ fontSize: 15, lineHeight: 1.35, color: 'var(--ink-1)' }}>
            "{wk.notes}"
          </div>
        </div>
      </div>

      {/* Start CTA — sticky */}
      <div style={{ padding: '12px 20px 14px', borderTop: '1px solid var(--rule)', background: 'var(--paper)' }}>
        <button className="fn-cta accent" onClick={onStart}>
          <span>Start session</span>
          <FNIcon name="play" size={20} color="var(--paper)" />
        </button>
      </div>

      <FNDock tab="build" onTab={(t) => set({ tab: t, compiled: false })} mode={mode} />
    </div>
  );
};

Object.assign(window, { FNResult });
