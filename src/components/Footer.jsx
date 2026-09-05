import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'Calculators', to: '/calculators' },
  { label: 'History',     to: '/history' },
  { label: 'About',       to: '/about' },
];

const CALCULATOR_LINKS = [
  { label: 'Basic Calculator',    to: '/calculators/basic' },
  { label: 'Scientific',          to: '/calculators/scientific' },
  { label: 'Graphing',            to: '/calculators/graphing' },
  { label: 'Financial',           to: '/calculators/financial' },
  { label: 'Programmer',          to: '/calculators/programmer' },
  { label: 'Unit Converter',      to: '/calculators/unit-converter' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo} aria-label="CalcVerse — Home">
              <span className={styles.logoIcon} aria-hidden="true">∑</span>
              <span className={styles.logoText}>
                Calc<span className={styles.logoAccent}>Verse</span>
              </span>
            </Link>
            <p className={styles.tagline}>One place for every calculation.</p>
            <p className={styles.subTagline}>
              A modern multi-purpose calculator platform built as a developer portfolio project.
            </p>
          </div>

          {/* Navigation */}
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Navigation</h4>
            <ul className={styles.linkList} role="list">
              {FOOTER_LINKS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Calculators */}
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Calculators</h4>
            <ul className={styles.linkList} role="list">
              {CALCULATOR_LINKS.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} CalcVerse — Built as a developer portfolio project.
          </p>
          <div className={styles.techStack}>
            <span className={styles.techBadge}>React</span>
            <span className={styles.techBadge}>Vite</span>
            <span className={styles.techBadge}>React Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
