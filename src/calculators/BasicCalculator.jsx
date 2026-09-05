import { Link } from 'react-router-dom';
import { BasicCalcIcon } from '../components/CalcIcons';
import styles from './PlaceholderCalc.module.css';

export default function BasicCalculator() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}>
          <BasicCalcIcon size={64} color="#6366F1" />
        </div>
        <span className={styles.badge}>Phase 3 — Coming Soon</span>
        <h1 className={styles.title}>Basic Calculator</h1>
        <p className={styles.desc}>
          Simple everyday arithmetic with keyboard support, memory functions,
          percentage, and sign toggle. Being built next.
        </p>
        <div className={styles.features}>
          {['Addition & Subtraction', 'Multiplication & Division', 'Percentage', 'Memory Functions (MC, MR, M+, M−)', 'Keyboard Input', 'Sign Toggle & Backspace'].map(f => (
            <span key={f} className={styles.featureChip}>{f}</span>
          ))}
        </div>
        <Link to="/calculators" className={styles.back}>← Back to Calculators</Link>
      </div>
    </main>
  );
}
