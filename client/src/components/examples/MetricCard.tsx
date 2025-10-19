import MetricCard from '../MetricCard';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-background">
      <MetricCard label="Total TVL Tracked" value="$142.5B" change={5.2} changeLabel="vs last week" />
      <MetricCard label="Average APY" value="8.47%" change={-1.3} changeLabel="vs last week" />
      <MetricCard label="Pools Monitored" value="1,247" />
      <MetricCard label="Chains Supported" value="15" />
    </div>
  );
}
