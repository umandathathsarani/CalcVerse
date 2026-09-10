import { useState, useCallback } from 'react';

/**
 * CopyButton — copies `text` to clipboard and briefly shows a ✓ tick.
 * Props:
 *   text      — string to copy
 *   size      — 'sm' | 'md' (default 'sm')
 *   label     — optional visible label next to the icon
 */
export default function CopyButton({ text, size = 'sm', label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = String(text);
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  const pad = size === 'md' ? '0.45rem 0.9rem' : '0.3rem 0.65rem';
  const fontSize = size === 'md' ? '0.85rem' : '0.75rem';

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: pad,
        fontSize,
        fontWeight: 600,
        background: copied ? 'var(--accent-light)' : 'var(--bg-surface-2)',
        border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
        color: copied ? 'var(--accent)' : 'var(--text-secondary)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {copied ? '✓' : '⎘'}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
}
