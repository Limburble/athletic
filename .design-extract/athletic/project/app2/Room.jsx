/* The Room — settings. Tuning the atmosphere. Quiet. */

const SaRoom = ({ state, set, onClose }) => {
  const { mode = 'def', light = false } = state;
  const [haptics, setHaptics]   = React.useState(true);
  const [ambient, setAmbient]   = React.useState(true);
  const [hydration, setHyd]     = React.useState(true);
  const [keepOn, setKeepOn]     = React.useState(true);

  return (
    <div className="sa-app" data-sa-mode={mode} data-sa-light={light}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-tap" onClick={onClose}>
          <SaIcon name="back" size={20} color="var(--sa-ink-2)" />
        </span>
        <span className="sa-label">The Room</span>
        <span style={{ width: 20 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 28px 28px' }}>
        <div className="sa-enter" style={{ marginBottom: 28 }}>
          <div className="sa-serif" style={{ fontSize: 32, marginBottom: 8 }}>
            Tune the <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>atmosphere.</em>
          </div>
          <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.55 }}>
            Small adjustments to how the room feels.
          </div>
        </div>

        {/* Athlete card */}
        <div className="sa-panel sa-enter" style={{
          padding: '22px 24px', marginBottom: 24,
          animationDelay: '0.1s',
        }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 10 }}>WHOSE ROOM</div>
          <div className="sa-serif" style={{ fontSize: 26, marginBottom: 4 }}>
            Brayden <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>L.</em>
          </div>
          <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)', marginBottom: 16 }}>
            5'10" · 149 lb · Club Greenwood
          </div>
          <div style={{ display: 'flex', gap: 0,
            paddingTop: 16, borderTop: '1px solid var(--sa-rule)' }}>
            <SaStat k="VISITS" v="142" light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="DAYS IN" v="294" light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="STREAK" v="5" light />
          </div>
        </div>

        {/* Atmosphere */}
        <SaRoomSection title="Atmosphere" delay={0.15}>
          <SaRoomRow k="Light" sub="Dusk by default. Morning when bright.">
            <div style={{ display: 'flex', gap: 0,
              background: 'var(--sa-bg-2)',
              border: '1px solid var(--sa-rule)',
              borderRadius: 100, padding: 3,
            }}>
              {[
                { id: false, ico: 'moon', label: 'Dusk' },
                { id: true,  ico: 'sun',  label: 'Morning' },
              ].map(o => {
                const on = light === o.id;
                return (
                  <span key={String(o.id)} className="sa-tap"
                    onClick={() => set({ light: o.id })}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px',
                      borderRadius: 100,
                      background: on ? 'var(--sa-accent)' : 'transparent',
                      color: on ? '#14110e' : 'var(--sa-ink-2)',
                      fontFamily: 'Newsreader, serif',
                      fontSize: 12,
                      fontStyle: on ? 'italic' : 'normal',
                      transition: 'all 0.55s var(--sa-settle)',
                    }}>
                    <SaIcon name={o.ico} size={12} color={on ? '#14110e' : 'currentColor'} />
                    {o.label}
                  </span>
                );
              })}
            </div>
          </SaRoomRow>
          <SaRoomRow k="Default mode" sub="The starting tempo.">
            <div style={{ display: 'flex', gap: 0,
              background: 'var(--sa-bg-2)',
              border: '1px solid var(--sa-rule)',
              borderRadius: 100, padding: 3,
            }}>
              {['def','str'].map(m => {
                const on = mode === m;
                return (
                  <span key={m} className="sa-tap"
                    onClick={() => set({ mode: m })}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 100,
                      background: on ? 'var(--sa-accent)' : 'transparent',
                      color: on ? '#14110e' : 'var(--sa-ink-2)',
                      fontFamily: 'Newsreader, serif',
                      fontStyle: on ? 'italic' : 'normal',
                      fontSize: 12,
                    }}>{m === 'def' ? 'Definition' : 'Strength'}</span>
                );
              })}
            </div>
          </SaRoomRow>
          <SaRoomRow k="Ambient motion" sub="The slow breathing of the room." last>
            <SaSwitch on={ambient} onChange={setAmbient} />
          </SaRoomRow>
        </SaRoomSection>

        {/* Care */}
        <SaRoomSection title="Care" delay={0.2}>
          <SaRoomRow k="Hydration nudge" sub="A quiet reminder after each visit.">
            <SaSwitch on={hydration} onChange={setHyd} />
          </SaRoomRow>
          <SaRoomRow k="Haptics" sub="Soft taps between phases.">
            <SaSwitch on={haptics} onChange={setHaptics} />
          </SaRoomRow>
          <SaRoomRow k="Keep screen on" sub="During timer only." last>
            <SaSwitch on={keepOn} onChange={setKeepOn} />
          </SaRoomRow>
        </SaRoomSection>

        {/* Gym */}
        <SaRoomSection title="What's in your gym" delay={0.25}>
          <SaRoomRow k="Club Greenwood" sub="Dumbbells, cables, smith, benches. Set up." chev last />
        </SaRoomSection>

        <SaRoomSection title="Boundaries" delay={0.3}>
          <SaRoomRow k="What you won't do" sub="4 exercises banned from rotation." chev />
          <SaRoomRow k="Notification quiet" sub="9pm — 7am. Always." chev last />
        </SaRoomSection>

        {/* Closing line */}
        <div className="sa-enter" style={{
          marginTop: 36, padding: '24px 22px',
          textAlign: 'center',
          animationDelay: '0.35s',
        }}>
          <div className="sa-serif-it" style={{ fontSize: 15, color: 'var(--sa-ink-2)', marginBottom: 12, lineHeight: 1.5 }}>
            "An instrument. Every element serves a function,
            and that function is immediately legible."
          </div>
          <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)' }}>
            VERSION 2.0 · THE SANCTUARY · 2026
          </div>
        </div>
      </div>
    </div>
  );
};

const SaRoomSection = ({ title, children, delay = 0 }) => (
  <div className="sa-enter" style={{ marginBottom: 24, animationDelay: `${delay}s` }}>
    <div className="sa-label" style={{ marginBottom: 10, fontSize: 9, paddingLeft: 4 }}>
      {title.toUpperCase()}
    </div>
    <div style={{
      background: 'var(--sa-bg-elev)',
      border: '1px solid var(--sa-rule)',
      borderRadius: 22,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  </div>
);

const SaRoomRow = ({ k, sub, children, chev, last }) => (
  <div className="sa-tap" style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: last ? 'none' : '1px solid var(--sa-rule)',
    gap: 14,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 15,
        color: 'var(--sa-ink-1)', letterSpacing: '-0.005em', marginBottom: sub ? 3 : 0,
      }}>{k}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--sa-ink-3)', lineHeight: 1.45 }}>{sub}</div>}
    </div>
    {chev ? <SaIcon name="chevR" size={14} color="var(--sa-ink-3)" /> : children}
  </div>
);

Object.assign(window, { SaRoom });
