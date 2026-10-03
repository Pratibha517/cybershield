import React, { useState } from 'react';
import { 
  History, Trash2, ArrowRight, ShieldAlert, ShieldCheck, 
  AlertTriangle, Filter, Clock, Search, RotateCcw
} from 'lucide-react';

export default function ScanHistory({ 
  history, 
  onClearHistory, 
  onInspectScan, 
  onDeleteScan 
}) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = history.filter((item) => {
    // Filter by risk tier
    if (filterType !== 'ALL' && item.level !== filterType) {
      return false;
    }
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return item.url.toLowerCase().includes(term) || (item.hostname && item.hostname.toLowerCase().includes(term));
    }
    return true;
  });

  const getTierIcon = (level) => {
    switch (level) {
      case 'HIGH':
        return <ShieldAlert size={14} className="text-red" />;
      case 'MEDIUM':
        return <AlertTriangle size={14} className="text-amber" />;
      case 'LOW':
      default:
        return <ShieldCheck size={14} className="text-green" />;
    }
  };

  const formatRelativeTime = (timestamp) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <section className="history-section" aria-label="Scan History Records">
      <div className="history-header">
        <div className="section-title-wrap">
          <History size={18} className="text-cyan inline-icon" />
          <h3 className="section-title">Audit Log & Local Scan History</h3>
          <span className="badge-counter">{history.length}</span>
        </div>

        {history.length > 0 && (
          <div className="history-top-controls">
            {!showClearConfirm ? (
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 size={14} />
                <span>Clear All Logs</span>
              </button>
            ) : (
              <div className="clear-confirm-group">
                <span className="confirm-prompt">Erase {history.length} records?</span>
                <button
                  type="button"
                  className="btn btn-danger btn-xs"
                  onClick={() => {
                    onClearHistory();
                    setShowClearConfirm(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="history-filter-bar">
          <div className="search-filter-box">
            <Search size={14} className="text-cyan-muted" />
            <input
              type="text"
              className="search-filter-input"
              placeholder="Search history by domain or path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-pill-group">
            <button
              type="button"
              className={`pill-btn ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              All ({history.length})
            </button>
            <button
              type="button"
              className={`pill-btn pill-high ${filterType === 'HIGH' ? 'active' : ''}`}
              onClick={() => setFilterType('HIGH')}
            >
              High ({history.filter(h => h.level === 'HIGH').length})
            </button>
            <button
              type="button"
              className={`pill-btn pill-medium ${filterType === 'MEDIUM' ? 'active' : ''}`}
              onClick={() => setFilterType('MEDIUM')}
            >
              Medium ({history.filter(h => h.level === 'MEDIUM').length})
            </button>
            <button
              type="button"
              className={`pill-btn pill-safe ${filterType === 'LOW' ? 'active' : ''}`}
              onClick={() => setFilterType('LOW')}
            >
              Low / Safe ({history.filter(h => h.level === 'LOW').length})
            </button>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="history-empty-card">
          <Clock size={36} className="text-cyan-muted mb-2" />
          <p className="empty-title">No Scan Logs Recorded</p>
          <p className="empty-sub">
            Your URL inspections are saved securely in your browser's localStorage. Analyze a link above or select an attack scenario to begin.
          </p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="history-empty-card">
          <Filter size={32} className="text-cyan-muted mb-2" />
          <p className="empty-title">No Scans Match Current Filter</p>
          <p className="empty-sub">Try changing your search keywords or tier filter tabs.</p>
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((item) => (
            <div key={item.id} className={`history-item history-item-${item.level.toLowerCase()}`}>
              <div className="history-score-cell">
                <span className={`score-badge score-${item.level.toLowerCase()}`}>
                  {item.score}
                </span>
                <span className="score-max-label">/100</span>
              </div>

              <div className="history-info-cell">
                <div className="history-item-top">
                  <span className={`tier-tag tag-${item.level.toLowerCase()}`}>
                    {getTierIcon(item.level)}
                    <span>{item.level} RISK</span>
                  </span>
                  <span className="history-time">{formatRelativeTime(item.timestamp)}</span>
                  <span className="threat-pill">
                    {item.threatsCount} issue{item.threatsCount === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="history-url-line" title={item.url}>
                  <code>{item.url}</code>
                </div>
              </div>

              <div className="history-actions-cell">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onInspectScan(item.url)}
                  title="Re-analyze or view full report"
                >
                  <span>Re-Inspect</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  type="button"
                  className="btn-icon btn-icon-danger"
                  onClick={() => onDeleteScan(item.id)}
                  title="Remove this record"
                  aria-label="Delete entry"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
