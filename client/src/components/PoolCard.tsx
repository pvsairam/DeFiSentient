import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface PoolCardProps {
  protocol: string;
  symbol: string;
  chain: string;
  tvl: string;
  apy: number;
  apyBase: number;
  apyReward: number;
  riskScore: number;
  ilRisk: string;
  protocolIcon?: string;
  onClick?: () => void;
}

export default function PoolCard({
  protocol,
  symbol,
  chain,
  tvl,
  apy,
  apyBase,
  apyReward,
  riskScore,
  ilRisk,
  protocolIcon,
  onClick
}: PoolCardProps) {
  const getRiskColor = (score: number) => {
    if (score >= 71) return "text-chart-2";
    if (score >= 41) return "text-chart-3";
    return "text-destructive";
  };

  const getRiskBadge = (score: number) => {
    if (score >= 71) return { label: "Low Risk", variant: "default" as const };
    if (score >= 41) return { label: "Medium Risk", variant: "secondary" as const };
    return { label: "High Risk", variant: "destructive" as const };
  };

  const risk = getRiskBadge(riskScore);
  const isHighYield = apy > 15;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className={`glass-card cursor-pointer overflow-hidden relative group ${isHighYield ? 'pulse-glow' : ''}`}
        onClick={onClick} 
        data-testid={`card-pool-${protocol}-${symbol}`}
      >
        {/* Holographic overlay on hover */}
        <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-sm font-bold text-primary-foreground">{protocol[0]}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base truncate" data-testid={`text-protocol-${protocol}`}>{protocol}</h3>
                <p className="text-sm text-muted-foreground truncate">{symbol}</p>
              </div>
            </div>
            <Badge variant="outline" className="flex-shrink-0 glass">{chain}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">TVL</p>
              <p className="font-mono font-medium" data-testid={`text-tvl-${protocol}`}>{tvl}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">APY</p>
              <div className="flex items-baseline gap-1">
                <motion.p 
                  className="text-2xl font-mono font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" 
                  data-testid={`text-apy-${protocol}`}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {apy.toFixed(2)}%
                </motion.p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Risk Score:</span>
              <span className={`text-sm font-mono font-semibold ${getRiskColor(riskScore)}`} data-testid={`text-risk-${protocol}`}>
                {riskScore}/100
              </span>
            </div>
            <Badge variant={risk.variant} className="glass">{risk.label}</Badge>
          </div>

          {apyReward > 0 && (
            <div className="text-xs text-muted-foreground flex items-center gap-1 pt-2 border-t border-white/5">
              <TrendingUp className="w-3 h-3" />
              Base: {apyBase.toFixed(2)}% + Rewards: {apyReward.toFixed(2)}%
            </div>
          )}
        </div>

        {/* Neon border glow on hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-primary/20" 
             style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.1)' }} />
      </Card>
    </motion.div>
  );
}
