# Database Setup Instructions

## Quick Setup (3 minutes)

Your DeFi Research Agent needs database tables to store pool data. Follow these simple steps:

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar (or go to: `<your-project-url>/project/_/sql`)

### Step 2: Run the Setup SQL

1. Click "New Query"
2. Copy the entire content from `setup-database.sql` file (or paste the SQL below)
3. Click "Run" or press Ctrl/Cmd + Enter

```sql
-- Create pools table
CREATE TABLE IF NOT EXISTS pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chain VARCHAR(50) NOT NULL,
  protocol VARCHAR(100) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  tvl_usd DECIMAL(20,2),
  apy DECIMAL(10,4),
  apy_base DECIMAL(10,4),
  apy_reward DECIMAL(10,4),
  risk_score INTEGER,
  il_risk VARCHAR(20),
  pool_id VARCHAR(255) UNIQUE,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pools_chain ON pools(chain);
CREATE INDEX IF NOT EXISTS idx_pools_protocol ON pools(protocol);
CREATE INDEX IF NOT EXISTS idx_pools_apy ON pools(apy DESC);
CREATE INDEX IF NOT EXISTS idx_pools_risk_score ON pools(risk_score DESC);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sentient_user_id VARCHAR(255),
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create agent_responses table
CREATE TABLE IF NOT EXISTS agent_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID,
  query TEXT,
  response JSONB,
  intermediate_steps JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Verify Tables

After running the SQL, you should see "Success. No rows returned" message. Your tables are now created!

### Step 4: Restart the Application

The application will automatically:
- Fetch live data from DeFiLlama API (50+ protocols, 15+ chains)
- Populate the database with the top 500 pools by TVL
- Refresh data every 6 hours
- Display real-time yield opportunities on your dashboard

## Troubleshooting

**Issue**: "relation 'public.pools' does not exist"
- **Solution**: Make sure you ran the SQL in the SQL Editor, not in the Supabase client

**Issue**: "permission denied"
- **Solution**: Make sure you're using the correct Supabase project and have admin access

**Issue**: No data showing up
- **Solution**: Wait 30 seconds for the initial data fetch from DeFiLlama, then refresh your browser

## What Happens Next

Once the tables are created, the application will:

1. **Initial Data Load**: Fetch ~20,000 pools from DeFiLlama
2. **Smart Filtering**: Select top 500 pools by TVL with proper risk scores
3. **Database Storage**: Store pools with indexing for fast queries
4. **Auto-Refresh**: Update data every 6 hours automatically
5. **Ready to Use**: Dashboard will display real-time yield opportunities

## Database Schema

### pools table
Stores DeFi yield opportunities across multiple chains
- 500+ pools tracked
- Updated every 6 hours
- Indexed for fast filtering and sorting

### user_sessions table
Tracks Sentient user preferences and session data
- Stores user preferences as JSONB
- Links to Sentient user IDs

### agent_responses table
Logs AI agent queries and responses
- Stores conversation history
- Tracks intermediate reasoning steps
- Used for analytics and improvements
