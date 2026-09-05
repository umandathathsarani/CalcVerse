import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi2';
import { getCalcIcon } from './CalcIcons';
import styles from './CalculatorCard.module.css';

/**
 * CalculatorCard — displays a single calculator entry from metadata.
 * @param {{ calc: import('../data/calculators').Calculator }} props
 */
export default function CalculatorCard({ calc }) {
  const { id, name, tagline, description, features, bestFor, route, color, gradient } = calc;

  return (
    <article className={styles.card} aria-label={`${name} calculator`}>
      {/* Top accent line */}
      <div className={styles.accentLine} style={{ background: gradient }} aria-hidden="true" />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          {getCalcIcon(id, 42, color)}
        </div>
        <div className={styles.titleGroup}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.tagline}>{tagline}</p>
        </div>
      </div>

      {/* Description */}
      <p className={styles.description}>{description}</p>

      {/* Features */}
      <ul className={styles.features} aria-label={`${name} features`}>
        {features.slice(0, 4).map((feature, i) => (
          <li key={i} className={styles.feature}>
            <HiCheckCircle className={styles.checkIcon} style={{ color }} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.bestFor}>
          <span className={styles.bestForLabel}>Best for</span>
          <span className={styles.bestForValue}>{bestFor}</span>
        </div>
        <Link
          to={route}
          className={styles.cta}
          style={{ '--card-color': color }}
          aria-label={`Open ${name}`}
        >
          Open Calculator
          <HiArrowRight className={styles.ctaArrow} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
