import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-background">
      <SearchBar 
        placeholder="Find stablecoin yields with low risk..."
        onSearch={(query) => console.log('Searching for:', query)}
      />
    </div>
  );
}
