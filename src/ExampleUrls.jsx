import React from 'react';
import { SAMPLE_URLS } from '../utils/sampleUrls';
import { Zap, ShieldCheck, AlertTriangle, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function ExampleUrls({ onSelectExample }) {
  const getBadgeIcon = (type) => {
    switch (type) {
      case 'safe':
        return <ShieldCheck size={13} className="text-green" />;
      case 'medium':
        return <AlertTriangle size={13} className="text-amber" />;
      case 'high':
      default:
        return <ShieldAlert size={13} className="text-red" />;
    }
  };

  return (
    <section className="examples-section">
      <div className="section-header-compact">
        <div className="section-title-wrap">
          <Zap size={16} className="text-cyan inline-icon" />
          <h3 className="section-subtitle">Quick Test Vectors & Attack Scenarios</h3>
        </div>
        <span className="subtitle-hint">Click any benchmark or simulated phishing attack to inspect</span>
      </div>

      <div className="examples-grid">
        {SAMPLE_URLS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            className={`example-card example-border-${sample.type}`}
            onClick={() => onSelectExample(sample.url)}
          >
            <div className="example-top-row">
              <span className={`example-badge badge-${sample.type}`}>
                {getBadgeIcon(sample.type)}
                <span>{sample.badge}</span>
              </span>
              <span className="example-arrow">
                <ArrowUpRight size={14} />
              </span>
            </div>

            <div className="example-url-text">
              <code>{sample.url}</code>
            </div>

            <p className="example-desc">{sample.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
