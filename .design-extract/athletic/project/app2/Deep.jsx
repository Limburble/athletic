/* Deep — immersive timer running. The focused mental tunnel. */

const SaDeep = ({ state, onClose }) => {
  const {
    mode = 'def',
    phase = 'work',           // 'work' | 'rest' | 'set' | 'done'
    timeLeft = 28,
    totalRound = 40,
    round = 2,
    totalRounds = 4,
    exName = 'Russian twist',
    nextName = 'Ab wheel rollout',
  } = state;

  const isWork = phase === 'work';
  const isRest = phase === 'rest';
  const isDone = phase === 'done';

  const pct = isDone ? 100 : Math.min(100, Math.max(0, (1 - timeLeft / totalRound) * 100));

  // Phase tone — the room temperature
  const phaseLabel = isWork ? 'In the work' : isRest ? 'Rest' : 'Complete';

  return (
    <div className="sa-app" data-sa-mode={mode}
      style={{
        height: '100%',
        background: isRest ? 'var(--sa-bg-0)' : 'var(--sa-bg-1)',
        display: 'flex', flexDirection: 'column',
      }}>
      {/* Phase-adjusted aura — work breathes faster */}
      <div className="sa-aura" style={{
        animationDuration: isWork ? '6s' : '14s',
        opacity: isWork ? 1 : 0.6,
      }} />

      {/* Top: minimal progress thread + close */}
      <div style={{
        position: 'relative',
        padding: '14px 24px 0',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'rgba(255,255,255,0.05)',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--sa-accent)',
            boxShadow: '0 0 12px var(--sa-accent-glow)',
            transition: 'width 0.9s linear',
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sa-tap" onClick={onClose}>
            <SaIcon name="close" size={20} color="var(--sa-ink-3)" />
          </span>
          <span className="sa-tag">
            <span className="dot" style={{ animation: isWork ? 'sa-breath 1.8s var(--sa-breathe) infinite' : 'none' }} />
            {phaseLabel}
          </span>
          <span className="sa-tap">
            <SaIcon name="waves" size={20} color="var(--sa-ink-3)" />
          </span>
        </div>
      </div>

      {/* Body — the number and the name */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px',
        position: 'relative',
      }}>
        {/* Soft halo behind the number */}
        <div style={{
          position: 'absolute',
          width: 360, height: 360,
          background: 'radial-gradient(closest-side, var(--sa-accent-aura), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'sa-breath 4s var(--sa-breathe) infinite',
        }} />

        <div style={{
          fontFamily: 'Newsreader, serif',
          fontWeight: 200,
          fontSize: 260,
          letterSpacing: '-0.05em',
          lineHeight: 0.85,
          color: 'var(--sa-ink-1)',
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 60px var(--sa-accent-glow)',
          position: 'relative',
        }}>
          {isDone ? '✓' : String(timeLeft).padStart(2,'0')}
        </div>

        <div className="sa-serif-it" style={{
          fontSize: 22, color: 'var(--sa-ink-2)',
          marginTop: 18, textAlign: 'center', position: 'relative',
        }}>
          {isDone ? 'you can let go.' : exName.toLowerCase() + '.'}
        </div>

        {isRest && nextName && (
          <div className="sa-label" style={{
            fontSize: 10, marginTop: 28, color: 'var(--sa-ink-3)',
            position: 'relative',
          }}>
            NEXT · {nextName.toUpperCase()}
          </div>
        )}
      </div>

      {/* Round pips — soft */}
      {!isDone && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '0 0 18px', position: 'relative' }}>
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div key={i} style={{
              width: 24, height: 3, borderRadius: 100,
              background: i < round
                ? 'var(--sa-accent)'
                : 'rgba(255,255,255,0.08)',
              boxShadow: i === round - 1 ? '0 0 10px var(--sa-accent-glow)' : 'none',
              transition: 'all 0.55s var(--sa-settle)',
            }} />
          ))}
        </div>
      )}

      {/* Controls — three quiet pills, no rectangles */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '12px 32px 32px',
        position: 'relative',
      }}>
        <button className="sa-tap" style={{
          width: 52, height: 52, borderRadius: 100, border: '1px solid var(--sa-rule-hi)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SaIcon name="reset" size={20} color="var(--sa-ink-2)" />
        </button>

        <button className="sa-tap" style={{
          width: 88, height: 88, borderRadius: 100, border: 'none',
          background: 'var(--sa-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 40px var(--sa-accent-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
          <SaIcon name={isDone ? 'check' : 'pause_lg'} size={isDone ? 32 : 28} color="#14110e" />
        </button>

        <button className="sa-tap" style={{
          width: 52, height: 52, borderRadius: 100, border: '1px solid var(--sa-rule-hi)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SaIcon name="skip" size={20} color="var(--sa-ink-2)" />
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { SaDeep });
