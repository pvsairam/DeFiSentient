import { Pool } from "@shared/schema";

export interface PoolsResponse {
  pools: Pool[];
  total: number;
  limit: number;
  offset: number;
}

export interface PoolsStatsResponse {
  totalPools: number;
  averageAPY: number;
  totalTVL: number;
  uniqueChains: number;
}

export interface AgentMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AgentResponse {
  response: string;
  data?: {
    pools?: Pool[];
    summary?: {
      best_apy: number;
      avg_risk_score: number;
    };
  };
  follow_up_suggestions?: string[];
}

export async function fetchPools(params?: {
  chain?: string;
  protocol?: string;
  minRiskScore?: number;
  minAPY?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}): Promise<PoolsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`/api/pools?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch pools');
  }

  return response.json();
}

export async function fetchPoolsStats(): Promise<PoolsStatsResponse> {
  const response = await fetch('/api/pools/stats');
  
  if (!response.ok) {
    throw new Error('Failed to fetch pool stats');
  }

  return response.json();
}

export async function queryAgent(
  messages: AgentMessage[],
  onEvent?: (type: string, data: any) => void
): Promise<AgentResponse> {
  const response = await fetch('/api/agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      stream: !!onEvent,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to query agent');
  }

  if (onEvent) {
    // Handle SSE streaming
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    let buffer = '';
    let finalResponse: AgentResponse = { response: '' };

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const event of events) {
        if (!event.trim()) continue;
        
        const lines = event.split('\n');
        let eventType = '';
        let eventData = '';
        
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            eventData = line.substring(5).trim();
          }
        }
        
        if (eventType && eventData) {
          try {
            const data = JSON.parse(eventData);
            
            if (eventType === 'complete') {
              finalResponse = data;
            }
            
            onEvent(eventType, data);
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

    return finalResponse;
  } else {
    // Non-streaming response
    return response.json();
  }
}
