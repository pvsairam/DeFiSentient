// Simple local storage-based watchlist
export interface WatchlistItem {
  poolId: string;
  protocol: string;
  symbol: string;
  chain: string;
  apy: number;
  tvl: string;
  riskScore: number;
  addedAt: string;
}

const WATCHLIST_KEY = 'defi_watchlist';

export const getWatchlist = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addToWatchlist = (item: Omit<WatchlistItem, 'addedAt'>): void => {
  const watchlist = getWatchlist();
  
  // Check if already in watchlist
  if (watchlist.some(w => w.poolId === item.poolId)) {
    return;
  }

  const newItem: WatchlistItem = {
    ...item,
    addedAt: new Date().toISOString(),
  };

  watchlist.unshift(newItem); // Add to beginning
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));

  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent('watchlistUpdated'));
};

export const removeFromWatchlist = (poolId: string): void => {
  const watchlist = getWatchlist();
  const filtered = watchlist.filter(w => w.poolId !== poolId);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
  
  window.dispatchEvent(new CustomEvent('watchlistUpdated'));
};

export const isInWatchlist = (poolId: string): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(w => w.poolId === poolId);
};
