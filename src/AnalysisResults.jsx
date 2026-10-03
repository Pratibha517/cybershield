import React, { useState } from 'react';
import RiskGauge from './RiskGauge';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, 
  ExternalLink, Copy, Check, Terminal, HelpCircle, 
  Layers, Globe, Lock, Unlock, Hash, Compass, ArrowRight
} from 'lucide-react';

export default function AnalysisResults({ result, onReanalyze }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('threats'); // 'threats' | 'passed' | 'structure'

  if (!result) return null;

  const {
    url,
    score,
    level,
    levelColor,
    verdictSummary,
    analyzedAt,
    components,
    threats,
    passed,
    metrics
  } = result;

  const handleCopySummary = async () => {
    const summaryText = `[CyberShield Analysis Report]
Target URL: ${url}
Risk Score: ${score}/100 (${level} RISK)
Verdict: ${verdictSummary}
Identified Threats (${threats.length}):
${threats.map((t, i) => `${i + 1}. [${t.severity.toUpperCase()}] ${t.title}: ${t.description}`).join('\n')}
Timestamp: ${analyzedAt}
Method: 100% Offline Static Heuristic Analysis`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="results-container">
      {/* Top Banner with Risk Level and Gauge */}
      <div className={`results-hero-card hero-border-${level.toLowerCase()}`}>
        <div className="hero-left">
          <div className="hero-status-row">
            <span className={`risk-pill pill-${level.toLowerCase()}`}>
              {level === 'HIGH' && <ShieldAlert size={14} className="inline-icon" />}
              {level === 'MEDIUM' && <AlertTriangle size={14} className="inline-icon" />}
              {level === 'LOW' && <ShieldCheck size={14} className="inline-icon" />}
              {level} RISK LEVEL
            </span>
            <span className="timestamp-note">
              Analyzed: {new Date(analyzedAt).toLocaleTimeString()}
            </span>
          </div>

          <h3 className="verdict-heading">{verdictSummary}</h3>

          <div className="target-url-display">
            <span className="target-url-label">INSPECTED URL:</span>
            <div className="target-url-code" title={url}>
              <code>{url}</code>
            </div>
          </div>

          <div className="quick-stats-row">
            <div className="quick-stat-badge">
              <span className="badge-count text-red">{metrics.threatsCount}</span>
              <span className="badge-label">Warning Signs</span>
            </div>
            <div className="quick-stat-badge">
              <span className="badge-count text-green">{metrics.passedCount}</span>
              <span className="badge-label">Clean Passes</span>
            </div>
            <div className="quick-stat-badge">
              <span className="badge-count text-cyan">{components.subdomainCount}</span>
              <span className="badge-label">Subdomains</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <RiskGauge score={score} level={level} levelColor={levelColor} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="results-action-bar">
        <div className="tab-buttons-group">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'threats' ? 'active' : ''}`}
            onClick={() => setActiveTab('threats')}
          >
            <ShieldAlert size={15} />
            <span>Detected Threats ({threats.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'passed' ? 'active' : ''}`}
            onClick={() => setActiveTab('passed')}
          >
            <ShieldCheck size={15} />
            <span>Passed Checks ({passed.length})</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            <Layers size={15} />
            <span>URL Anatomy</span>
          </button>
        </div>

        <div className="action-buttons-group">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={handleCopySummary}
          >
            {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Threats Explanation */}
      {activeTab === 'threats' && (
        <div className="tab-pane threats-pane">
          {threats.length === 0 ? (
            <div className="empty-threats-card">
              <CheckCircle2 size={40} className="text-green" />
              <h4>No Heuristic Warning Signs Flagged</h4>
              <p>
                The tested URL matches standard structural security patterns and does not trigger our static phishing heuristics. Always remain vigilant before sharing confidential information.
              </p>
            </div>
          ) : (
            <div className="threats-list">
              {threats.map((threat) => (
                <div key={threat.id} className={`threat-card card-severity-${threat.severity}`}>
                  <div className="threat-card-header">
                    <div className="threat-title-group">
                      <span className={`severity-badge severity-${threat.severity}`}>
                        {threat.severity.toUpperCase()}
                      </span>
                      <h4 className="threat-title">{threat.title}</h4>
                    </div>
                  </div>

                  <p className="threat-description">{threat.description}</p>

                  <div className="threat-evidence-box">
                    <span className="evidence-label">Observed Pattern:</span>
                    <code className="evidence-code">{threat.evidence}</code>
                  </div>

                  <div className="threat-recommendation">
                    <div className="rec-header">
                      <Compass size={14} className="text-cyan inline-icon" />
                      <strong>Safety Precaution:</strong>
                    </div>
                    <span className="rec-text">{threat.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Passed Checks */}
      {activeTab === 'passed' && (
        <div className="tab-pane passed-pane">
          <div className="passed-list">
            {passed.map((item) => (
              <div key={item.id} className="passed-card">
                <div className="passed-icon-wrap">
                  <CheckCircle2 size={20} className="text-green" />
                </div>
                <div className="passed-info">
                  <h4 className="passed-title">{item.title}</h4>
                  <p className="passed-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: URL Anatomy Breakdown */}
      {activeTab === 'structure' && (
        <div className="tab-pane structure-pane">
          <div className="anatomy-grid">
            <div className="anatomy-item">
              <span className="anatomy-label">Scheme / Protocol</span>
              <div className="anatomy-value">
                {components.protocol === 'https' ? (
                  <span className="text-green flex-align"><Lock size={14} className="inline-icon" /> HTTPS (Secure)</span>
                ) : (
                  <span className="text-amber flex-align"><Unlock size={14} className="inline-icon" /> {components.protocol.toUpperCase()} (Insecure)</span>
                )}
              </div>
            </div>

            <div className="anatomy-item">
              <span className="anatomy-label">Registered Root Domain</span>
              <div className="anatomy-value">
                <code>{components.rootDomain || 'N/A'}</code>
              </div>
            </div>

            <div className="anatomy-item">
              <span className="anatomy-label">Full Hostname</span>
              <div className="anatomy-value">
                <code>{components.hostname}</code>
              </div>
            </div>

            <div className="anatomy-item">
              <span className="anatomy-label">Subdomain Depth</span>
              <div className="anatomy-value">
                <span>{components.subdomainCount} level{components.subdomainCount === 1 ? '' : 's'}</span>
              </div>
            </div>

            <div className="anatomy-item">
              <span className="anatomy-label">Host Type</span>
              <div className="anatomy-value">
                <span>{components.isIp ? 'Raw Numeric IP Address' : 'Standard DNS Hostname'}</span>
              </div>
            </div>

            <div className="anatomy-item">
              <span className="anatomy-label">Destination Port</span>
              <div className="anatomy-value">
                <span>Port {components.port}</span>
              </div>
            </div>

            <div className="anatomy-item anatomy-full-width">
              <span className="anatomy-label">Resource Path</span>
              <div className="anatomy-value">
                <code>{components.pathname}</code>
              </div>
            </div>

            {components.search && (
              <div className="anatomy-item anatomy-full-width">
                <span className="anatomy-label">Query Parameters</span>
                <div className="anatomy-value">
                  <code>{components.search}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
