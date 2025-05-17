import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import MarketCard from '../components/market/MarketCard';
import Button from '../components/common/Button';
import { useMarketStore } from '../stores/marketStore';
import { MarketWithUserPosition } from '../utils/types';

const ExplorePage = () => {
  const { markets, isLoading } = useMarketStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'resolved'>('all');
  const [sortOption, setSortOption] = useState<'newest' | 'liquidity' | 'closing'>('newest');
  const [filteredMarkets, setFilteredMarkets] = useState<MarketWithUserPosition[]>([]);

  useEffect(() => {
    // Apply filters and sort
    let result = [...markets];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(market => market.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        market => 
          market.title.toLowerCase().includes(query) || 
          market.description.toLowerCase().includes(query)
      );
    }

    // Sort markets
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'liquidity':
          return b.totalLiquidity - a.totalLiquidity;
        case 'closing':
          return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredMarkets(result);
  }, [markets, searchQuery, statusFilter, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Explore Markets</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Browse all prediction markets and find opportunities to bet on.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="input w-full pl-10"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-slate-400" />
              <select
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <select
              className="input"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="liquidity">Highest Liquidity</option>
              <option value="closing">Closing Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-slate-200 animate-pulse dark:bg-slate-800"></div>
          ))}
        </div>
      ) : filteredMarkets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-2 text-lg font-medium">No markets found</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            No markets matching your search criteria were found.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;