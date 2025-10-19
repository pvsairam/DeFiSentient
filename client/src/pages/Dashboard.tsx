import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import MetricCard from "@/components/MetricCard";
import FilterChips from "@/components/FilterChips";
import PoolCard from "@/components/PoolCard";
import StreamingIndicator from "@/components/StreamingIndicator";
import PoolDetailModal from "@/components/PoolDetailModal";
import AIResponseCard from "@/components/AIResponseCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { fetchPools, fetchPoolsStats, queryAgent } from "@/lib/api";
import { Pool } from "@shared/schema";

export default function Dashboard() {
  const [filters, setFilters] = useState([
    { id: 'stablecoins', label: 'Stablecoins', active: false },
    { id: 'low-risk', label: 'Low Risk (>70)', active: false },
    { id: 'arbitrum', label: 'Arbitrum', active: false },
    { id: 'ethereum', label: 'Ethereum', active: false },
    { id: 'polygon', label: 'Polygon', active: false },
    { id: 'high-apy', label: 'High APY (>10%)', active: false },
  ]);

  const [sortBy, setSortBy] = useState<'apy' | 'tvl_usd' | 'risk_score'>('apy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingStep, setStreamingStep] = useState<"analyzing" | "searching" | "calculating" | "complete">("analyzing");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showAiResponse, setShowAiResponse] = useState(false);

  const pageSize = 9;

  // Build filter params
  const getFilterParams = () => {
    const params: any = {
      sortBy,
      order: sortOrder,
      limit: pageSize,
      offset: page * pageSize,
    };

    const activeFilters = filters.filter(f => f.active);
    
    if (activeFilters.find(f => f.id === 'low-risk')) {
      params.minRiskScore = 70;
    }
    
    if (activeFilters.find(f => f.id === 'high-apy')) {
      params.minAPY = 10;
    }

    const chainFilter = activeFilters.find(f => ['arbitrum', 'ethereum', 'polygon'].includes(f.id));
    if (chainFilter) {
      params.chain = chainFilter.label;
    }

    return params;
  };

  // Fetch pools data
  const { data: poolsData, isLoading: poolsLoading } = useQuery({
    queryKey: ['/api/pools', filters, sortBy, sortOrder, page],
    queryFn: () => fetchPools(getFilterParams()),
  });

  // Fetch stats data
  const { data: stats } = useQuery({
    queryKey: ['/api/pools/stats'],
    queryFn: fetchPoolsStats,
  });

  const handleToggle = (id: string) => {
    setFilters(prev => prev.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
    setPage(0); // Reset to first page when filters change
  };

  const handleSearch = async (query: string) => {
    setIsStreaming(true);
    setStreamingStep("analyzing");
    setShowAiResponse(false);
    
    try {
      await queryAgent(
        [{ role: "user", content: query }],
        (type, data) => {
          if (type === 'intermediate') {
            setStreamingStep(data.type);
            setStreamingMessage(data.message);
          } else if (type === 'complete') {
            setStreamingStep('complete');
            setStreamingMessage(data.response);
            setAiResponse(data.response);
            setTimeout(() => {
              setIsStreaming(false);
              setShowAiResponse(true);
            }, 1500);
          }
        }
      );
    } catch (error) {
      console.error('Error querying agent:', error);
      setIsStreaming(false);
    }
  };

  const handleSortChange = (value: string) => {
    if (value === 'apy' || value === 'tvl' || value === 'risk') {
      if (value === 'apy') {
        setSortBy('apy');
        setSortOrder('desc');
      } else if (value === 'tvl') {
        setSortBy('tvl_usd');
        setSortOrder('desc');
      } else if (value === 'risk') {
        setSortBy('risk_score');
        setSortOrder('desc');
      }
      setPage(0);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const pools = poolsData?.pools || [];
  const totalPools = poolsData?.total || 0;
  const totalPages = Math.ceil(totalPools / pageSize);

  const formatNumber = (num: number | string | null | undefined, prefix = '', suffix = ''): string => {
    if (num === undefined || num === null) return 'N/A';
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    
    if (isNaN(numValue)) return 'N/A';
    
    if (numValue >= 1_000_000_000) {
      return `${prefix}${(numValue / 1_000_000_000).toFixed(2)}B${suffix}`;
    } else if (numValue >= 1_000_000) {
      return `${prefix}${(numValue / 1_000_000).toFixed(2)}M${suffix}`;
    } else if (numValue >= 1_000) {
      return `${prefix}${(numValue / 1_000).toFixed(2)}K${suffix}`;
    }
    return `${prefix}${numValue.toFixed(2)}${suffix}`;
  };

  return (
    <div className="flex flex-col h-screen bg-background gradient-mesh grid-pattern relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <main className="flex-1 overflow-auto relative z-10">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Search Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-3xl mx-auto">
              <SearchBar 
                placeholder="Ask me anything about DeFi yields (e.g., 'Find stablecoin yields with low risk')"
                onSearch={handleSearch}
              />
            </div>
          </motion.div>

          {/* Metrics Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <MetricCard 
              label="Total TVL Tracked" 
              value={formatNumber(stats?.totalTVL, '$')} 
            />
            <MetricCard 
              label="Average APY" 
              value={stats?.averageAPY ? `${stats.averageAPY.toFixed(2)}%` : 'Loading...'} 
            />
            <MetricCard 
              label="Pools Monitored" 
              value={stats?.totalPools?.toLocaleString() || 'Loading...'} 
            />
            <MetricCard 
              label="Chains Supported" 
              value={stats?.uniqueChains?.toString() || 'Loading...'} 
            />
          </motion.div>

          {/* AI Response Card */}
          <AIResponseCard
            response={aiResponse}
            isVisible={showAiResponse}
            onClose={() => setShowAiResponse(false)}
          />

          {/* Filters Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-wrap">
              <FilterChips filters={filters} onToggle={handleToggle} />
              
              <div className="flex items-center gap-2">
                <Select value={sortBy === 'apy' ? 'apy' : sortBy === 'tvl_usd' ? 'tvl' : 'risk'} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] glass" data-testid="select-sort">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="apy">Highest APY</SelectItem>
                    <SelectItem value="tvl">Highest TVL</SelectItem>
                    <SelectItem value="risk">Highest Risk Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          {/* Pools Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h2 
              className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Available Opportunities {totalPools > 0 && `(${totalPools.toLocaleString()})`}
            </motion.h2>
            
            {poolsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : pools.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No pools found matching your criteria.</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {pools.map((pool) => (
                  <motion.div key={pool.id} variants={itemVariants}>
                    <PoolCard
                      protocol={pool.protocol}
                      symbol={pool.symbol}
                      chain={pool.chain}
                      tvl={formatNumber(pool.tvl_usd, '$')}
                      apy={parseFloat(pool.apy || '0')}
                      apyBase={parseFloat(pool.apy_base || '0')}
                      apyReward={parseFloat(pool.apy_reward || '0')}
                      riskScore={pool.risk_score || 0}
                      ilRisk={pool.il_risk || 'Unknown'}
                      onClick={() => setSelectedPool(pool)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              className="flex justify-center gap-2 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="glass" 
                data-testid="button-prev-page"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i;
                if (totalPages > 5 && page > 2) {
                  pageNum = page - 2 + i;
                  if (pageNum >= totalPages) {
                    pageNum = totalPages - 5 + i;
                  }
                }
                
                return (
                  <Button 
                    key={pageNum}
                    variant={page === pageNum ? "secondary" : "outline"}
                    size="sm" 
                    onClick={() => setPage(pageNum)}
                    className="glass" 
                    data-testid={`button-page-${pageNum + 1}`}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="glass" 
                data-testid="button-next-page"
              >
                Next
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Streaming Indicator */}
      {isStreaming && (
        <StreamingIndicator 
          step={streamingStep} 
          message={streamingMessage}
        />
      )}

      {/* Pool Detail Modal */}
      {selectedPool && (
        <PoolDetailModal
          isOpen={!!selectedPool}
          onClose={() => setSelectedPool(null)}
          pool={{
            id: selectedPool.id,
            protocol: selectedPool.protocol,
            symbol: selectedPool.symbol,
            chain: selectedPool.chain,
            tvl: formatNumber(selectedPool.tvl_usd, '$'),
            apy: parseFloat(selectedPool.apy || '0'),
            apyBase: parseFloat(selectedPool.apy_base || '0'),
            apyReward: parseFloat(selectedPool.apy_reward || '0'),
            riskScore: selectedPool.risk_score || 0,
            ilRisk: selectedPool.il_risk || 'Unknown',
          }}
        />
      )}
    </div>
  );
}
