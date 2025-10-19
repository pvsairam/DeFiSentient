import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, TrendingUp, Shield } from "lucide-react";
import { getWatchlist, removeFromWatchlist, type WatchlistItem } from "@/lib/watchlist";
import { useToast } from "@/hooks/use-toast";
import RiskGauge from "@/components/RiskGauge";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const { toast } = useToast();

  const loadWatchlist = () => {
    setWatchlist(getWatchlist());
  };

  useEffect(() => {
    loadWatchlist();

    const handleWatchlistUpdate = () => {
      loadWatchlist();
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
  }, []);

  const handleRemove = (poolId: string, protocol: string) => {
    removeFromWatchlist(poolId);
    toast({
      title: "Removed from watchlist",
      description: `${protocol} has been removed from your watchlist.`,
    });
  };

  const formatNumber = (num: number | string, prefix = '', suffix = ''): string => {
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
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Star className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Watchlist
          </h1>
        </div>
        <p className="text-muted-foreground">
          Track your favorite DeFi pools and monitor their performance
        </p>
      </motion.div>

      {/* Watchlist Grid */}
      {watchlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <Card className="glass-card p-8 max-w-md text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
            <p className="text-muted-foreground mb-4">
              Start adding pools to track their performance and stay updated on yield opportunities
            </p>
            <Button
              variant="default"
              onClick={() => window.location.href = '/'}
              data-testid="button-browse-pools"
            >
              Browse Pools
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {watchlist.map((item, index) => (
            <motion.div
              key={item.poolId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card p-5 relative overflow-hidden group hover:scale-105 transition-transform">
                {/* Holographic background */}
                <div className="absolute inset-0 holographic opacity-10 pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {item.protocol[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.protocol}</h3>
                        <p className="text-xs text-muted-foreground">{item.symbol}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item.poolId, item.protocol)}
                      className="hover-elevate active-elevate-2"
                      data-testid={`button-remove-${item.poolId}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Chain Badge */}
                  <Badge variant="outline" className="glass">
                    {item.chain}
                  </Badge>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        APY
                      </p>
                      <p className="text-2xl font-bold font-mono bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {item.apy.toFixed(2)}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">TVL</p>
                      <p className="text-lg font-semibold font-mono">
                        {item.tvl}
                      </p>
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Risk Score
                    </p>
                    <div className="scale-75 origin-right">
                      <RiskGauge score={item.riskScore} size="sm" />
                    </div>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-muted-foreground/70 text-right">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Neon glow */}
                <div className="absolute inset-0 rounded-lg border border-primary/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" 
                     style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.1)' }} />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats Summary */}
      {watchlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
        >
          <Card className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Pools</p>
            <p className="text-3xl font-bold">{watchlist.length}</p>
          </Card>
          <Card className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Average APY</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {(watchlist.reduce((sum, item) => sum + item.apy, 0) / watchlist.length).toFixed(2)}%
            </p>
          </Card>
          <Card className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-1">Average Risk Score</p>
            <p className="text-3xl font-bold">
              {Math.round(watchlist.reduce((sum, item) => sum + item.riskScore, 0) / watchlist.length)}/100
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
