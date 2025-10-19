import axios from 'axios';

const DEFILLAMA_BASE_URL = 'https://yields.llama.fi';

export interface DeFiLlamaPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy?: number;
  apyBase?: number;
  apyReward?: number;
  pool: string;
  ilRisk?: string;
  exposure?: string;
  predictions?: {
    predictedClass?: string;
    binnedConfidence?: number;
  };
}

export interface Pool {
  id?: string;
  chain: string;
  protocol: string;
  symbol: string;
  tvl_usd: number;
  apy: number;
  apy_base: number;
  apy_reward: number;
  risk_score: number;
  il_risk: string;
  pool_id: string;
  last_updated?: Date;
}

export async function fetchEnrichedPools(): Promise<Pool[]> {
  try {
    console.log('🔍 Fetching enriched pools from DeFiLlama...');
    const response = await axios.get(`${DEFILLAMA_BASE_URL}/pools`);
    const pools: DeFiLlamaPool[] = response.data.data || [];

    console.log(`📊 Received ${pools.length} pools from DeFiLlama`);

    // Transform and filter pools
    const transformedPools: Pool[] = pools
      .filter(pool => {
        // Filter out pools with missing critical data
        return pool.tvlUsd > 0 && 
               pool.apy !== undefined && 
               pool.apy > 0 &&
               pool.symbol &&
               pool.chain &&
               pool.project;
      })
      .map(pool => {
        const riskScore = calculateRiskScore(pool);
        
        return {
          chain: pool.chain,
          protocol: pool.project,
          symbol: pool.symbol,
          tvl_usd: pool.tvlUsd,
          apy: pool.apy || 0,
          apy_base: pool.apyBase || 0,
          apy_reward: pool.apyReward || 0,
          risk_score: riskScore,
          il_risk: determineILRisk(pool),
          pool_id: pool.pool,
        };
      })
      .sort((a, b) => b.tvl_usd - a.tvl_usd) // Sort by TVL descending
      .slice(0, 500); // Limit to top 500 pools by TVL

    console.log(`✅ Transformed ${transformedPools.length} pools`);
    return transformedPools;
  } catch (error) {
    console.error('❌ Error fetching pools from DeFiLlama:', error);
    throw new Error('Failed to fetch pools from DeFiLlama');
  }
}

function calculateRiskScore(pool: DeFiLlamaPool): number {
  let score = 50; // Base score

  // TVL stability (higher TVL = lower risk)
  if (pool.tvlUsd > 100_000_000) score += 15;
  else if (pool.tvlUsd > 10_000_000) score += 10;
  else if (pool.tvlUsd > 1_000_000) score += 5;

  // APY reasonableness (extremely high APY = higher risk)
  const apy = pool.apy || 0;
  if (apy < 20) score += 15;
  else if (apy < 50) score += 10;
  else if (apy < 100) score += 5;
  else score -= 10; // Very high APY is risky

  // IL risk assessment
  const ilRisk = pool.ilRisk?.toLowerCase() || '';
  if (ilRisk === 'no' || ilRisk === 'none') score += 15;
  else if (ilRisk === 'low') score += 10;
  else if (ilRisk === 'medium') score += 5;

  // Exposure type (stablecoins are safer)
  const exposure = pool.exposure?.toLowerCase() || '';
  if (exposure.includes('stable')) score += 10;
  else if (exposure.includes('single')) score += 5;

  // Predictions from DeFiLlama
  if (pool.predictions?.predictedClass === 'stable') score += 5;

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

function determineILRisk(pool: DeFiLlamaPool): string {
  const ilRisk = pool.ilRisk?.toLowerCase() || '';
  const exposure = pool.exposure?.toLowerCase() || '';

  if (ilRisk === 'no' || ilRisk === 'none' || exposure.includes('stable')) {
    return 'None';
  } else if (ilRisk === 'low') {
    return 'Low';
  } else if (ilRisk === 'medium') {
    return 'Medium';
  } else if (ilRisk === 'high') {
    return 'High';
  }

  // Default based on exposure
  if (exposure.includes('single')) return 'None';
  return 'Low';
}

export async function getPoolsByChain(chain: string, pools: Pool[]): Promise<Pool[]> {
  return pools.filter(pool => pool.chain.toLowerCase() === chain.toLowerCase());
}

export async function getPoolsByProtocol(protocol: string, pools: Pool[]): Promise<Pool[]> {
  return pools.filter(pool => pool.protocol.toLowerCase().includes(protocol.toLowerCase()));
}

export async function filterPoolsByRisk(minRiskScore: number, pools: Pool[]): Promise<Pool[]> {
  return pools.filter(pool => pool.risk_score >= minRiskScore);
}

export async function filterPoolsByAPY(minAPY: number, pools: Pool[]): Promise<Pool[]> {
  return pools.filter(pool => pool.apy >= minAPY);
}
