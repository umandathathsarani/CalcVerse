import { useState, useMemo } from 'react';
import styles from './FinancialCalculator.module.css';

const CURRENCIES = [
  { symbol: '$', label: 'USD – US Dollar' },
  { symbol: '€', label: 'EUR – Euro' },
  { symbol: '£', label: 'GBP – British Pound' },
  { symbol: '¥', label: 'JPY – Japanese Yen' },
  { symbol: '₹', label: 'INR – Indian Rupee' },
  { symbol: '₩', label: 'KRW – Korean Won' },
  { symbol: 'A$', label: 'AUD – Australian Dollar' },
  { symbol: 'C$', label: 'CAD – Canadian Dollar' },
];

const formatCurrency = (value, symbol = '$') => {
  if (isNaN(value) || !isFinite(value)) return `${symbol}0.00`;
  return symbol + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
};

function LoanCalculator({ currency = '$' }) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [showTable, setShowTable] = useState(false);

  const results = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12; // monthly rate
    const n = parseFloat(years) * 12; // total months

    if (!p || !r || !n || p <= 0 || r <= 0 || n <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    let balance = p;
    const schedule = [];
    for (let month = 1; month <= n; month++) {
      const interestPayment = balance * r;
      let principalPayment = emi - interestPayment;
      
      // Fix rounding issues on final payment
      if (month === n) {
        principalPayment = balance;
      }
      
      balance -= principalPayment;
      if (balance < 0) balance = 0;
      
      schedule.push({
        month,
        payment: principalPayment + interestPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance
      });
    }

    return { emi, totalPayment, totalInterest, schedule };
  }, [principal, rate, years]);

  const reset = () => {
    setPrincipal(''); setRate(''); setYears(''); setShowTable(false);
  };

  const exportCSV = () => {
    if (!results.schedule.length) return;
    const header = 'Month,Payment,Principal,Interest,Balance';
    const rows = results.schedule.map(r =>
      `${r.month},${r.payment.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.balance.toFixed(2)}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'amortization.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.content}>
      <div className={styles.formPanel}>
        <div className={styles.explainer}>
          <strong>What this does:</strong> Calculates the monthly payment (EMI) for a loan or mortgage, showing exactly how much interest you will pay over the entire term.
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Loan Amount (Principal)</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="300000" />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Annual Interest Rate</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={rate} onChange={e => setRate(e.target.value)} placeholder="5.5" />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Loan Term</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={years} onChange={e => setYears(e.target.value)} placeholder="30" />
            <span className={styles.suffix}>Years</span>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>Reset Fields</button>
      </div>

      <div className={styles.resultsPanel}>
        <div>
          <div className={styles.resultTitle}>Monthly Payment (EMI)</div>
          <div className={styles.primaryResult}>{formatCurrency(results.emi)}</div>
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total Principal</span>
            <span className={styles.breakdownValue}>{formatCurrency(parseFloat(principal) || 0)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total Interest</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.totalInterest)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total Payment</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.totalPayment)}</span>
          </div>
        </div>

        {results.schedule.length > 0 && (
          <>
            <button className={styles.toggleTableBtn} onClick={() => setShowTable(!showTable)}>
              {showTable ? 'Hide Amortization Schedule' : 'Show Amortization Schedule'}
            </button>
            {results.schedule.length > 0 && (
              <button className={styles.toggleTableBtn} onClick={exportCSV} style={{ marginTop: '0.4rem', borderStyle: 'solid', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                ⬇ Export CSV
              </button>
            )}
            
            {showTable && (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Payment</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.map(row => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{formatCurrency(row.payment)}</td>
                        <td>{formatCurrency(row.principal)}</td>
                        <td>{formatCurrency(row.interest)}</td>
                        <td>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CompoundCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [frequency, setFrequency] = useState('12'); // monthly

  const results = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseInt(frequency, 10);

    if (!p || !r || !t || !n || p <= 0 || r <= 0 || t <= 0) {
      return { futureValue: 0, totalInterest: 0 };
    }

    const futureValue = p * Math.pow(1 + r / n, n * t);
    const totalInterest = futureValue - p;

    return { futureValue, totalInterest };
  }, [principal, rate, years, frequency]);

  const reset = () => {
    setPrincipal(''); setRate(''); setYears(''); setFrequency('12');
  };

  return (
    <div className={styles.content}>
      <div className={styles.formPanel}>
        <div className={styles.explainer}>
          <strong>What this does:</strong> Shows how much your money will grow over time through compound interest (earning interest on your past interest).
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Initial Investment</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="10000" />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Annual Interest Rate</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={rate} onChange={e => setRate(e.target.value)} placeholder="7" />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Time Period</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={years} onChange={e => setYears(e.target.value)} placeholder="10" />
            <span className={styles.suffix}>Years</span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Compound Frequency</label>
          <div className={styles.inputWrapper}>
            <select className={styles.select} value={frequency} onChange={e => setFrequency(e.target.value)}>
              <option value="1">Annually (1/yr)</option>
              <option value="2">Semi-Annually (2/yr)</option>
              <option value="4">Quarterly (4/yr)</option>
              <option value="12">Monthly (12/yr)</option>
              <option value="365">Daily (365/yr)</option>
            </select>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>Reset Fields</button>
      </div>

      <div className={styles.resultsPanel}>
        <div>
          <div className={styles.resultTitle}>Future Value</div>
          <div className={styles.primaryResult}>{formatCurrency(results.futureValue)}</div>
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total Principal</span>
            <span className={styles.breakdownValue}>{formatCurrency(parseFloat(principal) || 0)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total Interest Earned</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.totalInterest)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [tax, setTax] = useState('');

  const results = useMemo(() => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discount) || 0;
    const t = parseFloat(tax) || 0;

    const discountAmount = p * (d / 100);
    const priceAfterDiscount = p - discountAmount;
    const taxAmount = priceAfterDiscount * (t / 100);
    const finalPrice = priceAfterDiscount + taxAmount;

    return { discountAmount, priceAfterDiscount, taxAmount, finalPrice };
  }, [price, discount, tax]);

  const reset = () => {
    setPrice(''); setDiscount(''); setTax('');
  };

  return (
    <div className={styles.content}>
      <div className={styles.formPanel}>
        <div className={styles.explainer}>
          <strong>What this does:</strong> Helps you find the final checkout price of an item after applying a sale discount and adding sales tax.
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Original Price</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={price} onChange={e => setPrice(e.target.value)} placeholder="100" />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Discount</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={discount} onChange={e => setDiscount(e.target.value)} placeholder="20" />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Sales Tax</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={tax} onChange={e => setTax(e.target.value)} placeholder="8.5" />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>Reset Fields</button>
      </div>

      <div className={styles.resultsPanel}>
        <div>
          <div className={styles.resultTitle}>Final Price</div>
          <div className={styles.primaryResult}>{formatCurrency(results.finalPrice)}</div>
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Original Price</span>
            <span className={styles.breakdownValue}>{formatCurrency(parseFloat(price) || 0)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Discount Amount</span>
            <span className={styles.breakdownValue}>-{formatCurrency(results.discountAmount)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Tax Amount</span>
            <span className={styles.breakdownValue}>+{formatCurrency(results.taxAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavingsGoalCalculator() {
  const [goal, setGoal] = useState('');
  const [years, setYears] = useState('');
  const [rate, setRate] = useState('');

  const results = useMemo(() => {
    const g = parseFloat(goal);
    const t = parseFloat(years);
    const r = parseFloat(rate) / 100;
    
    if (!g || !t || !r || g <= 0 || t <= 0 || r <= 0) {
      return { monthlySavings: 0, totalContribution: 0 };
    }

    const n = 12; // monthly compounding
    // Formula for PMT given Future Value: PMT = FV * (r/n) / ((1 + r/n)^(n*t) - 1)
    const monthlySavings = g * (r / n) / (Math.pow(1 + r / n, n * t) - 1);
    const totalContribution = monthlySavings * n * t;

    return { monthlySavings, totalContribution };
  }, [goal, years, rate]);

  const reset = () => {
    setGoal(''); setYears(''); setRate('');
  };

  return (
    <div className={styles.content}>
      <div className={styles.formPanel}>
        <div className={styles.explainer}>
          <strong>What this does:</strong> Tells you exactly how much money you need to save each month to reach a specific financial goal.
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Savings Goal</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={goal} onChange={e => setGoal(e.target.value)} placeholder="50000" />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Years to Save</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={years} onChange={e => setYears(e.target.value)} placeholder="5" />
            <span className={styles.suffix}>Years</span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Estimated Annual Return</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={rate} onChange={e => setRate(e.target.value)} placeholder="4" />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>Reset Fields</button>
      </div>

      <div className={styles.resultsPanel}>
        <div>
          <div className={styles.resultTitle}>Required Monthly Savings</div>
          <div className={styles.primaryResult}>{formatCurrency(results.monthlySavings)}</div>
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total You Contribute</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.totalContribution)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Interest Earned</span>
            <span className={styles.breakdownValue}>{formatCurrency(parseFloat(goal || 0) - results.totalContribution > 0 ? parseFloat(goal) - results.totalContribution : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalaryCalculator() {
  const [hourlyWage, setHourlyWage] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');

  const results = useMemo(() => {
    const wage = parseFloat(hourlyWage) || 0;
    const hours = parseFloat(hoursPerWeek) || 0;

    const weekly = wage * hours;
    const monthly = (weekly * 52) / 12;
    const annual = weekly * 52;

    return { weekly, monthly, annual };
  }, [hourlyWage, hoursPerWeek]);

  const reset = () => {
    setHourlyWage(''); setHoursPerWeek('40');
  };

  return (
    <div className={styles.content}>
      <div className={styles.formPanel}>
        <div className={styles.explainer}>
          <strong>What this does:</strong> Converts your hourly wage into a rough estimate of your total weekly, monthly, and annual income.
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Hourly Wage</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={hourlyWage} onChange={e => setHourlyWage(e.target.value)} placeholder="25" />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Hours Per Week</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)} placeholder="40" />
            <span className={styles.suffix}>Hours</span>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>Reset Fields</button>
      </div>

      <div className={styles.resultsPanel}>
        <div>
          <div className={styles.resultTitle}>Annual Salary</div>
          <div className={styles.primaryResult}>{formatCurrency(results.annual)}</div>
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Monthly Income</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.monthly)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Weekly Income</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.weekly)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ROICalculator() {
  const [initialValue, setInitialValue] = useState('');
  const [finalValue, setFinalValue] = useState('');

  const results = useMemo(() => {
    const initial = parseFloat(initialValue) || 0;
    const final = parseFloat(finalValue) || 0;

    if (initial <= 0) return { roi: 0, profit: 0 };

    const profit = final - initial;
    const roi = (profit / initial) * 100;

    return { roi, profit };
  }, [initialValue, finalValue]);

  const reset = () => {
    setInitialValue(''); setFinalValue('');
  };

  return (
    <div className={styles.content}>
      <div className={styles.formPanel}>
        <div className={styles.explainer}>
          <strong>What this does:</strong> Calculates the Return on Investment (ROI), showing the exact percentage of profit or loss made on an investment.
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Initial Investment</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={initialValue} onChange={e => setInitialValue(e.target.value)} placeholder="1000" />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Final Value</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={finalValue} onChange={e => setFinalValue(e.target.value)} placeholder="1250" />
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>Reset Fields</button>
      </div>

      <div className={styles.resultsPanel}>
        <div>
          <div className={styles.resultTitle}>Return on Investment (ROI)</div>
          <div className={styles.primaryResult}>{results.roi.toFixed(2)}%</div>
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Net Profit / Loss</span>
            <span className={styles.breakdownValue} style={{ color: results.profit >= 0 ? 'var(--success, #10B981)' : 'var(--danger)' }}>
              {formatCurrency(results.profit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [split, setSplit] = useState('1');

  const results = useMemo(() => {
    const b = parseFloat(bill) || 0;
    const t = parseFloat(tipPercent) || 0;
    const s = parseInt(split) || 1;

    const tipAmount = b * (t / 100);
    const totalBill = b + tipAmount;
    
    const tipPerPerson = tipAmount / s;
    const totalPerPerson = totalBill / s;

    return { tipAmount, totalBill, tipPerPerson, totalPerPerson };
  }, [bill, tipPercent, split]);

  const reset = () => {
    setBill(''); setTipPercent('15'); setSplit('1');
  };

  return (
    <div className={styles.content}>
      <div className={styles.formPanel}>
        <div className={styles.explainer}>
          <strong>What this does:</strong> Quickly calculates the tip amount and splits the total restaurant bill evenly among a group of people.
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Bill Amount</label>
          <div className={styles.inputWrapper}>
            <span className={styles.prefix}>$</span>
            <input type="number" className={styles.input} value={bill} onChange={e => setBill(e.target.value)} placeholder="50" />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Tip Percentage</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={tipPercent} onChange={e => setTipPercent(e.target.value)} placeholder="15" />
            <span className={styles.suffix}>%</span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Split (Number of People)</label>
          <div className={styles.inputWrapper}>
            <input type="number" className={styles.input} value={split} onChange={e => setSplit(e.target.value)} placeholder="1" min="1" />
            <span className={styles.suffix}>👤</span>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>Reset Fields</button>
      </div>

      <div className={styles.resultsPanel}>
        <div>
          <div className={styles.resultTitle}>Total per Person</div>
          <div className={styles.primaryResult}>{formatCurrency(results.totalPerPerson)}</div>
        </div>
        
        <div className={styles.breakdown}>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Tip per Person</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.tipPerPerson)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total Tip Amount</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.tipAmount)}</span>
          </div>
          <div className={styles.breakdownItem}>
            <span className={styles.breakdownLabel}>Total Bill</span>
            <span className={styles.breakdownValue}>{formatCurrency(results.totalBill)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancialCalculator() {
  const [activeTab, setActiveTab] = useState('loan');
  const [currency, setCurrency] = useState('$');

  return (
    <div className={styles.container}>
      <div className={styles.calculator}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-0.5rem' }}>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.7rem', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
          >
            {CURRENCIES.map(c => (
              <option key={c.symbol} value={c.symbol}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${activeTab === 'loan' ? styles.active : ''}`} onClick={() => setActiveTab('loan')}>Loan / EMI</button>
          <button className={`${styles.tab} ${activeTab === 'compound' ? styles.active : ''}`} onClick={() => setActiveTab('compound')}>Compound Interest</button>
          <button className={`${styles.tab} ${activeTab === 'discount' ? styles.active : ''}`} onClick={() => setActiveTab('discount')}>Discount / Tax</button>
          <button className={`${styles.tab} ${activeTab === 'savings' ? styles.active : ''}`} onClick={() => setActiveTab('savings')}>Savings Goal</button>
          <button className={`${styles.tab} ${activeTab === 'salary' ? styles.active : ''}`} onClick={() => setActiveTab('salary')}>Salary</button>
          <button className={`${styles.tab} ${activeTab === 'roi' ? styles.active : ''}`} onClick={() => setActiveTab('roi')}>ROI</button>
          <button className={`${styles.tab} ${activeTab === 'tip' ? styles.active : ''}`} onClick={() => setActiveTab('tip')}>Tip Splitter</button>
        </div>

        {activeTab === 'loan'     && <LoanCalculator currency={currency} />}
        {activeTab === 'compound' && <CompoundCalculator currency={currency} />}
        {activeTab === 'discount' && <DiscountCalculator currency={currency} />}
        {activeTab === 'savings'  && <SavingsGoalCalculator currency={currency} />}
        {activeTab === 'salary'   && <SalaryCalculator currency={currency} />}
        {activeTab === 'roi'      && <ROICalculator currency={currency} />}
        {activeTab === 'tip'      && <TipCalculator currency={currency} />}
      </div>
    </div>
  );
}
