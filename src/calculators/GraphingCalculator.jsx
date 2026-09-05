import { Link } from 'react-router-dom';
import { GraphingCalcIcon } from '../components/CalcIcons';
import styles from './PlaceholderCalc.module.css';

export default function GraphingCalculator() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}><GraphingCalcIcon size={64} color="#06B6D4" /></div>
        <span className={styles.badge}>Phase 5 — Coming Soon</span>
        <h1 className={styles.title}>Graphing Calculator</h1>
        <p className={styles.desc}>
          Plot equations on an interactive coordinate plane. Supports multiple functions, zoom, pan, and function evaluation.
        </p>
        <div className={styles.features}>
          {['Plot y = f(x)', 'Multiple functions', 'Zoom & Pan', 'Grid with axis labels', 'Evaluate f(x) at x', 'Interactive coordinate display'].map(f => (
            <span key={f} className={styles.featureChip}>{f}</span>
          ))}
        </div>
        <Link to="/calculators" className={styles.back}>← Back to Calculators</Link>
      </div>
    </main>
  );
}
