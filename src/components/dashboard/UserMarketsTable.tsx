import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency, oddsToPercentage } from '../../utils/format';

interface UserMarketsTableProps {
  markets: MarketWithUserPosition[];
  emptyMessage?: string;
}

const UserMarketsTable = ({ markets, emptyMessage = 'No markets found.' }: UserMarketsTableProps) => {
  if (markets.length === 0) {
    return <p className="text-center text-slate-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:border-slate-700">
            <th className="px-4 py-3">Market</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Yes/No</th>
            <th className="px-4 py-3">Total Liquidity</th>
            <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {markets.map((market) => {
            const { publicKey, question, resolved, outcome, totalYesAmount, totalNoAmount } = market;
            
            // Calculate odds
            const yesPercentage = totalYesAmount / (totalYesAmount + totalNoAmount);
            const noPercentage = totalNoAmount / (totalYesAmount + totalNoAmount);

            return (
              <tr key={publicKey.toString()} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="max-w-xs px-4 py-3">
                  <div className="line-clamp-1 font-medium">{question}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="inline-flex items-center">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        resolved
                          ? 'bg-success-500'
                          : 'bg-primary-500'
                      } mr-2`}
                    />
                    <span className="text-sm capitalize">{resolved ? 'Resolved' : 'Open'}</span>
                    {resolved && outcome && (
                      <span className="ml-1 text-sm">({outcome.toUpperCase()})</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-success-600 dark:text-success-400">
                      {oddsToPercentage(yesPercentage)}
                    </span>
                    <span>/</span>
                    <span className="text-error-600 dark:text-error-400">
                      {oddsToPercentage(noPercentage)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{formatCurrency(Number(totalYesAmount) + Number(totalNoAmount))}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/market/${publicKey.toString()}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-600"
                  >
                    View <ChevronRight size={16} className="ml-1" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserMarketsTable;