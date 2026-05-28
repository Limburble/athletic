import React from 'react'

/* ─────────────────────────────────────────────────────────────────
   MuscleMap — a quiet anatomy for the Deep screen.

   Front + back figures composed of soft muscle "tiles". Worked muscles
   glow in the active accent (--sa-accent) and breathe; supporting movers
   sit at a third of the light; everything else rests at parchment-dim.
   No striations, no clinical detail — a sanctuary body.

   Uses existing tokens (--sa-accent, --sa-accent-glow, --sa-ink-3/4) and
   the sa-breath keyframe already in index.css. No new dependencies.

     <MuscleMap active={['chest']} secondary={['triceps','frontDelt']} mode="def" />

   Groups: chest · backLats · traps · lowerBack · frontDelt · rearDelt
           biceps · triceps · abs · obliques · quads · glutes · hams
           calves · forearms
   ───────────────────────────────────────────────────────────────── */

/* Region geometry. Front figure centred on x=60, back on x=190 (+130).
   Primitive forms: ['e',cx,cy,rx,ry] ellipse · ['r',x,y,w,h,r] rounded
   rect · ['path', d]. viewBox 0 0 250 296. Back-figure ids end in 'B'. */
export const MM_REGIONS = {
  // neutral structure (never lights)
  headF:    { group: 'neutral', p: [['e', 60, 20, 14, 16]] },
  neckF:    { group: 'neutral', p: [['r', 53, 33, 14, 9, 4]] },
  pelvisF:  { group: 'neutral', p: [['r', 43, 145, 34, 20, 8]] },
  kneeLF:   { group: 'neutral', p: [['e', 51, 226, 8, 5]] },
  kneeRF:   { group: 'neutral', p: [['e', 69, 226, 8, 5]] },
  handLF:   { group: 'neutral', p: [['e', 18, 150, 6, 7]] },
  handRF:   { group: 'neutral', p: [['e', 102, 150, 6, 7]] },
  footLF:   { group: 'neutral', p: [['e', 50, 281, 9, 6]] },
  footRF:   { group: 'neutral', p: [['e', 70, 281, 9, 6]] },
  headB:    { group: 'neutral', p: [['e', 190, 20, 14, 16]] },
  neckB:    { group: 'neutral', p: [['r', 183, 33, 14, 9, 4]] },
  elbowLB:  { group: 'neutral', p: [['e', 148, 104, 6, 5]] },
  elbowRB:  { group: 'neutral', p: [['e', 232, 104, 6, 5]] },
  handLB:   { group: 'neutral', p: [['e', 148, 150, 6, 7]] },
  handRB:   { group: 'neutral', p: [['e', 232, 150, 6, 7]] },
  kneeLB:   { group: 'neutral', p: [['e', 181, 214, 8, 5]] },
  kneeRB:   { group: 'neutral', p: [['e', 199, 214, 8, 5]] },
  footLB:   { group: 'neutral', p: [['e', 181, 281, 9, 6]] },
  footRB:   { group: 'neutral', p: [['e', 199, 281, 9, 6]] },

  // front muscle tiles
  deltLF:    { group: 'frontDelt', p: [['e', 36, 53, 12, 11]] },
  deltRF:    { group: 'frontDelt', p: [['e', 84, 53, 12, 11]] },
  pecLF:     { group: 'chest',     p: [['e', 50, 67, 12, 11]] },
  pecRF:     { group: 'chest',     p: [['e', 70, 67, 12, 11]] },
  bicepLF:   { group: 'biceps',    p: [['r', 14, 58, 12, 44, 6]] },
  bicepRF:   { group: 'biceps',    p: [['r', 94, 58, 12, 44, 6]] },
  forearmLF: { group: 'forearms',  p: [['r', 13, 104, 11, 42, 5]] },
  forearmRF: { group: 'forearms',  p: [['r', 96, 104, 11, 42, 5]] },
  absU:      { group: 'abs',       p: [['r', 50, 90, 20, 26, 6]] },
  absL:      { group: 'abs',       p: [['r', 50, 118, 20, 26, 6]] },
  obliqueLF: { group: 'obliques',  p: [['r', 37, 92, 11, 48, 5]] },
  obliqueRF: { group: 'obliques',  p: [['r', 72, 92, 11, 48, 5]] },
  quadLF:    { group: 'quads',     p: [['r', 43, 166, 16, 56, 8]] },
  quadRF:    { group: 'quads',     p: [['r', 61, 166, 16, 56, 8]] },
  shinLF:    { group: 'neutral',   p: [['r', 45, 232, 13, 44, 6]] },
  shinRF:    { group: 'neutral',   p: [['r', 62, 232, 13, 44, 6]] },

  // back muscle tiles
  trapB:      { group: 'traps',     p: [['path', 'M190 40 L208 56 L190 66 L172 56 Z']] },
  rearDeltLB: { group: 'rearDelt',  p: [['e', 166, 54, 12, 11]] },
  rearDeltRB: { group: 'rearDelt',  p: [['e', 214, 54, 12, 11]] },
  latLB:      { group: 'backLats',  p: [['path', 'M174 64 C168 82 172 98 186 106 L190 106 L190 66 Z']] },
  latRB:      { group: 'backLats',  p: [['path', 'M206 64 C212 82 208 98 194 106 L190 106 L190 66 Z']] },
  lowerBackB: { group: 'lowerBack', p: [['r', 180, 106, 20, 26, 5]] },
  tricepLB:   { group: 'triceps',   p: [['r', 144, 58, 12, 44, 6]] },
  tricepRB:   { group: 'triceps',   p: [['r', 224, 58, 12, 44, 6]] },
  forearmLB:  { group: 'forearms',  p: [['r', 143, 110, 11, 40, 5]] },
  forearmRB:  { group: 'forearms',  p: [['r', 226, 110, 11, 40, 5]] },
  gluteLB:    { group: 'glutes',    p: [['e', 181, 145, 13, 13]] },
  gluteRB:    { group: 'glutes',    p: [['e', 199, 145, 13, 13]] },
  hamLB:      { group: 'hams',      p: [['r', 173, 160, 16, 52, 8]] },
  hamRB:      { group: 'hams',      p: [['r', 191, 160, 16, 52, 8]] },
  calfLB:     { group: 'calves',    p: [['r', 174, 218, 14, 44, 7]] },
  calfRB:     { group: 'calves',    p: [['r', 192, 218, 14, 44, 7]] },
}

