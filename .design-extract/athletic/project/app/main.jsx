/* Main — wires every screen into the design canvas */

// Status bar height inside the IOSDevice
const FN_STATUS = 50;

/* DeviceShell — iPhone frame around a screen, padded for status bar */
const FNDeviceShell = ({ children, dark = false }) => (
  <IOSDevice width={402} height={874} dark={dark}>
    <div style={{ paddingTop: FN_STATUS, height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      {children}
    </div>
  </IOSDevice>
);

/* Local-state wrapper — each artboard maintains its own scene */
const FNScene = ({ initial, render }) => {
  const [s, ss] = React.useState(initial);
  const set = (patch) => ss(prev => ({ ...prev, ...patch }));
  return render(s, set);
};

/* ─────────────── Top-level App + Tweaks ─────────────── */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "def",
  "dark": false,
  "showVariations": true
}/*EDITMODE-END*/;

const FNTweaks = ({ t, setTweak }) => {
  return (
    <TweaksPanel title="Tweaks · Athletic">
      <TweakSection title="Theme">
        <TweakRadio label="Mode"
          value={t.mode}
          onChange={(v) => setTweak('mode', v)}
          options={[
            { value: 'def', label: 'Definition' },
            { value: 'str', label: 'Strength' },
          ]}
          help="Tints all artboards' accent color." />
        <TweakRadio label="Surface"
          value={t.dark ? 'ink' : 'paper'}
          onChange={(v) => setTweak('dark', v === 'ink')}
          options={[
            { value: 'paper', label: 'Paper' },
            { value: 'ink', label: 'Ink' },
          ]} />
      </TweakSection>
      <TweakSection title="Canvas">
        <TweakToggle label="Show variation studies"
          value={t.showVariations}
          onChange={(v) => setTweak('showVariations', v)}
          help="Hide to focus on the main prototype." />
      </TweakSection>
    </TweaksPanel>
  );
};

/* ─────────────── Direction-study variants ─────────────── */

/* Direction B — "Stadium" — same Build content, jersey-numbers + hard color */
const FNBuildStadium = () => {
  const [slot, setSlot] = React.useState(3);
  const [groups, setGroups] = React.useState(['chest', 'back']);
  const time = FN_TIME_SLOTS[slot];
  return (
    <div style={{
      height: '100%', background: '#0e100c', color: '#f4ecd9',
      fontFamily: 'Geist, sans-serif',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 22, letterSpacing: '0.04em' }}>ATHLETIC</span>
        <span style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 13, letterSpacing: '0.16em', color: '#7ab26a' }}>DEF · 60</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0 20px' }}>
        {/* Jersey number */}
        <div style={{ padding: '10px 20px', position: 'relative' }}>
          <div style={{
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            fontSize: 280, lineHeight: 0.8, letterSpacing: '-0.04em',
            color: '#7ab26a',
            opacity: 0.95,
          }}>{time}</div>
          <div style={{
            position: 'absolute', right: 20, bottom: 40,
            fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 30,
            letterSpacing: '0.05em', color: '#f4ecd9',
          }}>MINUTES</div>
        </div>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[15, 30, 45, 60, 75, 90].map((t, i) => (
              <div key={t} className="tap" onClick={() => setSlot(i)}
                style={{
                  flex: 1, padding: '12px 0', textAlign: 'center',
                  background: time === t ? '#7ab26a' : 'transparent',
                  color: time === t ? '#0e100c' : '#9a9684',
                  border: '1px solid ' + (time === t ? '#7ab26a' : '#3c3d36'),
                  fontFamily: 'Bebas Neue, Impact, sans-serif',
                  fontSize: 22, letterSpacing: '0.04em',
                }}>{t}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 13, letterSpacing: '0.2em', color: '#9a9684', marginBottom: 10 }}>02 · MUSCLES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {FN_MUSCLES.map(m => {
              const on = groups.includes(m.id);
              return (
                <div key={m.id} className="tap" onClick={() => setGroups(on ? groups.filter(x => x !== m.id) : [...groups, m.id])}
                  style={{
                    padding: '14px 10px',
                    background: on ? '#7ab26a' : 'transparent',
                    color: on ? '#0e100c' : '#f4ecd9',
                    border: '1px solid ' + (on ? '#7ab26a' : '#3c3d36'),
                    fontFamily: 'Bebas Neue, Impact, sans-serif',
                    fontSize: 22, letterSpacing: '0.04em', textAlign: 'left',
                  }}>{m.label.toUpperCase()}</div>
              );
            })}
          </div>
        </div>
      </div>
      <button style={{
        width: '100%', padding: '22px', border: 'none', background: '#7ab26a', color: '#0e100c',
        fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: 24, letterSpacing: '0.05em',
        display: 'flex', justifyContent: 'space-between', padding: '20px 22px',
      }}>
        <span>COMPILE</span><span>→</span>
      </button>
    </div>
  );
};

