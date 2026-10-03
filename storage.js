/**
 * LocalStorage and Dashboard Metrics Utility
 * Manages scan history persistence and dynamically computes dashboard statistics.
 */

const STORAGE_KEY = 'cybershield_scan_history_v1';

export function getScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to retrieve scan history from localStorage:', err);
    return [];
  }
}

export function saveScanResult(analysisResult) {
  try {
    const history = getScanHistory();
    
    // Create new scan record
    const scanItem = {
      id: 'scan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      url: analysisResult.url,
      hostname: analysisResult.components.hostname,
      score: analysisResult.score,
      level: analysisResult.level,
      levelColor: analysisResult.levelColor,
      threatsCount: analysisResult.metrics.threatsCount,
      passedCount: analysisResult.metrics.passedCount,
      threats: analysisResult.threats.map(t => ({
        id: t.id,
        severity: t.severity,
        title: t.title,
        evidence: t.evidence
      })),
      timestamp: Date.now()
    };

    // Prepend to top, deduplicate if exact same URL was scanned in the last 10 seconds, and cap at 50 records
    const filtered = history.filter(item => !(item.url === scanItem.url && (Date.now() - item.timestamp < 10000)));
    const updated = [scanItem, ...filtered].slice(0, 50);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save scan to localStorage:', err);
    return getScanHistory();
  }
}

export function deleteScanItem(id) {
  try {
    const history = getScanHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete scan item:', err);
    return getScanHistory();
  }
}

export function clearAllHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear history:', err);
    return [];
  }
}

/**
 * Computes live dashboard metrics strictly from current history array
 */
export function calculateStats(history) {
  if (!history || history.length === 0) {
    return {
      totalScans: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      averageScore: 0,
      highRiskPercent: 0,
      mediumRiskPercent: 0,
      lowRiskPercent: 0,
      totalThreatsFlagged: 0
    };
  }

  const totalScans = history.length;
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  let totalScore = 0;
  let totalThreatsFlagged = 0;

  history.forEach(item => {
    totalScore += item.score;
    totalThreatsFlagged += (item.threatsCount || 0);

    if (item.level === 'HIGH' || item.score >= 70) {
      highRiskCount++;
    } else if (item.level === 'MEDIUM' || item.score >= 40) {
      mediumRiskCount++;
    } else {
      lowRiskCount++;
    }
  });

  const averageScore = Math.round(totalScore / totalScans);
  const highRiskPercent = Math.round((highRiskCount / totalScans) * 100);
  const mediumRiskPercent = Math.round((mediumRiskCount / totalScans) * 100);
  const lowRiskPercent = Math.round((lowRiskCount / totalScans) * 100);

  return {
    totalScans,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    averageScore,
    highRiskPercent,
    mediumRiskPercent,
    lowRiskPercent,
    totalThreatsFlagged
  };
}
