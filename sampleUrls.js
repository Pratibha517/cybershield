/**
 * Curated sample URLs for immediate demonstration and testing.
 * Includes both safe benchmark URLs and simulated phishing attack vectors.
 */

export const SAMPLE_URLS = [
  {
    id: 'safe-github',
    category: 'Safe / Low Risk',
    badge: 'Safe Benchmark',
    type: 'safe',
    url: 'https://github.com/explore',
    description: 'Clean HTTPS, established domain, no deceptive keywords or nesting.'
  },
  {
    id: 'safe-mdn',
    category: 'Safe / Low Risk',
    badge: 'Legitimate Portal',
    type: 'safe',
    url: 'https://developer.mozilla.org/en-US/docs/Web/Security',
    description: 'Standard multi-directory structure on a verified top-tier domain.'
  },
  {
    id: 'suspicious-shortener',
    category: 'Medium Risk',
    badge: 'URL Shortener',
    type: 'medium',
    url: 'https://bit.ly/3xXq9Yz',
    description: 'Masks true final destination; common in smishing and unsolicited communications.'
  },
  {
    id: 'suspicious-http-long',
    category: 'Medium Risk',
    badge: 'Insecure & Long Path',
    type: 'medium',
    url: 'http://news-feed-portal.com/articles/2026/10/03/session-verification-token-auth?redirect=external_target',
    description: 'Plain HTTP without SSL/TLS, excessive length, and authentication parameters.'
  },
  {
    id: 'danger-brand-spoof',
    category: 'High Risk',
    badge: 'Brand Spoofing',
    type: 'high',
    url: 'https://paypal-security-center.verify-login.xyz/webscr/update-account',
    description: 'Impersonates PayPal on an unauthorized .xyz domain with urgency keywords.'
  },
  {
    id: 'danger-ip-host',
    category: 'High Risk',
    badge: 'Direct IP Host',
    type: 'high',
    url: 'http://192.168.1.155:8080/login/chase-banking/verify-credentials.html',
    description: 'Raw IP address host, unencrypted HTTP, non-standard port 8080, and banking theft path.'
  },
  {
    id: 'danger-at-obfuscation',
    category: 'High Risk',
    badge: 'Deceptive @ Symbol',
    type: 'high',
    url: 'http://apple.com-login-support@portal-identity-auth.top/signin',
    description: 'Abuses the "@" syntax trick to disguise the real destination host (.top).'
  },
  {
    id: 'danger-subdomain-stack',
    category: 'High Risk',
    badge: 'Subdomain Stacking',
    type: 'high',
    url: 'https://security.login.microsoft.com.account-recovery-session.buzz/live',
    description: 'Five levels of subdomains disguising the true root domain (.buzz).'
  }
];
