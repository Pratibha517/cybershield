import React, { useState } from 'react';
import { Search, Sparkles, Clipboard, X, AlertCircle, ShieldAlert, Cpu } from 'lucide-react';

export default function UrlAnalyzer({ onAnalyze, isAnalyzing, currentUrl, setInputUrl }) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUrl || !currentUrl.trim()) {
      setErrorMessage('Please enter a target URL or select an example below.');
      return;
    }
    setErrorMessage('');
    onAnalyze(currentUrl.trim());
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputUrl(text.trim());
          setErrorMessage('');
        }
      }
    } catch {
      setErrorMessage('Clipboard access was blocked by browser permissions. Please paste directly.');
    }
  };

  const handleClear = () => {
    setInputUrl('');
    setErrorMessage('');
  };

  return (
    <div className="analyzer-card">
      <div className="analyzer-header">
        <div className="card-badge">
          <Cpu size={14} className="inline-icon text-cyan" />
          <span>OFFLINE HEURISTIC PARSER</span>
        </div>
        <div className="security-notice">
          <span>Safe Analysis: Target URL will never be loaded or visited</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="analyzer-form">
        <div className="input-group-wrapper">
          <div className="input-icon-prefix">
            <Search size={18} className="text-cyan-muted" />
          </div>

          <input
            type="text"
            className="url-input"
            placeholder="Paste or enter URL to inspect (e.g. https://secure-login.apple.com.verify.xyz/update)"
            value={currentUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            spellCheck="false"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            aria-label="Target URL to inspect"
          />

          <div className="input-actions-group">
            {currentUrl && (
              <button
                type="button"
                className="btn-icon"
                onClick={handleClear}
                title="Clear input"
                aria-label="Clear input"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="button"
              className="btn-icon"
              onClick={handlePaste}
              title="Paste from clipboard"
              aria-label="Paste from clipboard"
            >
              <Clipboard size={16} />
            </button>
          </div>
        </div>

        <div className="analyzer-actions-row">
          <div className="input-help-text">
            <span>Press <kbd>Enter</kbd> or click Analyze. Supports raw hostnames and full URIs.</span>
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-analyze ${isAnalyzing ? 'btn-pulsing' : ''}`}
            disabled={isAnalyzing}
            aria-label="Analyze URL"
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                <span>Deconstructing URL...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="sparkle-icon" />
                <span>Analyze URL</span>
              </>
            )}
          </button>
        </div>
      </form>

      {errorMessage && (
        <div className="error-banner" role="alert">
          <AlertCircle size={18} className="text-red flex-shrink-0" />
          <div className="error-text">{errorMessage}</div>
        </div>
      )}
    </div>
  );
}
