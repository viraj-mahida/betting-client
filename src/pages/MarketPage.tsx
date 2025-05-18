import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMarketStore } from '../stores/marketStore';
import MarketHeader from '../components/market/MarketHeader';
import BettingInterface from '../components/market/BettingInterface';
import MarketStats from '../components/market/MarketStats';
import UserPositionCard from '../components/market/UserPositionCard';
import { useWalletContext } from '../contexts/WalletContext';

const MarketPage = () => {
  const { marketPublicKeyString } = useParams<{ marketPublicKeyString: string }>();
  const { getMarketById, resolveMarket } = useMarketStore();
  const { isConnected } = useWalletContext();
  const [isResolving, setIsResolving] = useState(false);

  const marketNotFoundComp =  <div className="container mx-auto px-4 py-8">
  <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
    <h1 className="mb-2 text-2xl font-bold">Market Not Found</h1>
    <p className="text-slate-600 dark:text-slate-400">
      The market you're looking for doesn't exist or has been removed.
    </p>
  </div>
</div>

  // if (!marketPublicKeyString) {
  //   return marketNotFoundComp;
  // }

  const market = getMarketById(marketPublicKeyString!);

  console.log("market market market,",{market});

  const handleResolveMarket = async (outcome: 'yes' | 'no') => {
    setIsResolving(true);
    try {
      // await resolveMarket(market.id, outcome);
    } catch (error) {
      console.error('Failed to resolve market:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleBetPlaced = () => {
    // Refresh market data or do other updates when a bet is placed
    console.log('Bet placed successfully');
  };

  if (!market) {
    return marketNotFoundComp;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MarketHeader market={market} onResolve={handleResolveMarket} />
          <MarketStats market={market} />
        </div>

        <div className="flex flex-col space-y-6">
          {isConnected ? (
            <>
              {!market.resolved && <BettingInterface market={market} onBetPlaced={handleBetPlaced} />}
              <UserPositionCard market={market} />
            </>
          ) : (
            <div className="card p-6 text-center">
              <p className="mb-4 text-slate-700 dark:text-slate-300">
                Connect your wallet to place bets or view your positions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketPage;