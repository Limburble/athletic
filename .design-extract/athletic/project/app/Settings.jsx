/* Settings — equipment, banned exercises, about */

const FNSettings = ({ state, set, onClose }) => {
  const { mode = 'def', dark = false } = state;
  const setDark = (v) => set({ dark: v });
  const setMode = (m) => set({ mode: m });

  const equipment = [
    'Dumbbells (full rack)', 'Straight + curl bars', 'Flat + incline benches',
    'Preacher curl bench', 'Cable stations', 'Smith machine',
    'Leg press / curl / extension', 'Dip bars · pull-up bar',
  ];

  const banned = [
    'Hanging leg raises', 'Hanging knee raises', 'Reverse crunches', 'Cat-cow',
  ];

  return (
    <div className="fn-app" data-mode={mode} data-dark={dark}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid var(--rule)',
      }}>
        <span className="tap" onClick={onClose}>
          <FNIcon name="back" size={18} color="var(--ink-2)" />
        </span>
        <span className="t-label">SETTINGS</span>
        <span style={{ width: 18 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }}>
        {/* Athlete card */}
        <div style={{
          padding: '20px 18px', border: '1px solid var(--rule)',
          background: 'var(--card)', marginBottom: 24,
        }}>
          <div className="fn-serial" style={{ marginBottom: 8 }}>ATHLETE · ID-001</div>
          <div className="t-serif" style={{ fontSize: 32, lineHeight: 1, marginBottom: 12 }}>
            Brayden <span className="t-serif-it">L.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 14 }}>
            {[
              { k: 'HEIGHT', v: '5′10″' },
              { k: 'WEIGHT', v: '149 lb' },
              { k: 'GOAL',   v: 'Lean' },
            ].map((s, i) => (
              <div key={i}>
                <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.18em' }}>{s.k}</div>
                <div className="t-mono" style={{ fontSize: 15, marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Display */}
        <FNHead num={1} title="DISPLAY" />
        <div style={{ marginBottom: 28 }}>
          <SettingsRow k="Default mode" sub="Tap to switch">
            <div style={{ display: 'flex', gap: 0, border: '1px solid var(--rule)' }}>
              {['def','str'].map((m, i) => (
                <span key={m} className="tap" onClick={() => setMode(m)}
                  style={{
                    padding: '6px 12px',
                    background: mode === m ? 'var(--ink-1)' : 'transparent',
                    color: mode === m ? 'var(--paper)' : 'var(--ink-2)',
                    fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.12em',
                    borderRight: i < 1 ? '1px solid var(--rule)' : 'none',
                  }}>{m === 'def' ? 'DEF' : 'STR'}</span>
              ))}
            </div>
          </SettingsRow>
          <SettingsRow k="Surface" sub="Paper or ink">
            <div style={{ display: 'flex', gap: 0, border: '1px solid var(--rule)' }}>
              {[
                { id: false, label: 'PAPER' },
                { id: true,  label: 'INK'   },
              ].map((s, i) => (
                <span key={String(s.id)} className="tap" onClick={() => setDark(s.id)}
                  style={{
                    padding: '6px 12px',
                    background: dark === s.id ? 'var(--ink-1)' : 'transparent',
                    color: dark === s.id ? 'var(--paper)' : 'var(--ink-2)',
                    fontFamily: 'JetBrains Mono', fontSize: 11, letterSpacing: '0.12em',
                    borderRight: i < 1 ? '1px solid var(--rule)' : 'none',
                  }}>{s.label}</span>
              ))}
            </div>
          </SettingsRow>
          <SettingsRow k="Haptics" sub="Round transitions" toggle defaultOn />
          <SettingsRow k="Keep screen on" sub="During timer" toggle defaultOn />
        </div>

        {/* Equipment */}
        <FNHead num={2} title="GYM · CLUB GREENWOOD" />
        <div style={{ marginBottom: 28 }}>
          {equipment.map((e, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 0', borderBottom: '1px solid var(--rule)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FNIcon name="check" size={12} color="var(--accent-hi)" strokeWidth={2.2} />
                <span style={{ fontSize: 14 }}>{e}</span>
              </div>
            </div>
          ))}
          <button className="tap" style={{
            width: '100%', padding: '12px 0', marginTop: 10,
            background: 'transparent', border: '1px dashed var(--rule-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'JetBrains Mono', fontSize: 11,
            color: 'var(--ink-2)', letterSpacing: '0.14em', cursor: 'pointer',
          }}>
            <FNIcon name="plus_sm" size={12} color="var(--ink-2)" /> ADD EQUIPMENT
          </button>
        </div>

        {/* Banned */}
        <FNHead num={3} title="BANNED FROM ROTATION" right={
          <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{banned.length}</span>
        }/>
        <div style={{ marginBottom: 28 }}>
          {banned.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 0', borderBottom: '1px solid var(--rule)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  display: 'inline-flex', width: 14, height: 14,
                  alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--ink-3)',
                }}>
                  <FNIcon name="close" size={10} color="var(--ink-3)" strokeWidth={2.2} />
                </span>
                <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{b}</span>
              </div>
              <span className="t-mono tap" style={{ fontSize: 10, color: 'var(--accent-hi)' }}>UNBAN</span>
            </div>
          ))}
        </div>

        {/* About */}
        <FNHead num={4} title="ABOUT" />
        <div style={{ padding: '12px 0 0' }}>
          <div className="t-serif-it" style={{ fontSize: 17, lineHeight: 1.4, color: 'var(--ink-1)', marginBottom: 14 }}>
            "An instrument. Every element serves a function, and that function is immediately legible."
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>VERSION 2.0 · FIELD NOTES</span>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>BUILD 2026.05</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsRow = ({ k, sub, children, toggle, defaultOn }) => {
  const [on, setOn] = React.useState(defaultOn ?? false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid var(--rule)',
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{k}</div>
        {sub && <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-2)', marginTop: 2 }}>{sub.toUpperCase()}</div>}
      </div>
      {toggle ? (
        <div className="tap" onClick={() => setOn(!on)}
          style={{
            width: 44, height: 24, padding: 2,
            border: '1px solid var(--ink-1)',
            display: 'flex', alignItems: 'center',
            justifyContent: on ? 'flex-end' : 'flex-start',
            background: on ? 'var(--ink-1)' : 'transparent',
            transition: 'all .25s var(--ease)',
          }}>
          <div style={{ width: 16, height: 16,
            background: on ? 'var(--paper)' : 'var(--ink-1)',
            transition: 'all .25s var(--spring)',
          }} />
        </div>
      ) : children}
    </div>
  );
};

Object.assign(window, { FNSettings });
