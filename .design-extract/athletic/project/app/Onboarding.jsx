/* Onboarding — three calm screens */

const FNOnboarding = ({ slide = 0, onAdvance }) => {
  if (slide === 0) return <FNOnboard0 onAdvance={onAdvance} />;
  if (slide === 1) return <FNOnboard1 onAdvance={onAdvance} />;
  return <FNOnboard2 onAdvance={onAdvance} />;
};

/* Slide 0 — wordmark + tagline + tap to continue */
const FNOnboard0 = ({ onAdvance }) => (
  <div className="fn-app" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'flex-start',
      padding: '0 28px',
    }}>
      <div className="fn-fade">
        <div className="fn-serial" style={{ marginBottom: 16 }}>VOL. I · ED. 2026</div>
        <FNWordmark size={60} />
        <div className="t-serif-it" style={{
          fontSize: 20, color: 'var(--ink-2)', marginTop: 18, lineHeight: 1.2,
        }}>
          Your training,<br/>structured.
        </div>
      </div>
    </div>

    <div style={{ padding: '0 28px 40px' }}>
      <div className="fn-fade" style={{ animationDelay: '.2s' }}>
        <div className="rule" style={{ marginBottom: 22 }}/>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 28,
        }}>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>FOR · BRAYDEN</span>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>EST. 2026</span>
        </div>
        <button className="fn-cta" onClick={onAdvance}>
          <span>Begin</span>
          <FNIcon name="arrow" size={22} color="var(--paper)" />
        </button>
      </div>
    </div>
  </div>
);

/* Slide 1 — Philosophy: the three pillars (def vs str, ab pool, no rings) */
const FNOnboard1 = ({ onAdvance }) => {
  const items = [
    { num: 'I',   k: 'TWO MODES',  label: 'Definition · Strength', body: 'Different exercise order, different rep schemes, different rest. Pick one each session.' },
    { num: 'II',  k: 'YOUR POOL',  label: '57 exercises · 5 ab sessions', body: 'Built for Club Greenwood. Cable rows, smith, dumbbells. No machines you do not have.' },
    { num: 'III', k: 'NO RINGS',   label: 'The whole screen is the timer', body: 'Color floods green for work, dark for rest. One number. No fuss.' },
  ];
  return (
    <div className="fn-app" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '32px 24px 0' }}>
        <div className="fn-serial">A FIELD GUIDE · 01 / 02</div>
        <div className="t-serif" style={{ fontSize: 44, marginTop: 18, lineHeight: 1 }}>
          The <span className="t-serif-it">instrument.</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '36px 24px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map((it, i) => (
          <div key={i} className="fn-fade" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
              <span className="t-serif-it" style={{ fontSize: 26, color: 'var(--accent-hi)', minWidth: 32 }}>{it.num}.</span>
              <span className="t-label" style={{ color: 'var(--ink-1)' }}>{it.k}</span>
            </div>
            <div style={{ marginLeft: 48 }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{it.label}</div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)', textWrap: 'pretty' }}>{it.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 24px 36px' }}>
        <button className="fn-cta" onClick={onAdvance}>
          <span>Continue</span>
          <FNIcon name="arrow" size={22} color="var(--paper)" />
        </button>
      </div>
    </div>
  );
};

/* Slide 2 — set yourself up: pick default mode + dark */
const FNOnboard2 = ({ onAdvance }) => {
  const [mode, setMode] = React.useState('def');
  const [dark, setDark] = React.useState(false);

  return (
    <div className="fn-app" data-mode={mode} data-dark={dark}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '32px 24px 24px' }}>
        <div className="fn-serial">A FIELD GUIDE · 02 / 02</div>
        <div className="t-serif" style={{ fontSize: 40, marginTop: 18, lineHeight: 1 }}>
          Tune the <span className="t-serif-it">defaults.</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '12px 24px 0', display: 'flex', flexDirection: 'column', gap: 30 }}>
        {/* Mode picker */}
        <div>
          <FNHead num={1} title="Default mode" />
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { id: 'def', label: 'Definition', body: '8–15 reps · 60–90s rest' },
              { id: 'str', label: 'Strength',   body: '3–6 reps · 2–3 min rest' },
            ].map(m => (
              <div key={m.id} className="tap" onClick={() => setMode(m.id)}
                style={{
                  flex: 1,
                  border: mode === m.id ? '1px solid var(--ink-1)' : '1px solid var(--rule)',
                  background: mode === m.id ? 'var(--ink-1)' : 'transparent',
                  color: mode === m.id ? 'var(--paper)' : 'var(--ink-1)',
                  padding: '16px 14px',
                  borderRadius: 2,
                  transition: 'all .25s var(--ease)',
                }}>
                <div className="t-serif" style={{ fontSize: 22 }}>{m.label}</div>
                <div className="t-mono" style={{ fontSize: 10, marginTop: 6,
                  color: mode === m.id ? 'rgba(241,236,224,0.6)' : 'var(--ink-2)' }}>
                  {m.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surface */}
        <div>
          <FNHead num={2} title="Surface" />
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { id: false, label: 'Paper', body: 'Daylight legibility' },
              { id: true,  label: 'Ink',   body: 'Gym-bag friendly' },
            ].map(s => (
              <div key={String(s.id)} className="tap" onClick={() => setDark(s.id)}
                style={{
                  flex: 1,
                  border: dark === s.id ? '1px solid var(--ink-1)' : '1px solid var(--rule)',
                  background: dark === s.id ? 'var(--ink-1)' : 'transparent',
                  color: dark === s.id ? 'var(--paper)' : 'var(--ink-1)',
                  padding: '16px 14px',
                  borderRadius: 2,
                }}>
                <div className="t-serif" style={{ fontSize: 22 }}>{s.label}</div>
                <div className="t-mono" style={{ fontSize: 10, marginTop: 6,
                  color: dark === s.id ? 'rgba(241,236,224,0.6)' : 'var(--ink-2)' }}>
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />
      </div>

      <div style={{ padding: '0 24px 36px' }}>
        <button className="fn-cta accent" onClick={onAdvance}>
          <span>Start training</span>
          <FNIcon name="arrow" size={22} color="var(--paper)" />
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { FNOnboarding });
