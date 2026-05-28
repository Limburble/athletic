/* Sanctuary atoms — softer counterparts to Field Notes */

// Athlet|ic wordmark — Newsreader light, italic ic
const SaMark = ({ size = 28, color = 'var(--sa-ink-1)' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'baseline', lineHeight: 1, color }}>
    <span style={{
      fontFamily: 'Newsreader, serif',
      fontWeight: 300,
      fontSize: size,
      letterSpacing: '-0.025em',
    }}>Athlet</span>
    <span style={{
      fontFamily: 'Newsreader, serif',
      fontStyle: 'italic',
      fontWeight: 300,
      fontSize: size,
      letterSpacing: '-0.015em',
    }}>ic</span>
  </span>
);

// Soft icon set — 1px stroke, ample roundness
const SaIcon = ({ name, size = 20, color = 'currentColor', strokeWidth = 1.25 }) => {
  const paths = {
    arrow:    <path d="M3 12h18M14 5l7 7-7 7" />,
    arrowSm:  <path d="M5 12h14M11 5l7 7-7 7" />,
    back:     <path d="M21 12H3M9 19l-6-7 6-7" />,
    close:    <path d="M5 5l14 14M19 5L5 19" />,
    check:    <path d="M4 13l5 5 11-12" />,
    play:     <path d="M7 5l13 7-13 7z" fill={color} stroke="none" />,
    pause:    <g><rect x="7" y="5" width="3" height="14" rx="1.2" fill={color} stroke="none"/><rect x="14" y="5" width="3" height="14" rx="1.2" fill={color} stroke="none"/></g>,
    skip:     <g><path d="M5 5l11 7-11 7z" fill={color} stroke="none"/><rect x="17.5" y="5" width="2" height="14" rx="1" fill={color} stroke="none"/></g>,
    reset:    <g><path d="M4 12a8 8 0 1 1 2.5 5.8"/><path d="M4 19v-6h6"/></g>,
    plus:     <path d="M12 5v14M5 12h14" />,
    minus:    <path d="M5 12h14" />,
    chevR:    <path d="M9 6l6 6-6 6" />,
    chevD:    <path d="M6 9l6 6 6-6" />,
    dot:      <circle cx="12" cy="12" r="3" fill={color} stroke="none" />,
    flower:   <g><circle cx="12" cy="12" r="2"/><path d="M12 8a3 3 0 0 0 0 6M12 8a3 3 0 0 1 0 6M8 12a3 3 0 0 0 6 0M8 12a3 3 0 0 1 6 0"/></g>,
    moon:     <path d="M19 14.5A8 8 0 0 1 9.5 5a8 8 0 1 0 9.5 9.5z" />,
    sun:      <g><circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></g>,
    leaf:     <g><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19l8-8"/></g>,
    drop:     <path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z" />,
    waves:    <g><path d="M3 9c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/><path d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/></g>,
    timer:    <g><circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 3h6"/></g>,
    pause_lg: <g><rect x="6" y="4" width="4" height="16" rx="1.5" fill={color} stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1.5" fill={color} stroke="none"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// The "DEFINITION" / "STRENGTH" tag — soft, with glowing dot
const SaModeTag = ({ mode, sx = {} }) => (
  <span className="sa-tag" style={sx}>
    <span className="dot" />
    {mode === 'def' ? 'Definition' : mode === 'str' ? 'Strength' : 'Cool down'}
  </span>
);

// Top bar — minimal — wordmark + time + mode indicator
const SaTopBar = ({ mode = 'def', onMenu, right, pad = 16 }) => {
  const now = new Date();
  const hour = now.getHours();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(/\s/g, '');
  const todIcon = hour >= 6 && hour < 18 ? 'sun' : 'moon';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `${pad}px 24px`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <SaMark size={20} />
        <span style={{
          fontFamily: 'Newsreader, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 13,
          color: 'var(--sa-ink-3)',
          letterSpacing: '-0.01em',
        }}>{time}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <SaModeTag mode={mode} />
        {right || (
          <span className="sa-tap" onClick={onMenu}>
            <SaIcon name={todIcon} size={18} color="var(--sa-ink-2)" />
          </span>
        )}
      </div>
    </div>
  );
};

// Bottom dock — three glyphs, no labels (you know where you are)
const SaDock = ({ tab, onTab }) => {
  const items = [
    { id: 'tonight', label: 'Tonight', icon: 'moon' },
    { id: 'deep',    label: 'Deep',    icon: 'timer' },
    { id: 'log',     label: 'Log',     icon: 'flower' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, padding: '14px 24px 18px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: 6,
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--sa-rule)',
        borderRadius: 100,
      }}>
        {items.map(it => {
          const on = tab === it.id;
          return (
            <div key={it.id} className="sa-tap" onClick={() => onTab(it.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: on ? '10px 18px' : '10px 14px',
                background: on ? 'var(--sa-bg-3)' : 'transparent',
                borderRadius: 100,
                transition: 'all 0.6s var(--sa-settle)',
                color: on ? 'var(--sa-ink-1)' : 'var(--sa-ink-3)',
              }}>
              <SaIcon name={it.icon} size={16}
                color={on ? 'var(--sa-accent)' : 'currentColor'} />
              {on && (
                <span style={{
                  fontFamily: 'Newsreader, serif',
                  fontStyle: 'italic',
                  fontSize: 14, fontWeight: 400,
                  color: 'var(--sa-ink-1)',
                }}>{it.label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Spec/Stat group — soft rows with hairline rules
const SaStat = ({ k, v, sub, light }) => (
  <div style={{ flex: 1, textAlign: 'center', padding: '4px 0' }}>
    <div className="sa-label" style={{ fontSize: 9, marginBottom: 8, color: 'var(--sa-ink-3)' }}>{k}</div>
    <div style={{
      fontFamily: 'Newsreader, serif',
      fontWeight: light ? 200 : 300,
      fontSize: 28,
      color: 'var(--sa-ink-1)',
      letterSpacing: '-0.02em',
      lineHeight: 1,
    }}>{v}</div>
    {sub && <div className="sa-label" style={{ fontSize: 9, marginTop: 4, color: 'var(--sa-ink-3)' }}>{sub}</div>}
  </div>
);

// Soft toggle
const SaSwitch = ({ on, onChange }) => (
  <div className="sa-tap" onClick={() => onChange(!on)}
    style={{
      width: 46, height: 26, padding: 2,
      background: on ? 'var(--sa-accent)' : 'rgba(255,255,255,0.08)',
      borderRadius: 100,
      display: 'flex',
      justifyContent: on ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      transition: 'all 0.55s var(--sa-settle)',
      boxShadow: on ? '0 0 16px var(--sa-accent-glow)' : 'none',
    }}>
    <div style={{
      width: 22, height: 22, borderRadius: 100,
      background: on ? '#14110e' : 'var(--sa-ink-2)',
      transition: 'all 0.55s var(--sa-settle)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    }} />
  </div>
);

// Floating CTA dock — sits at bottom over the scroll area, fades content
// behind it so the page never feels "ended". Use position:relative on parent.
const SaFloatingDock = ({ children, pad = 24 }) => (
  <div style={{
    position: 'absolute', left: 0, right: 0, bottom: 0,
    paddingTop: 48,
    paddingBottom: pad,
    paddingLeft: 24, paddingRight: 24,
    background: 'linear-gradient(to top, var(--sa-bg-0) 0%, var(--sa-bg-0) 38%, rgba(20,17,14,0.6) 72%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 5,
  }}>
    <div style={{ pointerEvents: 'auto' }}>
      {children}
    </div>
  </div>
);

Object.assign(window, { SaMark, SaIcon, SaModeTag, SaTopBar, SaDock, SaStat, SaSwitch, SaFloatingDock });
