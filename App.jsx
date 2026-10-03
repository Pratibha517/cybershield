import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import UrlAnalyzer from './components/UrlAnalyzer';
import AnalysisResults from './components/AnalysisResults';
import ExampleUrls from './components/ExampleUrls';
import ScanHistory from './components/ScanHistory';
import AboutModal from './components/AboutModal';
import { analyzeUrl } from './utils/urlAnalyzer';
import { getScanHistory, saveScanResult, clearAllHistory, deleteScanItem, calculateStats } from './utils/storage';
import { Shield, Sparkles, CheckCircle, AlertCircle, Info, Lock } from 'lucide-react';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(calculateStats([]));
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize history and stats from localStorage on mount
  useEffect(() => {
    const loadedHistory = getScanHistory();
    setHistory(loadedHistory);
    setStats(calculateStats(loadedHistory));

    // If there is existing history, load the most recent scan as initial view
    if (loadedHistory.length > 0) {
      try {
        const latest = analyzeUrl(loadedHistory[0].url);
        setAnalysisResult(latest);
        setCurrentUrl(loadedHistory[0].url);
      } catch {
        // Ignore if cached item has issue
      }
    }
  }, []);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAnalyze = (targetUrl) => {
    if (!targetUrl || !targetUrl.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Realistic brief cyber scan simulation for UX clarity
    setTimeout(() => {
      try {
        const result = analyzeUrl(targetUrl);
        setAnalysisResult(result);
        
        // Save scan to localStorage and update telemetry
        const updatedHistory = saveScanResult(result);
        setHistory(updatedHistory);
        setStats(calculateStats(updatedHistory));

        if (result.level === 'HIGH') {
          showToast(`Critical warning: ${result.metrics.threatsCount} high risk indicators detected!`, 'danger');
        } else if (result.level === 'MEDIUM') {
          showToast(`Caution: ${result.metrics.threatsCount} suspicious patterns identified.`, 'warning');
        } else {
          showToast(`URL passed heuristic inspection with clean rating.`, 'success');
        }
      } catch (err) {
        showToast(err.message || 'Failed to parse URL.', 'danger');
      } finally {
        setIsAnalyzing(false);
      }
    }, 380);
  };

  const handleSelectExample = (exampleUrl) => {
    setCurrentUrl(exampleUrl);
    handleAnalyze(exampleUrl);

    // Smooth scroll up to analyzer
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    const cleared = clearAllHistory();
    setHistory(cleared);
    setStats(calculateStats(cleared));
    showToast('Scan history and telemetry metrics have been cleared.', 'info');
  };

  const handleDeleteScan = (id) => {
    const updated = deleteScanItem(id);
    setHistory(updated);
    setStats(calculateStats(updated));
    showToast('Record removed from audit log.', 'info');
  };

  const handleInspectScan = (url) => {
    setCurrentUrl(url);
    handleAnalyze(url);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="cyber-app-shell">
      {/* Background Cyber Grid Decorative Overlays */}
      <div className="cyber-grid-overlay" aria-hidden="true"></div>
      <div className="cyber-glow-blob blob-top-left" aria-hidden="true"></div>
      <div className="cyber-glow-blob blob-bottom-right" aria-hidden="true"></div>

      {/* Main Top Navigation Header */}
      <Header onOpenAbout={() => setIsAboutOpen(true)} />

      {/* Main Dashboard Body Container */}
      <main className="dashboard-content">
        <div className="dashboard-container">
          {/* Top Real-Time Telemetry Stats Cards */}
          <StatsOverview stats={stats} />

          {/* Core URL Input & Heuristic Analyzer */}
          <UrlAnalyzer 
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            currentUrl={currentUrl}
            setInputUrl={setCurrentUrl}
          />

          {/* Analysis Results Display (Gauge, Explanations, Anatomy) */}
          {analysisResult && (
            <AnalysisResults 
              result={analysisResult} 
              onReanalyze={() => handleAnalyze(currentUrl)}
            />
          )}

          {/* Pre-configured Test Vectors & Attack Scenarios */}
          <ExampleUrls onSelectExample={handleSelectExample} />

          {/* Scan History and Audit Trail */}
          <ScanHistory 
            history={history}
            onClearHistory={handleClearHistory}
            onInspectScan={handleInspectScan}
            onDeleteScan={handleDeleteScan}
          />
        </div>
      </main>

      {/* Footer with Disclaimer & Safety Notice */}
      <footer className="cyber-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-brand">
              <Shield size={16} className="text-cyan inline-icon" />
              <span>CyberShield Phishing URL Analyzer</span>
            </div>
            <p className="footer-disclaimer">
              <strong>Notice:</strong> For educational, defensive auditing, and triage purposes. Static heuristic analysis does not replace human judgment, multi-factor authentication, or enterprise endpoint protection.
            </p>
          </div>

          <div className="footer-right">
            <button 
              type="button" 
              className="footer-link-btn" 
              onClick={() => setIsAboutOpen(true)}
            >
              Security Principles & FAQ
            </button>
            <span className="footer-divider">•</span>
            <span className="footer-privacy-tag">
              <Lock size={12} className="inline-icon" /> Client-Side Only / No Tracking
            </span>
          </div>
        </div>
      </footer>

      {/* About & Education Modal */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />

      {/* Floating System Toast Alert */}
      {toastMessage && (
        <div className={`cyber-toast toast-${toastMessage.type}`} role="status">
          {toastMessage.type === 'success' && <CheckCircle size={16} className="text-green" />}
          {toastMessage.type === 'warning' && <AlertTriangle size={16} className="text-amber" />}
          {toastMessage.type === 'danger' && <AlertCircle size={16} className="text-red" />}
          {toastMessage.type === 'info' && <Info size={16} className="text-cyan" />}
          <span className="toast-text">{toastMessage.message}</span>
        </div>
      )}
    </div>
  );
}
