import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if tables exist and log helpful messages
export async function initializeDatabase() {
  try {
    console.log('🔍 Checking database tables...');
    
    // Try to query the pools table
    const { data, error } = await supabase
      .from('pools')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Database tables not found!');
      console.error('Please run the following SQL in your Supabase SQL Editor:');
      console.error('\n' + SQL_SETUP + '\n');
      console.error('Visit: ' + supabaseUrl + '/project/_/sql');
    } else {
      console.log('✅ Database tables are ready');
    }
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

// SQL statements to create tables
export const SQL_SETUP = `
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
`;
