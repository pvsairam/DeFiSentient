import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get total count
    const { count } = await supabase
      .from('pools')
      .select('*', { count: 'exact', head: true });

    // Get average APY
    const { data: apyData } = await supabase
      .from('pools')
      .select('apy');

    const avgAPY = apyData && apyData.length > 0
      ? apyData.reduce((sum, pool) => sum + parseFloat(pool.apy || '0'), 0) / apyData.length
      : 0;

    // Get total TVL
    const { data: tvlData } = await supabase
      .from('pools')
      .select('tvl_usd');

    const totalTVL = tvlData && tvlData.length > 0
      ? tvlData.reduce((sum, pool) => sum + parseFloat(pool.tvl_usd || '0'), 0)
      : 0;

    // Get unique chains
    const { data: chainData } = await supabase
      .from('pools')
      .select('chain');

    const uniqueChains = chainData 
      ? new Set(chainData.map(p => p.chain)).size 
      : 0;

    res.status(200).json({
      totalPools: count || 0,
      averageAPY: parseFloat(avgAPY.toFixed(2)),
      totalTVL: totalTVL,
      uniqueChains: uniqueChains,
    });
  } catch (error) {
    console.error('Error in /api/pools/stats:', error);
    res.status(500).json({ error: error.message });
  }
}
