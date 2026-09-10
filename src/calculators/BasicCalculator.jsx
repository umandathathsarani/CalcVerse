import { useState, useEffect, useCallback } from 'react';
import { useHistory } from '../context/HistoryContext';
import CopyButton from '../components/CopyButton';
import styles from './BasicCalculator.module.css';

const MAX_DIGITS = 15;

export default function BasicCalculator() {
  const { addHistoryEntry } = useHistory();
  const [current, setCurrent] = useState('0');
  const [previous, setPrevious] = useState('');
  const [operation, setOperation] = useState(null);
  const [isNewInput, setIsNewInput] = useState(true);
  const [memory, setMemory] = useState(0);

  // Format numbers to look nice (add commas, handle decimals)
  const formatNumber = (num) => {
    if (!num) return '';
    if (num === '-') return '-';
    
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
      default: return;
    }
    
    // Handle precision issues cleanly
    result = parseFloat(result.toPrecision(MAX_DIGITS));
    const resultStr = result.toString();
    
    addHistoryEntry(
      'Basic',
      `${formatNumber(previous)} ${operation} ${formatNumber(current)}`,
      formatNumber(resultStr)
    );
    
    setCurrent(resultStr);
    setPrevious('');
    setOperation(null);
    setIsNewInput(true);
  }, [current, previous, operation, addHistoryEntry]);

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

  // Memory functions
  const memoryClear = () => setMemory(0);
  const memoryRecall = () => {
    setCurrent(memory.toString());
    setIsNewInput(true);
  };
  const memoryAdd = () => {
    if (current === 'Error') return;
    setMemory(prev => prev + parseFloat(current));
    setIsNewInput(true);
  };
  const memorySubtract = () => {
    if (current === 'Error') return;
    setMemory(prev => prev - parseFloat(current));
    setIsNewInput(true);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Numbers
      if (/[0-9.]/.test(e.key)) {
        e.preventDefault();
        handleDigit(e.key);
      }
      // Operators
      if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        handleOperation(e.key);
      }
      if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleOperation('×');
      }
      if (e.key === '/') {
        e.preventDefault();
        handleOperation('÷');
      }
      // Actions
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        clearAll();
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        deleteDigit();
      }
      if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperation, calculate, clearAll, deleteDigit, handlePercentage]);

  return (
    <div className={styles.container}>
      <div className={styles.calculator}>
        <div className={styles.display}>
          <div className={styles.previous}>
            {previous ? `${formatNumber(previous)} ${operation}` : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div className={styles.current} style={{ flex: 1, textAlign: 'right' }}>
              {current === 'Error' ? 'Error' : formatNumber(current)}
            </div>
            <CopyButton text={current === 'Error' ? '' : current} />
          </div>
        </div>

        <div className={styles.memoryRow}>
          <button className={styles.memBtn} onClick={memoryClear}>MC</button>
          <button className={styles.memBtn} onClick={memoryRecall}>MR</button>
          <button className={styles.memBtn} onClick={memoryAdd}>M+</button>
          <button className={styles.memBtn} onClick={memorySubtract}>M-</button>
        </div>

        <div className={styles.keypad}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={clearAll}>AC</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={toggleSign}>+/-</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handlePercentage}>%</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('÷')}>÷</button>

          <button className={styles.btn} onClick={() => handleDigit('7')}>7</button>
          <button className={styles.btn} onClick={() => handleDigit('8')}>8</button>
          <button className={styles.btn} onClick={() => handleDigit('9')}>9</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('×')}>×</button>

          <button className={styles.btn} onClick={() => handleDigit('4')}>4</button>
          <button className={styles.btn} onClick={() => handleDigit('5')}>5</button>
          <button className={styles.btn} onClick={() => handleDigit('6')}>6</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('-')}>-</button>

          <button className={styles.btn} onClick={() => handleDigit('1')}>1</button>
          <button className={styles.btn} onClick={() => handleDigit('2')}>2</button>
          <button className={styles.btn} onClick={() => handleDigit('3')}>3</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => handleOperation('+')}>+</button>

          <button className={styles.btn} onClick={() => handleDigit('0')}>0</button>
          <button className={styles.btn} onClick={() => handleDigit('.')}>.</button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={deleteDigit}>⌫</button>
          <button className={`${styles.btn} ${styles.btnEqual}`} onClick={calculate}>=</button>
        </div>
      </div>
    </div>
  );
}
