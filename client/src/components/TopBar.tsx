import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function TopBar() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    console.log('Theme toggled:', !isDark ? 'dark' : 'light');
  };

  return (
    <motion.header 
      className="h-16 glass relative z-50 flex items-center justify-between px-6 flex-shrink-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-accent/50 animate-pulse" />
          <span className="text-primary-foreground font-bold text-lg relative z-10">DF</span>
        </motion.div>
        <div>
          <h1 className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            DeFi Research Agent
          </h1>
          <p className="text-xs text-muted-foreground">Multi-Chain Yield Analytics</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button 
            size="icon" 
            variant="ghost" 
            className="glass relative group"
            data-testid="button-notifications"
            onClick={() => console.log('Notifications clicked')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button 
            size="icon" 
            variant="ghost"
            className="glass"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </motion.div>
        
        <motion.div 
          className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center ml-2 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-bold text-white">U</span>
        </motion.div>
      </div>
    </motion.header>
  );
}
