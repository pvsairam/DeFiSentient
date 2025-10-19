# DeFi Sentinel

**Multi-Chain DeFi Analytics Platform powered by Sentient**

DeFi Sentinel aggregates yield opportunities across 50+ protocols and 15+ chains, providing AI-powered research capabilities, real-time data analysis, and comprehensive risk assessment for DeFi investments.

🔗 **Live Demo**: [defi-sentient.vercel.app](https://defi-sentient.vercel.app)

---

## Features

- 🤖 **AI-Powered Research** - Natural language queries powered by multiple AI providers (OpenAI, Gemini Pro, Claude, DeepSeek)
- 📊 **Real-Time Data** - Aggregates data from 500+ pools across 28+ blockchains
- 🎯 **Risk Analysis** - Smart risk scoring system (0-100) for every pool
- ⭐ **Watchlist** - Track your favorite DeFi pools
- 🔐 **User API Keys** - Bring your own API keys, no rate limits
- 🎨 **Modern UI** - Glassmorphism design with subtle animations
- ☁️ **Serverless** - Deployed on Vercel with Supabase database

---

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Framer Motion
- React Query (TanStack Query)

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- DeFiLlama API integration
- OpenAI, Gemini, Claude, DeepSeek SDKs

**Deployment:**
- Vercel (Frontend + Serverless Functions)
- Supabase (Database)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- AI provider API keys (OpenAI, Gemini, etc.)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pvsairam/DeFiSentient.git
cd DeFiSentient
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_key_here
SESSION_SECRET=your_random_secret_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**

Run the SQL setup script in your Supabase SQL Editor:
```bash
cat setup-database.sql
```

5. **Start development server**
```bash
npm run dev
```

The app will be running at `http://localhost:5000`

---

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables (same as `.env`)
- Deploy!

3. **Environment Variables**

Make sure to add these in Vercel:
- `OPENAI_API_KEY`
- `SESSION_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---

## Usage

### AI Search

Ask questions in natural language:
- "Find me stable pools with 10%+ APY"
- "Show low-risk pools on Ethereum"
- "What are the best yield opportunities on Arbitrum?"

### Watchlist

1. Browse pools on the Dashboard
2. Click on a pool card
3. Click "Add to Watchlist"
4. View your watchlist from the navigation

### Settings

Configure your preferred AI provider and API keys:
1. Go to Settings page
2. Select AI provider (OpenAI, Gemini, Claude, DeepSeek)
3. Enter your API key
4. Save settings

---

## Project Structure

```
DeFiSentient/
├── api/                    # Vercel serverless functions
│   ├── pools.js           # Pool data endpoint
│   ├── stats.js           # Statistics endpoint
│   └── settings/          # Settings endpoints
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
│   └── index.html
├── server/                 # Backend Express app
│   ├── routes.ts          # API routes
│   ├── services/          # Business logic
│   └── supabase.ts        # Database client
├── shared/                 # Shared types
│   └── schema.ts          # Database schema
└── vercel.json            # Vercel configuration
```

---

## API Endpoints

### GET `/api/pools`
Fetch pools with filtering and sorting.

**Query Parameters:**
- `chain` - Filter by blockchain
- `protocol` - Filter by protocol name
- `minAPY` - Minimum APY threshold
- `minRiskScore` - Minimum risk score
- `sortBy` - Sort field (default: `apy`)
- `order` - Sort order (`asc` or `desc`)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset

### GET `/api/pools/stats`
Get aggregate statistics.

**Response:**
```json
{
  "totalPools": 500,
  "averageAPY": 5.20,
  "totalTVL": 169440000000,
  "uniqueChains": 28
}
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - feel free to use this project for learning or building your own DeFi tools.

---

## Credits

**Built with ♥ by [@xtestnet](https://x.com/xtestnet)**

**Powered by [Sentient](https://x.com/SentientAGI)**

---

## Support

For issues or questions:
- Open an issue on GitHub
- Contact [@xtestnet](https://x.com/xtestnet) on X/Twitter

---

## Acknowledgments

- [DeFiLlama](https://defillama.com) for pool data
- [Supabase](https://supabase.com) for database hosting
- [Vercel](https://vercel.com) for deployment
- [Sentient](https://sentient.xyz) for AI infrastructure
