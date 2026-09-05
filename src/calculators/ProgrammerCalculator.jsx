import { Link } from 'react-router-dom';
import { ProgrammerCalcIcon } from '../components/CalcIcons';
import styles from './PlaceholderCalc.module.css';

export default function ProgrammerCalculator() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}><ProgrammerCalcIcon size={64} color="#F59E0B" /></div>
        <span className={styles.badge}>Phase 7 — Coming Soon</span>
        <h1 className={styles.title}>Programmer Calculator</h1>
        <p className={styles.desc}>
          Convert between number systems and perform bitwise operations. Built for developers and computer science students.
        </p>
        <div className={styles.features}>
          {['BIN / OCT / DEC / HEX', 'Bitwise AND, OR, XOR, NOT', 'Left & Right Shift', 'Instant Base Conversion', 'Developer-focused UI'].map(f => (
            <span key={f} className={styles.featureChip}>{f}</span>
          ))}
        </div>
        <Link to="/calculators" className={styles.back}>← Back to Calculators</Link>
      </div>
    </main>
  );
}
