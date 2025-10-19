-- DeFi Research Agent Database Setup
-- Run this SQL in your Supabase SQL Editor
-- URL: [Your Supabase URL]/project/_/sql

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

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('pools', 'user_sessions', 'agent_responses');
