import CalculatorCard from '../components/CalculatorCard';
import { calculators } from '../data/calculators';
import styles from './Calculators.module.css';

export default function Calculators() {
  return (
    <main className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-eyebrow">CalcVerse</p>
          <h1 className={styles.title}>All Calculators</h1>
          <p className={styles.desc}>
            Choose a calculator and start calculating. Each tool is purpose-built
            for its specific domain.
          </p>
        </div>

        {/* Grid */}
        <div className={`${styles.grid} stagger-children`}>
          {calculators.map(calc => (
            <div key={calc.id} className="animate-fade-in-up">
              <CalculatorCard calc={calc} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
