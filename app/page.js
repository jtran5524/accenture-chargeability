'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Constants
const HOURS_PER_WEEK = 40;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Accenture NA Level Configuration
const LEVEL_CONFIG = {
  'Analyst': { target: 0.80, critical: 0.65 },
  'Senior Analyst': { target: 0.85, critical: 0.70 },
  'Consultant': { target: 0.88, critical: 0.72 },
  'Manager': { target: 0.90, critical: 0.75 },
};

// Risk explainer text
const RISK_EXPLAINERS = {
  LOW: "Your projected chargeability is within or above the typical range for your level, with limited bench. In Accenture terms, this usually looks safe if performance and behavior are solid.",
  MEDIUM: "Projected chargeability dips below target or bench time is building. This is a yellow flag at Accenture: push for billable staffing or shift more time into PD&R while you look for a project.",
  HIGH: "Projected chargeability is in the critical range and/or bench time is significant. In Accenture North America, extended bench at these levels can increase layoff or performance risk.",
};

// Get today's date in YYYY-MM-DD format
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function Home() {
  // Form state
  const [level, setLevel] = useState('Analyst');
  const [ytdHours, setYtdHours] = useState('');
  const [asOfDate, setAsOfDate] = useState('');
  const [mode, setMode] = useState('fullChargeable');
  const [todayDate, setTodayDate] = useState('');
  const [benchStartDate, setBenchStartDate] = useState('');
  const [futureBenchWeeks, setFutureBenchWeeks] = useState('');
  
  // Results & error state
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Initialize today's date on mount
  useEffect(() => {
    setTodayDate(getTodayString());
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const calculateForecast = () => {
    setError('');
    setResults(null);

    // Validate YTD hours
    const ytd = Number(ytdHours);
    if (!ytd || ytd <= 0) {
      setError('Please enter a valid positive number for YTD hours.');
      return;
    }

    // Initialize base values
    let effectiveBillable = ytd;
    let effectiveTotal = ytd;
    let pastBenchWeeks = 0;

    const futureBenchWeeksNum = Number(futureBenchWeeks) || 0;
    const futureBenchHours = futureBenchWeeksNum * HOURS_PER_WEEK;

    // Parse dates
    const asOf = asOfDate ? new Date(asOfDate) : null;
    const today = todayDate ? new Date(todayDate) : null;
    const benchStart = benchStartDate ? new Date(benchStartDate) : null;

    if (mode === 'fullChargeable') {
      // Mode A: Fully chargeable since dashboard date
      if (asOf && today && today > asOf) {
        const diffDays = (today - asOf) / MS_PER_DAY;
        const extraWeeks = diffDays > 0 ? diffDays / 7 : 0;
        const extraHours = extraWeeks * HOURS_PER_WEEK;

        effectiveBillable += extraHours;
        effectiveTotal += extraHours;
      }
      // pastBenchWeeks remains 0
    } else if (mode === 'startedBench') {
      // Mode B: Started bench on specific date
      if (asOf && today && benchStart) {
        // Clamp dates
        let clampedBenchStart = benchStart < asOf ? asOf : benchStart;
        let clampedToday = today < asOf ? asOf : today;

        const totalDaysSinceAsOf = Math.max(0, (clampedToday - asOf) / MS_PER_DAY);
        const daysBillableAfterAsOf = Math.max(0, (clampedBenchStart - asOf) / MS_PER_DAY);
        const daysBenchSinceStart = Math.max(0, (clampedToday - clampedBenchStart) / MS_PER_DAY);

        // Convert to weeks
        const billableWeeksExtra = Math.min(daysBillableAfterAsOf, totalDaysSinceAsOf) / 7;
        pastBenchWeeks = Math.min(daysBenchSinceStart, totalDaysSinceAsOf) / 7;

        // Calculate hours
        const extraBillableHours = billableWeeksExtra * HOURS_PER_WEEK;
        const pastBenchHours = pastBenchWeeks * HOURS_PER_WEEK;

        // Update totals
        effectiveBillable += extraBillableHours;
        effectiveTotal += extraBillableHours;
        effectiveTotal += pastBenchHours;
      }
    }

    // Current chargeability (as of "today")
    const currentCHG = effectiveTotal > 0 ? effectiveBillable / effectiveTotal : 0;

    // Future forecast
    const finalBillable = effectiveBillable;
    const finalTotal = effectiveTotal + futureBenchHours;
    const projectedCHG = finalTotal > 0 ? finalBillable / finalTotal : 0;

    // Weeks tracked
    const weeksTracked = effectiveTotal / HOURS_PER_WEEK;

    // Total bench weeks for risk calculation
    const totalBenchWeeks = pastBenchWeeks + futureBenchWeeksNum;

    // Get level config
    const cfg = LEVEL_CONFIG[level];

    // Determine base risk from projected chargeability
    let baseRisk;
    if (projectedCHG >= cfg.target) {
      baseRisk = 'LOW';
    } else if (projectedCHG >= cfg.critical) {
      baseRisk = 'MEDIUM';
    } else {
      baseRisk = 'HIGH';
    }

    // Apply bench risk modifier
    let finalRisk = baseRisk;
    if (totalBenchWeeks >= 8) {
      finalRisk = 'HIGH';
    } else if (totalBenchWeeks >= 4 && baseRisk === 'LOW') {
      finalRisk = 'MEDIUM';
    }

    setResults({
      mode,
      asOfDate: formatDate(asOfDate),
      todayDate: formatDate(todayDate),
      benchStartDate: formatDate(benchStartDate),
      weeksTracked,
      pastBenchWeeks,
      currentCHG,
      projectedCHG,
      finalTotal,
      futureBenchHours,
      futureBenchWeeks: futureBenchWeeksNum,
      target: cfg.target,
      critical: cfg.critical,
      riskLevel: finalRisk,
      riskExplainer: RISK_EXPLAINERS[finalRisk],
    });
  };

  const formatPercent = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  return (
    <main className="main">
      <div className="stars"></div>
      <div className="container">
        <header className="header">
          <div className="logo-glow"></div>
          <h1 className="title">Chargeability & Bench Risk Forecaster</h1>
          <div className="header-buttons">
            <Link href="/" className="pill pill-link">
              Accenture · North America
            </Link>
            <Link href="/faq" className="pill pill-faq">
              FAQ
            </Link>
            <Link href="/other-countries" className="pill pill-faq">
              Other Countries
            </Link>
            <Link href="/privacy-policy" className="pill pill-faq">
              Privacy Policy
            </Link>
          </div>
          <p className="subtitle">
            Uses YTD hours from your productivity dashboard to forecast how bench weeks affect chargeability and staffing risk.
          </p>
        </header>

        <div className="two-column-layout">
          <div className="card input-card">
            <h2 className="card-title">Input Parameters</h2>
            
            <div className="form-stack">
              <div className="form-group">
                <label htmlFor="level">Career Level</label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="input select"
                >
                  <option value="Analyst">Analyst</option>
                  <option value="Senior Analyst">Senior Analyst</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ytdHours">Chargeability Year-to-Date Hours</label>
                <input
                  id="ytdHours"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 1200"
                  value={ytdHours}
                  onChange={(e) => setYtdHours(e.target.value)}
                  className="input"
                />
                <span className="helper-text">
                  Go to <a href="https://portal.accenture.com/#/myinfo" target="_blank" rel="noopener noreferrer" className="helper-link">portal.accenture.com</a>, click the + under Chargeability, then select "Year to Date".
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="asOfDate">As-of Date (from dashboard)</label>
                <input
                  id="asOfDate"
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="input"
                />
                <span className="helper-text">
                  Use the "As of MM/DD/YYYY" shown on your dashboard.
                </span>
              </div>

              <div className="form-section">
                <label className="section-label">What happened since this dashboard date?</label>
                
                <div className="radio-group">
                  <label className={`radio-option ${mode === 'fullChargeable' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="mode"
                      value="fullChargeable"
                      checked={mode === 'fullChargeable'}
                      onChange={(e) => setMode(e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">I've been fully chargeable from this dashboard date up to today</span>
                  </label>

                  {mode === 'fullChargeable' && (
                    <div className="conditional-fields">
                      <div className="form-group">
                        <label htmlFor="todayDate">Today's Date</label>
                        <input
                          id="todayDate"
                          type="date"
                          value={todayDate}
                          onChange={(e) => setTodayDate(e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>
                  )}

                  <label className={`radio-option ${mode === 'startedBench' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="mode"
                      value="startedBench"
                      checked={mode === 'startedBench'}
                      onChange={(e) => setMode(e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-text">I started bench (Suspended & Unassigned) on this date</span>
                  </label>

                  {mode === 'startedBench' && (
                    <div className="conditional-fields">
                      <div className="form-group">
                        <label htmlFor="benchStartDate">Bench Start Date</label>
                        <input
                          id="benchStartDate"
                          type="date"
                          value={benchStartDate}
                          onChange={(e) => setBenchStartDate(e.target.value)}
                          className="input"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="todayDateBench">Today's Date</label>
                        <input
                          id="todayDateBench"
                          type="date"
                          value={todayDate}
                          onChange={(e) => setTodayDate(e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="futureBenchWeeks">Forecast Bench Weeks (Suspended & Unassigned)</label>
                <input
                  id="futureBenchWeeks"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 4"
                  value={futureBenchWeeks}
                  onChange={(e) => setFutureBenchWeeks(e.target.value)}
                  className="input"
                />
                <span className="helper-text">
                  How many weeks you expect to be unassigned going forward.
                </span>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button className="calculate-btn" onClick={calculateForecast}>
                Calculate Forecast
              </button>
            </div>
          </div>

          <div className="results-column">
            {results && (
              <div className="card results-card">
                <h2 className="card-title">Forecast Results</h2>

                <p className="as-of-summary">
                  {results.mode === 'fullChargeable' ? (
                    <>
                      As of <strong>{results.todayDate}</strong>, assuming you have been fully chargeable since <strong>{results.asOfDate}</strong>, you have approximately <strong>{results.weeksTracked.toFixed(1)} weeks</strong> tracked this fiscal period (based on 40 hours/week).
                    </>
                  ) : (
                    <>
                      As of <strong>{results.todayDate}</strong>, we estimate about <strong>{results.weeksTracked.toFixed(1)} weeks</strong> tracked this fiscal period (based on 40 hours/week), including approximately <strong>{results.pastBenchWeeks.toFixed(1)} weeks</strong> of bench since <strong>{results.benchStartDate}</strong>.
                    </>
                  )}
                </p>

                <div className="level-range">
                  <span className="level-badge">{level}</span>
                  <span className="range-text">
                    Target ≥ {formatPercent(results.target)} • Critical &lt; {formatPercent(results.critical)}
                  </span>
                </div>

                <div className="metrics-grid">
                  <div className="metric">
                    <span className="metric-label">Current Chargeability</span>
                    <span className="metric-value">{formatPercent(results.currentCHG)}</span>
                  </div>
                  
                  <div className="metric highlight">
                    <span className="metric-label">Projected Chargeability</span>
                    <span className="metric-value large">{formatPercent(results.projectedCHG)}</span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">New Total Hours</span>
                    <span className="metric-value">{results.finalTotal.toFixed(1)} hrs</span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Bench Forecast</span>
                    <span className="metric-value small">
                      {results.futureBenchHours.toFixed(0)} hrs ({results.futureBenchWeeks} weeks)
                    </span>
                  </div>
                </div>

                <div className="risk-section">
                  <div className={`risk-badge risk-${results.riskLevel.toLowerCase()}`}>
                    Risk: {results.riskLevel}
                  </div>
                  <p className="risk-explainer">{results.riskExplainer}</p>
                </div>

                <p className="results-disclaimer">
                  Absence/PTO is treated as neutral. This model is a heuristic for personal planning only and does not represent any official HR or layoff decision logic.
                </p>
              </div>
            )}

            {!results && (
              <div className="card placeholder-card">
                <div className="placeholder-content">
                  <div className="placeholder-icon">📊</div>
                  <p className="placeholder-text">
                    Enter your YTD hours and click "Calculate Forecast" to see results
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="disclaimer">
          <p>
            ⚠️ This is a heuristic for personal planning only. It is not official HR logic.
          </p>
        </footer>
      </div>
    </main>
  );
}
