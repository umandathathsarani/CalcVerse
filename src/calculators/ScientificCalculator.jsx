import { useState, useCallback } from 'react';
import { useHistory } from '../context/HistoryContext';
import CopyButton from '../components/CopyButton';
import styles from './ScientificCalculator.module.css';
import * as math from 'mathjs';

const MAX_DIGITS = 15;

export default function ScientificCalculator() {
  const { addHistoryEntry } = useHistory();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [memory, setMemory] = useState(0);
  
  // Scientific toggles
  const [isDeg, setIsDeg] = useState(true);
  const [isInv, setIsInv] = useState(false);
  const [isHyp, setIsHyp] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // Evaluate math expression
  const evaluateExpression = (exprStr, degMode) => {
    try {
      if (!exprStr) return 0;
      
      const scope = {
         sin: (x) => degMode ? Math.sin(x * Math.PI / 180) : Math.sin(x),
         cos: (x) => degMode ? Math.cos(x * Math.PI / 180) : Math.cos(x),
         tan: (x) => degMode ? Math.tan(x * Math.PI / 180) : Math.tan(x),
         asin: (x) => degMode ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
         acos: (x) => degMode ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
         atan: (x) => degMode ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
         sinh: (x) => Math.sinh(x),
         cosh: (x) => Math.cosh(x),
         tanh: (x) => Math.tanh(x),
         asinh: (x) => Math.asinh(x),
         acosh: (x) => Math.acosh(x),
         atanh: (x) => Math.atanh(x),
         log: (x, base) => base ? Math.log(x) / Math.log(base) : Math.log10(x),
         ln: (x) => Math.log(x),
         pi: Math.PI,
         e: Math.E,
      };

      // Clean up UI symbols for mathjs
      let cleanExpr = exprStr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/√\(/g, 'sqrt(')
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        .replace(/π/g, 'pi')
        .replace(/e/g, 'e');

      const res = math.evaluate(cleanExpr, scope);
      if (res === undefined || isNaN(res) || !isFinite(res)) throw new Error('Error');
      
      // Fix tiny floating point errors from JS math (e.g. sin(180) = 1.22e-16)
      if (Math.abs(res) < 1e-10) return 0;
      
      return parseFloat(res.toPrecision(MAX_DIGITS));
    } catch (err) {
      return 'Error';
    }
  };

  const formatNumber = (num) => {
    if (num === 'Error') return 'Error';
    if (!num && num !== 0) return '';
    const strNum = num.toString();
    if (strNum.includes('e')) return parseFloat(num).toPrecision(7);
    
    const [integer, decimal] = strNum.split('.');
    let formattedInt = parseInt(integer, 10);
    if (isNaN(formattedInt)) return strNum;
    
    formattedInt = new Intl.NumberFormat('en-US').format(formattedInt);
    return decimal != null ? `${formattedInt}.${decimal}` : formattedInt;
  };

  const handleInput = useCallback((val) => {
    if (hasEvaluated) {
      // If typing an operator after equals, continue the equation from the result
      if (/[\+\-\×\÷\^]/.test(val)) {
        setExpression(result !== 'Error' ? result.toString() + val : val);
      } else {
        setExpression(val);
      }
      setHasEvaluated(false);
      return;
    }
    setExpression(prev => prev + val);
  }, [hasEvaluated, result]);

  const calculate = useCallback(() => {
    if (!expression) return;
    const evaluated = evaluateExpression(expression, isDeg);
    
    setResult(evaluated);
    setHasEvaluated(true);

    if (evaluated !== 'Error') {
      addHistoryEntry('Scientific', expression, evaluated.toString());
    }
  }, [expression, isDeg, addHistoryEntry]);

  const clearAll = useCallback(() => {
    setExpression('');
    setResult('0');
    setHasEvaluated(false);
  }, []);

  const deleteChar = useCallback(() => {
    if (hasEvaluated) {
      clearAll();
      return;
    }
    setExpression(prev => prev.slice(0, -1));
  }, [hasEvaluated, clearAll]);

  // Memory functions
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => handleInput(memory.toString());
  const memoryAdd = () => {
    const val = hasEvaluated ? result : evaluateExpression(expression, isDeg);
    if (val !== 'Error') setMemory(prev => prev + parseFloat(val));
  };
  const memorySubtract = () => {
    const val = hasEvaluated ? result : evaluateExpression(expression, isDeg);
    if (val !== 'Error') setMemory(prev => prev - parseFloat(val));
  };
  const memoryStore = () => {
    const val = hasEvaluated ? result : evaluateExpression(expression, isDeg);
    if (val !== 'Error') setMemory(parseFloat(val));
  };

  // Helper to get function name based on inv/hyp state
  const getTrigFunc = (base) => {
    let name = base;
    if (isHyp) name = name + 'h';
    if (isInv) name = 'a' + name;
    return name;
  };

  const getTrigLabel = (base) => {
    let label = base;
    if (isHyp) label = label + 'h';
    if (isInv) label = label + '⁻¹';
    return label;
  };

  return (
    <div className={styles.container}>
      <div className={styles.calculator}>
        <div className={styles.topBar}>
          <button className={`${styles.toggleBtn} ${isDeg ? styles.toggleBtnActive : ''}`} onClick={() => setIsDeg(true)}>DEG</button>
          <button className={`${styles.toggleBtn} ${!isDeg ? styles.toggleBtnActive : ''}`} onClick={() => setIsDeg(false)}>RAD</button>
        </div>

        <div className={styles.display}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div className={styles.previous} style={{ flex: 1 }}>{expression || '\u00A0'}</div>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
              {/* Unclosed parentheses badge */}
              {(() => {
                const open  = (expression.match(/\(/g) || []).length;
                const close = (expression.match(/\)/g) || []).length;
                const diff = open - close;
                return diff > 0 ? (
                  <span title={`${diff} unclosed parenthesis`} style={{
                    background: 'var(--accent-light)', color: 'var(--accent)',
                    border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)',
                    fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.4rem',
                  }}>
                    ({diff}
                  </span>
                ) : null;
              })()}
              <CopyButton text={expression} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div className={styles.current} style={{ flex: 1, textAlign: 'right' }}>{formatNumber(result)}</div>
            <CopyButton text={result !== 'Error' ? result : ''} />
          </div>
        </div>

        <div className={styles.memoryRow}>
          <button className={styles.memBtn} onClick={memoryClear}>MC</button>
          <button className={styles.memBtn} onClick={memoryRecall}>MR</button>
          <button className={styles.memBtn} onClick={memoryAdd}>M+</button>
          <button className={styles.memBtn} onClick={memorySubtract}>M-</button>
          <button className={styles.memBtn} onClick={memoryStore}>MS</button>
        </div>

        <div className={styles.keypad}>
          {/* Row 1 */}
          <button className={`${styles.btn} ${styles.btnSecondary} ${isInv ? styles.toggleBtnActive : ''}`} onClick={() => setIsInv(!isInv)}>INV</button>
          <button className={`${styles.btn} ${styles.btnSecondary} ${isHyp ? styles.toggleBtnActive : ''}`} onClick={() => setIsHyp(!isHyp)}>HYP</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput('(')}>(</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput(')')}>)</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={clearAll}>AC</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={deleteChar}>⌫</button>

          {/* Row 2 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput(getTrigFunc('sin') + '(')}>{getTrigLabel('sin')}</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput(getTrigFunc('cos') + '(')}>{getTrigLabel('cos')}</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput(getTrigFunc('tan') + '(')}>{getTrigLabel('tan')}</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput('%')}>%</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput('!')}>x!</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleInput('÷')}>÷</button>

          {/* Row 3 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput(isInv ? 'e^(' : 'ln(')}>{isInv ? 'eˣ' : 'ln'}</button>
          <button className={styles.btn} onClick={() => handleInput('7')}>7</button>
          <button className={styles.btn} onClick={() => handleInput('8')}>8</button>
          <button className={styles.btn} onClick={() => handleInput('9')}>9</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput('mod(')}>mod</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleInput('×')}>×</button>

          {/* Row 4 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput(isInv ? '10^(' : 'log(')}>{isInv ? '10ˣ' : 'log'}</button>
          <button className={styles.btn} onClick={() => handleInput('4')}>4</button>
          <button className={styles.btn} onClick={() => handleInput('5')}>5</button>
          <button className={styles.btn} onClick={() => handleInput('6')}>6</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput('log(')}>logᵧx</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleInput('-')}>-</button>

          {/* Row 5 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput(isInv ? '²' : '√(')}>{isInv ? 'x²' : '√x'}</button>
          <button className={styles.btn} onClick={() => handleInput('1')}>1</button>
          <button className={styles.btn} onClick={() => handleInput('2')}>2</button>
          <button className={styles.btn} onClick={() => handleInput('3')}>3</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput('1/(')}>1/x</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleInput('+')}>+</button>

          {/* Row 6 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleInput('^')}>xʸ</button>
          <button className={styles.btn} onClick={() => handleInput('0')}>0</button>
          <button className={styles.btn} onClick={() => handleInput('.')}>.</button>
          <button className={styles.btn} onClick={() => handleInput('π')}>π</button>
          <button className={styles.btn} onClick={() => handleInput('e')}>e</button>
          <button className={`${styles.btn} ${styles.btnEqual}`} onClick={calculate}>=</button>
        </div>
      </div>
    </div>
  );
}
