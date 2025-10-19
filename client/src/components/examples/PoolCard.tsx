import PoolCard from '../PoolCard';

export default function PoolCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-background">
      <PoolCard
        protocol="Aave V3"
        symbol="USDC"
        chain="Arbitrum"
        tvl="$245.2M"
        apy={12.45}
        apyBase={8.2}
        apyReward={4.25}
        riskScore={85}
        ilRisk="None"
        onClick={() => console.log('Pool clicked: Aave V3 USDC')}
      />
      <PoolCard
        protocol="Compound"
        symbol="USDT"
        chain="Ethereum"
        tvl="$892.1M"
        apy={6.32}
        apyBase={6.32}
        apyReward={0}
        riskScore={72}
        ilRisk="None"
        onClick={() => console.log('Pool clicked: Compound USDT')}
      />
      <PoolCard
        protocol="Curve"
        symbol="3pool"
        chain="Polygon"
        tvl="$156.8M"
        apy={15.67}
        apyBase={3.2}
        apyReward={12.47}
        riskScore={58}
        ilRisk="Low"
        onClick={() => console.log('Pool clicked: Curve 3pool')}
      />
    </div>
  );
}
