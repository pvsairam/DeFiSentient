interface RiskGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function RiskGauge({ score, size = "md" }: RiskGaugeProps) {
  const sizes = {
    sm: { dimension: 80, stroke: 6, fontSize: "text-lg" },
    md: { dimension: 120, stroke: 8, fontSize: "text-2xl" },
    lg: { dimension: 160, stroke: 10, fontSize: "text-4xl" }
  };

  const config = sizes[size];
  const radius = (config.dimension - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 71) return "hsl(var(--chart-2))";
    if (score >= 41) return "hsl(var(--chart-3))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className="flex flex-col items-center gap-2" data-testid="risk-gauge">
      <div className="relative" style={{ width: config.dimension, height: config.dimension }}>
        <svg width={config.dimension} height={config.dimension} className="transform -rotate-90">
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.stroke}
          />
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke={getColor(score)}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-bold ${config.fontSize}`} style={{ color: getColor(score) }} data-testid="text-risk-score">
            {score}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground">Risk Score</span>
    </div>
  );
}
