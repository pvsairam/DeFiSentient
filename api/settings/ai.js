import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const user_id = req.query.user_id || req.body?.user_id || "default_user";

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching AI settings:', error);
        return res.status(500).json({ error: 'Failed to fetch AI settings' });
      }

      return res.status(200).json(data || null);
    }

    if (req.method === 'POST') {
      const { provider, api_keys } = req.body;

      const { data, error } = await supabase
        .from('ai_settings')
        .upsert(
          {
            user_id,
            provider,
            api_keys,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        )
        .select()
        .single();

      if (error) {
        console.error('Error saving AI settings:', error);
        return res.status(500).json({ error: 'Failed to save AI settings' });
      }

      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in /api/settings/ai:', error);
    res.status(500).json({ error: error.message });
  }
}
