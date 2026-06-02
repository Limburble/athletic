import React, { useState, useRef } from 'react'
import { SaIcon, SaStat, SaSwitch, SaDock } from './SanctuaryAtoms'
import { DEF_POOL, STR_POOL, EX } from '../data/exercises'
import { exportData, importData } from '../data/store'

// All unique exercise keys across both pools
const _ALL_KEYS = [...new Set([
  ...Object.values(DEF_POOL).flat().map(([k]) => k),
  ...Object.values(STR_POOL).flat().map(([k]) => k),
])].filter(k => EX[k])

// Display list — deduplicated by exercise name
const ALL_EXERCISE_KEYS = (() => {
  const seen = new Set()
  return _ALL_KEYS.filter(k => {
    const name = EX[k].n
    if (seen.has(name)) return false
    seen.add(name)
    return true
  })
})()

// Name → all keys map (for banning synonyms like facePull + facePullSh)
const NAME_TO_KEYS = _ALL_KEYS.reduce((acc, k) => {
  const n = EX[k].n
  acc[n] = acc[n] ? [...acc[n], k] : [k]
  return acc
}, {})

function RoomSection({ title, children, delay = 0 }) {
  return (
    <div className="sa-enter" style={{ marginBottom: 24, animationDelay: `${delay}s` }}>
      <div className="sa-label" style={{ marginBottom: 10, fontSize: 9, paddingLeft: 4 }}>{title.toUpperCase()}</div>
      <div style={{ background: 'var(--sa-bg-elev)', border: '1px solid var(--sa-rule)', borderRadius: 22, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function RoomRow({ label, sub, children, chev, last, onClick }) {
  return (
    <div className="sa-tap" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: last ? 'none' : '1px solid var(--sa-rule)',
      gap: 14,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 15, color: 'var(--sa-ink-1)', letterSpacing: '-0.005em', marginBottom: sub ? 3 : 0 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--sa-ink-3)', lineHeight: 1.45 }}>{sub}</div>}
      </div>
      {chev ? <SaIcon name="chevR" size={14} color="var(--sa-ink-3)" /> : children}
    </div>
  )
}

export default function RoomScreen({ state }) {
  const { mode, setMode, light, setLight, setTab, store } = state
  const { profile, stats } = store

  const [haptics,      setHapticsState]   = useState(store.prefs.haptics)
  const [ambient,      setAmbientState]   = useState(store.prefs.ambient)
  const [hydration,    setHydrationState] = useState(store.prefs.hydration)
  const [keepOn,       setKeepOnState]    = useState(store.prefs.keepOn)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName,     setEditName]       = useState(profile.name)
  const [editLast,     setEditLast]       = useState(profile.lastName)
  const [editGym,      setEditGym]        = useState(profile.gym)
  const [boundariesOpen, setBoundariesOpen] = useState(false)
  const [importMsg, setImportMsg] = useState(null)
  const fileRef = useRef()
  const [gymOpen,  setGymOpenState]  = useState(profile.gymOpen  || '05:30')
  const [gymClose, setGymCloseState] = useState(profile.gymClose || '22:00')
  const [gymDays,  setGymDaysState]  = useState(profile.gymDays  || [1,2,3,4,5,6,0])

  const banned = profile.banned || []

  function setHaptics(v)   { setHapticsState(v);   store.updatePrefs({ haptics:   v }) }
  function setAmbient(v)   { setAmbientState(v);   store.updatePrefs({ ambient:   v }) }
  function setHydration(v) { setHydrationState(v); store.updatePrefs({ hydration: v }) }
  function setKeepOn(v)    { setKeepOnState(v);     store.updatePrefs({ keepOn:    v }) }

  function saveProfile() {
    store.updateProfile({ name: editName.trim() || profile.name, lastName: editLast.trim(), gym: editGym.trim() || profile.gym })
    setEditingProfile(false)
  }

  function toggleBan(key) {
    // Ban/unban all keys sharing the same name (handles facePull + facePullSh)
    const aliases = NAME_TO_KEYS[EX[key]?.n] || [key]
    const isBanned = aliases.some(k => banned.includes(k))
    const next = isBanned
      ? banned.filter(k => !aliases.includes(k))
      : [...new Set([...banned, ...aliases])]
    store.updateProfile({ banned: next })
  }

  return (
    <div className="sa-app" data-sa-mode={mode} data-sa-light={light}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="sa-aura" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <span className="sa-tap" onClick={() => setTab('tonight')}>
          <SaIcon name="back" size={20} color="var(--sa-ink-2)" />
        </span>
        <span className="sa-label">The Room</span>
        <span style={{ width: 20 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 28px 96px' }}>

        <div className="sa-enter" style={{ marginBottom: 28 }}>
          <div className="sa-serif" style={{ fontSize: 32, marginBottom: 8 }}>
            Tune the <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>atmosphere.</em>
          </div>
          <div style={{ fontSize: 13, color: 'var(--sa-ink-2)', lineHeight: 1.55 }}>Small adjustments to how the room feels.</div>
        </div>

        {/* Athlete card */}
        <div className="sa-panel sa-enter" style={{ padding: '22px 24px', marginBottom: 24, animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="sa-label" style={{ fontSize: 9 }}>WHOSE ROOM</div>
            <span className="sa-tap" onClick={() => { setEditName(profile.name); setEditLast(profile.lastName); setEditGym(profile.gym); setEditingProfile(v => !v) }}>
              <SaIcon name={editingProfile ? 'close' : 'chevR'} size={14} color="var(--sa-ink-3)" />
            </span>
          </div>

          {!editingProfile ? (
            <>
              <div className="sa-serif" style={{ fontSize: 26, marginBottom: 4 }}>
                {profile.name}{profile.lastName ? <> <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>{profile.lastName}.</em></> : <em style={{ fontStyle: 'italic', color: 'var(--sa-accent)' }}>.</em>}
              </div>
              <div className="sa-serif-it" style={{ fontSize: 13, color: 'var(--sa-ink-2)', marginBottom: 16 }}>
                {profile.heightFt}'{profile.heightIn}" · {profile.weight} lb · {profile.gym}
              </div>
            </>
          ) : (
            <div className="sa-enter" style={{ marginBottom: 16 }}>
              {[
                { label: 'FIRST NAME', val: editName,  set: setEditName,  ph: 'Name' },
                { label: 'LAST NAME',  val: editLast,  set: setEditLast,  ph: 'Last' },
                { label: 'GYM',        val: editGym,   set: setEditGym,   ph: 'Gym name' },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: 10 }}>
                  <div className="sa-label" style={{ fontSize: 9, marginBottom: 5 }}>{f.label}</div>
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{
                    width: '100%', padding: '10px 14px',
                    background: 'var(--sa-bg-2)', border: '1px solid var(--sa-rule-hi)',
                    borderRadius: 12, fontFamily: 'Newsreader, serif',
                    fontSize: 16, fontStyle: 'italic', color: 'var(--sa-ink-1)', outline: 'none',
                  }} />
                </div>
              ))}
              <button onClick={saveProfile} style={{
                width: '100%', padding: '11px 0', borderRadius: 100,
                background: 'var(--sa-accent)', border: 'none',
                fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: 15, color: '#14110e', cursor: 'pointer', marginTop: 4,
              }}>
                Save changes
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 0, paddingTop: 16, borderTop: '1px solid var(--sa-rule)' }}>
            <SaStat k="VISITS"  v={String(stats.visits  || 0)} light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="DAYS IN" v={String(stats.daysIn  || 0)} light />
            <div style={{ width: 1, background: 'var(--sa-rule)' }} />
            <SaStat k="STREAK"  v={String(stats.streak  || 0)} light />
          </div>
        </div>

        {/* Atmosphere */}
        <RoomSection title="Atmosphere" delay={0.15}>
          <RoomRow label="Light" sub="Dusk by default. Morning when bright.">
            <div style={{ display: 'flex', gap: 0, background: 'var(--sa-bg-2)', border: '1px solid var(--sa-rule)', borderRadius: 100, padding: 3 }}>
              {[{ id: false, ico: 'moon', label: 'Dusk' }, { id: true, ico: 'sun', label: 'Morning' }].map(o => {
                const on = light === o.id
                return (
                  <span key={String(o.id)} className="sa-tap" onClick={() => setLight(o.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 100,
                    background: on ? 'var(--sa-accent)' : 'transparent',
                    color: on ? '#14110e' : 'var(--sa-ink-2)',
                    fontFamily: 'Newsreader, serif', fontSize: 12,
                    fontStyle: on ? 'italic' : 'normal',
                    transition: 'all 0.55s var(--sa-settle)',
                  }}>
                    <SaIcon name={o.ico} size={12} color={on ? '#14110e' : 'currentColor'} />
                    {o.label}
                  </span>
                )
              })}
            </div>
          </RoomRow>
          <RoomRow label="Default mode" sub="The starting tempo.">
            <div style={{ display: 'flex', gap: 0, background: 'var(--sa-bg-2)', border: '1px solid var(--sa-rule)', borderRadius: 100, padding: 3 }}>
              {['def', 'str'].map(m => {
                const on = mode === m
                return (
                  <span key={m} className="sa-tap" onClick={() => setMode(m)} style={{
                    padding: '6px 14px', borderRadius: 100,
                    background: on ? 'var(--sa-accent)' : 'transparent',
                    color: on ? '#14110e' : 'var(--sa-ink-2)',
                    fontFamily: 'Newsreader, serif', fontStyle: on ? 'italic' : 'normal',
                    fontSize: 12, transition: 'all 0.55s var(--sa-settle)',
                  }}>
                    {m === 'def' ? 'Definition' : 'Strength'}
                  </span>
                )
              })}
            </div>
          </RoomRow>
          <RoomRow label="Ambient motion" sub="The slow breathing of the room." last>
            <SaSwitch on={ambient} onChange={setAmbient} />
          </RoomRow>
        </RoomSection>

        {/* Care */}
        <RoomSection title="Care" delay={0.2}>
          <RoomRow label="Hydration nudge" sub="A quiet reminder after each visit.">
            <SaSwitch on={hydration} onChange={setHydration} />
          </RoomRow>
          <RoomRow label="Haptics" sub="Soft taps between phases.">
            <SaSwitch on={haptics} onChange={setHaptics} />
          </RoomRow>
          <RoomRow label="Keep screen on" sub="During timer only." last>
            <SaSwitch on={keepOn} onChange={setKeepOn} />
          </RoomRow>
        </RoomSection>

        {/* Boundaries */}
        <RoomSection title="Boundaries" delay={0.25}>
          <RoomRow
            label="What you won't do"
            sub={banned.length > 0 ? `${banned.length} exercise${banned.length === 1 ? '' : 's'} banned` : 'Nothing banned yet'}
            chev
            last
            onClick={() => setBoundariesOpen(true)}
          />
        </RoomSection>

        {/* Gym hours */}
        <RoomSection title="Your gym" delay={0.28}>
          {/* Time pickers */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--sa-rule)', display: 'flex', gap: 12 }}>
            {[
              { label: 'OPENS', val: gymOpen, set: (v) => { setGymOpenState(v); store.updateProfile({ gymOpen: v }) } },
              { label: 'CLOSES', val: gymClose, set: (v) => { setGymCloseState(v); store.updateProfile({ gymClose: v }) } },
            ].map(f => (
              <div key={f.label} style={{ flex: 1 }}>
                <div className="sa-label" style={{ fontSize: 9, marginBottom: 6 }}>{f.label}</div>
                <input
                  type="time"
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--sa-bg-2)', border: '1px solid var(--sa-rule-hi)',
                    borderRadius: 12, fontFamily: 'Geist, monospace',
                    fontSize: 15, color: 'var(--sa-ink-1)', outline: 'none',
                    colorScheme: 'dark',
                  }}
                />
              </div>
            ))}
          </div>
          {/* Day toggles */}
          <div style={{ padding: '14px 20px' }}>
            <div className="sa-label" style={{ fontSize: 9, marginBottom: 8 }}>OPEN DAYS</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['M',1],['T',2],['W',3],['T',4],['F',5],['S',6],['S',0]].map(([lbl, d]) => {
                const on = gymDays.includes(d)
                return (
                  <span key={d + lbl} className="sa-tap" onClick={() => {
                    const next = on ? gymDays.filter(x => x !== d) : [...gymDays, d]
                    setGymDaysState(next)
                    store.updateProfile({ gymDays: next })
                  }} style={{
                    flex: 1, height: 34, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontFamily: 'Geist, monospace',
                    background: on ? 'var(--sa-accent)' : 'var(--sa-bg-2)',
                    color: on ? '#14110e' : 'var(--sa-ink-3)',
                    border: `1px solid ${on ? 'var(--sa-accent)' : 'var(--sa-rule)'}`,
                    transition: 'all 0.3s var(--sa-settle)',
                    userSelect: 'none',
                  }}>
                    {lbl}
                  </span>
                )
              })}
            </div>
          </div>
        </RoomSection>

        {/* Data backup */}
        <RoomSection title="Your Data" delay={0.3}>
          <RoomRow label="Export backup" sub="Download your history as a JSON file." last={false}>
            <span className="sa-tap" onClick={exportData}>
              <SaIcon name="drop" size={18} color="var(--sa-ink-2)" />
            </span>
          </RoomRow>
          <RoomRow label="Import backup" sub={importMsg || 'Restore from a previous export.'} last>
            <span className="sa-tap" onClick={() => fileRef.current?.click()}>
              <SaIcon name="plus" size={18} color="var(--sa-ink-2)" />
            </span>
          </RoomRow>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files?.[0]
              if (!file) return
              importData(
                file,
                () => { setImportMsg('Restored. Reload to apply.'); e.target.value = '' },
                (msg) => { setImportMsg(msg); e.target.value = '' },
              )
            }}
          />
        </RoomSection>

        <div className="sa-enter" style={{ marginTop: 36, padding: '24px 22px', textAlign: 'center', animationDelay: '0.35s' }}>
          <div className="sa-serif-it" style={{ fontSize: 15, color: 'var(--sa-ink-2)', marginBottom: 12, lineHeight: 1.5 }}>
            "An instrument. Every element serves a function,
            and that function is immediately legible."
          </div>
          <div className="sa-label" style={{ fontSize: 9, color: 'var(--sa-ink-3)' }}>VERSION 2.0 · THE SANCTUARY · 2026</div>
        </div>
      </div>

      <SaDock tab="room" onTab={(t) => setTab(t)} />

      {/* Boundaries sheet */}
      {boundariesOpen && (
        <div style={{
          position: 'absolute', inset: 0, background: 'var(--sa-bg-0)',
          zIndex: 20, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--sa-rule)' }}>
            <span className="sa-label">WHAT YOU WON'T DO</span>
            <span className="sa-tap" onClick={() => setBoundariesOpen(false)}>
              <SaIcon name="close" size={18} color="var(--sa-ink-2)" />
            </span>
          </div>
          <div style={{ padding: '12px 18px 8px' }}>
            <div style={{ fontSize: 12, color: 'var(--sa-ink-3)', lineHeight: 1.5 }}>
              Banned exercises are removed from all generated routines.
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 32px' }}>
            {ALL_EXERCISE_KEYS.map(key => {
              const ex    = EX[key]
              const isBan = banned.includes(key)
              return (
                <div key={key} className="sa-tap" onClick={() => toggleBan(key)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 4px', borderBottom: '1px solid var(--sa-rule)',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Newsreader, serif', fontWeight: 400, fontSize: 15, color: isBan ? 'var(--sa-ink-4)' : 'var(--sa-ink-1)', textDecoration: isBan ? 'line-through' : 'none' }}>
                      {ex.n}
                    </div>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: 6,
                    border: `1px solid ${isBan ? 'var(--sa-str)' : 'var(--sa-rule-hi)'}`,
                    background: isBan ? 'var(--sa-str)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s var(--sa-settle)',
                  }}>
                    {isBan && <SaIcon name="close" size={10} color="#14110e" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
