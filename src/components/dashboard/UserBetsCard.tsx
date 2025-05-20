import { ArrowUpRight, Check, X } from 'lucide-react';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency } from '../../utils/format';
import Button from '../common/Button';
import { useMarketStore } from '../../stores/marketStore';
import { useState } from 'react';
import { useAnchorProvider } from '../../contexts/WalletContext';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface UserBetsCardProps {
  markets: MarketWithUserPosition[];
}

const UserBetsCard = ({ markets }: UserBetsCardProps) => {
  const [claimingMarketId, setClaimingMarketId] = useState<string | null>(null);
  const { claimWinnings } = useMarketStore();
  const provider = useAnchorProvider();
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
      await claimWinnings(provider, marketId);
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
          const { publicKey, question, resolved, outcome } = market;

          if (!market.userPosition) return <div>You never placed any bets on this market</div>;

          const { yesBets, noBets, totalStaked, potentialPayout } = market.userPosition;
          
          // Convert to numbers and properly divide by LAMPORTS_PER_SOL
          // Note: BN values from Solana are in lamports, so we need to convert to SOL
          const yesBetsAmount = Number(yesBets) / LAMPORTS_PER_SOL;
          const noBetsAmount = Number(noBets) / LAMPORTS_PER_SOL;
          const totalStakedAmount = Number(totalStaked) / LAMPORTS_PER_SOL;
          const potentialPayoutAmount = Number(potentialPayout) / LAMPORTS_PER_SOL;

          const hasWon = resolved && (
            (outcome === 'yes' && yesBetsAmount > 0) || 
            (outcome === 'no' && noBetsAmount > 0)
          );

          const canClaim = hasWon;

          return (
            <div key={publicKey.toString()} className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-medium">{question}</h4>
                <div className="ml-2 flex-shrink-0">
                  <a
                    href={`/market/${publicKey.toString()}`}
                    className="inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
                  >
                    View <ArrowUpRight size={12} className="ml-0.5" />
                  </a>
                </div>
              </div>

              <div className="mb-3 text-sm text-slate-500">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    !resolved
                      ? 'bg-success-500'
                      : 'bg-primary-500'
                  } mr-1`}
                />
                <span className="capitalize">{resolved ? 'Resolved' : 'Open'}</span>
                {resolved && outcome && (
                  <span className="ml-1">({outcome.toUpperCase()})</span>
                )}
              </div>

              <div className="space-y-2">
                {yesBetsAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Check size={14} className="mr-1 text-success-500" />
                      <span>Yes bet:</span>
                    </div>
                    <span>{formatCurrency(yesBetsAmount * LAMPORTS_PER_SOL)}</span>
                  </div>
                )}

                {noBetsAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <X size={14} className="mr-1 text-error-500" />
                      <span>No bet:</span>
                    </div>
                    <span>{formatCurrency(noBetsAmount * LAMPORTS_PER_SOL)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Total staked:</span>
                  <span>{formatCurrency(totalStakedAmount * LAMPORTS_PER_SOL)}</span>
                </div>

                {resolved && (
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Result:</span>
                    {hasWon ? (
                      <span className="text-success-600">{formatCurrency(potentialPayoutAmount * LAMPORTS_PER_SOL)}</span>
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
                    isLoading={claimingMarketId === publicKey.toString()}
                    onClick={() => handleClaimWinnings(publicKey.toString())}
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