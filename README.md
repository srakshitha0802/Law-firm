# ⚖️ Sekhar Associates Law Firm Website

A high-performance, responsive web application for **Sekhar Associates Law Firm** (Kurnool, Andhra Pradesh) — featuring 20+ years of courtroom standing, verified advocate dossiers, practice area breakdowns, legal awards & recognitions, interactive case inquiries, and bespoke doodle animations.

---

## 🚀 Key Features

* **Sub-Millisecond Asset Serving & In-Memory Cache:** Node.js static server with automated in-memory buffer caching for ultra-fast response times (<2 ms).
* **Automated Gzip Compression:** Integrated dynamic Gzip encoding reducing transfer payloads by over 75-80%.
* **Smart HTTP Caching & ETag Validation:** Full `ETag` generation providing immediate `304 Not Modified` responses for unchanged assets.
* **Responsive, Mobile-First Design:** Fully adaptable layout with dedicated hamburger navigation, touch interactions, and fluid typography.
* **Interactive Advocate Dossiers:** Modals with detailed credentials, Bar Council enrollment numbers, jurisdictions, and one-tap WhatsApp / Call consultation triggers.
* **Legal Practice Areas:** In-depth coverage of Arbitration, Civil Litigation, Criminal Defense, Constitutional Writs (Art 226/227), Corporate Insolvency, and Property Due Diligence.
* **Optimized Doodle Animations:** Lightweight SVG hand-drawn underlines, floating orbit parallax with geometry caching, rotating seal badges, and subtle golden ink cursor trails.
* **Bar Council of India Disclaimer Compliance:** Interactive disclaimer modal with session persistence.

---

## 📂 Project Structure

```text
├── index.html              # Main homepage with hero, practice areas, partner quotes & stats
├── about-us.html           # Chambers history, vision, executive office overview
├── our-people.html         # Senior advocate profiles, credentials & Bar Council details
├── our-expertise.html      # Practice area breakdowns, statutes & legal domains
├── our-awards.html         # National & international legal awards gallery
├── insights.html           # Legal briefs, case analyses & statutory updates
├── contact-us.html         # Chambers address, interactive inquiry form & map
├── privacy-policy.html     # Privacy statement & legal disclaimers
├── server.js               # High-performance Node.js HTTP server with Gzip & ETag cache
├── public/
│   ├── css/                # Bespoke stylesheets & animations
│   ├── js/                 # Main scripts, icon renderers & doodle animation engine
│   ├── assets/             # Vector icons, award plaques & high-res backgrounds
│   └── vendor/             # AOS animation dependencies
├── package.json            # Project manifest & dev scripts
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0 or higher recommended)

### Installation & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/srakshitha0802/Law-firm.git
   cd Law-firm
   ```

2. Start the local high-performance dev server:
   ```bash
   npm run dev
   ```

3. Open your browser:
   ```
   http://localhost:3000
   ```

---

## 🏛️ Chambers Contact

* **Location:** Near District Court Complex, Collectorate Road, Kurnool, Andhra Pradesh, 518001
* **Direct Helpline:** +91 8500742555 / +91 9441401781
* **Email:** contact@sekharassociates.com
* **Jurisdiction:** Andhra Pradesh & Telangana High Courts, District & Sessions Courts, Special Appellate Tribunals
