import { Link } from 'react-router-dom';
import { UnitConverterIcon } from '../components/CalcIcons';
import styles from './PlaceholderCalc.module.css';

export default function UnitConverter() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.iconWrap}><UnitConverterIcon size={64} color="#EC4899" /></div>
        <span className={styles.badge}>Phase 8 — Coming Soon</span>
        <h1 className={styles.title}>Unit Converter</h1>
        <p className={styles.desc}>
          Convert between units across 9 categories — length, weight, temperature, area, volume, speed, time, data, and energy.
        </p>
        <div className={styles.features}>
          {['Length', 'Weight', 'Temperature', 'Area & Volume', 'Speed', 'Time', 'Data Storage', 'Energy', 'Swap Units'].map(f => (
            <span key={f} className={styles.featureChip}>{f}</span>
          ))}
        </div>
        <Link to="/calculators" className={styles.back}>← Back to Calculators</Link>
      </div>
    </main>
  );
}
