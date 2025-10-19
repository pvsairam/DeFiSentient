import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIResponseCardProps {
  response: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function AIResponseCard({ response, isVisible, onClose }: AIResponseCardProps) {
  if (!isVisible || !response) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-6"
        data-testid="ai-response-card"
      >
        <Card className="glass-card p-6 relative overflow-hidden">
          {/* Holographic background */}
          <div className="absolute inset-0 holographic opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                </motion.div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Analysis
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover-elevate active-elevate-2 flex-shrink-0"
                data-testid="button-close-ai-response"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Response Content with Markdown Rendering */}
            <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-primary prose-li:text-foreground/90 prose-a:text-primary hover:prose-a:text-primary/80">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response}
              </ReactMarkdown>
            </div>

            {/* Footer hint */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-muted-foreground">
                💡 This analysis is powered by AI and uses real pool data from DeFiLlama
              </p>
            </div>
          </div>

          {/* Neon glow border */}
          <div className="absolute inset-0 rounded-lg border border-primary/30 pointer-events-none" 
               style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' }} />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
