/* Check-in — a gentle weekly ritual. Appears at the first session of each
 * 7-day period. Sits between Tonight and the Path.
 * Two minutes. Skippable. Designed to feel like a friendly hotel check-in. */

const SaCheckin = ({ state, set, onClose }) => {
  const { mode = 'def' } = state;

  const [weight, setWeight]     = React.useState(149);
  const [heightOpen, setHO]     = React.useState(false);
  const [heightFt, setHF]       = React.useState(5);
  const [heightIn, setHI]       = React.useState(10);
  const [arrived, setArrived]   = React.useState(null);
  const [aches, setAches]       = React.useState([]);
  const [sleep, setSleep]       = React.useState(3);
  const [intention, setInt]     = React.useState('');

  const toggleAche = (id) => setAches(aches.includes(id) ? aches.filter(x => x !== id) : [...aches, id]);

  const arrivedOpts = [
    { id: 'rested',  label: 'Rested' },
    { id: 'even',    label: 'Even' },
    { id: 'tired',   label: 'Tired' },
    { id: 'wrecked', label: 'Wrecked' },
  ];
  const acheOpts = [
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'midback',   label: 'Mid-back' },
    { id: 'lowback',   label: 'Lower back' },
    { id: 'knees',     label: 'Knees' },
    { id: 'hips',      label: 'Hips' },
    { id: 'clear',     label: 'All clear' },
  ];
  const sleepLabels = ['Rough', 'Restless', 'Okay', 'Solid', 'Deep'];

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      {/* Quiet header — no full top bar; this is a moment apart */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)' }}>
          WEEK OF MAY 25
        </span>
        <span className="sa-tap" onClick={onClose}>
          <SaIcon name="close" size={18} color="var(--sa-ink-3)" />
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 28px 180px' }}>
        {/* Greeting */}
        <div className="sa-enter" style={{ marginBottom: 28 }}>
          <div className="sa-label" style={{ marginBottom: 14 }}>A SMALL CHECK-IN</div>
          <div className="sa-serif" style={{ fontSize: 36, lineHeight: 1.05, marginBottom: 6 }}>
            Seven <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>days</em>
          </div>
          <div className="sa-serif" style={{ fontSize: 36, lineHeight: 1.05, color: 'var(--sa-ink-2)' }}>
            in.
          </div>
          <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.55, marginTop: 14, maxWidth: 300 }}>
            Two minutes. We'll know you a little better.
            Skip anything you don't feel like.
          </div>
        </div>

        {/* ─── 01 · The body ─── */}
        <SaCheckSection n="I" label="The body" delay={0.1}>
          {/* Weight — big readout with subtle nudges */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 22px',
            borderBottom: '1px solid var(--sa-rule)',
          }}>
            <div>
              <div className="sa-label" style={{ fontSize: 9, marginBottom: 6 }}>WEIGHT</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 300, fontSize: 32, lineHeight: 1 }}>
                {weight}<span style={{ fontStyle: 'italic', color: 'var(--sa-ink-2)', fontSize: 18, marginLeft: 4 }}>lb</span>
              </div>
              <div className="sa-serif-it" style={{ fontSize: 11, color: 'var(--sa-ink-3)', marginTop: 4 }}>
                same as last week
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="sa-tap" onClick={() => setWeight(w => w - 1)}
                style={{
                  width: 38, height: 38, borderRadius: 100,
                  border: '1px solid var(--sa-rule-hi)',
                  background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <SaIcon name="minus" size={14} color="var(--sa-ink-2)" />
              </button>
              <button className="sa-tap" onClick={() => setWeight(w => w + 1)}
                style={{
                  width: 38, height: 38, borderRadius: 100,
                  border: '1px solid var(--sa-rule-hi)',
                  background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <SaIcon name="plus" size={14} color="var(--sa-ink-2)" />
              </button>
            </div>
          </div>

          {/* Height — collapsed by default */}
          <div className="sa-tap" onClick={() => setHO(!heightOpen)}
            style={{
              padding: '16px 22px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
            <div>
              <div className="sa-label" style={{ fontSize: 9, marginBottom: 4 }}>HEIGHT</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 17 }}>
                  {heightFt}′{heightIn}″
                </span>
                <span className="sa-serif-it" style={{ fontSize: 12, color: 'var(--sa-ink-3)' }}>
                  rarely changes — tap if it has
                </span>
              </div>
            </div>
            <SaIcon name={heightOpen ? 'chevD' : 'chevR'} size={14} color="var(--sa-ink-3)" />
          </div>

          {heightOpen && (
            <div className="sa-enter" style={{
              padding: '0 22px 18px',
              display: 'flex', gap: 14,
            }}>
              <div style={{ flex: 1 }}>
                <div className="sa-label" style={{ fontSize: 9, marginBottom: 6 }}>FEET</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="sa-tap" onClick={() => setHF(Math.max(4, heightFt - 1))}
                    style={{ width: 30, height: 30, borderRadius: 100, border: '1px solid var(--sa-rule-hi)', background: 'transparent' }}>
                    <SaIcon name="minus" size={12} color="var(--sa-ink-2)" />
                  </button>
                  <span style={{ fontFamily: 'Newsreader, serif', fontSize: 20, flex: 1, textAlign: 'center' }}>{heightFt}</span>
                  <button className="sa-tap" onClick={() => setHF(Math.min(7, heightFt + 1))}
                    style={{ width: 30, height: 30, borderRadius: 100, border: '1px solid var(--sa-rule-hi)', background: 'transparent' }}>
                    <SaIcon name="plus" size={12} color="var(--sa-ink-2)" />
                  </button>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="sa-label" style={{ fontSize: 9, marginBottom: 6 }}>INCHES</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="sa-tap" onClick={() => setHI(Math.max(0, heightIn - 1))}
                    style={{ width: 30, height: 30, borderRadius: 100, border: '1px solid var(--sa-rule-hi)', background: 'transparent' }}>
                    <SaIcon name="minus" size={12} color="var(--sa-ink-2)" />
                  </button>
                  <span style={{ fontFamily: 'Newsreader, serif', fontSize: 20, flex: 1, textAlign: 'center' }}>{heightIn}</span>
                  <button className="sa-tap" onClick={() => setHI(Math.min(11, heightIn + 1))}
                    style={{ width: 30, height: 30, borderRadius: 100, border: '1px solid var(--sa-rule-hi)', background: 'transparent' }}>
                    <SaIcon name="plus" size={12} color="var(--sa-ink-2)" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </SaCheckSection>

        {/* ─── 02 · Today ─── */}
        <SaCheckSection n="II" label="Today" delay={0.15}>
          <div style={{ padding: '20px 22px' }}>
            <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)', marginBottom: 12 }}>
              How did you arrive?
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {arrivedOpts.map(o => {
                const on = arrived === o.id;
                return (
                  <span key={o.id} className={`sa-pill ${on ? 'on' : ''}`}
                    onClick={() => setArrived(o.id)}
                    style={{
                      padding: '9px 16px', fontSize: 13,
                      background: on ? 'var(--sa-accent)' : 'transparent',
                      color: on ? '#14110e' : 'var(--sa-ink-1)',
                      borderColor: on ? 'var(--sa-accent)' : 'var(--sa-rule-hi)',
                    }}>{o.label}</span>
                );
              })}
            </div>
          </div>

          <div className="sa-rule" />

          <div style={{ padding: '20px 22px' }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)' }}>
                Anything tight?
              </div>
              <span className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-4)' }}>OPTIONAL</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {acheOpts.map(o => {
                const on = aches.includes(o.id);
                const clear = o.id === 'clear';
                return (
                  <span key={o.id} className={`sa-pill ${on ? 'on' : ''}`}
                    onClick={() => {
                      if (clear) { setAches(on ? [] : ['clear']); return; }
                      setAches((aches.includes(o.id) ? aches.filter(x => x !== o.id) : [...aches.filter(x => x !== 'clear'), o.id]));
                    }}
                    style={{
                      padding: '9px 16px', fontSize: 13,
                      background: on ? (clear ? 'var(--sa-cool)' : 'var(--sa-bg-3)') : 'transparent',
                      color: on ? (clear ? '#14110e' : 'var(--sa-ink-1)') : 'var(--sa-ink-2)',
                      borderColor: on ? (clear ? 'var(--sa-cool)' : 'var(--sa-ink-2)') : 'var(--sa-rule)',
                    }}>{o.label}</span>
                );
              })}
            </div>
          </div>

          <div className="sa-rule" />

          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)' }}>
                Last night?
              </div>
              <span style={{
                fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: 15, color: 'var(--sa-accent)',
              }}>
                {sleepLabels[sleep]}
              </span>
            </div>
            {/* Soft slider — 5 dots, tap any */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {sleepLabels.map((l, i) => {
                const on = i === sleep;
                return (
                  <div key={l} className="sa-tap" onClick={() => setSleep(i)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    }}>
                    <div style={{
                      width: on ? 14 : 8, height: on ? 14 : 8,
                      borderRadius: 100,
                      background: on ? 'var(--sa-accent)' : 'rgba(255,255,255,0.08)',
                      boxShadow: on ? '0 0 12px var(--sa-accent-glow)' : 'none',
                      transition: 'all 0.55s var(--sa-settle)',
                    }} />
                    <span className="sa-label" style={{
                      fontSize: 8,
                      color: on ? 'var(--sa-ink-1)' : 'var(--sa-ink-4)',
                    }}>{l[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </SaCheckSection>

        {/* ─── 03 · Intention ─── */}
        <SaCheckSection n="III" label="The week" delay={0.2}>
          <div style={{ padding: '20px 22px' }}>
            <div className="sa-serif-it" style={{ fontSize: 16, color: 'var(--sa-ink-2)', marginBottom: 12 }}>
              Anything to set down?
            </div>
            <textarea value={intention} onChange={(e) => setInt(e.target.value)}
              placeholder="One line if you have one. Otherwise leave it."
              style={{
                width: '100%', minHeight: 76, resize: 'none',
                background: 'transparent',
                border: '1px solid var(--sa-rule)',
                borderRadius: 14,
                padding: '12px 14px',
                fontFamily: 'Newsreader, serif',
                fontStyle: 'italic',
                fontWeight: 400, fontSize: 14,
                color: 'var(--sa-ink-1)',
                outline: 'none',
                lineHeight: 1.45,
              }} />
          </div>
        </SaCheckSection>

        {/* Reassurance footer line */}
        <div className="sa-enter" style={{
          padding: '16px 8px 4px', textAlign: 'center', animationDelay: '0.25s',
        }}>
          <div className="sa-serif-it" style={{ fontSize: 12, color: 'var(--sa-ink-3)' }}>
            Just for you. Nothing leaves the room.
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>

      {/* CTAs */}
      <SaFloatingDock>
        <button className="sa-cta" onClick={onClose}>
          Saved · step in
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
          <span className="sa-tap" onClick={onClose}
            style={{
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: 13, color: 'var(--sa-ink-3)',
            }}>
            skip this week
          </span>
        </div>
      </SaFloatingDock>
    </div>
  );
};

/* Section shell — Roman numeral, label, panel */
const SaCheckSection = ({ n, label, children, delay = 0 }) => (
  <div className="sa-enter" style={{ marginBottom: 18, animationDelay: `${delay}s` }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10, paddingLeft: 4 }}>
      <span className="sa-serif-it" style={{ fontSize: 20, color: 'var(--sa-accent)' }}>{n}.</span>
      <span style={{
        fontFamily: 'Newsreader, serif', fontStyle: 'italic',
        fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)',
      }}>{label}</span>
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

Object.assign(window, { SaCheckin });
