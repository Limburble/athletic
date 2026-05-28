/* Shared atoms for Athletic — Field Notes */

// Icon set — minimal, hand-curated. 1.5px stroke, 22px viewBox.
const FNIcon = ({ name, size = 18, color = 'currentColor', strokeWidth = 1.5 }) => {
  const paths = {
    arrow:   <path d="M3 11h16M13 5l6 6-6 6" />,
    back:    <path d="M19 11H3M9 17l-6-6 6-6" />,
    close:   <path d="M5 5l12 12M17 5L5 17" />,
    check:   <path d="M4 12l5 5 11-11" />,
    play:    <path d="M6 4l13 8-13 8z" fill={color} stroke="none" />,
    pause:   <g><rect x="6" y="4" width="4" height="16" fill={color} stroke="none"/><rect x="14" y="4" width="4" height="16" fill={color} stroke="none"/></g>,
    skip:    <g><path d="M5 5l10 7-10 7z" fill={color} stroke="none"/><rect x="17" y="5" width="2" height="14" fill={color} stroke="none"/></g>,
    reset:   <g><path d="M4 11a8 8 0 1 1 2.4 5.7"/><path d="M4 17v-5h5"/></g>,
    plus:    <path d="M11 4v14M4 11h14" />,
    minus:   <path d="M4 11h14" />,
    chevR:   <path d="M8 5l6 6-6 6" />,
    chevD:   <path d="M5 8l6 6 6-6" />,
    chevU:   <path d="M5 14l6-6 6 6" />,
    dot:     <circle cx="11" cy="11" r="3" fill={color} stroke="none" />,
    settings:<g><circle cx="11" cy="11" r="3"/><path d="M11 1v3M11 18v3M21 11h-3M4 11H1M18 4l-2.1 2.1M6.1 15.9L4 18M18 18l-2.1-2.1M6.1 6.1L4 4"/></g>,
    history: <g><circle cx="11" cy="11" r="8"/><path d="M11 6v5l3 2"/></g>,
    plus_sm: <path d="M11 5v12M5 11h12" />,
    timer:   <g><circle cx="11" cy="12" r="7"/><path d="M11 12V8M8 2h6"/></g>,
    dumb:    <g><path d="M3 8v6M5 6v10M9 9v4h6V9zM17 6v10M19 8v6"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none"
         stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// Display number with leading-zero pad + tabular figures
const FNNum = ({ value, pad = 2, suffix, sx = {} }) => {
  const s = String(value).padStart(pad, '0');
  return (
    <span className="t-mono" style={{ fontVariantNumeric: 'tabular-nums', ...sx }}>
      {s}{suffix}
    </span>
  );
};

// Athlet|ic wordmark — serif italic on the "ic"
const FNWordmark = ({ size = 28, color = 'var(--ink-1)' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'baseline', lineHeight: 1, color }}>
    <span className="t-serif" style={{ fontSize: size, fontWeight: 700, letterSpacing: '-0.02em' }}>Athlet</span>
    <span className="t-serif-it" style={{ fontSize: size, fontWeight: 500, letterSpacing: '-0.02em' }}>ic</span>
  </span>
);

// "Field Notes" section heading: serial number + small title + optional rule
const FNHead = ({ num, title, right, sx = {} }) => (
  <div className="fn-section-head" style={sx}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      {num !== undefined && <span className="fn-serial">№ {String(num).padStart(2, '0')}</span>}
      <span className="t-label" style={{ color: 'var(--ink-1)' }}>{title}</span>
    </div>
    {right && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>}
  </div>
);

// Spec row — left label, right tabular value
const FNRow = ({ k, v, sub, accent }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    padding: '13px 0', borderBottom: '1px solid var(--rule)',
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 15, fontWeight: 500, color: accent ? 'var(--accent-hi)' : 'var(--ink-1)' }}>{k}</span>
      {sub && <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>{sub}</span>}
    </div>
    <span className="t-mono" style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-1)' }}>{v}</span>
  </div>
);

// Top bar: wordmark left, mode tag center, kebab right
const FNTopBar = ({ mode = 'def', onMenu, right }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px 14px',
    borderBottom: '1px solid var(--rule)',
  }}>
    <FNWordmark size={22} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span className="fn-mode-tag">[ {mode === 'def' ? 'DEFINITION' : 'STRENGTH'} ]</span>
      {right || (
        <span className="tap" onClick={onMenu}>
          <FNIcon name="settings" size={18} color="var(--ink-2)" />
        </span>
      )}
    </div>
  </div>
);

// Bottom dock — Build / Timer / Log
const FNDock = ({ tab, onTab, mode = 'def' }) => {
  const Item = ({ id, label, num }) => {
    const on = tab === id;
    return (
      <div className="tap" onClick={() => onTab(id)}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '12px 0 14px', gap: 6,
          borderTop: on ? '2px solid var(--ink-1)' : '2px solid transparent',
          marginTop: -1,
        }}>
        <span className="t-mono" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-3)' }}>{num}</span>
        <span style={{
          fontFamily: 'Fraunces, serif',
          fontStyle: on ? 'italic' : 'normal',
          fontWeight: on ? 600 : 500,
          fontSize: 17,
          letterSpacing: '-0.02em',
          color: on ? 'var(--ink-1)' : 'var(--ink-2)',
        }}>{label}</span>
      </div>
    );
  };
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      borderTop: '1px solid var(--rule)',
      background: 'var(--paper)',
    }}>
      <Item id="build" label="Build"   num="01" />
      <Item id="timer" label="Timer"   num="02" />
      <Item id="log"   label="Log"     num="03" />
    </div>
  );
};

Object.assign(window, { FNIcon, FNNum, FNWordmark, FNHead, FNRow, FNTopBar, FNDock });
