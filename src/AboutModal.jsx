import React from 'react';
import { 
  X, ShieldAlert, ShieldCheck, Lock, AlertTriangle, 
  HelpCircle, EyeOff, CheckCircle2, ExternalLink, Cpu 
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Lock className="text-cyan modal-icon" />
            <h3 className="modal-title">About CyberShield & Security Architecture</h3>
          </div>
          <button 
            type="button" 
            className="btn-icon" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Important Security Disclaimer */}
          <div className="disclaimer-callout">
            <div className="callout-header">
              <AlertTriangle className="text-amber" size={18} />
              <h4>Safety Disclaimer & Heuristic Limitations</h4>
            </div>
            <p>
              <strong>CyberShield does not and cannot guarantee 100% phishing detection.</strong> Cybercrime techniques evolve continuously. A low risk score indicates the absence of known static heuristic warning patterns; it does <em>not</em> guarantee that a domain is completely benign. Always verify sender identity and never share master credentials or two-factor codes on unfamiliar sites.
            </p>
          </div>

          {/* Privacy & Zero-Fetch Architecture */}
          <div className="modal-section">
            <h4 className="section-subtitle-cyan">
              <EyeOff size={16} className="inline-icon text-cyan" /> 100% Offline Static Sandbox (Zero-Fetch)
            </h4>
            <p>
              Traditional URL scanners often fetch pages or perform DNS lookups, which alerts attackers that their decoy link is active (burns tracking tokens) or potentially triggers malicious scripts.
            </p>
            <p>
              <strong>CyberShield never initiates outbound HTTP requests, WebSockets, or DNS queries to submitted links.</strong> All lexical deconstructions, regex pattern searches, and heuristic calculations execute entirely inside your local browser runtime.
            </p>
          </div>

          {/* How the Heuristic Engine Works */}
          <div className="modal-section">
            <h4 className="section-subtitle-cyan">
              <Cpu size={16} className="inline-icon text-cyan" /> Evaluated Threat Vectors
            </h4>
            <ul className="modal-check-list">
              <li>
                <strong>Raw IP-Address Hosts:</strong> Using raw IPv4, IPv6, or hex strings instead of standard domains to evade reputational blacklists.
              </li>
              <li>
                <strong>Subdomain Stacking:</strong> Chaining 3+ fake subdomains (e.g. <code>paypal.com.verify.attacker.xyz</code>) to fool mobile browsers.
              </li>
              <li>
                <strong>Brand Impersonation & Typosquatting:</strong> Unauthorized use of high-value brands (Apple, Microsoft, Google, PayPal, Banking) in subdomains or paths.
              </li>
              <li>
                <strong>Suspicious Delimiters:</strong> Abusing the <code>@</code> credential trick to spoof browser destination addresses.
              </li>
              <li>
                <strong>High-Abuse TLDs:</strong> Domains registered on disposable top-level extensions (e.g. <code>.xyz</code>, <code>.top</code>, <code>.tk</code>, <code>.buzz</code>).
              </li>
              <li>
                <strong>URL Shorteners:</strong> Obfuscating actual landing pages behind redirection services.
              </li>
              <li>
                <strong>Homograph / Punycode:</strong> Non-ASCII characters (<code>xn--</code>) mimicking Latin alphabets.
              </li>
            </ul>
          </div>

          {/* Essential Phishing Defense Rules */}
          <div className="modal-section">
            <h4 className="section-subtitle-cyan">
              <ShieldCheck size={16} className="inline-icon text-cyan" /> 4 Golden Rules for URL Safety
            </h4>
            <div className="golden-rules-grid">
              <div className="rule-card">
                <span className="rule-num">1</span>
                <strong>Check the Root Domain</strong>
                <p>Read from right to left before the first forward slash. That is the actual server owner.</p>
              </div>
              <div className="rule-card">
                <span className="rule-num">2</span>
                <strong>HTTPS is Not Proof of Safety</strong>
                <p>Phishers obtain free SSL certificates. HTTPS encrypts data in-transit, but does not mean the recipient is trustworthy.</p>
              </div>
              <div className="rule-card">
                <span className="rule-num">3</span>
                <strong>Type Addresses Manually</strong>
                <p>Never click urgent "Account Suspended" links in emails or texts. Type the official URL manually.</p>
              </div>
              <div className="rule-card">
                <span className="rule-num">4</span>
                <strong>Enable Hardware MFA</strong>
                <p>FIDO2 / WebAuthn passkeys protect your accounts even if you mistakenly input a password on a phishing page.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Acknowledge & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
