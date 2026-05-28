/* Cool — the reward state. The point of the whole loop.
 * Earned silence. Restoration metrics. A door to the sauna.
 * Steps through three sub-phases: arrive → reflect → close.
 */

const SaCool = ({ state, set, step = 'arrive' }) => {
  // 'arrive' → just done, soft welcome
  // 'reflect' → restoration metrics, hydration nudge
  // 'close'   → log entry as reflection, return to tonight

  if (step === 'arrive')  return <SaCoolArrive  set={set} />;
  if (step === 'reflect') return <SaCoolReflect set={set} />;
  return <SaCoolClose set={set} />;
};

/* ─── Arrive ─── The first 8 seconds after the timer ends.
 * Whole screen breathes. Cool tone. No buttons until ready. */
const SaCoolArrive = ({ set }) => {
  // Auto-advance after 4s (in this mock, we render the state)
  return (
    <div className="sa-app" data-sa-mode="cool"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" style={{
        animationDuration: '20s',
      }} />

      {/* Time of completion — small */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 24px 0' }}>
        <div className="sa-label" style={{ fontSize: 9 }}>
          COMPLETED · 8:47 PM
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center', position: 'relative',
      }}>
        <div className="sa-enter" style={{ position: 'relative' }}>
          {/* Breathing rings — anchored to the title so they share visual center */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute', width: 320, height: 320,
              borderRadius: '50%',
              border: '1px solid var(--sa-cool)',
              animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite',
            }} />
            {/* Middle ring */}
            <div style={{
              position: 'absolute', width: 240, height: 240,
              borderRadius: '50%',
              border: '1px solid var(--sa-cool)',
              opacity: 0.7,
              animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite',
            }} />
            {/* Inner orb — soft glow */}
            <div style={{
              position: 'absolute', width: 160, height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, var(--sa-cool-glow), transparent 80%)',
              animation: 'sa-breath-cycle 8s var(--sa-breathe) infinite',
            }} />
          </div>

          <style>{`
            @keyframes sa-breath-cycle {
              0%   { transform: scale(0.78); opacity: 0.35; }
              45%  { transform: scale(1.12); opacity: 0.85; }
              55%  { transform: scale(1.12); opacity: 0.85; }
              100% { transform: scale(0.78); opacity: 0.35; }
            }
            @keyframes sa-breath-in-label {
              0%, 45%, 100% { opacity: 1; }
              46%, 99%      { opacity: 0; }
            }
            @keyframes sa-breath-out-label {
              0%, 45%, 100% { opacity: 0; }
              55%, 95%      { opacity: 1; }
            }
          `}</style>

          <div style={{ position: 'relative' }}>
            <div className="sa-serif" style={{
              fontSize: 48, color: 'var(--sa-ink-1)', marginBottom: 14,
              lineHeight: 1,
            }}>
              That's <em style={{ fontStyle: 'italic', color: 'var(--sa-cool)' }}>it.</em>
            </div>
            <div className="sa-serif-it" style={{
              fontSize: 19, color: 'var(--sa-ink-2)', lineHeight: 1.4,
              maxWidth: 280, margin: '0 auto',
            }}>
              Stay as long as<br/>you need.
            </div>
          </div>
        </div>

        <div className="sa-enter" style={{
          marginTop: 64, animationDelay: '1.2s', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        }}>
          {/* Breath-cycle label — fades in/out with the rings */}
          <div style={{ position: 'relative', height: 14, display: 'flex', alignItems: 'center' }}>
            <span className="sa-label" style={{
              fontSize: 9, color: 'var(--sa-cool)', position: 'absolute',
              animation: 'sa-breath-in-label 8s var(--sa-breathe) infinite',
            }}>BREATHE IN</span>
            <span className="sa-label" style={{
              fontSize: 9, color: 'var(--sa-cool)', position: 'absolute',
              animation: 'sa-breath-out-label 8s var(--sa-breathe) infinite',
            }}>BREATHE OUT</span>
          </div>
          <div className="sa-tap" onClick={() => set({ coolStep: 'reflect' })}>
            <div className="sa-ghost" style={{
              padding: '14px 28px',
              fontSize: 15,
              borderColor: 'var(--sa-cool)',
              color: 'var(--sa-cool)',
            }}>
              when you're ready
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
};

