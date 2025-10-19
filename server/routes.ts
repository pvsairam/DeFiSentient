import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { supabase, initializeDatabase } from "./supabase";
import { startScheduler } from "./services/scheduler";
import OpenAI from "openai";
import { aiProviderService, type AIProvider } from "./services/ai-providers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize database and scheduler on startup
initializeDatabase().then(() => {
  startScheduler();
});

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/pools - Fetch pools with filtering and sorting
  app.get("/api/pools", async (req: Request, res: Response) => {
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

      let query = supabase
        .from('pools')
        .select('*');

      // Apply filters
      if (chain) {
        query = query.ilike('chain', chain as string);
      }

      if (protocol) {
        query = query.ilike('protocol', `%${protocol}%`);
      }

      if (minRiskScore) {
        query = query.gte('risk_score', parseInt(minRiskScore as string));
      }

      if (minAPY) {
        query = query.gte('apy', parseFloat(minAPY as string));
      }

      // Apply sorting
      const sortColumn = sortBy as string;
      const sortOrder = order === 'asc';
      query = query.order(sortColumn, { ascending: sortOrder });

      // Apply pagination
      query = query.range(
        parseInt(offset as string), 
        parseInt(offset as string) + parseInt(limit as string) - 1
      );

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching pools:', error);
        return res.status(500).json({ error: 'Failed to fetch pools' });
      }

      res.json({
        pools: data || [],
        total: count || 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
    } catch (error) {
      console.error('Error in /api/pools:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/pools/stats - Get aggregate statistics
  app.get("/api/pools/stats", async (req: Request, res: Response) => {
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

      res.json({
        totalPools: count || 0,
        averageAPY: parseFloat(avgAPY.toFixed(2)),
        totalTVL: totalTVL,
        uniqueChains: uniqueChains,
      });
    } catch (error) {
      console.error('Error in /api/pools/stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/agent - Sentient Agent API endpoint
  app.post("/api/agent", async (req: Request, res: Response) => {
    try {
      const { messages, stream = false, user_id = "default_user" } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const userMessage = messages[messages.length - 1]?.content || '';

      // Fetch user's AI settings
      const { data: userSettings } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user_id)
        .single();

      // Determine which provider and API key to use
      let provider: AIProvider = 'openai';
      let apiKey = process.env.OPENAI_API_KEY || '';

      if (userSettings && userSettings.provider && userSettings.api_keys) {
        provider = userSettings.provider as AIProvider;
        apiKey = userSettings.api_keys[provider] || apiKey;
      }

      const systemPrompt = `You are a DeFi research agent that helps users find the best yield opportunities across multiple blockchains. 
                          You have access to real-time data from 50+ protocols across 15+ chains.
                          Provide clear, actionable insights with specific numbers and recommendations.
                          Always mention risk scores and explain why certain pools are recommended.
                          Format your response with clear headers using ### and bold text using **.`;

      if (stream) {
        // Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendEvent = (type: string, data: any) => {
          res.write(`event: ${type}\n`);
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        try {
          // Step 1: Analyzing
          sendEvent('intermediate', { 
            type: 'analyzing', 
            message: 'Understanding your requirements...' 
          });

          await new Promise(resolve => setTimeout(resolve, 500));

          // Step 2: Searching
          sendEvent('intermediate', { 
            type: 'searching', 
            message: 'Scanning 50+ protocols across 15 chains...' 
          });

          // Query pools based on user intent
          const { data: pools } = await supabase
            .from('pools')
            .select('*')
            .order('apy', { ascending: false })
            .limit(20);

          await new Promise(resolve => setTimeout(resolve, 500));

          // Step 3: Calculating
          sendEvent('intermediate', { 
            type: 'calculating', 
            message: 'Evaluating risk factors and yields...' 
          });

          // Use AI provider service
          let aiResponse = '';
          await aiProviderService.streamCompletion(
            provider,
            apiKey,
            [
              { role: "user", content: `${userMessage}\n\nHere are the top pools I found:\n${JSON.stringify(pools?.slice(0, 10), null, 2)}` }
            ],
            systemPrompt,
            {
              onComplete: (response) => {
                aiResponse = response;
              },
              onError: (error) => {
                throw error;
              }
            }
          );

          await new Promise(resolve => setTimeout(resolve, 500));

          // Step 4: Complete
          sendEvent('complete', {
            response: aiResponse,
            data: {
              pools: pools?.slice(0, 5),
              summary: {
                best_apy: pools && pools.length > 0 ? parseFloat(pools[0].apy || '0') : 0,
                avg_risk_score: pools && pools.length > 0 
                  ? pools.reduce((sum, p) => sum + (p.risk_score || 0), 0) / pools.length 
                  : 0,
              }
            },
            follow_up_suggestions: [
              "Would you like to see historical APY trends?",
              "Should I calculate gas-adjusted returns?",
              "Do you want me to compare specific protocols?"
            ]
          });

          res.end();
        } catch (error) {
          console.error('Error in streaming agent:', error);
          sendEvent('error', { message: 'An error occurred processing your request' });
          res.end();
        }
      } else {
        // Non-streaming response
        const { data: pools } = await supabase
          .from('pools')
          .select('*')
          .order('apy', { ascending: false })
          .limit(10);

        let aiResponse = '';
        await aiProviderService.streamCompletion(
          provider,
          apiKey,
          [
            { role: "user", content: `${userMessage}\n\nHere are the top pools:\n${JSON.stringify(pools, null, 2)}` }
          ],
          systemPrompt,
          {
            onComplete: (response) => {
              aiResponse = response;
            },
            onError: (error) => {
              throw error;
            }
          }
        );

        res.json({
          response: aiResponse,
          data: {
            pools: pools?.slice(0, 5),
          }
        });
      }
    } catch (error) {
      console.error('Error in /api/agent:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // GET /api/settings/ai - Fetch user's AI settings
  app.get("/api/settings/ai", async (req: Request, res: Response) => {
    try {
      // For now, use a default user_id. In production, this would come from auth session
      const user_id = req.query.user_id || "default_user";

      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching AI settings:', error);
        return res.status(500).json({ error: 'Failed to fetch AI settings' });
      }

      res.json(data || null);
    } catch (error) {
      console.error('Error in /api/settings/ai GET:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/settings/ai - Save user's AI settings
  app.post("/api/settings/ai", async (req: Request, res: Response) => {
    try {
      const { provider, api_keys } = req.body;

      if (!provider || !api_keys) {
        return res.status(400).json({ error: 'Provider and API keys are required' });
      }

      // For now, use a default user_id. In production, this would come from auth session
      const user_id = req.body.user_id || "default_user";

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

      res.json(data);
    } catch (error) {
      console.error('Error in /api/settings/ai POST:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
