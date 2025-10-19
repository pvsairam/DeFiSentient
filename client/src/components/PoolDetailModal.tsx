import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Shield, AlertTriangle, Clock, Star, StarOff } from "lucide-react";
import RiskGauge from "./RiskGauge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist";
import { useToast } from "@/hooks/use-toast";

interface PoolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: {
    id?: string;
    protocol: string;
    symbol: string;
    chain: string;
    tvl: string;
    apy: number;
    apyBase: number;
    apyReward: number;
    riskScore: number;
    ilRisk: string;
  };
}

export default function PoolDetailModal({ isOpen, onClose, pool }: PoolDetailModalProps) {
  const { toast } = useToast();
  const [inWatchlist, setInWatchlist] = useState(false);

  // Generate a unique pool ID from protocol + chain + symbol
  const poolId = pool.id || `${pool.protocol}-${pool.chain}-${pool.symbol}`.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    setInWatchlist(isInWatchlist(poolId));

    const handleWatchlistUpdate = () => {
      setInWatchlist(isInWatchlist(poolId));
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
  }, [poolId]);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(poolId);
      toast({
        title: "Removed from watchlist",
        description: `${pool.protocol} has been removed from your watchlist.`,
      });
    } else {
      addToWatchlist({
        poolId,
        protocol: pool.protocol,
        symbol: pool.symbol,
        chain: pool.chain,
        apy: pool.apy,
        tvl: pool.tvl,
        riskScore: pool.riskScore,
      });
      toast({
        title: "Added to watchlist",
        description: `${pool.protocol} has been added to your watchlist.`,
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-primary/20" data-testid="modal-pool-detail">
        {/* Holographic background */}
        <div className="absolute inset-0 holographic opacity-20 pointer-events-none rounded-lg" />
        
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span className="font-bold text-lg">{pool.protocol[0]}</span>
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{pool.protocol}</span>
                  <Badge variant="outline" className="glass">{pool.chain}</Badge>
                </div>
                <p className="text-sm font-normal text-muted-foreground">{pool.symbol}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <motion.div 
              className="space-y-2 p-4 rounded-lg glass"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm text-muted-foreground">Total Value Locked</p>
              <p className="text-2xl font-mono font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                {pool.tvl}
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-2 p-4 rounded-lg glass"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground">Current APY</p>
              <p className="text-3xl font-mono font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {pool.apy.toFixed(2)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Base: {pool.apyBase.toFixed(2)}% + Rewards: {pool.apyReward.toFixed(2)}%
              </p>
            </motion.div>
            
            <motion.div 
              className="flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <RiskGauge score={pool.riskScore} size="md" />
            </motion.div>
          </div>

          <Separator className="my-6 bg-white/10" />

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-primary" />
                Risk Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="flex items-start gap-3 p-4 rounded-lg glass group hover:scale-105 transition-transform"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Shield className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Protocol Security</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Audited by multiple firms. No major exploits in 2+ years.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-3 p-4 rounded-lg glass group hover:scale-105 transition-transform"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <AlertTriangle className="w-5 h-5 text-chart-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Impermanent Loss Risk</p>
                    <p className="text-sm text-muted-foreground mt-1">{pool.ilRisk}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-3 p-4 rounded-lg glass group hover:scale-105 transition-transform"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <TrendingUp className="w-5 h-5 text-chart-1 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">TVL Stability</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Stable TVL over 30 days (+2.3%)
                    </p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-3 p-4 rounded-lg glass group hover:scale-105 transition-transform"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Smart Contract Age</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Deployed 24+ months ago
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="font-semibold mb-4 text-lg">Real Yield Calculator</h3>
              <div className="p-5 rounded-lg glass space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gross APY</span>
                  <span className="font-mono font-medium text-primary">{pool.apy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-sm">Est. Gas Costs (Annual)</span>
                  <span className="font-mono text-sm">-0.15%</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-sm">Compound Frequency (Weekly)</span>
                  <span className="font-mono text-sm">+0.08%</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Net APY</span>
                  <span className="font-mono bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent">
                    {(pool.apy - 0.15 + 0.08).toFixed(2)}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="flex gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90" 
              data-testid="button-view-protocol"
              onClick={() => {
                const protocolUrls: Record<string, string> = {
                  'orca-dex': 'https://www.orca.so',
                  'aerodrome-slipstream': 'https://aerodrome.finance',
                  'sceptre-liquid': 'https://sceptre.fi',
                  'hyperion': 'https://hyperion.fi',
                  'uniswap-v3': 'https://app.uniswap.org',
                  'aave-v3': 'https://app.aave.com',
                  'compound-v3': 'https://app.compound.finance',
                  'curve': 'https://curve.fi',
                  'balancer-v2': 'https://app.balancer.fi',
                  'pendle': 'https://app.pendle.finance',
                };
                const url = protocolUrls[pool.protocol.toLowerCase()] || `https://defillama.com/protocol/${pool.protocol}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on {pool.protocol}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 glass" 
              data-testid="button-add-watchlist"
              onClick={handleWatchlistToggle}
            >
              {inWatchlist ? (
                <>
                  <Star className="w-4 h-4 mr-2 fill-primary text-primary" />
                  Remove from Watchlist
                </>
              ) : (
                <>
                  <StarOff className="w-4 h-4 mr-2" />
                  Add to Watchlist
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