const MM_LABEL = {
  chest: 'Chest', backLats: 'Lats', traps: 'Traps', lowerBack: 'Lower back',
  frontDelt: 'Shoulders', rearDelt: 'Shoulders', biceps: 'Biceps',
  triceps: 'Triceps', abs: 'Abs', obliques: 'Obliques', quads: 'Quads',
  glutes: 'Glutes', hams: 'Hamstrings', calves: 'Calves', forearms: 'Forearms',
}

function renderPrim(prim, key, fill, style) {
  const [t] = prim
  const common = { key, fill, stroke: 'none', style }
  if (t === 'e') { const [, cx, cy, rx, ry] = prim; return <ellipse {...common} cx={cx} cy={cy} rx={rx} ry={ry} /> }
  if (t === 'r') { const [, x, y, w, h, r] = prim; return <rect {...common} x={x} y={y} width={w} height={h} rx={r} /> }
  const [, d] = prim; return <path {...common} d={d} />
}

export default function MuscleMap({
  active = [], secondary = [], mode = 'def',
  width = 180, showBack = true, breathe = true,
}) {
  const activeSet = new Set(active)
  const secSet = new Set(secondary)
  const vbW = showBack ? 250 : 122
  const ratio = 296 / vbW

  const tiles = []
  Object.entries(MM_REGIONS).forEach(([id, def]) => {
    if (!showBack && id.endsWith('B')) return
    const g = def.group
    const on = activeSet.has(g)
    const sec = !on && secSet.has(g)

    let fill, style
    if (g === 'neutral') {
      fill = 'var(--sa-ink-4)'; style = { opacity: 0.32 }
    } else if (on) {
      fill = 'var(--sa-accent)'
      style = {
        opacity: 0.92,
        filter: 'drop-shadow(0 0 5px var(--sa-accent-glow)) drop-shadow(0 0 10px var(--sa-accent-glow))',
        animation: breathe ? 'sa-breath 3.4s var(--sa-breathe) infinite' : 'none',
        transition: 'opacity 0.6s var(--sa-settle)',
      }
    } else if (sec) {
      fill = 'var(--sa-accent)'; style = { opacity: 0.34, transition: 'opacity 0.6s var(--sa-settle)' }
    } else {
      fill = 'var(--sa-ink-3)'; style = { opacity: 0.16, transition: 'opacity 0.6s var(--sa-settle)' }
    }
    def.p.forEach((prim, i) => tiles.push(renderPrim(prim, `${id}-${i}`, fill, style)))
  })

  return (
    <svg
      data-sa-mode={mode}
      width={width}
      height={Math.round(width * ratio)}
      viewBox={showBack ? '0 0 250 296' : '0 0 122 296'}
      fill="none"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {tiles}
    </svg>
  )
}

/* Exercise key → muscle groups. Keys match EX in src/data/exercises.js.
   p = primary movers, s = secondary. */
