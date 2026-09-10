import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HiXMark, HiOutlineCommandLine } from 'react-icons/hi2';

const SHORTCUTS = {
  '/calculators/basic': [
    { key: '0–9', desc: 'Type a digit' },
    { key: '+ - * /', desc: 'Arithmetic operators' },
    { key: 'Enter or =', desc: 'Calculate result' },
    { key: 'Escape', desc: 'Clear all (AC)' },
    { key: 'Backspace', desc: 'Delete last digit' },
    { key: '%', desc: 'Percentage' },
  ],
  '/calculators/scientific': [
    { key: '0–9 . ( )', desc: 'Build expression' },
    { key: '+ - * /', desc: 'Arithmetic operators' },
    { key: 'Enter or =', desc: 'Evaluate expression' },
    { key: 'Escape', desc: 'Clear all' },
    { key: 'Backspace', desc: 'Delete last character' },
  ],
  '/calculators/programmer': [
    { key: '0–9, A–F', desc: 'Type digit (valid for current base)' },
    { key: 'Enter or =', desc: 'Evaluate pending operation' },
    { key: 'Escape', desc: 'Clear all' },
    { key: 'Backspace', desc: 'Delete last digit' },
  ],
  '/calculators/graphing': [
    { key: 'Scroll wheel', desc: 'Zoom in / out on graph' },
    { key: 'Click + drag', desc: 'Pan the graph' },
  ],
  default: [
    { key: '?', desc: 'Open keyboard shortcuts' },
    { key: 'Escape', desc: 'Close this modal' },
  ],
};

export default function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === '?' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        setOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const shortcuts = SHORTCUTS[location.pathname] || SHORTCUTS.default;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Keyboard shortcuts (?)"
        style={{
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.target.style.background = 'var(--accent-light)'; e.target.style.color = 'var(--accent)'; e.target.style.borderColor = 'var(--accent)'; }}
        onMouseLeave={e => { e.target.style.background = 'var(--bg-surface-2)'; e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)'; }}
      >
        <HiOutlineCommandLine size={18} />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Keyboard Shortcuts
              </h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer', lineHeight: 1 }}>
                <HiXMark size={18} />
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {shortcuts.map(({ key, desc }) => (
                  <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0', paddingRight: '1rem' }}>
                      <kbd style={{
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '0.2rem 0.5rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}>
                        {key}
                      </kbd>
                    </td>
                    <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: '1.25rem', marginBottom: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Press <kbd style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}>?</kbd> anytime to toggle this panel
            </p>
          </div>
        </div>
      )}
    </>
  );
}
