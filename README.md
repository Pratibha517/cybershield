# CyberShield — Phishing URL Analyzer 🛡️⚡

A modern, professional cybersecurity web application built with **React**, **Vite**, **JavaScript**, and custom **CSS**. 

**CyberShield** inspects submitted URLs using in-depth client-side heuristic pattern analysis to detect potential phishing tactics, credential harvesting schemes, brand impersonation, and obfuscation tricks—**without ever loading, fetching, or visiting the submitted link**.

![CyberShield Banner](https://img.shields.io/badge/Security-Zero--Fetch%20Sandbox-00f2fe?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## ✨ Key Features

1. **URL Input & Instant Analysis**:
   - Clean, keyboard-accessible interface with `Enter` key execution.
   - Quick **Paste from Clipboard** and **Clear** buttons.
   - Smart URL normalization (automatically handles bare domains and malformed syntax).

2. **100% Offline Static Heuristic Engine (Zero-Fetch Guarantee)**:
   - Evaluates links entirely in-browser using pure regular expressions, lexical parsers, and heuristic rule engines.
   - **Never issues HTTP, WebSocket, or DNS requests** to analyzed URLs, preventing attackers from learning you inspected their bait link or tracking your IP.

3. **0 – 100 Heuristic Risk Score & Radial Gauge**:
   - Color-coded dynamic SVG speedometer gauge:
     - 🟢 **LOW RISK (0 – 39)**: Clean domain structure and benign characteristics.
     - 🟡 **MEDIUM RISK (40 – 69)**: Suspicious signals, masked destinations, or atypical schemes.
     - 🔴 **HIGH RISK (70 – 100)**: Critical phishing vectors, brand spoofing, or credential traps.

4. **Multi-Vector Threat Detection**:
   - **HTTPS & Encryption**: Detects unencrypted `http://` and dangerous protocols (`data:`, `file:`, `javascript:`).
   - **Raw IP Address Hosts**: Flags raw IPv4 (e.g. `192.168.1.1`), IPv6, and hex/octal representations used to bypass domain reputation filters.
   - **Excessive Subdomain Stacking**: Identifies deep subdomain nesting (>3 levels) designed to trick mobile address bars.
   - **Abnormal URL & Host Length**: Detects unusually long URLs (>75 / >120 chars) and over-length hostnames.
   - **Suspicious Delimiters & Obfuscations**: Detects deceptive `@` basic auth credentials, consecutive hyphens (`--`), illegal underscores, non-standard web ports (`:8080`, `:8443`), multiple path slashes (`//`), heavy percent-encoding (`%XX`), and Punycode homoglyphs (`xn--`).
   - **Brand Impersonation & Typosquatting**: Warns if high-value brands (PayPal, Apple, Microsoft, Google, Amazon, Netflix, Chase, etc.) appear in subdomains or paths when registered under third-party domains.
   - **High-Abuse TLDs**: Flags domains registered on free or abuse-prone extensions (`.xyz`, `.top`, `.tk`, `.buzz`, `.zip`, `.mov`).
   - **URL Shortener Detection**: Recognizes links from `bit.ly`, `tinyurl.com`, `t.co`, etc., which conceal their real landing page.

5. **Detailed Explanations & Positive Security Checks**:
   - Each detected threat displays the observed pattern, an explanation of why scammers use it, and actionable safety precautions.
   - Also displays passing checks (e.g., valid HTTPS, clean subdomain hierarchy) for complete transparency.

6. **Interactive Scan History & Real-Time Dashboard Metrics**:
   - Stores scans locally in `localStorage`.
   - Live dashboard metrics automatically calculated from your actual history:
     - Total URLs analyzed
     - High Risk Threats flagged
     - Medium Risk warnings
     - Clean / Low Risk count
     - Average heuristic score
     - Threat distribution spectrum bar
   - Audit trail table with search, tier filtering, one-click re-inspection, single deletion, and a "Clear All" confirmation flow.

7. **Curated Test Vectors**:
   - One-click buttons to load safe benchmarks (GitHub, MDN) or simulated attack links (IP-based banking phishing, PayPal spoofing on `.xyz`, `@` credential trick, and subdomain nesting).

8. **Safety & Education Center**:
   - In-app modal detailing how phishing works, 4 golden rules for link safety, and clear boundaries of static analysis.

---

## 🚀 Beginner-Friendly Setup & Local Run Guide

Follow these simple steps to run CyberShield on your computer.

### Prerequisites
Make sure you have **Node.js** (v18 or higher) installed on your system.
Verify in your terminal:
```bash
node -v
npm -v
```

---

### Step 1: Clone or Navigate to the Project Directory
```bash
cd CyberShield
```

### Step 2: Install Dependencies
Install the required packages (`react`, `react-dom`, `vite`, `lucide-react`):
```bash
npm install
```
*(On Windows PowerShell, if you encounter script execution restrictions, you can run `npm.cmd install`)*

### Step 3: Start the Development Server
Launch Vite's fast local development server:
```bash
npm run dev
```
*(or `npm.cmd run dev`)*

The terminal will display the local URL:
```
  VITE v6.x.x  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open **`http://localhost:3000`** in your favorite web browser (Chrome, Firefox, Edge, Safari, Brave).

---

### Step 4: Build for Production (Optional)
To generate an optimized, minified production build:
```bash
npm run build
```
The compiled static assets will be saved to the `dist/` directory, ready for deployment on GitHub Pages, Vercel, Netlify, or any static web host.

---

## 📁 Project Structure

```
CyberShield/
├── index.html                   # HTML entry point with cyber typography
├── package.json                 # Project dependencies and npm scripts
├── vite.config.js               # Vite configuration (port 3000, React plugin)
├── .gitignore                   # Ignored files (node_modules, dist, logs)
├── README.md                    # Comprehensive documentation and run guide
├── public/
│   └── favicon.svg              # Neon cyber shield SVG icon
└── src/
    ├── main.jsx                 # React root renderer
    ├── App.jsx                  # Main application dashboard controller & layout
    ├── index.css                # Dark Navy & Neon Cyan Cyber Design System
    ├── components/
    │   ├── Header.jsx           # Top navigation with zero-fetch badge
    │   ├── StatsOverview.jsx    # Real-time metrics computed from history
    │   ├── UrlAnalyzer.jsx      # Input bar, validation, and paste/clear tools
    │   ├── RiskGauge.jsx        # Animated radial SVG risk score meter (0-100)
    │   ├── AnalysisResults.jsx  # Detailed threat breakdown, passes, & URL anatomy
    │   ├── ExampleUrls.jsx      # Curated safe & phishing test vectors
    │   ├── ScanHistory.jsx      # localStorage audit log with search & filters
    │   └── AboutModal.jsx       # Privacy guarantee, educational tips, disclaimer
    └── utils/
        ├── urlAnalyzer.js       # Core heuristic analysis rules & score calculator
        ├── storage.js           # localStorage persistence & stats calculation
        └── sampleUrls.js        # Benchmark and attack scenario URLs
```

---

## 🔒 Security & Privacy Notice

> **IMPORTANT DISCLAIMER**
> 
> CyberShield is an educational, heuristic triage utility designed to evaluate lexical and structural URL patterns. **It does not and cannot guarantee 100% phishing detection.**
> 
> - A **Low Risk (0–39)** score means no common static phishing indicators were detected, but does *not* prove a website is 100% safe. Attackers frequently register new domains or compromise legitimate sites.
> - A **High Risk (70–100)** score indicates multiple patterns strongly correlated with fraudulent or malicious campaigns.
> - Never enter passwords, financial data, or sensitive personal credentials on unfamiliar websites. Always verify the domain name manually and use multi-factor authentication (MFA).

---

## 🛠️ Built With

* **[React 18](https://react.dev/)** — Declarative component architecture
* **[Vite](https://vitejs.dev/)** — Next-generation frontend build tooling
* **[Lucide React](https://lucide.dev/)** — Clean cybersecurity iconography
* **Vanilla CSS** — Custom responsive dark-navy theme, glassmorphism, and neon cyber accents

---

## 📄 License
This project is open-source and free to use for personal learning, educational security labs, and defensive research.
