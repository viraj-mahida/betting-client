import { ArrowUpRight, Check, X } from 'lucide-react';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency, formatDate, truncateAddress } from '../../utils/format';
import Button from '../common/Button';
import { useMarketStore } from '../../stores/marketStore';
import { useState } from 'react';

interface UserBetsCardProps {
  markets: MarketWithUserPosition[];
}

const UserBetsCard = ({ markets }: UserBetsCardProps) => {
  const [claimingMarketId, setClaimingMarketId] = useState<string | null>(null);
  const { claimWinnings } = useMarketStore();

  // Filter to only markets where the user has a position
  const marketsWithPositions = markets.filter(m => m.userPosition);

  if (marketsWithPositions.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-500">You haven't placed any bets yet.</p>
      </div>
    );
  }

  const handleClaimWinnings = async (marketId: string) => {
    setClaimingMarketId(marketId);
    try {
      await claimWinnings(marketId);
    } catch (error) {
      console.error('Failed to claim winnings:', error);
    } finally {
      setClaimingMarketId(null);
    }
  };

  return (
    <div className="card">
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <h3 className="text-lg font-medium">Your Bets</h3>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {marketsWithPositions.map((market) => {
          const { id, title, status, outcome } = market;
          const { yesBets, noBets, totalStaked, potentialPayout } = market.userPosition!;
          
          const hasWon = status === 'resolved' && (
            (outcome === 'yes' && yesBets > 0) || 
            (outcome === 'no' && noBets > 0)
          );

          const canClaim = hasWon;

          return (
            <div key={id} className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-medium">{title}</h4>
                <div className="ml-2 flex-shrink-0">
                  <a
                    href={`/market/${id}`}
                    className="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
                  >
                    View <ArrowUpRight size={12} className="ml-0.5" />
                  </a>
                </div>
              </div>

              <div className="mb-3 text-sm text-slate-500">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    status === 'open'
                      ? 'bg-success-500'
                      : status === 'closed'
                      ? 'bg-warning-500'
                      : 'bg-primary-500'
                  } mr-1`}
                />
                <span className="capitalize">{status}</span>
                {status === 'resolved' && outcome && (
                  <span className="ml-1">({outcome.toUpperCase()})</span>
                )}
              </div>

              <div className="space-y-2">
                {yesBets > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Check size={14} className="mr-1 text-success-500" />
                      <span>Yes bet:</span>
                    </div>
                    <span>{formatCurrency(yesBets)}</span>
                  </div>
                )}

                {noBets > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <X size={14} className="mr-1 text-error-500" />
                      <span>No bet:</span>
                    </div>
                    <span>{formatCurrency(noBets)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Total staked:</span>
                  <span>{formatCurrency(totalStaked)}</span>
                </div>

                {status === 'resolved' && (
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Result:</span>
                    {hasWon ? (
                      <span className="text-success-600">{formatCurrency(potentialPayout)}</span>
                    ) : (
                      <span className="text-error-600">No winnings</span>
                    )}
                  </div>
                )}
              </div>

              {canClaim && (
                <div className="mt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    isLoading={claimingMarketId === id}
                    onClick={() => handleClaimWinnings(id)}
                  >
                    Claim Winnings
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserBetsCard;