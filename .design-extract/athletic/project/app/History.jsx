/* History — a coach's log book */

const FN_LOG = [
  { d: '27', dow: 'WED', m: 'MAY', mode: 'def', focus: 'Chest · Back',     dur: 60, sets: 24, current: true },
  { d: '26', dow: 'TUE', m: 'MAY', mode: 'str', focus: 'Legs',              dur: 75, sets: 18 },
  { d: '24', dow: 'SUN', m: 'MAY', mode: 'def', focus: 'Shoulders · Arms',  dur: 45, sets: 19 },
  { d: '22', dow: 'FRI', m: 'MAY', mode: 'def', focus: 'Chest · Back',      dur: 60, sets: 24 },
  { d: '20', dow: 'WED', m: 'MAY', mode: 'str', focus: 'Legs',              dur: 90, sets: 20 },
  { d: '18', dow: 'MON', m: 'MAY', mode: 'def', focus: 'Shoulders · Arms',  dur: 60, sets: 22 },
];

const FNHistory = ({ state, set }) => {
  const { mode = 'def', dark = false } = state;

  // Aggregate stats
  const last30 = { sessions: 14, hours: 12.5, sets: 312, streak: 5 };

  // Sparkline data (mock)
  const spark = [40, 55, 30, 60, 75, 45, 60, 70, 90, 60, 85, 60];

  return (
    <div className="fn-app" data-mode={mode} data-dark={dark}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FNTopBar mode={mode} onMenu={() => set({ tab: 'settings' })} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }}>
        <div className="fn-serial">VOL. I · LOG</div>
        <div className="t-serif" style={{ fontSize: 38, marginTop: 8, lineHeight: .95, marginBottom: 22 }}>
          The <span className="t-serif-it">record.</span>
        </div>

        {/* Aggregate strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid var(--rule)', background: 'var(--card)',
          marginBottom: 22,
        }}>
          {[
            { k: 'SESSIONS', v: last30.sessions },
            { k: 'HOURS',    v: last30.hours },
            { k: 'SETS',     v: last30.sets },
            { k: 'STREAK',   v: last30.streak },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '14px 8px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid var(--rule)' : 'none',
            }}>
              <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.18em' }}>{s.k}</div>
              <div className="t-mono" style={{ fontSize: 22, fontWeight: 300, marginTop: 4 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Sparkline chart */}
        <FNHead title="VOLUME · 12 WEEKS" right={<span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>SETS / WK</span>} />
        <div style={{
          height: 100, position: 'relative', marginBottom: 30,
          padding: '6px 0',
        }}>
          <svg width="100%" height="100%" viewBox="0 0 240 86" preserveAspectRatio="none"
            style={{ display: 'block' }}>
            {/* baseline */}
            <line x1="0" y1="83" x2="240" y2="83" stroke="var(--rule)" strokeWidth="1" />
            {/* bars */}
            {spark.map((v, i) => {
              const x = i * 20 + 5;
              const h = (v / 100) * 70;
              const y = 83 - h;
              const cur = i === spark.length - 1;
              return (
                <g key={i}>
                  <rect x={x} y={y} width="10" height={h}
                    fill={cur ? 'var(--accent-hi)' : 'var(--ink-1)'}
                    opacity={cur ? 1 : 0.85} />
                </g>
              );
            })}
          </svg>
          <div className="t-mono" style={{
            position: 'absolute', bottom: -16, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-between',
            fontSize: 9, color: 'var(--ink-3)',
          }}>
            <span>MAR</span><span>APR</span><span>MAY</span>
          </div>
        </div>

        {/* Log entries */}
        <FNHead title="SESSIONS · RECENT" />
        <div>
          {FN_LOG.map((e, i) => (
            <div key={i} className="tap" style={{
              display: 'grid', gridTemplateColumns: '64px 1fr auto',
              gap: 14, padding: '14px 0',
              borderBottom: '1px solid var(--rule)',
              alignItems: 'center',
              opacity: e.current ? 1 : 0.92,
            }}>
              {/* Date col */}
              <div style={{ textAlign: 'center' }}>
                <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.18em' }}>{e.dow}</div>
                <div className="t-mono" style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.1 }}>{e.d}</div>
                <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-3)' }}>{e.m}</div>
              </div>
              {/* Focus col */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    display: 'inline-block', width: 8, height: 8,
                    background: e.mode === 'def' ? 'var(--def-hi)' : 'var(--str-hi)',
                  }} />
                  <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-2)', letterSpacing: '0.14em' }}>
                    {e.mode === 'def' ? 'DEFINITION' : 'STRENGTH'}
                  </span>
                  {e.current && <span className="t-mono" style={{ fontSize: 10, color: 'var(--accent-hi)' }}>· TODAY</span>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em' }}>{e.focus}</div>
              </div>
              {/* Stats col */}
              <div style={{ textAlign: 'right' }}>
                <div className="t-mono" style={{ fontSize: 14 }}>{e.dur}<span style={{ color: 'var(--ink-3)' }}>min</span></div>
                <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>{e.sets} sets</div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <button className="tap" style={{
          width: '100%', padding: '14px 0', marginTop: 14,
          background: 'transparent', border: '1px solid var(--rule)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 15,
          color: 'var(--ink-1)', cursor: 'pointer',
        }}>
          See full archive <FNIcon name="arrow" size={14} color="var(--ink-1)" />
        </button>
      </div>

      <FNDock tab="log" onTab={(t) => set({ tab: t })} mode={mode} />
    </div>
  );
};

Object.assign(window, { FNHistory });
