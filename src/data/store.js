import { useState, useCallback } from 'react'

const STORE_KEY = 'sa-store-v1'

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_PROFILE = {
  name:      'Brayden',
  lastName:  'L',
  gym:       'Club Greenwood',
  weight:    149,
  heightFt:  5,
  heightIn:  10,
  onboarded: false,
  banned:    [],
}

const DEFAULT_PREFS = {
  mode:      'def',
  light:     false,
  haptics:   true,
  ambient:   true,
  hydration: true,
  keepOn:    true,
}

// ── Time helpers ──────────────────────────────────────────────────────────────

export function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function dayKey(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function daysAgo(timestamp) {
  return Math.max(0, Math.round((dayKey() - dayKey(new Date(timestamp))) / 86400000))
}

export function weekMonday(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() || 7
  d.setDate(d.getDate() - (day - 1))
  return d
}

// ── Derived stats ─────────────────────────────────────────────────────────────

function computeStreak(sessions) {
  if (!sessions.length) return 0
  const days = new Set(sessions.map(s => dayKey(new Date(s.timestamp))))
  let cur = dayKey()
  if (!days.has(cur)) {
    cur -= 86400000
    if (!days.has(cur)) return 0
  }
  let streak = 0
  while (days.has(cur)) { streak++; cur -= 86400000 }
  return streak
}

function computeDaysIn(sessions) {
  if (!sessions.length) return 0
  const first = Math.min(...sessions.map(s => s.timestamp))
  return Math.max(1, Math.round((Date.now() - first) / 86400000))
}

function commonMood(sessions) {
  if (!sessions.length) return null
  const c = {}
  sessions.forEach(s => { if (s.mood) c[s.mood] = (c[s.mood] || 0) + 1 })
  const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0]
  return top ? top[0] : null
}

// ── Storage I/O ───────────────────────────────────────────────────────────────

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function buildStore(raw) {
  const base     = raw || {}
  const profile  = { ...DEFAULT_PROFILE, ...(base.profile  || {}) }
  const prefs    = { ...DEFAULT_PREFS,   ...(base.prefs    || {}) }
  const checkins = Array.isArray(base.checkins) ? base.checkins : []
  const rawSess  = Array.isArray(base.sessions) ? base.sessions : []
  const sessions = [...rawSess].sort((a, b) => b.timestamp - a.timestamp)

  const now4w   = Date.now() - 28 * 86400000
  const recent  = sessions.filter(s => s.timestamp >= now4w)

  const stats = {
    visits:           sessions.length,
    daysIn:           computeDaysIn(sessions),
    streak:           computeStreak(sessions),
    lastSession:      sessions[0] || null,
    lastVisitDaysAgo: sessions[0] ? daysAgo(sessions[0].timestamp) : null,
    recentVisits:     recent.length,
    recentHours:      +(recent.reduce((s, e) => s + (e.duration || 0), 0) / 60).toFixed(1),
    recentAvgMood:    commonMood(recent),
  }

  const thisWeekCheckin = checkins.find(c => c.weekKey === isoWeekKey()) || null

  return { profile, prefs, checkins, sessions, stats, thisWeekCheckin }
}

function persist(store) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      profile:  store.profile,
      prefs:    store.prefs,
      checkins: store.checkins,
      sessions: store.sessions,
    }))
  } catch { /* quota / SSR */ }
}

// ── Backup utilities ──────────────────────────────────────────────────────────

export function exportData() {
  const raw = localStorage.getItem(STORE_KEY) || '{}'
  const blob = new Blob([raw], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'athletic-backup.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file, onSuccess, onError) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result)
      if (!parsed.sessions && !parsed.profile) throw new Error('Unrecognized format')
      localStorage.setItem(STORE_KEY, JSON.stringify(parsed))
      onSuccess()
    } catch { onError('Could not read backup file.') }
  }
  reader.readAsText(file)
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSanctuaryStore() {
  const [store, setStore] = useState(() => buildStore(loadRaw()))

  const update = useCallback((updater) => {
    setStore(prev => {
      const next = buildStore(updater(prev))
      persist(next)
      return next
    })
  }, [])

  const saveCheckin = useCallback((data) => {
    update(prev => ({
      ...prev,
      checkins: [
        ...prev.checkins.filter(c => c.weekKey !== isoWeekKey()),
        { ...data, weekKey: isoWeekKey(), date: new Date().toISOString().slice(0, 10) },
      ],
      profile: {
        ...prev.profile,
        ...(data.weight   !== undefined ? { weight:   data.weight   } : {}),
        ...(data.heightFt !== undefined ? { heightFt: data.heightFt } : {}),
        ...(data.heightIn !== undefined ? { heightIn: data.heightIn } : {}),
      },
    }))
  }, [update])

  const saveSession = useCallback((data) => {
    update(prev => ({
      ...prev,
      sessions: [...prev.sessions, {
        id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        date:      new Date().toISOString().slice(0, 10),
        ...data,
      }],
    }))
  }, [update])

  const deleteSession = useCallback((id) => {
    update(prev => ({ ...prev, sessions: prev.sessions.filter(s => s.id !== id) }))
  }, [update])

  const updateSession = useCallback((id, data) => {
    update(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === id ? { ...s, ...data } : s),
    }))
  }, [update])

  const updateProfile = useCallback((data) => {
    update(prev => ({ ...prev, profile: { ...prev.profile, ...data } }))
  }, [update])

  const updatePrefs = useCallback((data) => {
    update(prev => ({ ...prev, prefs: { ...prev.prefs, ...data } }))
  }, [update])

  return { ...store, saveCheckin, saveSession, deleteSession, updateSession, updateProfile, updatePrefs }
}
