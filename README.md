# OmniSales AI - Universal Sales & Marketing Automation System

OmniSales AI is a fully configurable, multi-agent autonomous system designed to find, qualify, and engage leads across ANY industry, geography, and profession worldwide including comprehensive coverage of Pakistan and all 195+ countries.

## Features

- **Autonomous Agents**:
  - **Discovery**: Multi-source lead finding (DuckDuckGo, Google, Business Directories).
  - **Research**: Deeper data enrichment and social media profiling.
  - **Qualifier**: AI-based scoring and fit analysis using Gemini.
  - **Outreach**: Multi-channel personalized engagement (Email, WhatsApp).
  - **Closer**: Conversation management and discovery call booking.
- **Command Center**: Chat with the system Supervisor (Gemini).
- **Dashboard**: Live metrics and activity logs.

## Setup

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

3. **Run the System**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Go to **Agent Monitor** to start agents manually or enable "Autonomous Mode".
2. View **Lead Pipeline** to see leads moving through stages.
3. Use **Command Center** to ask questions about performance.

## Architecture

- **Frontend**: Next.js App Router (React Server Components).
- **Styling**: Pure CSS (Glassmorphism theme) with CSS Modules.
- **Database**: Local JSON file storage (`data/leads.json`).
- **AI**: Google Gemini 1.5 Pro via Google AI SDK.
