/**
 * CyberShield — Heuristic Phishing URL Analysis Engine
 * 
 * Performs 100% local, client-side pattern analysis without initiating
 * any outbound network requests or DNS queries to the target URL.
 */

// Popular targets for phishing brand impersonation
const TARGETED_BRANDS = [
  { name: 'PayPal', match: 'paypal', legitDomains: ['paypal.com', 'paypal.me'] },
  { name: 'Apple', match: 'apple', legitDomains: ['apple.com', 'icloud.com'] },
  { name: 'Microsoft', match: 'microsoft', legitDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'msn.com'] },
  { name: 'Google', match: 'google', legitDomains: ['google.com', 'gmail.com', 'google.co.uk'] },
  { name: 'Amazon', match: 'amazon', legitDomains: ['amazon.com', 'amazon.co.uk', 'amazon.de', 'aws.amazon.com'] },
  { name: 'Netflix', match: 'netflix', legitDomains: ['netflix.com'] },
  { name: 'Chase Bank', match: 'chase', legitDomains: ['chase.com'] },
  { name: 'Wells Fargo', match: 'wellsfargo', legitDomains: ['wellsfargo.com'] },
  { name: 'Bank of America', match: 'bankofamerica', legitDomains: ['bankofamerica.com'] },
  { name: 'Facebook / Meta', match: 'facebook', legitDomains: ['facebook.com', 'meta.com', 'fb.com'] },
  { name: 'Instagram', match: 'instagram', legitDomains: ['instagram.com'] },
  { name: 'Binance', match: 'binance', legitDomains: ['binance.com'] },
  { name: 'Coinbase', match: 'coinbase', legitDomains: ['coinbase.com'] },
  { name: 'MetaMask', match: 'metamask', legitDomains: ['metamask.io'] },
  { name: 'Steam', match: 'steam', legitDomains: ['steampowered.com', 'steamcommunity.com'] },
  { name: 'DHL', match: 'dhl', legitDomains: ['dhl.com', 'dhl.de'] },
  { name: 'FedEx', match: 'fedex', legitDomains: ['fedex.com'] },
  { name: 'USPS', match: 'usps', legitDomains: ['usps.com'] }
];

// Common URL shortener services that obscure final destinations
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'buff.ly', 
  'ow.ly', 'cutt.ly', 'goo.gl', 'qr.net', 'shorturl.at', 
  'rb.gy', 'v.gd', 'clck.ru', 'rotf.lol'
];

// Top Level Domains frequently associated with low-cost or spammy phishing campaigns
const SUSPICIOUS_TLDS = [
  'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'xyz', 'buzz', 
  'work', 'click', 'fit', 'icu', 'loan', 'surf', 'zip', 
  'mov', 'country', 'kim', 'gdn', 'mom', 'rest', 'center'
];

// Sensitive keywords commonly leveraged in social engineering attack paths
const SENSITIVE_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'security', 
  'account', 'banking', 'authenticate', 'credential', 'update', 
  'confirm', 'recovery', 'password', 'passcode', 'wallet', 'token', 
  'billing', 'validate', 'unlock', 'suspended', 'alert', 'webscr', 'cgi-bin'
];

/**
 * Extracts effective registered root domain from a hostname
 * (Handles basic 2-level TLDs like .co.uk, .com.br, etc.)
 */
function extractRootDomain(hostname) {
  if (!hostname) return '';
  const parts = hostname.toLowerCase().split('.');
  if (parts.length <= 2) return hostname.toLowerCase();

  const twoLevelTlds = ['co.uk', 'com.au', 'com.br', 'co.nz', 'co.za', 'com.mx', 'gov.uk', 'edu.au', 'org.uk'];
  const lastTwo = parts.slice(-2).join('.');
  
  if (twoLevelTlds.includes(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  return parts.slice(-2).join('.');
}

/**
 * Normalizes user input into a valid URL object
 */
export function normalizeUrl(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Please enter a valid URL.');
  }

  let cleaned = input.trim();

  // Strip dangerous whitespace and control characters
  cleaned = cleaned.replace(/[\r\n\t]/g, '');

  if (cleaned.length === 0) {
    throw new Error('URL input cannot be blank.');
  }

  // If user pasted without protocol, assume https for parsing but keep note
  let hadScheme = true;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(cleaned)) {
    cleaned = 'https://' + cleaned;
    hadScheme = false;
  }

  try {
    const parsed = new URL(cleaned);
    return { parsed, original: input.trim(), hadScheme };
  } catch {
    throw new Error('Malformed URL structure. Ensure it follows standard domain syntax (e.g., example.com or https://example.com).');
  }
}

