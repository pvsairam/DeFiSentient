import StreamingIndicator from '../StreamingIndicator';
import { useState, useEffect } from 'react';

export default function StreamingIndicatorExample() {
  const [step, setStep] = useState<"analyzing" | "searching" | "calculating" | "complete">("analyzing");
  const messages = {
    analyzing: "Understanding your requirements...",
    searching: "Scanning 50+ protocols across 15 chains...",
    calculating: "Evaluating risk factors and yields...",
    complete: "Found 12 opportunities matching your criteria"
  };

  useEffect(() => {
    const steps: Array<"analyzing" | "searching" | "calculating" | "complete"> = ["analyzing", "searching", "calculating", "complete"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % steps.length;
      setStep(steps[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-background relative">
      <StreamingIndicator step={step} message={messages[step]} />
    </div>
  );
}
