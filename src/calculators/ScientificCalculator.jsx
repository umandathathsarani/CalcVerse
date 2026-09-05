import { Link } from 'react-router-dom';
import { ScientificCalcIcon } from '../components/CalcIcons';
import styles from './PlaceholderCalc.module.css';

export default function ScientificCalculator() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}><ScientificCalcIcon size={64} color="#8B5CF6" /></div>
        <span className={styles.badge}>Phase 4 — Coming Soon</span>
        <h1 className={styles.title}>Scientific Calculator</h1>
        <p className={styles.desc}>
          Advanced mathematics with trigonometry, logarithms, constants, powers, roots, and DEG/RAD mode switching.
        </p>
        <div className={styles.features}>
          {['sin, cos, tan + inverses', 'log & ln', 'x², x³, xⁿ, √, ³√', 'π and e constants', 'DEG / RAD modes', 'Factorial & Reciprocal'].map(f => (
            <span key={f} className={styles.featureChip}>{f}</span>
          ))}
        </div>
        <Link to="/calculators" className={styles.back}>← Back to Calculators</Link>
      </div>
    </main>
  );
}
