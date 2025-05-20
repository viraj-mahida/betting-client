import { Check, X } from 'lucide-react';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency } from '../../utils/format';
import Button from '../common/Button';
import { useMarketStore } from '../../stores/marketStore';
import { useState } from 'react';
import { useAnchorProvider } from '../../contexts/WalletContext';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface UserPositionCardProps {
  market: MarketWithUserPosition;
}

const UserPositionCard = ({ market }: UserPositionCardProps) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const { claimWinnings } = useMarketStore();
  const provider = useAnchorProvider();

  // If no user position, don't show anything
  if (!market.userPosition) {
    return null;
  }

  const { userPosition, resolved, outcome } = market;
  const { yesBets, noBets, totalStaked, potentialPayout } = userPosition;

  // Convert to numbers and properly handle lamports conversion
  const yesBetsAmount = Number(yesBets) / LAMPORTS_PER_SOL;
  const noBetsAmount = Number(noBets) / LAMPORTS_PER_SOL;
  const totalStakedAmount = Number(totalStaked) / LAMPORTS_PER_SOL;
  const potentialPayoutAmount = potentialPayout ? Number(potentialPayout) / LAMPORTS_PER_SOL : 0;

  // Check if user has won
  const hasWon = resolved && (
    (outcome === 'yes' && yesBetsAmount > 0) || 
    (outcome === 'no' && noBetsAmount > 0)
  );

  const handleClaimWinnings = async () => {
    setIsClaiming(true);
    try {
      await claimWinnings(provider, market.publicKey.toString());
    } catch (error) {
      console.error('Failed to claim winnings:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-medium">Your Position</h3>
      </div>

      <div className="p-4">
        <div className="mb-4 space-y-2">
          {yesBetsAmount > 0 && (
            <div className="flex items-center justify-between rounded-md bg-primary-50 p-2 dark:bg-primary-900/20">
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className="font-medium">YES</span>
              </div>
              <span>{formatCurrency(yesBetsAmount * LAMPORTS_PER_SOL)}</span>
            </div>
          )}

          {noBetsAmount > 0 && (
            <div className="flex items-center justify-between rounded-md bg-error-50 p-2 dark:bg-error-900/20">
              <div className="flex items-center">
                <X size={16} className="mr-2 text-error-600 dark:text-error-400" />
                <span className="font-medium">NO</span>
              </div>
              <span>{formatCurrency(noBetsAmount * LAMPORTS_PER_SOL)}</span>
            </div>
          )}
        </div>

        <div className="mb-4 space-y-2 rounded-md bg-slate-100 p-3 dark:bg-slate-800">
          <div className="flex justify-between text-sm">
            <span className="text-slate-700 dark:text-slate-300">Total staked:</span>
            <span className="font-medium">{formatCurrency(totalStakedAmount * LAMPORTS_PER_SOL)}</span>
          </div>

          {!resolved && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">Potential payout:</span>
              <span className="font-medium text-success-600 dark:text-success-400">
                {formatCurrency(potentialPayoutAmount * LAMPORTS_PER_SOL)}
              </span>
            </div>
          )}

          {resolved && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">
                {hasWon ? 'Winnings:' : 'Result:'}
              </span>
              {hasWon ? (
                <span className="font-medium text-success-600 dark:text-success-400">
                  {formatCurrency(potentialPayoutAmount * LAMPORTS_PER_SOL)}
                </span>
              ) : (
                <span className="font-medium text-error-600 dark:text-error-400">
                  No winnings
                </span>
              )}
            </div>
          )}
        </div>

        {resolved && hasWon && (
          <Button
            variant="primary"
            fullWidth
            isLoading={isClaiming}
            onClick={handleClaimWinnings}
          >
            Claim Winnings
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserPositionCard;