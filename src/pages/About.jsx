import { Link } from 'react-router-dom';
import { calculators } from '../data/calculators';
import styles from './About.module.css';

const TECH_STACK = [
  { name: 'React 18', desc: 'UI library' },
  { name: 'Vite', desc: 'Build tool' },
  { name: 'React Router v6', desc: 'Client-side routing' },
  { name: 'CSS Modules', desc: 'Scoped component styles' },
  { name: 'React Icons', desc: 'Icon library' },
  { name: 'LocalStorage', desc: 'Persistent user preferences' },
];

const FUTURE_PLANS = [
  'Date & Age Calculator',
  'BMI & Health Calculator',
  'Matrix Calculator',
  'Statistics Calculator',
  'Fraction Calculator',
  'Currency Converter (live rates)',
  'Probability Calculator',
  'PWA support (offline mode)',
  'Export calculations to PDF',
];

export default function About() {
  return (
    <main className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-eyebrow">About</p>
          <h1 className={styles.title}>What is CalcVerse?</h1>
          <p className={styles.subtitle}>
            A modern, multi-purpose calculator platform built as a developer portfolio project.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left: Main content */}
          <div className={styles.content}>
            {/* About section */}
            <section className={styles.section} aria-labelledby="about-heading">
              <h2 className={styles.sectionTitle} id="about-heading">The Project</h2>
              <p className={styles.body}>
                CalcVerse was built to demonstrate modern front-end development skills while creating
                something genuinely useful. Rather than a single calculator, it's a platform of
                six specialized tools — each purpose-built for a different domain.
              </p>
              <p className={styles.body}>
                The design philosophy centers on being{' '}
                <strong>modern, minimal, technical, and functional</strong> — a premium experience
                that feels like a real SaaS product rather than a demo project.
              </p>
            </section>

            {/* Calculators */}
            <section className={styles.section} aria-labelledby="calcs-heading">
              <h2 className={styles.sectionTitle} id="calcs-heading">Available Calculators</h2>
              <ul className={styles.calcList}>
                {calculators.map(calc => (
                  <li key={calc.id} className={styles.calcItem}>
                    <Link to={calc.route} className={styles.calcLink} style={{ '--c': calc.color }}>
                      <span className={styles.calcDot} style={{ background: calc.color }} />
                      <span className={styles.calcName}>{calc.name}</span>
                      <span className={styles.calcTagline}>{calc.tagline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Future plans */}
            <section className={styles.section} aria-labelledby="future-heading">
              <h2 className={styles.sectionTitle} id="future-heading">Future Plans</h2>
              <p className={styles.body}>
                The architecture is designed for extensibility — adding a new calculator
                requires only a metadata entry and a new component.
              </p>
              <ul className={styles.futureList}>
                {FUTURE_PLANS.map(plan => (
                  <li key={plan} className={styles.futureItem}>
                    <span className={styles.futureDot} aria-hidden="true" />
                    {plan}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right: Sidebar */}
          <aside className={styles.sidebar}>
            {/* Tech stack */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Tech Stack</h2>
              <ul className={styles.techList}>
                {TECH_STACK.map(tech => (
                  <li key={tech.name} className={styles.techItem}>
                    <span className={styles.techName}>{tech.name}</span>
                    <span className={styles.techDesc}>{tech.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project info */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Project Info</h2>
              <div className={styles.infoList}>
                <InfoRow label="Type" value="Portfolio Project" />
                <InfoRow label="Status" value="In Development" />
                <InfoRow label="License" value="MIT" />
                <InfoRow label="Version" value="0.1.0" />
              </div>
            </div>

            {/* CTA */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Repository</h2>
              <p className={styles.cardBody}>
                This project is open-source and available on GitHub.
              </p>
              <a
                href="https://github.com/umandathathsarani/CalcVerse"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ghLink}
                aria-label="View CalcVerse on GitHub (opens in new tab)"
              >
                View on GitHub →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}
