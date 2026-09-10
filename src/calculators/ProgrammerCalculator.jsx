import { useState, useEffect, useCallback } from 'react';
import { useHistory } from '../context/HistoryContext';
import CopyButton from '../components/CopyButton';
import styles from './ProgrammerCalculator.module.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WORD_SIZES = { 8: 0xFF, 16: 0xFFFF, 32: 0xFFFFFFFF, 64: Number.MAX_SAFE_INTEGER };

const toBase = (value, base, wordSize) => {
  if (value === '' || isNaN(Number(value))) return '0';
  const num = BigInt(Math.floor(Number(value))) & BigInt(WORD_SIZES[wordSize]);
  if (base === 2) return num.toString(2);
  if (base === 8) return num.toString(8);
  if (base === 10) return num.toString(10);
  if (base === 16) return num.toString(16).toUpperCase();
  return '0';
};

// Group binary into nibbles (groups of 4) for readability
const formatBinary = (bin) => {
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, '0');
  return padded.match(/.{1,4}/g).join(' ');
};

const BASES = [
  { label: 'HEX', base: 16 },
  { label: 'DEC', base: 10 },
  { label: 'OCT', base: 8  },
  { label: 'BIN', base: 2  },
];

const BITWISE_OPS = ['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProgrammerCalculator() {
  const { addHistoryEntry } = useHistory();

  const [currentBase, setCurrentBase] = useState(10);   // active input base
  const [wordSize, setWordSize]       = useState(32);   // 8 / 16 / 32 / 64
  const [input, setInput]             = useState('0');  // decimal string
  const [stored, setStored]           = useState(null); // first operand (decimal)
  const [pendingOp, setPendingOp]     = useState(null); // 'AND' | 'OR' | 'XOR' ...
  const [justEvaled, setJustEvaled]   = useState(false);

  // ── Derived display values ─────────────────────────────────────────────────
  const numVal = () => {
    try {
      let n;
      if (currentBase === 10) n = parseInt(input, 10);
      else if (currentBase === 16) n = parseInt(input, 16);
      else if (currentBase === 8)  n = parseInt(input, 8);
      else n = parseInt(input, 2);
      return isNaN(n) ? 0 : n;
    } catch { return 0; }
  };

  const decValue = numVal();
  const masked = decValue & WORD_SIZES[wordSize];

  const displayFor = (base) => {
    const v = toBase(masked, base, wordSize);
    return base === 2 ? formatBinary(v) : v;
  };

  // ── Input handling ─────────────────────────────────────────────────────────
  const appendDigit = useCallback((d) => {
    const validDigits = {
      16: '0123456789ABCDEFabcdef',
      10: '0123456789',
      8:  '01234567',
      2:  '01',
    };
    if (!validDigits[currentBase].includes(d)) return;

    setInput(prev => {
      if (justEvaled) { setJustEvaled(false); return d; }
      const next = prev === '0' ? d : prev + d;
      return next.toUpperCase();
    });
  }, [currentBase, justEvaled]);

  const clearAll = useCallback(() => {
    setInput('0');
    setStored(null);
    setPendingOp(null);
    setJustEvaled(false);
  }, []);

  const backspace = useCallback(() => {
    if (justEvaled) { clearAll(); return; }
    setInput(prev => prev.length <= 1 ? '0' : prev.slice(0, -1));
  }, [justEvaled, clearAll]);

  const toggleSign = useCallback(() => {
    const n = decValue;
    if (n === 0) return;
    setInput((-n & WORD_SIZES[wordSize]).toString(currentBase === 10 ? 10 : 16).toUpperCase());
  }, [decValue, wordSize, currentBase]);

  // ── Bitwise operations ─────────────────────────────────────────────────────
  const applyBitwiseBinary = useCallback((op) => {
    if (stored !== null && !justEvaled) {
      // Evaluate the pending op first
      const a = stored & WORD_SIZES[wordSize];
      const b = decValue & WORD_SIZES[wordSize];
      let result;
      switch (pendingOp) {
        case 'AND':  result = a & b; break;
        case 'OR':   result = a | b; break;
        case 'XOR':  result = a ^ b; break;
        case 'NAND': result = (~(a & b)) & WORD_SIZES[wordSize]; break;
        case 'NOR':  result = (~(a | b)) & WORD_SIZES[wordSize]; break;
        default:     result = b;
      }
      const resultDec = result.toString(10);
      addHistoryEntry('Programmer', `${stored} ${pendingOp} ${decValue}`, resultDec);
      setStored(result);
      setInput(currentBase === 10 ? resultDec : result.toString(currentBase).toUpperCase());
    } else {
      setStored(decValue);
    }
    setPendingOp(op);
    setJustEvaled(true);
  }, [stored, decValue, pendingOp, wordSize, currentBase, addHistoryEntry, justEvaled]);

  const applyNOT = useCallback(() => {
    const result = (~decValue) & WORD_SIZES[wordSize];
    addHistoryEntry('Programmer', `NOT ${decValue}`, result.toString(10));
    setInput(currentBase === 10 ? result.toString(10) : result.toString(currentBase).toUpperCase());
    setJustEvaled(true);
  }, [decValue, wordSize, currentBase, addHistoryEntry]);

  const applyShift = useCallback((dir) => {
    const a = decValue & WORD_SIZES[wordSize];
    const result = dir === 'L' ? (a << 1) & WORD_SIZES[wordSize] : (a >> 1) & WORD_SIZES[wordSize];
    addHistoryEntry('Programmer', `${decValue} ${dir === 'L' ? '<<' : '>>'} 1`, result.toString(10));
    setInput(currentBase === 10 ? result.toString(10) : result.toString(currentBase).toUpperCase());
    setJustEvaled(true);
  }, [decValue, wordSize, currentBase, addHistoryEntry]);

  const calculate = useCallback(() => {
    if (stored === null || pendingOp === null) return;
    const a = stored & WORD_SIZES[wordSize];
    const b = decValue & WORD_SIZES[wordSize];
    let result;
    switch (pendingOp) {
      case 'AND':  result = a & b; break;
      case 'OR':   result = a | b; break;
      case 'XOR':  result = a ^ b; break;
      case 'NAND': result = (~(a & b)) & WORD_SIZES[wordSize]; break;
      case 'NOR':  result = (~(a | b)) & WORD_SIZES[wordSize]; break;
      default: return;
    }
    const resultDec = result.toString(10);
    addHistoryEntry('Programmer', `${stored} ${pendingOp} ${decValue}`, resultDec);
    setInput(currentBase === 10 ? resultDec : result.toString(currentBase).toUpperCase());
    setStored(null);
    setPendingOp(null);
    setJustEvaled(true);
  }, [stored, pendingOp, decValue, wordSize, currentBase, addHistoryEntry]);

  // ── Base switching ─────────────────────────────────────────────────────────
  const switchBase = useCallback((newBase) => {
    // Re-encode input in the new base
    const val = decValue;
    if (newBase === 10) setInput(val.toString(10));
    else if (newBase === 16) setInput(val.toString(16).toUpperCase() || '0');
    else if (newBase === 8)  setInput(val.toString(8) || '0');
    else setInput(val.toString(2) || '0');
    setCurrentBase(newBase);
  }, [decValue]);

  // ── Keyboard support ───────────────────────────────────────────────────────
  useEffect(() => {
    const valid = {
      16: '0123456789ABCDEFabcdef',
      10: '0123456789',
      8:  '01234567',
      2:  '01',
    };
    const handleKey = (e) => {
      if (valid[currentBase].includes(e.key)) { e.preventDefault(); appendDigit(e.key.toUpperCase()); }
      if (e.key === 'Backspace') { e.preventDefault(); backspace(); }
      if (e.key === 'Escape')    { e.preventDefault(); clearAll(); }
      if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); calculate(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentBase, appendDigit, backspace, clearAll, calculate]);

  // ── Helpers for button disabled state ─────────────────────────────────────
  const isDigitEnabled = (d) => {
    const maxDigit = { 2: 1, 8: 7, 10: 9, 16: 15 }[currentBase];
    if (currentBase === 16) return true;
    return parseInt(d, 16) <= maxDigit;
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <div className={styles.calculator}>

        {/* Top bar: base selector + word size */}
        <div className={styles.topBar}>
          <div className={styles.baseTabs}>
            {BASES.map(({ label, base }) => (
              <button
                key={base}
                className={`${styles.baseTab} ${currentBase === base ? styles.baseTabActive : ''}`}
                onClick={() => switchBase(base)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.wordSizeTabs}>
            {[8, 16, 32, 64].map(size => (
              <button
                key={size}
                className={`${styles.wordSizeTab} ${wordSize === size ? styles.wordSizeTabActive : ''}`}
                onClick={() => setWordSize(size)}
              >
                {size}‑bit
              </button>
            ))}
          </div>
        </div>

        {/* Multi-base live display */}
        <div className={styles.display}>
          {BASES.map(({ label, base }) => {
            const isActive = base === currentBase;
            const displayVal = displayFor(base).replace(/ /g, '');
            return (
              <div
                key={base}
                className={`${styles.baseRow} ${isActive ? styles.baseRowActive : ''}`}
                onClick={() => switchBase(base)}
                style={{ cursor: 'pointer' }}
              >
                <span className={`${styles.baseLabel} ${isActive ? styles.baseLabelActive : ''}`}>
                  {label}
                </span>
                <span className={`${styles.baseValue} ${isActive ? styles.baseValueActive : ''}`}>
                  {displayFor(base)}
                </span>
                <CopyButton text={displayVal} />
              </div>
            );
          })}
          {/* Two's Complement row */}
          <div className={styles.baseRow} style={{ borderTop: '1px dashed var(--border)', marginTop: '0.25rem', paddingTop: '0.5rem' }}>
            <span className={styles.baseLabel} style={{ fontSize: '0.7rem' }}>2's C</span>
            <span className={styles.baseValue} style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {(() => {
                const signed = masked > (WORD_SIZES[wordSize] >> 1)
                  ? masked - WORD_SIZES[wordSize] - 1
                  : masked;
                return signed.toString(10);
              })()}
            </span>
          </div>
        </div>

        {/* Bit Map Visualizer */}
        {(() => {
          const bits = Math.min(wordSize, 32);
          const binStr = masked.toString(2).padStart(bits, '0').slice(-bits);
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '0.3rem', justifyContent: 'flex-end' }}>
              {Array.from({ length: bits }).map((_, i) => {
                const bitIndex = bits - 1 - i;
                const isSet = binStr[i] === '1';
                const flipBit = () => {
                  const newMasked = isSet ? masked & ~(1 << bitIndex) : masked | (1 << bitIndex);
                  setInput(currentBase === 10 ? newMasked.toString(10) : newMasked.toString(currentBase).toUpperCase());
                  setJustEvaled(false);
                };
                return (
                  <div key={bitIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{bitIndex}</span>
                    <button
                      onClick={flipBit}
                      style={{
                        width: '22px', height: '22px',
                        background: isSet ? 'var(--accent)' : 'var(--bg-surface-2)',
                        border: `1px solid ${isSet ? 'var(--accent)' : 'var(--border)'}`,
                        borderRadius: '3px',
                        color: isSet ? '#fff' : 'var(--text-muted)',
                        fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.15s',
                        fontFamily: 'monospace',
                      }}
                    >
                      {isSet ? '1' : '0'}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Pending op banner */}
        {pendingOp && (
          <div className={styles.opBanner}>
            <span><span className={styles.opLabel}>{pendingOp}</span> operation pending…</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>stored: {stored}</span>
          </div>
        )}

        {/* Keypad — 8 columns */}
        <div className={styles.keypad}>
          {/* Row 1: Bitwise ops */}
          {['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR'].map(op => (
            <button
              key={op}
              className={`${styles.btn} ${styles.btnOp} ${pendingOp === op ? styles.btnOpActive : ''}`}
              onClick={() => op === 'NOT' ? applyNOT() : applyBitwiseBinary(op)}
            >
              {op}
            </button>
          ))}
          <button className={`${styles.btn} ${styles.btnShift}`} onClick={() => applyShift('L')}>
            &lt;&lt;
          </button>
          <button className={`${styles.btn} ${styles.btnShift}`} onClick={() => applyShift('R')}>
            &gt;&gt;
          </button>

          {/* Row 2: Hex A–F + AC + ⌫ */}
          {['A', 'B', 'C', 'D', 'E', 'F'].map(d => (
            <button
              key={d}
              className={`${styles.btn} ${styles.btnHex} ${currentBase !== 16 ? styles.btnDisabled : ''}`}
              onClick={() => appendDigit(d)}
            >
              {d}
            </button>
          ))}
          <button className={`${styles.btn} ${styles.btnAction}`} onClick={clearAll}>AC</button>
          <button className={`${styles.btn} ${styles.btnAction}`} onClick={backspace}>⌫</button>

          {/* Row 3–5: digit pad 7–9, 4–6, 1–3 + 0 */}
          {['7', '8', '9'].map(d => (
            <button
              key={d}
              className={`${styles.btn} ${!isDigitEnabled(d) ? styles.btnDisabled : ''}`}
              onClick={() => appendDigit(d)}
            >
              {d}
            </button>
          ))}
          {/* placeholder to push = to the right side */}
          <span />
          {['4', '5', '6'].map(d => (
            <button
              key={d}
              className={`${styles.btn} ${!isDigitEnabled(d) ? styles.btnDisabled : ''}`}
              onClick={() => appendDigit(d)}
            >
              {d}
            </button>
          ))}
          <span />
          {['1', '2', '3'].map(d => (
            <button
              key={d}
              className={`${styles.btn} ${!isDigitEnabled(d) ? styles.btnDisabled : ''}`}
              onClick={() => appendDigit(d)}
            >
              {d}
            </button>
          ))}
          <span />
          <button className={styles.btn} onClick={() => appendDigit('0')}>0</button>
          <button className={`${styles.btn} ${styles.btnAction}`} onClick={toggleSign}>+/−</button>
          <button className={`${styles.btn} ${styles.btnAction}`}>MOD</button>
          <span />
          <button
            className={`${styles.btn} ${styles.btnEqual}`}
            onClick={calculate}
            style={{ gridColumn: 'span 2' }}
          >
            =
          </button>
        </div>

        {/* Explainer */}
        <div className={styles.explainer}>
          <strong>How to use:</strong> Select a <em>base</em> (HEX/DEC/OCT/BIN) to type in — all 4 representations update live. Choose a <em>word size</em> to limit the result to 8/16/32/64 bits. Use <em>bitwise operators</em> (AND, OR, XOR…) between two numbers exactly like a normal operator then press <strong>=</strong>. Shift buttons (<em>&lt;&lt; &gt;&gt;</em>) instantly shift the current value left or right by 1 bit. Click any base row to switch to that base.
        </div>
      </div>
    </div>
  );
}
