import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

export default function MetricCard({ label, value, change, changeLabel }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="p-6 glass-card relative overflow-hidden group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="space-y-2 relative z-10">
          <p className="text-sm text-muted-foreground">{label}</p>
          <motion.p 
            className="text-3xl font-mono font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <motion.div 
              className="flex items-center gap-1 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-chart-2" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <span className={isPositive ? "text-chart-2" : "text-destructive"}>
                {isPositive ? "+" : ""}{change}%
              </span>
              {changeLabel && (
                <span className="text-muted-foreground ml-1">{changeLabel}</span>
              )}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