/**
 * Main URL Heuristic Analysis Function
 */
export function analyzeUrl(rawInput) {
  const { parsed, original, hadScheme } = normalizeUrl(rawInput);
  
  let score = 0;
  const threats = [];
  const passed = [];

  const rawUrl = original.toLowerCase();
  const protocol = parsed.protocol;
  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname;
  const search = parsed.search;
  const port = parsed.port;
  const rootDomain = extractRootDomain(hostname);
  const hostParts = hostname.split('.');

  // -------------------------------------------------------------
  // Check 1: HTTPS & Secure Protocol
  // -------------------------------------------------------------
  if (protocol === 'https:') {
    passed.push({
      id: 'https-active',
      title: 'HTTPS Encryption Enabled',
      description: 'The URL uses the encrypted HTTPS protocol for in-transit transport security.'
    });
  } else if (protocol === 'http:') {
    score += 25;
    threats.push({
      id: 'insecure-http',
      severity: 'medium',
      title: 'Unencrypted HTTP Protocol',
      evidence: 'http://',
      description: 'Communication is transmitted in plain text without SSL/TLS encryption, leaving credentials vulnerable to interception.',
      recommendation: 'Do not submit passwords, personal data, or payment information on plain HTTP sites.'
    });
  } else {
    score += 35;
    threats.push({
      id: 'unusual-protocol',
      severity: 'high',
      title: `Unusual / Potentially Dangerous Protocol (${protocol})`,
      evidence: protocol,
      description: 'The URL specifies a non-standard protocol (e.g. data:, ftp:, file:, or javascript:) which can be abused for payload delivery or XSS.',
      recommendation: 'Avoid opening links using non-standard web protocols.'
    });
  }

  // -------------------------------------------------------------
  // Check 2: IP-Address Hostname (IPv4 / IPv6 / Hex / Octal)
  // -------------------------------------------------------------
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isIpv4 = ipv4Regex.test(hostname);
  const isIpv6 = hostname.startsWith('[') || /^[0-9a-fA-F:]{5,}$/.test(hostname);
  const isHexOrOctalIp = /^(0x[0-9a-f]+|\d+)$/i.test(hostname);

  if (isIpv4 || isIpv6 || isHexOrOctalIp) {
    score += 35;
    threats.push({
      id: 'ip-address-host',
      severity: 'high',
      title: 'Raw IP Address Used as Hostname',
      evidence: hostname,
      description: 'Legitimate services use registered domain names. Cybercriminals often use direct IP addresses to evade domain-based reputation filters and blocklists.',
      recommendation: 'Be extremely cautious. Most legitimate commercial and consumer services do not direct users to raw IP addresses.'
    });
  } else {
    passed.push({
      id: 'domain-host-verified',
      title: 'Standard Domain Name Format',
      description: 'The host uses a standard alphabetical domain name rather than a raw numeric IP address.'
    });
  }

  // -------------------------------------------------------------
  // Check 3: Excessive Subdomains / Deep Domain Nesting
  // -------------------------------------------------------------
  // Subtract 2 for domain.tld (or 3 for co.uk)
  const isMultiLevelTld = rootDomain.split('.').length > 2;
  const basePartsCount = isMultiLevelTld ? 3 : 2;
  const subdomainCount = Math.max(0, hostParts.length - basePartsCount);

  if (subdomainCount >= 3) {
    score += 25;
    threats.push({
      id: 'excessive-subdomains',
      severity: 'high',
      title: `Excessive Subdomain Stacking (${subdomainCount} subdomains detected)`,
      evidence: hostname,
      description: 'Phishers frequently chain multiple subdomains (e.g., login.chase.com.account-update.xyz) to deceive mobile users who only see the first few characters in their browser address bar.',
      recommendation: 'Inspect the true root domain at the far right of the hostname before the first slash.'
    });
  } else if (subdomainCount === 2) {
    score += 10;
    threats.push({
      id: 'moderate-subdomains',
      severity: 'low',
      title: 'Multiple Subdomain Levels Detected',
      evidence: hostname,
      description: 'The domain contains multiple subdomains. While sometimes used by content delivery networks or enterprise portals, it warrants attention.',
      recommendation: 'Verify that the root domain corresponds to the entity you expect.'
    });
  } else {
    passed.push({
      id: 'subdomain-structure-clean',
      title: 'Reasonable Subdomain Hierarchy',
      description: 'The domain structure has a normal depth without suspicious subdomain nesting.'
    });
  }

  // -------------------------------------------------------------
  // Check 4: URL Length & Hostname Length
  // -------------------------------------------------------------
  const fullLength = original.length;
  const hostLength = hostname.length;

  if (fullLength > 120) {
    score += 20;
    threats.push({
      id: 'extreme-url-length',
      severity: 'medium',
      title: `Abnormally Long URL (${fullLength} characters)`,
      evidence: `${fullLength} characters`,
      description: 'Very long URLs are often used to conceal malicious parameters, embed encoded tokens, or push malicious host parts out of the visible address bar.',
      recommendation: 'Check query string parameters to ensure sensitive data or unintended redirects are not being passed.'
    });
  } else if (fullLength > 75) {
    score += 10;
    threats.push({
      id: 'long-url',
      severity: 'low',
      title: `Long URL Detected (${fullLength} characters)`,
      evidence: `${fullLength} characters`,
      description: 'The URL is longer than typical website links, which may indicate tracking tokens or layered redirects.',
      recommendation: 'Inspect the path components.'
    });
  } else {
    passed.push({
      id: 'url-length-normal',
      title: 'Normal URL Character Length',
      description: `URL length (${fullLength} chars) is well within standard compact web link conventions.`
    });
  }

  if (hostLength > 30) {
    score += 15;
    threats.push({
      id: 'long-hostname',
      severity: 'medium',
      title: `Extremely Long Hostname (${hostLength} characters)`,
      evidence: hostname,
      description: 'Attackers create lengthy hostnames packed with keywords (e.g. secure-login-account-verification-portal) to create a false sense of security.',
      recommendation: 'Verify the domain name carefully with official sources.'
    });
  }

  // -------------------------------------------------------------
  // Check 5: Suspicious Characters & Obfuscation
  // -------------------------------------------------------------
  // Check 5a: Embedded '@' symbol in URL
  if (rawUrl.includes('@')) {
    score += 35;
    threats.push({
      id: 'at-symbol-in-url',
      severity: 'high',
      title: 'Suspicious "@" Symbol in URL',
      evidence: '@ symbol in string',
      description: 'In URL syntax, text before the "@" symbol represents user authentication credentials, while everything after it is the real destination server. For example: "http://legit-bank.com@malicious-site.com" actually navigates to malicious-site.com.',
      recommendation: 'Never visit URLs containing "@" before the domain name.'
    });
  }

  // Check 5b: Multiple hyphens in hostname
  const hyphenMatches = (hostname.match(/-/g) || []).length;
  if (hostname.includes('--') || hyphenMatches >= 3) {
    score += 20;
    threats.push({
      id: 'excessive-hyphens',
      severity: 'medium',
      title: `Suspicious Hyphen Usage in Domain (${hyphenMatches} hyphens)`,
      evidence: hostname,
      description: 'Multiple hyphens or consecutive dashes ("--") are frequently used in brand impersonation domains (e.g., "paypal-security-update-center.com").',
      recommendation: 'Check whether the legitimate company uses hyphens in its official registered domain.'
    });
  }

  // Check 5c: Underscore in hostname
  if (hostname.includes('_')) {
    score += 15;
    threats.push({
      id: 'underscore-in-hostname',
      severity: 'medium',
      title: 'Illegal Underscore in Hostname',
      evidence: '_ character in hostname',
      description: 'Standard DNS RFC 1035/1123 standards disallow underscores in hostnames. Their presence often indicates non-standard hosting or phishing proxies.',
      recommendation: 'Exercise high caution with non-standard domain characters.'
    });
  }

  // Check 5d: Double slashes in path
  if (pathname.includes('//')) {
    score += 15;
    threats.push({
      id: 'double-slash-path',
      severity: 'medium',
      title: 'Consecutive Slashes in URL Path',
      evidence: '// in pathname',
      description: 'Multiple slashes within the URL path are commonly used to exploit open-redirect flaws or bypass web application firewall (WAF) filters.',
      recommendation: 'Ensure you are not being quietly redirected through an intermediary domain.'
    });
  }

  // Check 5e: Heavy percent-encoding / hex escapes
  const percentMatches = (original.match(/%[0-9a-fA-F]{2}/g) || []).length;
  if (percentMatches >= 3) {
    score += 15;
    threats.push({
      id: 'heavy-percent-encoding',
      severity: 'medium',
      title: `Heavy URL Percent-Encoding (${percentMatches} escaped characters)`,
      evidence: `${percentMatches} encoded sequences (%XX)`,
      description: 'Hex-encoded characters are sometimes used to disguise malicious paths, directory traversal payloads, or script tags from human readers and automated scanners.',
      recommendation: 'Verify the decoded meaning of the URL path before interacting.'
    });
  }

  // Check 5f: Non-standard web ports
  if (port && !['80', '443'].includes(port)) {
    score += 20;
    threats.push({
      id: 'non-standard-port',
      severity: 'medium',
      title: `Non-Standard Port Specified (:${port})`,
      evidence: `:${port}`,
      description: 'Standard web traffic uses port 80 (HTTP) or 443 (HTTPS). Non-standard ports (such as 8080, 8443, 2082, 3000) are commonly run on compromised hosts or ephemeral phishing testbeds.',
      recommendation: 'Legitimate mainstream websites rarely request users to navigate to custom ports.'
    });
  }

  // Check 5g: Punycode / IDN homograph attack indicator
  if (hostname.includes('xn--')) {
    score += 30;
    threats.push({
      id: 'punycode-homograph',
      severity: 'high',
      title: 'Punycode Internationalized Domain (IDN Homograph Risk)',
      evidence: 'xn--',
      description: 'The domain uses Punycode ("xn--"), which allows non-ASCII characters. Phishers use this to swap Latin letters with visually identical Cyrillic or Greek glyphs (e.g., swapping Latin "a" with Cyrillic "а").',
      recommendation: 'Do not trust visual resemblance. The domain resolves to completely different characters.'
    });
  }

  // -------------------------------------------------------------
  // Check 6: Brand Impersonation & Typosquatting
  // -------------------------------------------------------------
  let brandSpoofDetected = null;

  for (const brand of TARGETED_BRANDS) {
    const brandLower = brand.match;
    // Check if brand appears in hostname or path
    const inHost = hostname.includes(brandLower);
    const inPath = pathname.toLowerCase().includes(brandLower);

    if (inHost || inPath) {
      // Is the rootDomain legitimate for this brand?
      const isLegit = brand.legitDomains.some(legit => 
        rootDomain === legit || rootDomain.endsWith('.' + legit)
      );

      if (!isLegit) {
        brandSpoofDetected = {
          brand: brand.name,
          inHost,
          inPath,
          legitDomains: brand.legitDomains
        };
        break;
      }
    }
  }

  if (brandSpoofDetected) {
    score += 40;
    threats.push({
      id: 'brand-impersonation',
      severity: 'high',
      title: `Potential Brand Impersonation (${brandSpoofDetected.brand})`,
      evidence: `Mentions "${brandSpoofDetected.brand}" on unauthorized domain "${rootDomain}"`,
      description: `The URL references high-profile brand "${brandSpoofDetected.brand}", but the registered root domain is "${rootDomain}" (Official domains: ${brandSpoofDetected.legitDomains.join(', ')}). This is a hallmark of brand spoofing credential harvesting.`,
      recommendation: `Only access ${brandSpoofDetected.brand} by manually typing their official address (${brandSpoofDetected.legitDomains[0]}) into your browser.`
    });
  } else {
    passed.push({
      id: 'no-brand-spoof',
      title: 'No Known Brand Spoofing Detected',
      description: 'The URL does not attempt to mimic known banking, technology, or retail brands on unregistered domains.'
    });
  }

  // -------------------------------------------------------------
  // Check 7: Suspicious / High-Abuse TLDs
  // -------------------------------------------------------------
  const tld = hostParts[hostParts.length - 1];
  if (SUSPICIOUS_TLDS.includes(tld)) {
    score += 25;
    threats.push({
      id: 'suspicious-tld',
      severity: 'high',
      title: `High-Risk Top-Level Domain (.${tld})`,
      evidence: `.${tld}`,
      description: `The ".${tld}" extension has a statistically high rate of abuse due to free or extremely low-cost registrations, frequently utilized by disposable phishing campaigns.`,
      recommendation: 'Exercise heightened scrutiny for any website operating on this top-level domain.'
    });
  } else {
    passed.push({
      id: 'standard-tld',
      title: `Established Top-Level Domain (.${tld})`,
      description: `The top-level domain extension (.${tld}) is widely recognized and standard.`
    });
  }

  // -------------------------------------------------------------
  // Check 8: Sensitive Credential & Action Keywords
  // -------------------------------------------------------------
  const matchedKeywords = SENSITIVE_KEYWORDS.filter(kw => {
    // Check if keyword is in subdomain, path, or query
    const hostWithoutRoot = hostname.replace(rootDomain, '');
    return hostWithoutRoot.includes(kw) || pathname.toLowerCase().includes(kw) || search.toLowerCase().includes(kw);
  });

  if (matchedKeywords.length >= 2) {
    score += 20;
    threats.push({
      id: 'sensitive-keywords-cluster',
      severity: 'medium',
      title: `Sensitive Action Keywords Detected (${matchedKeywords.slice(0, 4).join(', ')})`,
      evidence: matchedKeywords.join(', '),
      description: 'The URL contains multiple urgency-inducing terms related to accounts, logins, or verification. Phishing scams rely on urgency to prompt hasty action.',
      recommendation: 'Verify the authenticity of any unsolicited requests asking you to log in or update credentials.'
    });
  } else if (matchedKeywords.length === 1) {
    score += 10;
    threats.push({
      id: 'sensitive-keyword-single',
      severity: 'low',
      title: `Security-Sensitive Keyword Detected ("${matchedKeywords[0]}")`,
      evidence: matchedKeywords[0],
      description: `The URL references account authentication or verification ("${matchedKeywords[0]}").`,
      recommendation: 'Ensure you initiated this authentication step yourself.'
    });
  }

  // -------------------------------------------------------------
  // Check 9: Known URL Shortener Detection
  // -------------------------------------------------------------
  const isShortener = URL_SHORTENERS.includes(hostname) || URL_SHORTENERS.includes(rootDomain);
  if (isShortener) {
    score += 25;
    threats.push({
      id: 'url-shortener',
      severity: 'medium',
      title: `URL Shortener / Masking Service (${hostname})`,
      evidence: hostname,
      description: 'URL shortening services mask the true destination domain, preventing you from evaluating the actual landing website before clicking.',
      recommendation: 'Use a link-unshortener tool or verify the sender before opening shortened links received in messages or emails.'
    });
  }

  // -------------------------------------------------------------
  // Final Score Clamping & Tier Classification
  // -------------------------------------------------------------
  score = Math.min(100, Math.max(0, score));

  let level = 'LOW';
  let levelColor = '#10b981'; // Green
  let verdictSummary = 'Low risk indicators detected. The URL structure aligns with standard conventions.';

  if (score >= 70) {
    level = 'HIGH';
    levelColor = '#ef4444'; // Crimson Red
    verdictSummary = 'Dangerous phishing patterns detected. High probability of malicious intent, credential theft, or fraud.';
  } else if (score >= 40) {
    level = 'MEDIUM';
    levelColor = '#f59e0b'; // Amber Orange
    verdictSummary = 'Suspicious elements identified. Exercise caution and do not enter sensitive credentials.';
  }

  return {
    score,
    level,
    levelColor,
    verdictSummary,
    analyzedAt: new Date().toISOString(),
    url: original,
    components: {
      protocol: protocol.replace(':', ''),
      hostname,
      rootDomain,
      subdomainCount,
      pathname: pathname || '/',
      search: search || '',
      port: port || (protocol === 'https:' ? '443' : '80'),
      isIp: isIpv4 || isIpv6 || isHexOrOctalIp
    },
    threats,
    passed,
    metrics: {
      threatsCount: threats.length,
      passedCount: passed.length,
      highSeverityCount: threats.filter(t => t.severity === 'high').length,
      mediumSeverityCount: threats.filter(t => t.severity === 'medium').length,
      lowSeverityCount: threats.filter(t => t.severity === 'low').length
    }
  };
}
