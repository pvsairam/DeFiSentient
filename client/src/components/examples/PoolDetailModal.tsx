import PoolDetailModal from '../PoolDetailModal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PoolDetailModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const pool = {
    protocol: "Aave V3",
    symbol: "USDC",
    chain: "Arbitrum",
    tvl: "$245.2M",
    apy: 12.45,
    apyBase: 8.2,
    apyReward: 4.25,
    riskScore: 85,
    ilRisk: "None - Stablecoin"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-modal">
        Open Pool Details
      </Button>
      <PoolDetailModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        pool={pool}
      />
    </div>
  );
}
