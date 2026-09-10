import { useState, useMemo, useEffect } from 'react';
import { HiStar, HiOutlineStar, HiArrowsRightLeft } from 'react-icons/hi2';
import CopyButton from '../components/CopyButton';
import styles from './UnitConverter.module.css';

// ─── Conversion data ───────────────────────────────────────────────────────
// Each unit has a `toBase` factor to convert TO the base unit.
// Temperature uses special functions instead of factors.

const CATEGORIES = [
  {
    id: 'length',
    label: 'Length',
    explainer: 'Convert distances — from nanometers to light-years. The base unit is the <strong>metre (m)</strong>.',
    units: [
      { label: 'Kilometre (km)',   toBase: 1000 },
      { label: 'Metre (m)',        toBase: 1 },
      { label: 'Centimetre (cm)',  toBase: 0.01 },
      { label: 'Millimetre (mm)', toBase: 0.001 },
      { label: 'Micrometre (μm)', toBase: 1e-6 },
      { label: 'Mile (mi)',        toBase: 1609.344 },
      { label: 'Yard (yd)',        toBase: 0.9144 },
      { label: 'Foot (ft)',        toBase: 0.3048 },
      { label: 'Inch (in)',        toBase: 0.0254 },
      { label: 'Nautical Mile',   toBase: 1852 },
      { label: 'Light Year (ly)',  toBase: 9.461e15 },
    ],
  },
  {
    id: 'weight',
    label: 'Weight',
    explainer: 'Convert mass — from micrograms to metric tonnes. The base unit is the <strong>kilogram (kg)</strong>.',
    units: [
      { label: 'Metric Tonne (t)',    toBase: 1000 },
      { label: 'Kilogram (kg)',        toBase: 1 },
      { label: 'Gram (g)',             toBase: 0.001 },
      { label: 'Milligram (mg)',       toBase: 1e-6 },
      { label: 'Microgram (μg)',      toBase: 1e-9 },
      { label: 'Pound (lb)',           toBase: 0.453592 },
      { label: 'Ounce (oz)',           toBase: 0.0283495 },
      { label: 'Stone (st)',           toBase: 6.35029 },
      { label: 'US Short Ton',        toBase: 907.185 },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    explainer: 'Convert temperatures between Celsius, Fahrenheit, and Kelvin. Unlike other categories, these use <strong>special formulas</strong> — not simple multiplication.',
    isTemp: true,
    units: [
      { label: 'Celsius (°C)',    id: 'C' },
      { label: 'Fahrenheit (°F)', id: 'F' },
      { label: 'Kelvin (K)',      id: 'K' },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    explainer: 'Convert areas — from square millimetres to square kilometres and acres. The base unit is the <strong>square metre (m²)</strong>.',
    units: [
      { label: 'Square Kilometre (km²)', toBase: 1e6 },
      { label: 'Square Metre (m²)',       toBase: 1 },
      { label: 'Square Centimetre (cm²)', toBase: 1e-4 },
      { label: 'Square Millimetre (mm²)', toBase: 1e-6 },
      { label: 'Hectare (ha)',             toBase: 10000 },
      { label: 'Square Mile (mi²)',        toBase: 2.59e6 },
      { label: 'Acre',                     toBase: 4046.856 },
      { label: 'Square Yard (yd²)',        toBase: 0.836127 },
      { label: 'Square Foot (ft²)',        toBase: 0.092903 },
      { label: 'Square Inch (in²)',        toBase: 6.4516e-4 },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    explainer: 'Convert volumes — from millilitres to cubic metres. The base unit is the <strong>litre (L)</strong>.',
    units: [
      { label: 'Cubic Metre (m³)',   toBase: 1000 },
      { label: 'Litre (L)',           toBase: 1 },
      { label: 'Millilitre (mL)',    toBase: 0.001 },
      { label: 'Cubic Centimetre',   toBase: 0.001 },
      { label: 'US Gallon (gal)',    toBase: 3.78541 },
      { label: 'UK Gallon (gal)',    toBase: 4.54609 },
      { label: 'US Quart (qt)',      toBase: 0.946353 },
      { label: 'US Pint (pt)',       toBase: 0.473176 },
      { label: 'US Cup',             toBase: 0.236588 },
      { label: 'Fluid Ounce (fl oz)', toBase: 0.0295735 },
      { label: 'Tablespoon (tbsp)',  toBase: 0.0147868 },
      { label: 'Teaspoon (tsp)',     toBase: 0.00492892 },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    explainer: 'Convert speeds — from metres per second to the speed of light. The base unit is <strong>metres per second (m/s)</strong>.',
    units: [
      { label: 'Metres/second (m/s)',   toBase: 1 },
      { label: 'Kilometres/hour (km/h)', toBase: 0.277778 },
      { label: 'Miles/hour (mph)',        toBase: 0.44704 },
      { label: 'Knot (kn)',              toBase: 0.514444 },
      { label: 'Feet/second (ft/s)',     toBase: 0.3048 },
      { label: 'Speed of Light (c)',     toBase: 299792458 },
      { label: 'Mach (Ma)',              toBase: 343 },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    explainer: 'Convert durations — from nanoseconds to years. The base unit is the <strong>second (s)</strong>.',
    units: [
      { label: 'Year (yr)',          toBase: 31536000 },
      { label: 'Month (mo)',         toBase: 2628000 },
      { label: 'Week (wk)',          toBase: 604800 },
      { label: 'Day (d)',            toBase: 86400 },
      { label: 'Hour (hr)',          toBase: 3600 },
      { label: 'Minute (min)',       toBase: 60 },
      { label: 'Second (s)',         toBase: 1 },
      { label: 'Millisecond (ms)',   toBase: 0.001 },
      { label: 'Microsecond (μs)',  toBase: 1e-6 },
      { label: 'Nanosecond (ns)',    toBase: 1e-9 },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    explainer: 'Convert digital storage — from bits to petabytes. The base unit is the <strong>bit (b)</strong>.',
    units: [
      { label: 'Petabyte (PB)',  toBase: 8e15 },
      { label: 'Terabyte (TB)',  toBase: 8e12 },
      { label: 'Gigabyte (GB)',  toBase: 8e9 },
      { label: 'Megabyte (MB)',  toBase: 8e6 },
      { label: 'Kilobyte (KB)',  toBase: 8000 },
      { label: 'Byte (B)',       toBase: 8 },
      { label: 'Bit (b)',        toBase: 1 },
      { label: 'Kibibyte (KiB)', toBase: 8192 },
      { label: 'Mebibyte (MiB)', toBase: 8388608 },
      { label: 'Gibibyte (GiB)', toBase: 8589934592 },
    ],
  },
  {
    id: 'energy',
    label: 'Energy',
    explainer: 'Convert energy — from joules to kilowatt-hours and calories. The base unit is the <strong>joule (J)</strong>.',
    units: [
      { label: 'Joule (J)',               toBase: 1 },
      { label: 'Kilojoule (kJ)',          toBase: 1000 },
      { label: 'Calorie (cal)',           toBase: 4.184 },
      { label: 'Kilocalorie (kcal)',      toBase: 4184 },
      { label: 'Watt-hour (Wh)',          toBase: 3600 },
      { label: 'Kilowatt-hour (kWh)',     toBase: 3600000 },
      { label: 'Electronvolt (eV)',       toBase: 1.602e-19 },
      { label: 'British Thermal Unit (BTU)', toBase: 1055.06 },
      { label: 'Foot-pound (ft·lb)',      toBase: 1.35582 },
    ],
  },
  {
    id: 'currency',
    label: 'Currency',
    explainer: 'Exchange rates relative to <strong>USD ($)</strong>. Fetches live rates when available, otherwise falls back to hardcoded approximations.',
    units: [
      { label: 'US Dollar (USD)',           toBase: 1 },
      { label: 'Euro (EUR)',                toBase: 1.08 },
      { label: 'British Pound (GBP)',       toBase: 1.27 },
      { label: 'Japanese Yen (JPY)',        toBase: 0.0067 },
      { label: 'Indian Rupee (INR)',        toBase: 0.012 },
      { label: 'Chinese Yuan (CNY)',        toBase: 0.14 },
      { label: 'Australian Dollar (AUD)',   toBase: 0.65 },
      { label: 'Canadian Dollar (CAD)',     toBase: 0.74 },
      { label: 'Swiss Franc (CHF)',         toBase: 1.12 },
      { label: 'South Korean Won (KRW)',    toBase: 0.00075 },
      { label: 'Singapore Dollar (SGD)',    toBase: 0.74 },
      { label: 'UAE Dirham (AED)',          toBase: 0.272 },
    ],
  },
];

// ─── Temperature conversion helpers ───────────────────────────────────────
const tempToC = (value, fromId) => {
  if (fromId === 'C') return value;
  if (fromId === 'F') return (value - 32) * 5 / 9;
  if (fromId === 'K') return value - 273.15;
};

const cToUnit = (celsius, toId) => {
  if (toId === 'C') return celsius;
  if (toId === 'F') return celsius * 9 / 5 + 32;
  if (toId === 'K') return celsius + 273.15;
};

const convertTemp = (value, fromId, toId) => {
  return cToUnit(tempToC(value, fromId), toId);
};

// ─── Number formatter ────────────────────────────────────────────────────
const formatResult = (num) => {
  if (isNaN(num) || !isFinite(num)) return '—';
  if (num === 0) return '0';
  const abs = Math.abs(num);
  if (abs >= 1e15 || (abs < 1e-6 && abs > 0)) {
    return parseFloat(num.toPrecision(6)).toExponential();
  }
  return parseFloat(num.toPrecision(10)).toString();
};

// ─── Component ────────────────────────────────────────────────────────────
export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState('length');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx]     = useState(1);
  const [fromValue, setFromValue] = useState('1');
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_uc_favs') || '{}'); } catch { return {}; }
  });

  const toggleFav = (catId, unitIdx) => {
    setFavourites(prev => {
      const key = `${catId}:${unitIdx}`;
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('cv_uc_favs', JSON.stringify(next));
      return next;
    });
  };
  const isFav = (catId, unitIdx) => !!favourites[`${catId}:${unitIdx}`];

  const [liveRates, setLiveRates] = useState(null);
  const [fetchingRates, setFetchingRates] = useState(false);

  useEffect(() => {
    if (activeCategory === 'currency' && !liveRates && !fetchingRates) {
      setFetchingRates(true);
      fetch('https://open.er-api.com/v6/latest/USD')
        .then(res => res.json())
        .then(data => {
          if (data && data.rates) {
            setLiveRates(data.rates);
          }
        })
        .catch(err => console.error("Failed to fetch live rates:", err))
        .finally(() => setFetchingRates(false));
    }
  }, [activeCategory, liveRates, fetchingRates]);

  const category = useMemo(() => {
    const baseCat = CATEGORIES.find(c => c.id === activeCategory);
    if (activeCategory === 'currency' && liveRates) {
      // Create a cloned category with updated toBase rates
      return {
        ...baseCat,
        units: baseCat.units.map(u => {
          // Extract currency code from label, e.g., "Euro (EUR)" -> "EUR"
          const codeMatch = u.label.match(/\(([A-Z]{3})\)/);
          const code = codeMatch ? codeMatch[1] : null;
          if (code && liveRates[code]) {
            return { ...u, toBase: 1 / liveRates[code] }; // toBase means how many of this unit make 1 USD
          }
          return u;
        })
      };
    }
    return baseCat;
  }, [activeCategory, liveRates]);

  // Derived: result value
  const result = useMemo(() => {
    const v = parseFloat(fromValue);
    if (isNaN(v)) return '';
    if (category.isTemp) {
      const fromUnit = category.units[fromIdx];
      const toUnit   = category.units[toIdx];
      return formatResult(convertTemp(v, fromUnit.id, toUnit.id));
    }
    const fromFactor = category.units[fromIdx].toBase;
    const toFactor   = category.units[toIdx].toBase;
    return formatResult((v * fromFactor) / toFactor);
  }, [fromValue, fromIdx, toIdx, category]);

  // All-unit quick results
  const quickResults = useMemo(() => {
    const v = parseFloat(fromValue);
    if (isNaN(v) || !v) return [];
    if (category.isTemp) {
      const fromUnit = category.units[fromIdx];
      return category.units.map((u, i) => ({
        label: u.label,
        value: formatResult(convertTemp(v, fromUnit.id, u.id)),
        index: i,
      }));
    }
    const fromFactor = category.units[fromIdx].toBase;
    return category.units.map((u, i) => ({
      label: u.label,
      value: formatResult((v * fromFactor) / u.toBase),
      index: i,
    }));
  }, [fromValue, fromIdx, category]);

  const swap = () => {
    const prevFrom = fromIdx;
    const prevTo   = toIdx;
    // Swap selection AND carry the result value into fromValue
    setFromValue(result !== '—' ? result : fromValue);
    setFromIdx(prevTo);
    setToIdx(prevFrom);
  };

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setFromIdx(0);
    setToIdx(1);
    setFromValue('1');
  };

  return (
    <div className={styles.container}>
      <div className={styles.converter}>

        {/* Category tabs */}
        <div className={styles.categoryScroll}>
          <div className={styles.categoryTabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.categoryTab} ${activeCategory === cat.id ? styles.categoryTabActive : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion panel */}
        <div className={styles.panel}>
          <div className={styles.conversionRow}>

            {/* FROM */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>From</label>
              <select
                className={styles.select}
                value={fromIdx}
                onChange={e => setFromIdx(Number(e.target.value))}
              >
                {category.units.map((u, i) => (
                  <option key={i} value={i}>{u.label}</option>
                ))}
              </select>
              <input
                type="number"
                className={styles.input}
                value={fromValue}
                onChange={e => setFromValue(e.target.value)}
                placeholder="Enter value…"
              />
            </div>

            {/* Swap */}
            <button className={styles.swapBtn} onClick={swap} title="Swap units">⇆</button>

            {/* TO */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>To</label>
              <select
                className={styles.select}
                value={toIdx}
                onChange={e => setToIdx(Number(e.target.value))}
              >
                {category.units.map((u, i) => (
                  <option key={i} value={i}>{u.label}</option>
                ))}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.readOnly}`}
                  value={result}
                  readOnly
                />
                <CopyButton text={result !== '—' ? result : ''} size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick results grid — all units at once */}
        {quickResults.length > 0 && (
          <>
            <div className={styles.quickResultsHeader}>All conversions from {fromValue} {category.units[fromIdx].label}</div>
            <div className={styles.quickResults}>
              {quickResults.map(({ label, value, index }) => (
              <div
                key={index}
                className={styles.quickResultItem}
                onClick={() => { setToIdx(index); }}
                title={`Click to select ${label} as the "To" unit`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className={styles.quickResultValue}>{value}</span>
                  <button
                    onClick={e => { e.stopPropagation(); toggleFav(activeCategory, index); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0, flexShrink: 0 }}
                    title={isFav(activeCategory, index) ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    {isFav(activeCategory, index) ? <HiStar style={{ color: 'var(--accent)' }} size={16} /> : <HiOutlineStar size={16} />}
                  </button>
                </div>
                <span className={styles.quickResultUnit}>{label}</span>
              </div>
            ))}
            </div>
          </>
        )}

        {/* Explainer */}
        <div className={styles.explainer}>
          <p dangerouslySetInnerHTML={{ __html: `<strong>What this converts:</strong> ${category.explainer}` }} />
          {activeCategory === 'currency' && fetchingRates && (
            <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>Fetching live rates...</p>
          )}
          {activeCategory === 'currency' && liveRates && !fetchingRates && (
            <p style={{ color: 'var(--success, #10B981)', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 600 }}>Using live rates from open.er-api.com</p>
          )}
        </div>
      </div>
    </div>
  );
}
