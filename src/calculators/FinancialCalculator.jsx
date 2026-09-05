import { Link } from 'react-router-dom';
import { FinancialCalcIcon } from '../components/CalcIcons';
import styles from './PlaceholderCalc.module.css';

export default function FinancialCalculator() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}><FinancialCalcIcon size={64} color="#10B981" /></div>
        <span className={styles.badge}>Phase 6 — Coming Soon</span>
        <h1 className={styles.title}>Financial Calculator</h1>
        <p className={styles.desc}>
          Loan payments, compound interest, investment projections, and full amortization schedules for informed financial decisions.
        </p>
        <div className={styles.features}>
          {['Loan / EMI Calculator', 'Compound Interest', 'Investment Projections', 'Amortization Schedule', 'Multiple Frequencies', 'Input Validation'].map(f => (
            <span key={f} className={styles.featureChip}>{f}</span>
          ))}
        </div>
        <Link to="/calculators" className={styles.back}>← Back to Calculators</Link>
      </div>
    </main>
  );
}