/* Direction C — "Atmosphere" — refined glass + dusk gradient */
const FNBuildAtmosphere = () => {
  const [slot, setSlot] = React.useState(3);
  const [groups, setGroups] = React.useState(['chest', 'back']);
  const time = FN_TIME_SLOTS[slot];
  return (
    <div style={{
      height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(140% 80% at 20% 0%, #1b3a25 0%, #0a1410 50%, #050807 100%)',
      color: '#e0e6dc', fontFamily: '-apple-system, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(60% 30% at 70% 80%, rgba(122,178,106,0.18), transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22 }}>
          Athlet<span style={{ fontStyle: 'italic', fontWeight: 500 }}>ic</span>
        </span>
        <span style={{ fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,.5)' }}>DEFINITION</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 22px 20px', position: 'relative' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, lineHeight: 1.05, marginBottom: 22 }}>
          What's the<br/>session today?
        </div>
        <div style={{
          padding: '24px 20px', borderRadius: 28,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>DURATION</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 14 }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 92, letterSpacing: '-0.04em', lineHeight: 1 }}>{time}</span>
            <span style={{ fontStyle: 'italic', fontSize: 22, color: 'rgba(255,255,255,.6)', fontFamily: 'Fraunces, serif' }}>min</span>
          </div>
          <input type="range" min={0} max={9} value={slot}
            onChange={(e) => setSlot(+e.target.value)}
            style={{ width: '100%', accentColor: '#7ab26a' }} />
        </div>
        <div style={{
          padding: '20px 20px', borderRadius: 28,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>MUSCLES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FN_MUSCLES.map(m => {
              const on = groups.includes(m.id);
              return (
                <span key={m.id} className="tap" onClick={() => setGroups(on ? groups.filter(x => x !== m.id) : [...groups, m.id])}
                  style={{
                    padding: '8px 14px', borderRadius: 100,
                    background: on ? 'rgba(122,178,106,0.2)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid ' + (on ? '#7ab26a' : 'rgba(255,255,255,0.1)'),
                    color: on ? '#a8d09a' : 'rgba(255,255,255,.75)',
                    fontSize: 13, fontWeight: 500,
                  }}>{m.label}</span>
              );
            })}
          </div>
        </div>
      </div>
      <button style={{
        margin: '0 22px 30px', borderRadius: 100, padding: '18px 22px',
        border: 'none', background: '#7ab26a', color: '#061408',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em',
      }}>
        <span>Compile</span><span>→</span>
      </button>
    </div>
  );
};

/* ─────────────── App entrypoint ─────────────── */

const FNApp = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  return (
    <div>
      <FNAppInner t={t} />
      <FNTweaks t={t} setTweak={setTweak} />
    </div>
  );
};

const FNAppInner = ({ t }) => {
  const mode = t.mode || 'def';
  const dark = t.dark || false;
  const showVar = t.showVariations !== false;

  return (
    <DesignCanvas>
      {/* ─── Onboarding ─── */}
      <DCSection id="onboarding" title="Onboarding" subtitle="First-run · 3 calm screens, tap to advance">
        <DCArtboard id="cover" label="01 · Cover" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ slide: 0 }}
              render={(s, set) => (
                <FNOnboarding slide={s.slide}
                  onAdvance={() => set({ slide: Math.min(2, s.slide + 1) })} />
              )} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="philosophy" label="02 · Philosophy" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ slide: 1 }}
              render={(s, set) => (
                <FNOnboarding slide={s.slide}
                  onAdvance={() => set({ slide: Math.min(2, s.slide + 1) })} />
              )} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="defaults" label="03 · Defaults" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ slide: 2 }}
              render={(s, set) => (
                <FNOnboarding slide={s.slide}
                  onAdvance={() => set({ slide: 0 })} />
              )} />
          </FNDeviceShell>
        </DCArtboard>
      </DCSection>

      {/* ─── Core flow ─── */}
      <DCSection id="flow" title="Core flow"
        subtitle="Build → compile → Result. Tap step rows + Compile to advance live.">
        <DCArtboard id="build-1" label="04 · Build · Duration" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ mode, dark, step: 0, slotIdx: 3, groups: ['chest','back'], compiled: false }}
              render={(s, set) => (
                s.compiled
                  ? <FNResult state={s} set={set} onStart={() => set({ tab: 'timer-run' })} onReset={() => set({ compiled: false })} />
                  : <FNBuild state={s} set={set} onCompile={() => set({ compiled: true })} />
              )} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="build-2" label="05 · Build · Muscles" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ mode, dark, step: 1, slotIdx: 3, groups: ['chest','back'] }}
              render={(s, set) => <FNBuild state={s} set={set} onCompile={() => set({ step: 2 })} />} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="build-3" label="06 · Build · Mode" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ mode, dark, step: 2, slotIdx: 3, groups: ['chest','back'] }}
              render={(s, set) => <FNBuild state={s} set={set} onCompile={() => {}} />} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="result" label="07 · Result · Prescription" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ mode, dark }}
              render={(s, set) => <FNResult state={s} set={set}
                onStart={() => {}} onReset={() => {}} />} />
          </FNDeviceShell>
        </DCArtboard>
      </DCSection>

      {/* ─── Timer states ─── */}
      <DCSection id="timer" title="Timer · running"
        subtitle="One number, one phase, one color flood. No rings.">
        <DCArtboard id="t-config" label="08 · Config" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ mode, dark, hiitWork: 40, hiitRest: 20, hiitRounds: 4, hiitMode: 'queue' }}
              render={(s, set) => <FNTimerConfig state={s} set={set} onStart={() => {}} />} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="t-work" label="09 · WORK · def" width={402} height={874}>
          <FNDeviceShell dark={true}>
            <FNTimerRun state={{ mode: 'def', phase: 'work', timeLeft: 28, totalRound: 40, round: 2, totalRounds: 4, exName: 'Russian twist' }} onClose={() => {}} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="t-rest" label="10 · REST · def" width={402} height={874}>
          <FNDeviceShell dark={true}>
            <FNTimerRun state={{ mode: 'def', phase: 'rest', timeLeft: 12, totalRound: 20, round: 2, totalRounds: 4, exName: 'next · Ab wheel rollout' }} onClose={() => {}} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="t-str" label="11 · WORK · strength" width={402} height={874}>
          <FNDeviceShell dark={true}>
            <FNTimerRun state={{ mode: 'str', phase: 'work', timeLeft: 41, totalRound: 60, round: 3, totalRounds: 5, exName: 'Smith bench press' }} onClose={() => {}} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="t-done" label="12 · COMPLETE" width={402} height={874}>
          <FNDeviceShell dark={true}>
            <FNTimerRun state={{ mode: 'def', phase: 'done', timeLeft: 0, totalRound: 40, round: 4, totalRounds: 4 }} onClose={() => {}} />
          </FNDeviceShell>
        </DCArtboard>
      </DCSection>

      {/* ─── Tools ─── */}
      <DCSection id="tools" title="Logbook + Settings"
        subtitle="The record, and the instrument's underside.">
        <DCArtboard id="history" label="13 · Logbook" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ mode, dark }}
              render={(s, set) => <FNHistory state={s} set={set} />} />
          </FNDeviceShell>
        </DCArtboard>
        <DCArtboard id="settings" label="14 · Settings" width={402} height={874}>
          <FNDeviceShell dark={dark}>
            <FNScene initial={{ mode, dark }}
              render={(s, set) => <FNSettings state={s} set={set} onClose={() => {}} />} />
          </FNDeviceShell>
        </DCArtboard>
      </DCSection>

      {/* ─── Variations ─── */}
      {showVar && (
        <DCSection id="variations" title="Direction studies"
          subtitle="What else could it be? Build screen, two alternate flavors.">
          <DCArtboard id="v-fieldnotes" label="A · Field Notes (selected)" width={402} height={874}>
            <FNDeviceShell dark={false}>
              <FNScene initial={{ mode: 'def', dark: false, step: 0, slotIdx: 3, groups: ['chest','back'] }}
                render={(s, set) => <FNBuild state={s} set={set} onCompile={() => {}} />} />
            </FNDeviceShell>
          </DCArtboard>
          <DCArtboard id="v-stadium" label="B · Stadium" width={402} height={874}>
            <FNDeviceShell dark={true}>
              <FNBuildStadium />
            </FNDeviceShell>
          </DCArtboard>
          <DCArtboard id="v-atmosphere" label="C · Atmosphere" width={402} height={874}>
            <FNDeviceShell dark={true}>
              <FNBuildAtmosphere />
            </FNDeviceShell>
          </DCArtboard>
          <DCPostIt top={30} right={-180} rotate={3}>
            Three flavors. <b>A · Field Notes</b> is the redesign — editorial,
            mono numbers, paper. B is heavier and louder. C keeps the original's
            glass DNA but quieter. Toggle hidden via Tweaks.
          </DCPostIt>
        </DCSection>
      )}
    </DesignCanvas>
  );
};

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<FNApp />);
