import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, BarChart3, Database } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const {
    totalScans,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    averageScore,
    highRiskPercent,
    mediumRiskPercent,
    lowRiskPercent,
    totalThreatsFlagged
  } = stats;

  return (
    <section className="stats-dashboard" aria-label="Security Metrics Overview">
      <div className="stats-header-row">
        <div className="section-title-wrap">
          <Activity size={18} className="text-cyan pulse-icon" />
          <h2 className="section-title">Telemetry & Scan Metrics</h2>
        </div>
        <span className="stats-source-note">
          <Database size={13} className="inline-icon" /> Derived from {totalScans} local scan{totalScans === 1 ? '' : 's'}
        </span>
      </div>

      <div className="stats-grid">
        {/* Total Scans Card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Analyzed</span>
            <div className="stat-icon-wrap bg-cyan-dim">
              <Activity size={20} className="text-cyan" />
            </div>
          </div>
          <div className="stat-value text-cyan">{totalScans}</div>
          <div className="stat-footnote">
            {totalThreatsFlagged} total threat indicators tracked
          </div>
        </div>

        {/* High Risk Card */}
        <div className="stat-card stat-card-high">
          <div className="stat-card-header">
            <span className="stat-label">High Risk Threats</span>
            <div className="stat-icon-wrap bg-red-dim">
              <ShieldAlert size={20} className="text-red" />
            </div>
          </div>
          <div className="stat-value text-red">{highRiskCount}</div>
          <div className="stat-footnote">
            {totalScans > 0 ? `${highRiskPercent}% of analyzed targets` : 'Zero high threats logged'}
          </div>
        </div>

        {/* Medium Risk Card */}
        <div className="stat-card stat-card-medium">
          <div className="stat-card-header">
            <span className="stat-label">Medium Risk Alerts</span>
            <div className="stat-icon-wrap bg-amber-dim">
              <AlertTriangle size={20} className="text-amber" />
            </div>
          </div>
          <div className="stat-value text-amber">{mediumRiskCount}</div>
          <div className="stat-footnote">
            {totalScans > 0 ? `${mediumRiskPercent}% suspicious signals` : 'No suspicious anomalies'}
          </div>
        </div>

        {/* Low Risk / Safe Card */}
        <div className="stat-card stat-card-safe">
          <div className="stat-card-header">
            <span className="stat-label">Safe / Low Risk</span>
            <div className="stat-icon-wrap bg-green-dim">
              <ShieldCheck size={20} className="text-green" />
            </div>
          </div>
          <div className="stat-value text-green">{lowRiskCount}</div>
          <div className="stat-footnote">
            {totalScans > 0 ? `${lowRiskPercent}% clean benchmark URLs` : 'Awaiting initial scans'}
          </div>
        </div>
      </div>

      {/* Threat Distribution Ratio Bar */}
      {totalScans > 0 && (
        <div className="threat-ratio-panel">
          <div className="ratio-header">
            <div className="ratio-title">
              <BarChart3 size={15} className="text-cyan inline-icon" /> Threat Distribution Spectrum
            </div>
            <div className="ratio-avg">
              Average Heuristic Risk: <strong className="text-cyan">{averageScore}/100</strong>
            </div>
          </div>
          <div className="ratio-bar-container">
            {lowRiskPercent > 0 && (
              <div 
                className="ratio-segment ratio-safe" 
                style={{ width: `${lowRiskPercent}%` }}
                title={`Safe: ${lowRiskCount} (${lowRiskPercent}%)`}
              >
                <span>{lowRiskPercent}% Safe</span>
              </div>
            )}
            {mediumRiskPercent > 0 && (
              <div 
                className="ratio-segment ratio-medium" 
                style={{ width: `${mediumRiskPercent}%` }}
                title={`Medium Risk: ${mediumRiskCount} (${mediumRiskPercent}%)`}
              >
                <span>{mediumRiskPercent}% Suspicious</span>
              </div>
            )}
            {highRiskPercent > 0 && (
              <div 
                className="ratio-segment ratio-high" 
                style={{ width: `${highRiskPercent}%` }}
                title={`High Risk: ${highRiskCount} (${highRiskPercent}%)`}
              >
                <span>{highRiskPercent}% High</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
