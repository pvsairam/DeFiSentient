import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onToggle: (id: string) => void;
}

export default function FilterChips({ filters, onToggle }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <motion.div
          key={filter.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge
            variant={filter.active ? "outline" : "secondary"}
            className={`cursor-pointer px-4 py-2 glass relative overflow-hidden group transition-all ${
              filter.active ? '!bg-gradient-to-r !from-primary !to-accent !border-primary/50' : ''
            }`}
            style={filter.active ? {
              backgroundImage: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
              color: 'hsl(var(--primary-foreground))',
            } : undefined}
            onClick={() => {
              onToggle(filter.id);
              console.log('Filter toggled:', filter.id);
            }}
            data-testid={`filter-${filter.id}`}
          >
            {filter.active && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 font-medium" style={filter.active ? { color: 'white' } : undefined}>
              {filter.label}
              {filter.active && <X className="w-3 h-3" />}
            </span>
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}
