# OmniSales AI - Autonomous Sales & Marketing Intelligence System

OmniSales AI is a cutting-edge, multi-agent autonomous system designed to **find, qualify, and engage leads** across any industry, geography, or profession. It features a specialized **Healthcare & RCM Intelligence Layer**, making it the ultimate tool for medical billing companies, private practices, and healthcare service providers.

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Key Features

### 🤖 Autonomous Multi-Agent Architecture
The system is powered by five specialized AI agents working in perfect harmony:
1.  **Discovery Agent**: 
    - Scours the web using **Google (Serper)**, **Brave**, and **native scrapers**.
    - Identifies high-value leads based on complex ICPs (Ideal Customer Profiles).
    - Features **Smart Filtering** to automatically disqualify hospitals, government sites, and non-target entities.
2.  **Research Agent**: 
    - Enriches leads with **social media profiles** (LinkedIn, Facebook, Instagram).
    - Extracts **tech stacks** (EHR systems, billing software) and **insurance acceptance** data.
    - Identifies decision-makers (DNP, MD, Owner) with high precision.
3.  **Qualifier Agent**: 
    - Uses **Gemini 2.0 AI** to score leads on a 1-100 scale.
    - Evaluates **Billing Complexity**, **Practice Size**, and **Pain Points**.
    - Categorizes leads into **HOT**, **WARM**, or **COLD**.
4.  **Outreach Agent**: 
    - Sends **hyper-personalized emails** using extracted metadata.
    - auto-populates tokens like `{{practiceName}}`, `{{specialtyFocus}}`, and `{{ehrSystem}}`.
    - Features **smart rotation** of email accounts and connection pooling.
5.  **Closer Agent**: 
    - Manages replies and conversation flow (Coming Soon).

### 🏥 Specialized Healthcare RCM Intelligence
OmniSales AI includes a dedicated layer for the **Medical Billing & Revenue Cycle Management** industry:
-   **Credential Recognition**: Automatically detects `DNP`, `FNP-C`, `PMHNP-BC`, and `CRNA` credentials.
-   **EHR Detection**: Identifies if a practice uses **Epic**, **athenahealth**, **eClinicalWorks**, or **Kareo**.
-   **Insurance Profiling**: Scans for **Medicare**, **Medicaid**, and commercial payer acceptance.
-   **Practice Sizing**: Targets the "sweet spot" of independent private practices (1-15 providers).

### 🌍 Global Reach
-   **Universal Scraping**: Capable of finding leads in **195+ countries**, including detailed coverage of the **US, UK, Canada, and Pakistan**.
-   **Multi-Language Support**: Enforces English-language business discovery or adapts to local markets.

### 🛡️ Enterprise-Grade Reliability
-   **Anti-Blocking**: Uses realistic headers, delays, and user-agent rotation.
-   **Data Validation**: Strict email verification to block code artifacts (e.g., `intl-segmenter`, `webpack`) and fake addresses.
-   **SMTP Health Check**: Automatically verifies email credentials before sending to prevent bounces.

---

## 🛠️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Uzair1718/omnisales.git
    cd omnisales
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```bash
    GEMINI_API_KEY=your_gemini_key
    SERPER_API_KEY=your_serper_key
    
    # SMTP Settings (Gmail App Password Recommended)
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email@gmail.com
    SMTP_PASS=your_app_password_no_spaces
    ```

4.  **Run the System**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to access the Command Center.

---

## 🖥️ Usage Guide

1.  **Configure Workspace**:
    - Edit `data/workspaces.json` to define your **Target Industries**, **Locations**, and **Email Templates**.
    - The system comes pre-configured with an "All Care MBS" workspace for healthcare lead generation.

2.  **Start the Engine**:
    - Go to the **Command Center**.
    - Click **"Start Autonomous Engine"**.
    - Watch as the agents discover, qualify, and engage leads in real-time via the terminal logs.

3.  **Monitor Pipeline**:
    - Use the **Pipeline View** to see leads moving from `NEW` -> `QUALIFIED` -> `OUTREACH`.

---

## 🏗️ Tech Stack

-   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
-   **Backend**: Next.js API Routes, Node.js
-   **AI Core**: Google Gemini 1.5 Pro / 2.0 Flash
-   **Scraping**: Cheerio, Puppeteer-core, Serper.dev API
-   **Database**: JSON-based local storage (LowDB style)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the OmniSales Team**
