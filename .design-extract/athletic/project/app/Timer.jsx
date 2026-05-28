/* Timer — config screen + fullscreen running takeover */

const FNTimerConfig = ({ state, set, onStart }) => {
  const { mode = 'def', dark = false } = state;
  const [work, setWork]     = React.useState(state.hiitWork  ?? 40);
  const [rest, setRest]     = React.useState(state.hiitRest  ?? 20);
  const [rounds, setRounds] = React.useState(state.hiitRounds ?? 4);
  const [hiitMode, setHm]   = React.useState(state.hiitMode  ?? 'free'); // 'free' | 'queue'
  const [queue]             = React.useState([
    'Weighted crunch', 'Russian twist', 'Mountain climb', 'Ab wheel rollout',
  ]);

  const total = (work + rest) * rounds;
  const m = Math.floor(total / 60);
  const s = total % 60;

  const Stepper = ({ value, set, min = 5, max = 600, step = 5, suffix }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button onClick={() => set(Math.max(min, value - step))}
        style={{ width: 36, height: 36, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 2 }}>
        <FNIcon name="minus" size={14} color="var(--ink-1)" />
      </button>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="t-mono" style={{ fontSize: 36, fontWeight: 300, letterSpacing: '-0.04em' }}>
          {String(value).padStart(2,'0')}
        </span>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>{suffix}</span>
      </div>
      <button onClick={() => set(Math.min(max, value + step))}
        style={{ width: 36, height: 36, border: '1px solid var(--rule)', background: 'transparent', borderRadius: 2 }}>
        <FNIcon name="plus" size={14} color="var(--ink-1)" />
      </button>
    </div>
  );

  return (
    <div className="fn-app" data-mode={mode} data-dark={dark}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FNTopBar mode={mode} onMenu={() => set({ tab: 'settings' })} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }}>
        <div className="fn-serial">TIMER · CONFIG</div>
        <div className="t-serif" style={{ fontSize: 38, marginTop: 8, lineHeight: .95, marginBottom: 24 }}>
          HIIT <span className="t-serif-it">queue.</span>
        </div>

        {/* Mode switch */}
        <div style={{ display: 'flex', gap: 0, border: '1px solid var(--rule)', marginBottom: 24 }}>
          {[
            { id: 'free',  label: 'Free' },
            { id: 'queue', label: 'Exercise queue' },
          ].map((t, i) => {
            const on = hiitMode === t.id;
            return (
              <div key={t.id} className="tap" onClick={() => setHm(t.id)}
                style={{
                  flex: 1, padding: '11px 8px', textAlign: 'center',
                  background: on ? 'var(--ink-1)' : 'transparent',
                  color: on ? 'var(--paper)' : 'var(--ink-2)',
                  borderRight: i < 1 ? '1px solid var(--rule)' : 'none',
                  fontFamily: 'Fraunces, serif', fontSize: 16, fontStyle: on ? 'italic' : 'normal',
                  fontWeight: on ? 600 : 500,
                }}>
                {t.label}
              </div>
            );
          })}
        </div>

        {/* Big duration readout */}
        <div style={{
          border: '1px solid var(--rule)', background: 'var(--card)',
          padding: '24px 18px', marginBottom: 20, textAlign: 'center',
        }}>
          <div className="t-label" style={{ marginBottom: 8 }}>TOTAL DURATION</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
            <span className="t-mono" style={{ fontSize: 64, fontWeight: 300, letterSpacing: '-0.04em' }}>
              {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
            </span>
          </div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-2)', marginTop: 6 }}>
            {rounds} ROUNDS · {work}s WORK · {rest}s REST
          </div>
        </div>

        {/* Steppers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span className="t-label">WORK</span>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>SECONDS</span>
            </div>
            <Stepper value={work}   set={setWork}   suffix="s" />
          </div>
          <div className="rule" />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span className="t-label">REST</span>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>SECONDS</span>
            </div>
            <Stepper value={rest}   set={setRest}   suffix="s" />
          </div>
          <div className="rule" />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span className="t-label">ROUNDS</span>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>×</span>
            </div>
            <Stepper value={rounds} set={setRounds} min={1} max={30} step={1} suffix="x" />
          </div>
        </div>

        {/* Queue list (only in queue mode) */}
        {hiitMode === 'queue' && (
          <div>
            <FNHead title="QUEUE" right={
              <span className="t-mono tap" style={{ fontSize: 10, color: 'var(--accent-hi)' }}>EDIT</span>
            } />
            {queue.map((q, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '12px 0',
                borderBottom: '1px solid var(--rule)', gap: 12,
              }}>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  {String(i + 1).padStart(2,'0')}
                </span>
                <span style={{ flex: 1, fontSize: 14 }}>{q}</span>
                <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>{work}s</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 14px', borderTop: '1px solid var(--rule)', background: 'var(--paper)' }}>
        <button className="fn-cta accent" onClick={onStart}>
          <span>Start timer</span>
          <FNIcon name="play" size={20} color="var(--paper)" />
        </button>
      </div>

      <FNDock tab="timer" onTab={(t) => set({ tab: t })} mode={mode} />
    </div>
  );
};


/* Timer fullscreen — color-floods, single giant number, ink-on-ink */
const FNTimerRun = ({ state, set, onClose }) => {
  const { mode = 'def', dark = true, phase = 'work', timeLeft = 28, totalRound = 40, round = 2, totalRounds = 4 } = state;
  const exName = state.exName ?? 'Russian twist';

  // Phase + mode color
  const isWork = phase === 'work';
  const isRest = phase === 'rest';
  const isDone = phase === 'done';

  let bg, ink, sub, accentBar;
  if (isDone) {
    bg = '#0a0a0a'; ink = '#fff'; sub = 'rgba(255,255,255,.55)'; accentBar = 'var(--accent-hi)';
  } else if (mode === 'def') {
    bg = isWork ? '#0d2a18' : '#0d1018';
    ink = isWork ? '#a8d09a' : '#cfd2c8';
    sub = 'rgba(255,255,255,.45)';
    accentBar = '#7ab26a';
  } else {
    bg = isWork ? '#2a1408' : '#15110a';
    ink = isWork ? '#e6b075' : '#d2cdbb';
    sub = 'rgba(255,255,255,.45)';
    accentBar = '#e09a45';
  }

  const pct = Math.min(100, Math.max(0, (1 - timeLeft / totalRound) * 100));

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: bg, color: ink,
      display: 'flex', flexDirection: 'column',
      transition: 'background .55s var(--ease), color .35s var(--ease)',
      zIndex: 50,
      overflow: 'hidden',
    }}>
      {/* Top: progress strip + close */}
      <div style={{
        height: 2, background: 'rgba(255,255,255,.06)', position: 'relative',
        marginTop: 'env(safe-area-inset-top)',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct}%`, background: accentBar,
          transition: 'width .9s linear',
        }} />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 18px',
      }}>
        <span className="tap" onClick={onClose}>
          <FNIcon name="close" size={20} color={sub} />
        </span>
        <span className="t-mono" style={{ fontSize: 11, color: sub, letterSpacing: '0.16em' }}>
          {mode === 'def' ? 'DEFINITION' : 'STRENGTH'} · {phase.toUpperCase()}
        </span>
        <span style={{ width: 20 }} />
      </div>

      {/* Center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '0 20px',
      }}>
        <div className="t-label" style={{ color: sub, marginBottom: 12 }}>
          {isWork ? 'WORK' : isRest ? 'REST' : 'COMPLETE'}
        </div>

        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontVariantNumeric: 'tabular-nums',
          fontSize: 240, fontWeight: 200, lineHeight: 0.9,
          letterSpacing: '-0.06em', color: ink,
        }}>
          {String(timeLeft).padStart(2,'0')}
        </div>

        <div className="t-serif-it" style={{ fontSize: 22, color: sub, marginTop: 20 }}>
          {isDone ? 'done.' : exName}
        </div>
      </div>

      {/* Round counter */}
      <div style={{ textAlign: 'center', padding: '0 0 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div key={i} style={{
              width: 22, height: 2,
              background: i < round ? accentBar : 'rgba(255,255,255,.15)',
            }} />
          ))}
        </div>
        <div className="t-mono" style={{ fontSize: 11, color: sub, marginTop: 8 }}>
          ROUND {round} / {totalRounds}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '20px 24px 30px',
        borderTop: '1px solid rgba(255,255,255,.08)',
      }}>
        <button className="tap"
          style={{ width: 52, height: 52, borderRadius: 0, border: '1px solid rgba(255,255,255,.15)',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FNIcon name="reset" size={20} color={ink} />
        </button>
        <button className="tap"
          style={{ width: 84, height: 84, borderRadius: 0,
            border: 'none', background: accentBar,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FNIcon name="pause" size={28} color="#0a0a0a" />
        </button>
        <button className="tap"
          style={{ width: 52, height: 52, borderRadius: 0, border: '1px solid rgba(255,255,255,.15)',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FNIcon name="skip" size={20} color={ink} />
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { FNTimerConfig, FNTimerRun });
