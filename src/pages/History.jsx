import { HiClockReviewed } from 'react-icons/hi2';
import styles from './History.module.css';

export default function History() {
  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-eyebrow">CalcVerse</p>
          <h1 className={styles.title}>Calculation History</h1>
          <p className={styles.desc}>
            Your recent calculations will appear here. History is stored locally in your browser.
          </p>
        </div>

        {/* Empty state */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            <HiClockReviewed size={48} />
          </div>
          <h2 className={styles.emptyTitle}>No calculations yet</h2>
          <p className={styles.emptyDesc}>
            Start using any calculator and your results will appear here automatically.
          </p>
          <div className={styles.comingSoonBadge}>
            History tracking coming in Phase 9
          </div>
        </div>
      </div>
    </main>
  );
}
