import { useState } from 'react';
import UserMarketsTable from '../components/dashboard/UserMarketsTable';
import UserBetsCard from '../components/dashboard/UserBetsCard';
import { useMarketStore } from '../stores/marketStore';
import { useWalletContext } from '../contexts/WalletContext';

const DashboardPage = () => {
  const { markets } = useMarketStore();
  const { isConnected, publicKey } = useWalletContext();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'markets' | 'bets'>('overview');

  // Filter user markets (in a real app, this would use the actual connected wallet address)
  const userAddress = publicKey;
  const userCreatedMarkets = markets.filter(m => m.creator.toString() === userAddress);
  
  // Filter markets where user has positions
  const marketsWithUserPositions = markets.filter(m => m.userPosition);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
          <h1 className="mb-4 text-2xl font-bold">Connect Your Wallet</h1>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            You need to connect your wallet to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">        

            <div className="card">
              <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                <h2 className="text-lg font-medium">Your Created Markets</h2>
              </div>
              <div className="p-4">
                <UserMarketsTable 
                  markets={userCreatedMarkets} 
                  emptyMessage="You haven't created any markets yet." 
                />
              </div>
            </div>

            <UserBetsCard markets={marketsWithUserPositions} />
          </div>
        );

      case 'markets':
        return (
          <div className="card">
            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
              <h2 className="text-lg font-medium">Your Created Markets</h2>
            </div>
            <div className="p-4">
              <UserMarketsTable 
                markets={userCreatedMarkets} 
                emptyMessage="You haven't created any markets yet." 
              />
            </div>
          </div>
        );

      case 'bets':
        return <UserBetsCard markets={marketsWithUserPositions} />;

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">Your Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your predictions, markets, and performance.
        </p>
      </div>

      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex overflow-x-auto">
          <button
            className={`inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'markets'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            onClick={() => setActiveTab('markets')}
          >
            Your Markets
          </button>
          <button
            className={`inline-flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'bets'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            onClick={() => setActiveTab('bets')}
          >
            Your Bets
          </button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default DashboardPage;