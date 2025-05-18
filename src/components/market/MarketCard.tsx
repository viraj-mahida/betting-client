import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { formatCurrency, oddsToPercentage } from '../../utils/format';
import { MarketWithUserPosition } from '../../utils/types';
import { cn } from '../../utils/cn';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

interface MarketCardProps {
  market: MarketWithUserPosition;
}

const MarketCard = ({ market }: MarketCardProps) => {
  const { question, outcome, totalYesAmount, totalNoAmount, resolved, publicKey } = market;

  // Calculate odds and percentages
  const yesAmount = totalYesAmount.toNumber();
  const noAmount = totalNoAmount.toNumber();
  const total = yesAmount + noAmount;
  
  const yesPercentage = total > 0 ? yesAmount / total : 0.5;
  const noPercentage = total > 0 ? noAmount / total : 0.5;

  const status = resolved ? 'resolved' : 'open';

  // Status indicator color
  const statusColor = {
    open: 'bg-success-500',
    resolved: 'bg-primary-500'
  };

  // Generate a market path using publicKey
  const marketPath = `/market/${publicKey.toString()}`;

  return (
    <Link to={marketPath} className="market-card">
      <div className="card overflow-hidden">
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn("mr-2 h-2 w-2 rounded-full", statusColor[status])} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {status} {outcome && outcome !== 'Undecided' && `• ${outcome}`}
              </span>
            </div>
          </div>

          <h3 className="mb-3 line-clamp-2 text-lg font-medium">{question}</h3>

          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Yes ({oddsToPercentage(yesPercentage)})</span>
              <span>No ({oddsToPercentage(noPercentage)})</span>
            </div>
            <div className="odds-bar mt-1">
              <div
                className="odds-bar-yes"
                style={{ width: `${yesPercentage * 100}%` }}
              />
              <div
                className="odds-bar-no"
                style={{ width: `${noPercentage * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <TrendingUp size={14} className="mr-1" />
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {market.userPosition && (
            <div className="mt-2 rounded-md bg-primary-50 p-2 text-xs dark:bg-primary-900/20">
              <p className="font-medium text-primary-700 dark:text-primary-300">
                Your position: {formatCurrency(market.userPosition.totalStaked.toNumber())}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;