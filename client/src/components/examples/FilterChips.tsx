import FilterChips from '../FilterChips';
import { useState } from 'react';

export default function FilterChipsExample() {
  const [filters, setFilters] = useState([
    { id: 'stablecoins', label: 'Stablecoins', active: true },
    { id: 'low-risk', label: 'Low Risk', active: true },
    { id: 'arbitrum', label: 'Arbitrum', active: false },
    { id: 'ethereum', label: 'Ethereum', active: false },
    { id: 'polygon', label: 'Polygon', active: false },
    { id: 'high-apy', label: 'High APY (>10%)', active: false },
  ]);

  const handleToggle = (id: string) => {
    setFilters(prev => prev.map(f => 
      f.id === id ? { ...f, active: !f.active } : f
    ));
  };

  return (
    <div className="p-6 bg-background">
      <FilterChips filters={filters} onToggle={handleToggle} />
    </div>
  );
}
