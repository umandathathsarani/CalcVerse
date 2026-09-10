import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineTrash, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useHistory } from '../context/HistoryContext';
import CopyButton from '../components/CopyButton';
import styles from './History.module.css';

const CALC_TYPES = ['All', 'Basic', 'Scientific', 'Graphing', 'Financial', 'Programmer', 'Unit Converter'];

const TYPE_COLORS = {
  Basic:         '#6366F1',
  Scientific:    '#B88947',
  Graphing:      '#10B981',
  Financial:     '#3B82F6',
  Programmer:    '#F59E0B',
  'Unit Converter': '#EC4899',
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function History() {
  const { history, clearHistory, deleteHistoryEntry } = useHistory();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return history.filter(entry => {
      const matchType = filter === 'All' || entry.calculatorType === filter;
      const q = search.toLowerCase();
      const matchSearch = !q
        || entry.expression.toLowerCase().includes(q)
        || String(entry.result).toLowerCase().includes(q)
        || entry.calculatorType.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [history, filter, search]);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <p className="section-eyebrow">CalcVerse</p>
          <h1 className={styles.title}>Calculation History</h1>
          <p className={styles.desc}>
            Your recent calculations stored locally in your browser.
          </p>
        </div>

        {history.length === 0 ? (
          /* Empty state */
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <HiOutlineClock size={48} />
            </div>
            <h2 className={styles.emptyTitle}>No calculations yet</h2>
            <p className={styles.emptyDesc}>
              Start using any calculator and your results will appear here automatically.
            </p>
            <Link to="/calculators" className={styles.startLink}>
              Open a Calculator →
            </Link>
          </div>
        ) : (
          <div className={styles.historyLayout}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchWrapper}>
                <HiOutlineMagnifyingGlass className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search expressions or results…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className={styles.filterTabs}>
                {CALC_TYPES.map(t => (
                  <button
                    key={t}
                    className={`${styles.filterTab} ${filter === t ? styles.filterTabActive : ''}`}
                    onClick={() => setFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button className={styles.clearBtn} onClick={clearHistory}>
                <HiOutlineTrash size={16} />
                Clear All
              </button>
            </div>

            {/* Count */}
            <p className={styles.countLabel}>
              {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
              {filter !== 'All' && ` · ${filter}`}
              {search && ` · matching "${search}"`}
            </p>

            {/* Entries */}
            {filtered.length === 0 ? (
              <div className={styles.noResults}>No entries match your search.</div>
            ) : (
              <div className={styles.entries}>
                {filtered.map(entry => (
                  <div key={entry.id} className={styles.entry}>
                    <div className={styles.entryLeft}>
                      <span
                        className={styles.entryBadge}
                        style={{ background: `${TYPE_COLORS[entry.calculatorType] || '#6366F1'}22`, color: TYPE_COLORS[entry.calculatorType] || '#6366F1', borderColor: `${TYPE_COLORS[entry.calculatorType] || '#6366F1'}44` }}
                      >
                        {entry.calculatorType}
                      </span>
                      <div className={styles.entryExpression}>{entry.expression}</div>
                      <div className={styles.entryResult}>= {entry.result}</div>
                      <div className={styles.entryTime}>{formatTime(entry.timestamp)}</div>
                    </div>
                    <div className={styles.entryActions}>
                      <CopyButton text={String(entry.result)} size="sm" />
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteHistoryEntry(entry.id)}
                        title="Delete entry"
                      >
                        <HiOutlineTrash size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
