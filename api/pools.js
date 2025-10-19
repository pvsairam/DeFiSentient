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
    const { 
      chain, 
      protocol, 
      minRiskScore, 
      minAPY,
      sortBy = 'apy',
      order = 'desc',
      limit = 50,
      offset = 0 
    } = req.query;

    let query = supabase.from('pools').select('*');

    // Apply filters
    if (chain) {
      query = query.ilike('chain', chain);
    }
    if (protocol) {
      query = query.ilike('protocol', `%${protocol}%`);
    }
    if (minRiskScore) {
      query = query.gte('risk_score', parseInt(minRiskScore));
    }
    if (minAPY) {
      query = query.gte('apy', parseFloat(minAPY));
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: order === 'asc' });

    // Apply pagination
    query = query.range(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit) - 1
    );

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pools:', error);
      return res.status(500).json({ error: 'Failed to fetch pools' });
    }

    res.status(200).json({
      pools: data || [],
      total: data?.length || 0,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('Error in /api/pools:', error);
    res.status(500).json({ error: error.message });
  }
}
