import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Watchlist from "@/pages/Watchlist";
import NotFound from "@/pages/not-found";
import { Home, Settings as SettingsIcon, Star } from "lucide-react";

function Router() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              DF
            </div>
            <div>
              <h1 className="text-lg font-bold">DeFi Sentinel</h1>
              <p className="text-xs text-muted-foreground">Multi-Chain Yield Analytics</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate active-elevate-2"
                data-testid="link-dashboard"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/watchlist">
              <Button 
                variant={location === "/watchlist" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate active-elevate-2"
                data-testid="link-watchlist"
              >
                <Star className="w-4 h-4 mr-2" />
                Watchlist
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant={location === "/settings" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate active-elevate-2"
                data-testid="link-settings"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background/80 backdrop-blur-lg py-4">
        <div className="container mx-auto px-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="text-red-500">♥</span>
            <span>by</span>
            <a 
              href="https://x.com/xtestnet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              data-testid="link-creator"
            >
              @xtestnet
            </a>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <span>Powered by</span>
            <a 
              href="https://x.com/SentientAGI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 font-semibold transition-colors"
              data-testid="link-sentient"
            >
              Sentient
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
