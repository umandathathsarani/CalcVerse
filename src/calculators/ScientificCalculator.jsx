import { useState, useEffect, useCallback } from 'react';
import { useHistory } from '../context/HistoryContext';
import styles from './ScientificCalculator.module.css';

const MAX_DIGITS = 15;

export default function ScientificCalculator() {
  const { addHistoryEntry } = useHistory();
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState('');
  const [operation, setOperation] = useState(null);
  const [isNewInput, setIsNewInput] = useState(true);
  
  // Scientific toggles
  const [isDeg, setIsDeg] = useState(true);
  const [isInv, setIsInv] = useState(false);

  // Format numbers to look nice
  const formatNumber = (num) => {
    if (!num) return '';
    if (num === '-' || num === 'Error') return num;
    
    // Handle e notation natively or if extremely large
    if (num.toString().includes('e')) {
      return parseFloat(num).toPrecision(7);
    }
    
    const [integer, decimal] = num.toString().split('.');
    if (integer === '') return num;

    let formattedInt = parseFloat(integer);
    if (isNaN(formattedInt)) return '';
    
    formattedInt = new Intl.NumberFormat('en-US').format(formattedInt);
    
    if (decimal != null) {
      return `${formattedInt}.${decimal}`;
    }
    return formattedInt;
  };

  const handleDigit = useCallback((digit) => {
    if (isNewInput) {
      if (digit === '.') {
        setCurrent('0.');
      } else {
        setCurrent(digit);
      }
      setIsNewInput(false);
      return;
    }
    
    if (digit === '.' && current.includes('.')) return;
    if (current.replace(/[^0-9]/g, '').length >= MAX_DIGITS) return;
    
    if (current === '0' && digit !== '.') {
      setCurrent(digit);
    } else {
      setCurrent(prev => prev + digit);
    }
  }, [current, isNewInput]);

  const handleOperation = useCallback((op) => {
    if (current === 'Error') return;
    
    if (previous !== '' && !isNewInput) {
      calculate();
    }
    
    // For x^y, we use '^'
    // For y root x, we use 'y√x'
    setOperation(op);
    setPrevious(current);
    setIsNewInput(true);
  }, [current, previous, isNewInput]);

  const calculate = useCallback(() => {
    if (!previous || !current || !operation) return;
    
    const prevNum = parseFloat(previous);
    const currentNum = parseFloat(current);
    
    if (isNaN(prevNum) || isNaN(currentNum)) return;
    
    let result = 0;
    switch (operation) {
      case '+': result = prevNum + currentNum; break;
      case '-': result = prevNum - currentNum; break;
      case '×': result = prevNum * currentNum; break;
      case '÷': 
        if (currentNum === 0) {
          setCurrent('Error');
          setPrevious('');
          setOperation(null);
          setIsNewInput(true);
          return;
        }
        result = prevNum / currentNum; 
        break;
      case '^': result = Math.pow(prevNum, currentNum); break;
      case 'y√x': 
        if (prevNum < 0 && currentNum % 2 === 0) {
           setCurrent('Error');
           setPrevious('');
           setOperation(null);
           setIsNewInput(true);
           return;
        }
        // y root x is x^(1/y) -- but prevNum is x, currentNum is y, or vice versa?
        // Standard is: previous is x, current is y -> x^(1/y)
        result = Math.pow(prevNum, 1 / currentNum); 
        break;
      case 'EXP':
        result = prevNum * Math.pow(10, currentNum);
        break;
      default: return;
    }
    
    result = parseFloat(result.toPrecision(MAX_DIGITS));
    const resultStr = result.toString();
    
    addHistoryEntry(
      'Scientific',
      `${formatNumber(previous)} ${operation} ${formatNumber(current)}`,
      formatNumber(resultStr)
    );
    
    setCurrent(resultStr);
    setPrevious('');
    setOperation(null);
    setIsNewInput(true);
  }, [current, previous, operation, addHistoryEntry]);

  const handleImmediateFunc = useCallback((func) => {
    if (current === 'Error') return;
    const num = parseFloat(current);
    if (isNaN(num)) return;

    let result = 0;
    let expStr = '';

    const toRad = (d) => d * (Math.PI / 180);
    const fromRad = (r) => r * (180 / Math.PI);

    switch (func) {
      case 'sin':
        result = isDeg ? Math.sin(toRad(num)) : Math.sin(num);
        expStr = `sin(${num})`;
        break;
      case 'cos':
        result = isDeg ? Math.cos(toRad(num)) : Math.cos(num);
        expStr = `cos(${num})`;
        break;
      case 'tan':
        result = isDeg ? Math.tan(toRad(num)) : Math.tan(num);
        expStr = `tan(${num})`;
        break;
      case 'asin':
        result = isDeg ? fromRad(Math.asin(num)) : Math.asin(num);
        expStr = `sin⁻¹(${num})`;
        break;
      case 'acos':
        result = isDeg ? fromRad(Math.acos(num)) : Math.acos(num);
        expStr = `cos⁻¹(${num})`;
        break;
      case 'atan':
        result = isDeg ? fromRad(Math.atan(num)) : Math.atan(num);
        expStr = `tan⁻¹(${num})`;
        break;
      case 'ln':
        if (num <= 0) { result = 'Error'; break; }
        result = Math.log(num);
        expStr = `ln(${num})`;
        break;
      case 'log':
        if (num <= 0) { result = 'Error'; break; }
        result = Math.log10(num);
        expStr = `log(${num})`;
        break;
      case 'ex':
        result = Math.exp(num);
        expStr = `e^${num}`;
        break;
      case '10x':
        result = Math.pow(10, num);
        expStr = `10^${num}`;
        break;
      case 'sqrt':
        if (num < 0) { result = 'Error'; break; }
        result = Math.sqrt(num);
        expStr = `√${num}`;
        break;
      case 'cbrt':
        result = Math.cbrt(num);
        expStr = `³√${num}`;
        break;
      case 'sq':
        result = Math.pow(num, 2);
        expStr = `${num}²`;
        break;
      case 'cube':
        result = Math.pow(num, 3);
        expStr = `${num}³`;
        break;
      case 'fact':
        if (num < 0 || !Number.isInteger(num)) { result = 'Error'; break; }
        let f = 1;
        for (let i = 2; i <= num; i++) f *= i;
        result = f;
        expStr = `${num}!`;
        break;
      case 'inv':
        if (num === 0) { result = 'Error'; break; }
        result = 1 / num;
        expStr = `1/${num}`;
        break;
      default:
        return;
    }

    if (result === 'Error' || isNaN(result)) {
      setCurrent('Error');
    } else {
      // Fix floating point quirks for trig functions (e.g. cos(90 deg) = 6.123233995736766e-17)
      if (Math.abs(result) < 1e-10) result = 0;
      
      result = parseFloat(result.toPrecision(MAX_DIGITS));
      const resStr = result.toString();
      addHistoryEntry('Scientific', expStr, formatNumber(resStr));
      setCurrent(resStr);
    }
    setIsNewInput(true);
  }, [current, isDeg, addHistoryEntry]);

  const insertConstant = useCallback((constant) => {
    let val = 0;
    if (constant === 'pi') val = Math.PI;
    if (constant === 'e') val = Math.E;
    
    val = parseFloat(val.toPrecision(MAX_DIGITS)).toString();
    setCurrent(val);
    setIsNewInput(true);
  }, []);

  const clearAll = useCallback(() => {
    setCurrent('0');
    setPrevious('');
    setOperation(null);
    setIsNewInput(true);
  }, []);

  const deleteDigit = useCallback(() => {
    if (isNewInput || current === 'Error') return;
    
    if (current.length === 1 || (current.length === 2 && current.startsWith('-'))) {
      setCurrent('0');
      setIsNewInput(true);
    } else {
      setCurrent(prev => prev.slice(0, -1));
    }
  }, [current, isNewInput]);

  const toggleSign = useCallback(() => {
    if (current === '0' || current === 'Error') return;
    if (current.startsWith('-')) {
      setCurrent(current.slice(1));
    } else {
      setCurrent('-' + current);
    }
  }, [current]);

  const handlePercentage = useCallback(() => {
    if (current === 'Error') return;
    const num = parseFloat(current);
    if (isNaN(num)) return;
    
    const result = (num / 100).toString();
    setCurrent(result);
    setIsNewInput(true);
  }, [current]);

  return (
    <div className={styles.container}>
      <div className={styles.calculator}>
        <div className={styles.topBar}>
          <button 
            className={`${styles.toggleBtn} ${isDeg ? styles.toggleBtnActive : ''}`}
            onClick={() => setIsDeg(true)}
          >
            DEG
          </button>
          <button 
            className={`${styles.toggleBtn} ${!isDeg ? styles.toggleBtnActive : ''}`}
            onClick={() => setIsDeg(false)}
          >
            RAD
          </button>
        </div>

        <div className={styles.display}>
          <div className={styles.previous}>
            {previous ? `${formatNumber(previous)} ${operation}` : ''}
          </div>
          <div className={styles.current}>
            {current === 'Error' ? 'Error' : formatNumber(current)}
          </div>
        </div>

        <div className={styles.keypad}>
          {/* Row 1 */}
          <button className={`${styles.btn} ${styles.btnSecondary} ${isInv ? styles.toggleBtnActive : ''}`} onClick={() => setIsInv(!isInv)}>INV</button>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.hideMobile}`} onClick={() => insertConstant('pi')}>π</button>
          <button className={`${styles.btn} ${styles.btnSecondary} ${styles.hideMobile}`} onClick={() => insertConstant('e')}>e</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={clearAll}>AC</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={deleteDigit}>⌫</button>

          {/* Row 2 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleImmediateFunc(isInv ? 'asin' : 'sin')}>{isInv ? 'sin⁻¹' : 'sin'}</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleImmediateFunc(isInv ? 'acos' : 'cos')}>{isInv ? 'cos⁻¹' : 'cos'}</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleImmediateFunc(isInv ? 'atan' : 'tan')}>{isInv ? 'tan⁻¹' : 'tan'}</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleOperation('EXP')}>EXP</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('÷')}>÷</button>

          {/* Row 3 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleImmediateFunc(isInv ? 'ex' : 'ln')}>{isInv ? 'eˣ' : 'ln'}</button>
          <button className={styles.btn} onClick={() => handleDigit('7')}>7</button>
          <button className={styles.btn} onClick={() => handleDigit('8')}>8</button>
          <button className={styles.btn} onClick={() => handleDigit('9')}>9</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('×')}>×</button>

          {/* Row 4 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleImmediateFunc(isInv ? '10x' : 'log')}>{isInv ? '10ˣ' : 'log'}</button>
          <button className={styles.btn} onClick={() => handleDigit('4')}>4</button>
          <button className={styles.btn} onClick={() => handleDigit('5')}>5</button>
          <button className={styles.btn} onClick={() => handleDigit('6')}>6</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('-')}>-</button>

          {/* Row 5 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleImmediateFunc(isInv ? 'sq' : 'sqrt')}>{isInv ? 'x²' : '√x'}</button>
          <button className={styles.btn} onClick={() => handleDigit('1')}>1</button>
          <button className={styles.btn} onClick={() => handleDigit('2')}>2</button>
          <button className={styles.btn} onClick={() => handleDigit('3')}>3</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('+')}>+</button>

          {/* Row 6 */}
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => handleOperation('^')}>xʸ</button>
          <button className={styles.btn} onClick={toggleSign}>+/-</button>
          <button className={styles.btn} onClick={() => handleDigit('0')}>0</button>
          <button className={styles.btn} onClick={() => handleDigit('.')}>.</button>
          <button className={`${styles.btn} ${styles.btnEqual}`} onClick={calculate}>=</button>
        </div>
      </div>
    </div>
  );
}