/* ─── Reflect ─── The restoration moment. Hydration, recovery, breath. */
const SaCoolReflect = ({ set }) => {
  const [hydrated, setHydrated] = React.useState(false);

  return (
    <div className="sa-app" data-sa-mode="cool"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      <div style={{ padding: '20px 28px 0' }}>
        <div className="sa-label" style={{ marginBottom: 14 }}>RESTORATION</div>
        <div className="sa-serif" style={{ fontSize: 34, lineHeight: 1.05, marginBottom: 8 }}>
          The body is <em style={{ fontStyle: 'italic', color: 'var(--sa-cool)' }}>open</em>
        </div>
        <div className="sa-serif" style={{ fontSize: 34, lineHeight: 1.05, color: 'var(--sa-ink-2)' }}>
          for the next hour.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 140px' }}>
        {/* Hydration card */}
        <div className="sa-panel sa-enter" style={{ padding: '20px 22px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 100,
              background: 'var(--sa-cool-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <SaIcon name="drop" size={20} color="var(--sa-cool)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)',
                marginBottom: 4,
              }}>Water first.</div>
              <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.5, marginBottom: 14 }}>
                Two glasses, sipped slowly over the next ten minutes.
              </div>
              <SaSwitch on={hydrated} onChange={setHydrated} />
            </div>
          </div>
        </div>

        {/* Recovery stats */}
        <div className="sa-panel sa-enter" style={{
          padding: '22px 22px 20px', marginBottom: 14,
          animationDelay: '0.1s',
        }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 16 }}>WHAT YOU GAVE</div>
          <div style={{ display: 'flex', gap: 0 }}>
            <SaStat k="TIME" v="62" sub="MINUTES" light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="SETS" v="24" light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="EFFORT" v="steady" light />
          </div>
          <div className="sa-rule" style={{ margin: '20px -22px 18px' }} />
          <div style={{ fontSize: 12, color: 'var(--sa-ink-2)', lineHeight: 1.55 }}>
            Heart rate settled <span style={{ color: 'var(--sa-cool)' }}>before the next song</span> finished.
            One of your steadier sessions.
          </div>
        </div>

        {/* Sauna / sauna prompt */}
        <div className="sa-panel sa-enter" style={{
          padding: '20px 22px', marginBottom: 14,
          background: 'linear-gradient(180deg, var(--sa-str-aura), var(--sa-bg-elev))',
          animationDelay: '0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 100,
              background: 'var(--sa-str-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SaIcon name="sun" size={20} color="var(--sa-str)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)',
                marginBottom: 4,
              }}>The sauna is open.</div>
              <div style={{ fontSize: 12, color: 'var(--sa-ink-2)', lineHeight: 1.5 }}>
                Until 10pm. 15 minutes is plenty.
              </div>
            </div>
          </div>
        </div>

        {/* Breath exercise */}
        <div className="sa-panel sa-enter sa-tap" style={{
          padding: '20px 22px', marginBottom: 14,
          animationDelay: '0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 100,
              background: 'rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--sa-rule)',
            }}>
              <SaIcon name="leaf" size={20} color="var(--sa-ink-2)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontWeight: 400, fontSize: 17, color: 'var(--sa-ink-1)',
                marginBottom: 4,
              }}>Four breaths.</div>
              <div style={{ fontSize: 12, color: 'var(--sa-ink-2)' }}>
                Two minutes · downshift the nervous system
              </div>
            </div>
            <SaIcon name="chevR" size={14} color="var(--sa-ink-3)" />
          </div>
        </div>
      </div>

      <SaFloatingDock>
        <button className="sa-cta"
          onClick={() => set({ coolStep: 'close' })}
          style={{
            background: 'var(--sa-cool)',
            boxShadow: '0 8px 32px var(--sa-cool-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>
          Log and close
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  );
};

