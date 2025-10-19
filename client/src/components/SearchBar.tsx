import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  placeholder = "Ask me anything about DeFi yields...",
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
      console.log('Search query:', query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div 
        className="relative group"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect on focus */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${isFocused ? 'opacity-50' : ''}`} />
        
        <div className="relative glass-card rounded-xl overflow-hidden">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
          <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-12 pr-12 h-14 bg-transparent border-none text-base focus-visible:ring-2 focus-visible:ring-primary/50 relative z-10"
            data-testid="input-search"
          />
        </div>
      </motion.div>
    </form>
  );
}
