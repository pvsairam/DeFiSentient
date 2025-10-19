import { Card } from "@/components/ui/card";
import { Loader2, Search, Calculator, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

type StreamingStep = "analyzing" | "searching" | "calculating" | "complete";

interface StreamingIndicatorProps {
  step: StreamingStep;
  message: string;
  isVisible?: boolean;
}

export default function StreamingIndicator({ step, message, isVisible = true }: StreamingIndicatorProps) {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (step) {
      case "analyzing":
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      case "searching":
        return <Search className="w-5 h-5 text-primary animate-pulse" />;
      case "calculating":
        return <Calculator className="w-5 h-5 text-primary animate-pulse" />;
      case "complete":
        return <CheckCircle2 className="w-5 h-5 text-chart-2" />;
    }
  };

  const getStepLabel = () => {
    switch (step) {
      case "analyzing":
        return "Analyzing";
      case "searching":
        return "Searching";
      case "calculating":
        return "Calculating";
      case "complete":
        return "Complete";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
        data-testid="streaming-indicator"
      >
        <Card className="glass-card p-5 shadow-2xl w-96 relative overflow-hidden">
          {/* Holographic shimmer effect */}
          <div className="absolute inset-0 holographic opacity-30 pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <motion.div
              animate={{ rotate: step !== "complete" ? 360 : 0 }}
              transition={{ duration: 2, repeat: step !== "complete" ? Infinity : 0, ease: "linear" }}
              className="flex-shrink-0"
            >
              {getIcon()}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={step === "complete" ? "default" : "secondary"} className="glass">
                  {getStepLabel()}
                </Badge>
              </div>
              <motion.p 
                className="text-sm text-foreground truncate" 
                data-testid="text-streaming-message"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={message}
              >
                {message}
              </motion.p>
            </div>
          </div>
          
          {step !== "complete" && (
            <div className="mt-4 h-1.5 bg-muted/30 rounded-full overflow-hidden relative z-10">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
