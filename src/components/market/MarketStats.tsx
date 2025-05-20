import { ChevronUp, ChevronDown, TrendingUp } from 'lucide-react';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency, oddsToPercentage } from '../../utils/format';

interface MarketStatsProps {
  market: MarketWithUserPosition;
}

const MarketStats = ({ market }: MarketStatsProps) => {
  const {
    outcome,
    totalYesAmount,
    totalNoAmount,
  } = market;

  // Convert big numbers to regular numbers
  const yesAmount = Number(totalYesAmount);
  const noAmount = Number(totalNoAmount);
  const totalAmount = yesAmount + noAmount;

  // Calculate odds with safety checks
  const yesPercentage = totalAmount > 0 ? yesAmount / totalAmount : 0;
  const noPercentage = totalAmount > 0 ? noAmount / totalAmount : 0;

  return (
    <div className="card">
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <h3 className="text-lg font-medium">Market Statistics</h3>
      </div>

      <div className="p-4">
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="mb-1 text-xs font-medium uppercase text-slate-500">Yes Pool</div>
            <div className="flex items-center">
              <ChevronUp className="mr-1 text-primary-500" size={18} />
              <span className="text-lg font-semibold">{formatCurrency(yesAmount)}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {oddsToPercentage(yesPercentage * 100)} odds
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="mb-1 text-xs font-medium uppercase text-slate-500">No Pool</div>
            <div className="flex items-center">
              <ChevronDown className="mr-1 text-error-500" size={18} />
              <span className="text-lg font-semibold">{formatCurrency(noAmount)}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {oddsToPercentage(noPercentage * 100)} odds
            </div>
          </div>

          <div className="col-span-2 rounded-lg bg-slate-50 p-3 md:col-span-1 dark:bg-slate-800">
            <div className="mb-1 text-xs font-medium uppercase text-slate-500">Total Liquidity</div>
            <div className="flex items-center">
              <TrendingUp className="mr-1 text-secondary-500" size={18} />
              <span className="text-lg font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {outcome ? `Outcome: ${outcome.toUpperCase()}` : 'Unresolved'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;