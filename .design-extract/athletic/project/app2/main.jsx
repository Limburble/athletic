/* Sanctuary — main canvas wiring */

const SA_STATUS = 50;

const SaDeviceShell = ({ children }) => (
  <IOSDevice width={402} height={874} dark={true}>
    <div style={{ paddingTop: SA_STATUS, height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      {children}
    </div>
  </IOSDevice>
);

const SaDeviceShellLight = ({ children }) => (
  <IOSDevice width={402} height={874} dark={false}>
    <div style={{ paddingTop: SA_STATUS, height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      {children}
    </div>
  </IOSDevice>
);

/* Scene wrapper — local state per artboard */
const SaScene = ({ initial, render }) => {
  const [s, ss] = React.useState(initial);
  const set = (patch) => ss(prev => ({ ...prev, ...patch }));
  return render(s, set);
};

/* ─── Tweaks ─── */

const SA_TWEAKS = /*EDITMODE-BEGIN*/{
  "mode": "def",
  "light": false
}/*EDITMODE-END*/;

const SaTweaks = ({ t, setTweak }) => (
  <TweaksPanel title="Tweaks · Sanctuary">
    <TweakSection title="The room">
      <TweakRadio label="Tempo"
        value={t.mode}
        onChange={(v) => setTweak('mode', v)}
        options={[
          { value: 'def', label: 'Definition' },
          { value: 'str', label: 'Strength' },
        ]}
        help="Mode color glows through the whole canvas." />
      <TweakRadio label="Light"
        value={t.light ? 'morning' : 'dusk'}
        onChange={(v) => setTweak('light', v === 'morning')}
        options={[
          { value: 'dusk',    label: 'Dusk' },
          { value: 'morning', label: 'Morning' },
        ]}
        help="Dusk is the natural state — morning is quieter." />
    </TweakSection>
  </TweaksPanel>
);

/* ─── App ─── */

const SaApp = () => {
  const [t, setTweak] = useTweaks(SA_TWEAKS);
  return (
    <div>
      <SaAppInner t={t} />
      <SaTweaks t={t} setTweak={setTweak} />
    </div>
  );
};

const SaAppInner = ({ t }) => {
  const Shell = t.light ? SaDeviceShellLight : SaDeviceShell;
  const mode = t.mode || 'def';

  return (
    <DesignCanvas>

      {/* ─── 01 · Invitation ─── */}
      <DCSection id="invitation" title="The invitation"
        subtitle="The front door. Greeting + tonight's suggested path.">
        <DCArtboard id="tonight" label="01 · Tonight" width={402} height={874}>
          <Shell>
            <SaScene initial={{ mode, tab: 'tonight' }}
              render={(s, set) => <SaTonight state={s} set={set} />} />
          </Shell>
        </DCArtboard>
        <DCPostIt top={30} right={-220} rotate={2}>
          Replaces "open the app, hit start". This is the <b>invitation moment</b>.
          Time-of-day greeting, suggested path, three alternatives.
          Soft, settled, no obligation.
        </DCPostIt>
        <DCPostIt top={260} right={-230} rotate={-2} width={210}>
          <b>The whole app shifts with time of day.</b><br/><br/>
          Morning → "wake" / sun icon / lighter copy.<br/>
          Afternoon → "reset" / "step out".<br/>
          Evening → "decompress" / moon / suggested sauna.<br/>
          Night → "unwind" / quiet copy / no nudges.<br/><br/>
          You wouldn't say <i>"what's the move tonight"</i> at 9am.
        </DCPostIt>
      </DCSection>

      {/* ─── 02 · Weekly check-in ─── */}
      <DCSection id="checkin" title="The weekly check-in"
        subtitle="A two-minute ritual that appears on the first session of every seven days.">
        <DCArtboard id="checkin" label="02 · Check-in" width={402} height={874}>
          <Shell>
            <SaScene initial={{ mode }}
              render={(s, set) => <SaCheckin state={s} set={set} onClose={() => {}} />} />
          </Shell>
        </DCArtboard>
        <DCPostIt top={30} right={-240} rotate={-2} width={220}>
          <b>Not a form — a ritual.</b><br/><br/>
          Weight nudges only; height collapsed and self-narrates
          ("rarely changes"). One mood, one tightness pick,
          one sleep dot, one optional line.<br/><br/>
          Every prompt is skippable. The page scrolls past the dock —
          nothing is "required."
        </DCPostIt>
      </DCSection>

      {/* ─── 03 · Compose ─── */}
      <DCSection id="compose" title="Compose the path"
        subtitle="One question at a time. Conversational, slow, gentle.">
        <DCArtboard id="path" label="02 · Path · choose" width={402} height={874}>
          <Shell>
            <SaScene initial={{ mode }}
              render={(s, set) => <SaPath state={s} set={set} onCompose={() => set({ composed: true })} />} />
          </Shell>
        </DCArtboard>
        <DCArtboard id="compose" label="03 · Compose · itinerary" width={402} height={874}>
          <Shell>
            <SaScene initial={{ mode }}
              render={(s, set) => <SaCompose state={s} set={set} onStart={() => {}} onBack={() => {}} />} />
          </Shell>
        </DCArtboard>
      </DCSection>

      {/* ─── 03 · Deep (timer running) ─── */}
      <DCSection id="deep" title="Deep · in the work"
        subtitle="One number, breathing halo, soft phase color. The mental tunnel.">
        <DCArtboard id="deep-work" label="04 · In the work" width={402} height={874}>
          <SaDeviceShell>
            <SaDeep state={{ mode: 'def', phase: 'work', timeLeft: 28, totalRound: 40, round: 2, totalRounds: 4, exName: 'Russian twist' }}
              onClose={() => {}} />
          </SaDeviceShell>
        </DCArtboard>
        <DCArtboard id="deep-rest" label="05 · Rest" width={402} height={874}>
          <SaDeviceShell>
            <SaDeep state={{ mode: 'def', phase: 'rest', timeLeft: 12, totalRound: 20, round: 2, totalRounds: 4, exName: 'Russian twist', nextName: 'Ab wheel rollout' }}
              onClose={() => {}} />
          </SaDeviceShell>
        </DCArtboard>
        <DCArtboard id="deep-str" label="06 · Strength · amber" width={402} height={874}>
          <SaDeviceShell>
            <SaDeep state={{ mode: 'str', phase: 'work', timeLeft: 41, totalRound: 60, round: 3, totalRounds: 5, exName: 'Smith bench press' }}
              onClose={() => {}} />
          </SaDeviceShell>
        </DCArtboard>
      </DCSection>

      {/* ─── 04 · Cool (THE REWARD) ─── */}
      <DCSection id="cool" title="Cool — the reward"
        subtitle="The whole point of the loop. Three quiet sub-screens. THIS is the sanctuary.">
        <DCArtboard id="cool-arrive" label="07 · Arrive · just done" width={402} height={874}>
          <SaDeviceShell>
            <SaScene initial={{}}
              render={(s, set) => <SaCoolArrive set={set} />} />
          </SaDeviceShell>
        </DCArtboard>
        <DCArtboard id="cool-reflect" label="08 · Reflect · restoration" width={402} height={874}>
          <SaDeviceShell>
            <SaScene initial={{}}
              render={(s, set) => <SaCoolReflect set={set} />} />
          </SaDeviceShell>
        </DCArtboard>
        <DCArtboard id="cool-close" label="09 · Close · journal" width={402} height={874}>
          <SaDeviceShell>
            <SaScene initial={{}}
              render={(s, set) => <SaCoolClose set={set} />} />
          </SaDeviceShell>
        </DCArtboard>
        <DCPostIt top={30} right={-260} rotate={-3} width={220}>
          <b>This screen didn't exist in v1.</b><br/><br/>
          The post-workout state is where most fitness apps fail —
          they end on "session complete" and dump you out.<br/><br/>
          The Sanctuary's whole point: <i>the reset itself is the reward.</i>
          Cool stretches across <b>arrive → reflect → close</b>.
        </DCPostIt>
      </DCSection>

      {/* ─── 05 · The Log ─── */}
      <DCSection id="log" title="The log"
        subtitle="A journal of resets. Mood, not metrics. Streak as quiet pattern.">
        <DCArtboard id="log" label="10 · The log" width={402} height={874}>
          <Shell>
            <SaScene initial={{ mode }}
              render={(s, set) => <SaLog state={s} set={set} />} />
          </Shell>
        </DCArtboard>
      </DCSection>

      {/* ─── 06 · The Room ─── */}
      <DCSection id="room" title="The room"
        subtitle="Settings as atmosphere tuning. Light, motion, hydration, care.">
        <DCArtboard id="room" label="11 · The room" width={402} height={874}>
          <Shell>
            <SaScene initial={{ mode, light: t.light || false }}
              render={(s, set) => <SaRoom state={s} set={set} onClose={() => {}} />} />
          </Shell>
        </DCArtboard>
      </DCSection>

      {/* ─── 07 · Side-by-side ─── */}
      <DCSection id="comparison" title="Field Notes ↔ Sanctuary"
        subtitle="Same screen, two emotional models.">
        <DCArtboard id="cmp-tonight" label="Sanctuary · invitation" width={402} height={874}>
          <SaDeviceShell>
            <SaScene initial={{ mode: 'def' }}
              render={(s, set) => <SaTonight state={s} set={set} />} />
          </SaDeviceShell>
        </DCArtboard>
        <DCArtboard id="cmp-deep" label="Sanctuary · in the work" width={402} height={874}>
          <SaDeviceShell>
            <SaDeep state={{ mode: 'def', phase: 'work', timeLeft: 28, totalRound: 40, round: 2, totalRounds: 4, exName: 'Russian twist' }}
              onClose={() => {}} />
          </SaDeviceShell>
        </DCArtboard>
        <DCArtboard id="cmp-cool" label="Sanctuary · reward" width={402} height={874}>
          <SaDeviceShell>
            <SaScene initial={{}}
              render={(s, set) => <SaCoolReflect set={set} />} />
          </SaDeviceShell>
        </DCArtboard>
        <DCPostIt top={30} right={-220} rotate={2} width={200}>
          Different emotional model.<br/><br/>
          v1 said: "do the work." <br/>
          v2 says: "enter the room."
        </DCPostIt>
      </DCSection>

    </DesignCanvas>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<SaApp />);
