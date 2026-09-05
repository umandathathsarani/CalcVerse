import { Link } from 'react-router-dom';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';
import CalculatorCard from '../components/CalculatorCard';
import { calculators } from '../data/calculators';
import styles from './Home.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-label="Hero section">
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              {/* Eyebrow badge */}
              <div className={styles.eyebrow}>
                <HiSparkles className={styles.eyebrowIcon} aria-hidden="true" />
                <span>Six specialized calculators in one place</span>
              </div>

              {/* Headline */}
              <h1 className={styles.heroTitle}>
                Calculate
                <span className={styles.heroTitleAccent}> Without</span>
                <br />
                <span className={styles.heroTitleAccent}>Limits.</span>
              </h1>

              {/* Sub */}
              <p className={styles.heroSub}>
                From everyday arithmetic to scientific equations, financial planning,
                graphing, programming, and unit conversions — CalcVerse has every
                calculator you need.
              </p>

              {/* CTAs */}
              <div className={styles.heroCtas}>
                <Link to="/calculators" className={styles.primaryCta}>
                  Explore Calculators
                  <HiArrowRight className={styles.ctaArrow} aria-hidden="true" />
                </Link>
                <Link to="/about" className={styles.secondaryCta}>
                  Learn More
                </Link>
              </div>

              {/* Quick stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>6</span>
                  <span className={styles.statLabel}>Calculators</span>
                </div>
                <div className={styles.statDivider} aria-hidden="true" />
                <div className={styles.stat}>
                  <span className={styles.statNum}>9</span>
                  <span className={styles.statLabel}>Unit Categories</span>
                </div>
                <div className={styles.statDivider} aria-hidden="true" />
                <div className={styles.stat}>
                  <span className={styles.statNum}>∞</span>
                  <span className={styles.statLabel}>Calculations</span>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className={styles.heroVisual} aria-hidden="true">
              <HeroDisplay />
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.bgGlow1} />
          <div className={styles.bgGlow2} />
          <div className={styles.bgGrid} />
        </div>
      </section>

      {/* ── Calculators Section ── */}
      <section className={styles.calcSection} id="calculators" aria-labelledby="calc-section-title">
        <div className="container">
          <div className={`${styles.sectionHeader} text-center`}>
            <p className="section-eyebrow">What's Inside</p>
            <h2 className={styles.sectionTitle} id="calc-section-title">
              Every Calculator You Need
            </h2>
            <p className={styles.sectionDesc}>
              Precision tools for every calculation — from quick arithmetic to complex
              financial analysis and mathematical visualization.
            </p>
          </div>

          {/* Card grid */}
          <div className={`${styles.cardGrid} stagger-children`}>
            {calculators.map(calc => (
              <div key={calc.id} className={`${styles.cardWrap} animate-fade-in-up`}>
                <CalculatorCard calc={calc} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className={styles.featuresSection} aria-label="Platform features">
        <div className="container">
          <div className={styles.featuresGrid}>
            <FeatureItem
              icon="🗝️"
              title="Keyboard Friendly"
              desc="Use your keyboard for fast input on all calculators. No mouse needed."
            />
            <FeatureItem
              icon="📜"
              title="Calculation History"
              desc="Every calculation is saved locally. Review and revisit past results anytime."
            />
            <FeatureItem
              icon="🌙"
              title="Dark & Light Modes"
              desc="A premium dark interface by default, with a clean light mode you can switch to instantly."
            />
            <FeatureItem
              icon="📱"
              title="Fully Responsive"
              desc="Every calculator works beautifully on desktop, tablet, and mobile."
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner} aria-label="Get started call to action">
        <div className="container">
          <div className={styles.ctaBannerInner}>
            <div>
              <h2 className={styles.ctaBannerTitle}>Ready to Calculate?</h2>
              <p className={styles.ctaBannerSub}>Pick a calculator and get started in seconds.</p>
            </div>
            <Link to="/calculators" className={styles.ctaBannerBtn}>
              Open a Calculator
              <HiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Sub-components ── */

function HeroDisplay() {
  const items = [
    { expr: '2 + 2', result: '4', color: '#6366F1' },
    { expr: 'sin(90°)', result: '1', color: '#8B5CF6' },
    { expr: 'y = x²', result: '∫ graph', color: '#06B6D4' },
    { expr: '$50,000 @ 7.5%', result: '$71,781', color: '#10B981' },
    { expr: '0xFF', result: '255', color: '#F59E0B' },
    { expr: '10 km → mi', result: '6.214 mi', color: '#EC4899' },
  ];

  return (
    <div className={styles.displayGrid}>
      {items.map((item, i) => (
        <div
          key={i}
          className={styles.displayCard}
          style={{ '--dc': item.color, animationDelay: `${i * 0.08}s` }}
        >
          <span className={styles.displayExpr}>{item.expr}</span>
          <span className={styles.displayEq}>=</span>
          <span className={styles.displayResult} style={{ color: item.color }}>{item.result}</span>
        </div>
      ))}
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className={styles.featureItem}>
      <span className={styles.featureIcon} aria-hidden="true">{icon}</span>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{desc}</p>
    </div>
  );
}
