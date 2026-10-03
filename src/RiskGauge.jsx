import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RiskGauge({ score, level, levelColor }) {
  // SVG circular gauge geometry
  const radius = 68;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc spans 260 degrees instead of 360 for high-tech instrument panel feel
  const arcLength = circumference * 0.75;
  const progressOffset = arcLength - (score / 100) * arcLength;

  const getLevelIcon = () => {
    switch (level) {
      case 'HIGH':
        return <ShieldAlert size={22} className="text-red" />;
      case 'MEDIUM':
        return <AlertTriangle size={22} className="text-amber" />;
      case 'LOW':
      default:
        return <ShieldCheck size={22} className="text-green" />;
    }
  };

  const getTierDescription = () => {
    switch (level) {
      case 'HIGH':
        return 'Critical Phishing Probability';
      case 'MEDIUM':
        return 'Elevated Suspicion Detected';
      case 'LOW':
      default:
        return 'Standard / Minimal Risk Profile';
    }
  };

  return (
    <div className="risk-gauge-container">
      <div className="gauge-svg-wrapper">
        <svg className="gauge-svg" width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="gaugeTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={levelColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Background circle track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="url(#gaugeTrackGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(135 90 90)"
          />

          {/* Active progress arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={levelColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform="rotate(135 90 90)"
            filter="url(#gaugeGlow)"
            className="gauge-arc-anim"
          />
        </svg>

        {/* Center score readout */}
        <div className="gauge-center-content">
          <div className="gauge-score-number" style={{ color: levelColor }}>
            {score}
          </div>
          <div className="gauge-score-max">/ 100</div>
          <div className="gauge-score-caption">RISK SCORE</div>
        </div>
      </div>

      <div className="gauge-verdict-box">
        <div className={`gauge-badge badge-${level.toLowerCase()}`}>
          {getLevelIcon()}
          <span>{level} RISK</span>
        </div>
        <div className="gauge-tier-sub">{getTierDescription()}</div>
      </div>
    </div>
  );
}
