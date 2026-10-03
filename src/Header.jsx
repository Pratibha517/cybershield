import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Info, Terminal, Lock } from 'lucide-react';

export default function Header({ onOpenAbout }) {
  return (
    <header className="cyber-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="logo-badge">
            <Shield className="logo-icon text-cyan" />
            <span className="logo-pulse"></span>
          </div>
          <div className="brand-text">
            <div className="title-row">
              <h1 className="brand-title">CYBERSHIELD</h1>
              <span className="badge-tag version-tag">v1.2 PRO</span>
              <span className="badge-tag safe-tag">
                <Lock size={12} className="inline-icon" /> ZERO-FETCH ENGINE
              </span>
            </div>
            <p className="brand-subtitle">
              Heuristic Phishing URL Analyzer & Security Intelligence Dashboard
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="privacy-pill" title="No network calls are made to analyzed URLs">
            <span className="status-dot-green"></span>
            <span className="privacy-text">100% Local Sandbox</span>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary btn-about"
            onClick={onOpenAbout}
            aria-label="About and Safety Information"
          >
            <Info size={16} />
            <span>Safety & About</span>
          </button>
        </div>
      </div>
    </header>
  );
}
