import { Link } from 'react-router-dom';
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency, formatDate, getTimeRemaining, oddsToPercentage } from '../../utils/format';
import { MarketWithUserPosition } from '../../utils/types';
import { cn } from '../../utils/cn';

interface MarketCardProps {
  market: MarketWithUserPosition;
}

const MarketCard = ({ market }: MarketCardProps) => {
  const { id, title, yesPool, noPool, totalLiquidity, closingDate, status, outcome } = market;

  // Calculate odds and percentages
  const yesPercentage = yesPool / totalLiquidity;
  const noPercentage = noPool / totalLiquidity;

  // Status indicator color
  const statusColor = {
    open: 'bg-success-500',
    closed: 'bg-warning-500',
    resolved: 'bg-primary-500'
  };

  return (
    <Link to={`/market/${id}`} className="market-card">
      <div className="card overflow-hidden">
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div className={cn("mr-2 h-2 w-2 rounded-full", statusColor[status])} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {status} {outcome && `• ${outcome.toUpperCase()}`}
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-500">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(closingDate)}</span>
            </div>
          </div>

          <h3 className="mb-3 line-clamp-2 text-lg font-medium">{title}</h3>

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
              <span>{formatCurrency(totalLiquidity)}</span>
            </div>
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Clock size={14} className="mr-1" />
              <span>{getTimeRemaining(closingDate)}</span>
            </div>
          </div>

          {market.userPosition && (
            <div className="mt-2 rounded-md bg-primary-50 p-2 text-xs dark:bg-primary-900/20">
              <p className="font-medium text-primary-700 dark:text-primary-300">
                Your position: {formatCurrency(market.userPosition.totalStaked)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;