export const EX_MUSCLES = {
  // Chest
  benchPress:   { p: ['chest'], s: ['triceps', 'frontDelt'] },
  inclineDB:    { p: ['chest'], s: ['frontDelt', 'triceps'] },
  declineBench: { p: ['chest'], s: ['triceps'] },
  dipsChest:    { p: ['chest'], s: ['triceps', 'frontDelt'] },
  cableFly:     { p: ['chest'], s: ['frontDelt'] },
  lowCableFly:  { p: ['chest'], s: ['frontDelt'] },
  pecFly:       { p: ['chest'], s: [] },
  chestPress:   { p: ['chest'], s: ['triceps', 'frontDelt'] },
  smithBench:   { p: ['chest'], s: ['triceps', 'frontDelt'] },
  inclineSmith: { p: ['chest'], s: ['frontDelt', 'triceps'] },
  dbFly:        { p: ['chest'], s: [] },
  // Back
  pullUp:            { p: ['backLats'], s: ['biceps', 'rearDelt'] },
  latPulldown:       { p: ['backLats'], s: ['biceps'] },
  closeGripPulldown: { p: ['backLats'], s: ['biceps'] },
  cableRow:          { p: ['backLats', 'traps'], s: ['biceps', 'rearDelt'] },
  wideRow:           { p: ['backLats'], s: ['rearDelt'] },
  straightPull:      { p: ['backLats'], s: [] },
  singleArmRow:      { p: ['backLats'], s: ['biceps'] },
  underhandPulldown: { p: ['backLats'], s: ['biceps'] },
  ropeRow:           { p: ['traps', 'backLats'], s: ['rearDelt'] },
  facePull:          { p: ['rearDelt', 'traps'], s: [] },
  // Shoulders
  ohpDB:         { p: ['frontDelt'], s: ['triceps', 'traps'] },
  shoulderPress: { p: ['frontDelt'], s: ['triceps'] },
  lateralRaise:  { p: ['frontDelt', 'rearDelt'], s: [] },
  facePullSh:    { p: ['rearDelt'], s: ['traps'] },
  dbLateral:     { p: ['frontDelt', 'rearDelt'], s: [] },
  // Biceps
  barbellCurl:       { p: ['biceps'], s: ['forearms'] },
  inclineCurl:       { p: ['biceps'], s: [] },
  preacherCurl:      { p: ['biceps'], s: [] },
  hammerCurl:        { p: ['biceps', 'forearms'], s: [] },
  machineCurl:       { p: ['biceps'], s: [] },
  cableCurl:         { p: ['biceps'], s: [] },
  concentrationCurl: { p: ['biceps'], s: [] },
  spiderCurl:        { p: ['biceps'], s: [] },
  reverseCurl:       { p: ['forearms'], s: ['biceps'] },
  // Triceps
  triPushdown:       { p: ['triceps'], s: [] },
  barPushdown:       { p: ['triceps'], s: [] },
  skullCrusher:      { p: ['triceps'], s: [] },
  dipsTri:           { p: ['triceps'], s: ['chest'] },
  ohTricep:          { p: ['triceps'], s: [] },
  cableOHTricep:     { p: ['triceps'], s: [] },
  closeGripSmith:    { p: ['triceps'], s: ['chest', 'frontDelt'] },
  singleArmPushdown: { p: ['triceps'], s: [] },
  diamondPushup:     { p: ['triceps'], s: ['chest', 'frontDelt'] },
  // Legs
  smithSquat: { p: ['quads', 'glutes'], s: ['hams', 'lowerBack'] },
  legPress:   { p: ['quads', 'glutes'], s: ['hams'] },
  legCurl:    { p: ['hams'], s: ['calves'] },
  legExt:     { p: ['quads'], s: [] },
  calfRaise:  { p: ['calves'], s: [] },
  hipAbduct:  { p: ['glutes'], s: [] },
  hipAdduct:  { p: ['quads'], s: ['glutes'] },
  // Core / abs
  weightedCrunch:   { p: ['abs'], s: [] },
  weightedSitUp:    { p: ['abs'], s: [] },
  russianTwist:     { p: ['obliques'], s: ['abs'] },
  straightLegRaise: { p: ['abs'], s: [] },
  toeTouchCrunch:   { p: ['abs'], s: [] },
  slowTempoCrunch:  { p: ['abs'], s: [] },
  abWheelRollout:   { p: ['abs'], s: ['obliques', 'lowerBack'] },
  hollowBodyHold:   { p: ['abs'], s: [] },
  plank:            { p: ['abs'], s: ['obliques', 'glutes'] },
  sidePlank:        { p: ['obliques'], s: ['abs'] },
  plankShoulderTap: { p: ['abs', 'obliques'], s: ['frontDelt'] },
}

/* Pretty label from a primary group list, e.g. ['chest'] → "Chest" */
export function muscleLabel(groups = []) {
  const seen = []
  groups.forEach(g => { const l = MM_LABEL[g]; if (l && !seen.includes(l)) seen.push(l) })
  return seen.join(' · ')
}
