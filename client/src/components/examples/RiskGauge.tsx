import RiskGauge from '../RiskGauge';

export default function RiskGaugeExample() {
  return (
    <div className="flex items-center justify-center gap-12 p-12 bg-background">
      <RiskGauge score={85} size="sm" />
      <RiskGauge score={62} size="md" />
      <RiskGauge score={35} size="lg" />
    </div>
  );
}