/* ─── Close ─── The journal entry. Three soft prompts. */
const SaCoolClose = ({ set }) => {
  const [mood, setMood] = React.useState(null);
  const [note, setNote] = React.useState('');
  const moods = [
    { id: 'heavy',  label: 'Heavy' },
    { id: 'steady', label: 'Steady' },
    { id: 'light',  label: 'Light' },
    { id: 'clear',  label: 'Clear' },
  ];

  return (
    <div className="sa-app" data-sa-mode="cool"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="sa-aura" />

      <div style={{ padding: '20px 28px 0' }}>
        <div className="sa-label" style={{ marginBottom: 14 }}>JOURNAL · TONIGHT</div>
        <div className="sa-serif" style={{ fontSize: 34, lineHeight: 1.05 }}>
          Before you <em style={{ fontStyle: 'italic', color: 'var(--sa-cool)' }}>leave</em>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px 140px' }}>
        {/* Mood selector */}
        <div className="sa-enter" style={{ marginBottom: 36 }}>
          <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-2)', marginBottom: 16 }}>
            How was your body?
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {moods.map(m => {
              const on = mood === m.id;
              return (
                <span key={m.id} className={`sa-pill ${on ? 'on' : ''}`}
                  onClick={() => setMood(m.id)}
                  style={{
                    padding: '12px 20px', fontSize: 14,
                    background: on ? 'var(--sa-cool)' : 'transparent',
                    color: on ? '#14110e' : 'var(--sa-ink-1)',
                    borderColor: on ? 'var(--sa-cool)' : 'var(--sa-rule-hi)',
                  }}>
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Optional note */}
        <div className="sa-enter" style={{ marginBottom: 28, animationDelay: '0.1s' }}>
          <div className="sa-serif-it" style={{ fontSize: 18, color: 'var(--sa-ink-2)', marginBottom: 12 }}>
            Anything to remember?
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="A line, if you want. Or leave it blank."
            style={{
              width: '100%', minHeight: 90, resize: 'none',
              background: 'var(--sa-bg-2)',
              border: '1px solid var(--sa-rule)',
              borderRadius: 18,
              padding: '14px 16px',
              fontFamily: 'Newsreader, serif',
              fontStyle: 'italic',
              fontWeight: 400, fontSize: 15,
              color: 'var(--sa-ink-1)',
              outline: 'none',
              lineHeight: 1.45,
            }} />
        </div>

        {/* Streak — celebrated quietly */}
        <div className="sa-enter" style={{
          padding: '20px 22px',
          background: 'var(--sa-bg-elev)',
          border: '1px solid var(--sa-rule)',
          borderRadius: 22,
          textAlign: 'center',
          animationDelay: '0.15s',
        }}>
          <div className="sa-label" style={{ fontSize: 9, marginBottom: 10 }}>VISITS THIS WEEK</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
              const on = [true, false, true, false, true, false, false][i];
              const today = i === 2;
              return (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? (today ? 'var(--sa-cool)' : 'rgba(138,169,196,0.18)') : 'transparent',
                  border: '1px solid ' + (on ? 'var(--sa-cool)' : 'var(--sa-rule)'),
                  boxShadow: today ? '0 0 14px var(--sa-cool-glow)' : 'none',
                }}>
                  <span style={{
                    fontFamily: 'Newsreader, serif', fontSize: 11,
                    color: on ? (today ? '#14110e' : 'var(--sa-cool)') : 'var(--sa-ink-3)',
                  }}>{d}</span>
                </div>
              );
            })}
          </div>
          <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)' }}>
            Three resets this week. Steady.
          </div>
        </div>
      </div>

      <SaFloatingDock>
        <button className="sa-cta"
          onClick={() => set({ tab: 'tonight', compiled: false, coolStep: null })}
          style={{
            background: 'var(--sa-cool)',
            boxShadow: '0 8px 32px var(--sa-cool-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}>
          Step out
          <span className="arrow"><SaIcon name="arrowSm" size={16} color="#14110e" /></span>
        </button>
      </SaFloatingDock>
    </div>
  );
};

Object.assign(window, { SaCool, SaCoolArrive, SaCoolReflect, SaCoolClose });
