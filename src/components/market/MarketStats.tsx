import { ChevronUp, ChevronDown, Users, TrendingUp, CalendarClock } from 'lucide-react';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency, formatDateTime, oddsToPercentage } from '../../utils/format';

interface MarketStatsProps {
  market: MarketWithUserPosition;
}

const MarketStats = ({ market }: MarketStatsProps) => {
  const {
    yesPool,
    noPool,
    totalLiquidity,
    closingDate,
    resolutionDeadline,
    status,
    outcome,
  } = market;

  // Calculate odds
  const yesPercentage = yesPool / totalLiquidity;
  const noPercentage = noPool / totalLiquidity;

  // Format dates
  const closingDateFormatted = formatDateTime(closingDate);
  const resolutionDeadlineFormatted = formatDateTime(resolutionDeadline);

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
              <span className="text-lg font-semibold">{formatCurrency(yesPool)}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {oddsToPercentage(yesPercentage)} odds
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="mb-1 text-xs font-medium uppercase text-slate-500">No Pool</div>
            <div className="flex items-center">
              <ChevronDown className="mr-1 text-error-500" size={18} />
              <span className="text-lg font-semibold">{formatCurrency(noPool)}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {oddsToPercentage(noPercentage)} odds
            </div>
          </div>

          <div className="col-span-2 rounded-lg bg-slate-50 p-3 md:col-span-1 dark:bg-slate-800">
            <div className="mb-1 text-xs font-medium uppercase text-slate-500">Total Liquidity</div>
            <div className="flex items-center">
              <TrendingUp className="mr-1 text-secondary-500" size={18} />
              <span className="text-lg font-semibold">{formatCurrency(totalLiquidity)}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {status === 'resolved' ? `Outcome: ${outcome?.toUpperCase()}` : 'Currently in play'}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
            <div className="flex items-center">
              <CalendarClock size={16} className="mr-2 text-slate-400" />
              <span className="text-sm font-medium">Betting closes at</span>
            </div>
            <div className="text-right text-sm">{closingDateFormatted}</div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <CalendarClock size={16} className="mr-2 text-slate-400" />
              <span className="text-sm font-medium">Resolution deadline</span>
            </div>
            <div className="text-right text-sm">{resolutionDeadlineFormatted}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;