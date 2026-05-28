/* The Log — a journal of resets. Not a performance dashboard. */

const SA_LOG = [
  { d: '27', dow: 'Wed', month: 'May', mode: 'def', label: 'Chest & back', mood: 'Steady', dur: 62, today: true,  note: 'Felt the back open up by set three.' },
  { d: '25', dow: 'Mon', month: 'May', mode: 'def', label: 'Shoulders & arms', mood: 'Light', dur: 48, note: 'Quick reset. Sauna after.' },
  { d: '23', dow: 'Sat', month: 'May', mode: 'str', label: 'Legs',          mood: 'Heavy', dur: 78, note: 'Long one. Slept like the dead.' },
  { d: '21', dow: 'Thu', month: 'May', mode: 'def', label: 'Chest & back',  mood: 'Clear', dur: 60 },
  { d: '19', dow: 'Tue', month: 'May', mode: 'str', label: 'Legs',          mood: 'Steady', dur: 75 },
  { d: '17', dow: 'Sun', month: 'May', mode: 'def', label: 'Full body',     mood: 'Light', dur: 45 },
];

const SaLog = ({ state, set }) => {
  const { mode = 'def' } = state;

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />
      <SaTopBar mode={mode} onMenu={() => set({ tab: 'room' })} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px 8px' }}>
        <div className="sa-enter">
          <div className="sa-label" style={{ marginBottom: 12 }}>THE LOG</div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, marginBottom: 6 }}>
            What you've
          </div>
          <div className="sa-serif" style={{ fontSize: 38, lineHeight: 1, color: 'var(--sa-ink-2)' }}>
            <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>kept up with.</em>
          </div>
        </div>

        <div style={{ height: 32 }} />

        {/* Quiet at-a-glance — 3 numbers, no charts */}
        <div className="sa-panel sa-enter" style={{
          padding: '24px 18px', marginBottom: 24,
          animationDelay: '0.1s',
        }}>
          <div className="sa-label" style={{ fontSize: 9, textAlign: 'center', marginBottom: 16 }}>
            THE PAST FOUR WEEKS
          </div>
          <div style={{ display: 'flex', gap: 0 }}>
            <SaStat k="VISITS" v="14" light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="HOURS" v="12.5" light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="AVG MOOD" v="Steady" light />
          </div>
        </div>

        {/* Calendar — last 6 weeks as soft dots */}
        <div className="sa-enter" style={{ marginBottom: 36, animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span className="sa-label">SIX-WEEK PATTERN</span>
            <span className="sa-label" style={{ color: 'var(--sa-ink-3)' }}>3 / WEEK · STEADY</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8,
          }}>
            {/* Day headers */}
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={'h' + i} className="sa-label" style={{ fontSize: 9, textAlign: 'center', color: 'var(--sa-ink-4)' }}>{d}</div>
            ))}
            {/* 6 weeks * 7 days */}
            {Array.from({ length: 42 }).map((_, i) => {
              // Mock: definition green for many, strength amber for some, blanks
              const seed = (i * 17 + 5) % 11;
              const has = seed < 6;
              const isStr = has && seed % 3 === 0;
              const isToday = i === 39;
              const accent = isStr ? 'var(--sa-str)' : 'var(--sa-def)';
              const aura   = isStr ? 'var(--sa-str-glow)' : 'var(--sa-def-glow)';
              return (
                <div key={i} style={{
                  aspectRatio: '1',
                  borderRadius: 100,
                  background: has ? (isToday ? accent : 'transparent') : 'transparent',
                  border: '1px solid ' + (has ? accent : 'var(--sa-rule)'),
                  boxShadow: isToday ? '0 0 14px ' + aura : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {has && !isToday && <div style={{
                    width: 4, height: 4, borderRadius: 100,
                    background: accent, opacity: 0.7,
                  }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent visits */}
        <div className="sa-enter" style={{ animationDelay: '0.2s' }}>
          <div className="sa-label" style={{ marginBottom: 14 }}>RECENT VISITS</div>
          {SA_LOG.map((e, i) => (
            <div key={i} className="sa-tap" style={{
              display: 'flex', gap: 16, padding: '16px 0',
              borderBottom: i < SA_LOG.length - 1 ? '1px solid var(--sa-rule)' : 'none',
              alignItems: 'flex-start',
            }}>
              {/* Date column — Newsreader light */}
              <div style={{ textAlign: 'center', width: 52, flexShrink: 0 }}>
                <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginBottom: 2 }}>{e.dow.toUpperCase()}</div>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontWeight: 300,
                  fontSize: 32, lineHeight: 1, color: e.today ? 'var(--sa-accent)' : 'var(--sa-ink-1)',
                }}>{e.d}</div>
                <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginTop: 2 }}>{e.month.toUpperCase()}</div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 100,
                    background: e.mode === 'def' ? 'var(--sa-def)' : 'var(--sa-str)',
                  }} />
                  <span className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-2)' }}>
                    {e.mode === 'def' ? 'DEFINITION' : 'STRENGTH'}
                  </span>
                  {e.today && <span className="sa-serif-it" style={{ fontSize: 11, color: 'var(--sa-accent)' }}>· tonight</span>}
                </div>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontWeight: 400,
                  fontSize: 17, color: 'var(--sa-ink-1)', marginBottom: 4,
                  letterSpacing: '-0.005em',
                }}>{e.label}</div>
                {e.note && (
                  <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.4 }}>
                    "{e.note}"
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: 'Newsreader, serif', fontWeight: 300,
                  fontSize: 16, color: 'var(--sa-ink-1)',
                }}>{e.dur}<span style={{ color: 'var(--sa-ink-3)', fontSize: 12 }}>m</span></div>
                <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)', marginTop: 2 }}>{e.mood.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sa-enter sa-tap" style={{
          marginTop: 22, padding: '16px 24px',
          borderRadius: 100,
          border: '1px solid var(--sa-rule-hi)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          animationDelay: '0.3s',
        }}>
          <span className="sa-serif-it" style={{ fontSize: 14, color: 'var(--sa-ink-2)' }}>The full archive</span>
          <SaIcon name="arrowSm" size={14} color="var(--sa-ink-2)" />
        </div>

        <div style={{ height: 24 }} />
      </div>

      <SaDock tab="log" onTab={(t) => set({ tab: t })} />
    </div>
  );
};

Object.assign(window, { SaLog });
