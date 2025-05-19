import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Clock } from 'lucide-react';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency, oddsToPercentage } from '../../utils/format';
import Button from '../common/Button';
import { useWallet } from '@solana/wallet-adapter-react';

interface MarketHeaderProps {
  market: MarketWithUserPosition;
  onResolve?: (outcome: 'yes' | 'no') => void;
}

const MarketHeader = ({ market, onResolve }: MarketHeaderProps) => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { question, outcome, totalYesAmount, totalNoAmount } = market;

  // Calculate odds
  const yesPercentage = totalYesAmount / (totalYesAmount + totalNoAmount);
  const noPercentage = totalNoAmount / (totalYesAmount + totalNoAmount);

  const isCreator = publicKey && market.creator.toString() === publicKey.toString();

  const handleResolve = (outcome: 'yes' | 'no') => {
    if (onResolve) onResolve(outcome);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-lg">
      <div className="p-6">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to markets
        </button>

        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            {!market.resolved ? (
              <div className="mr-2 flex items-center rounded-full bg-success-500 px-2 py-0.5 text-xs font-medium">
                <Clock size={12} className="mr-1" />
                <span>Open for betting</span>
              </div>
            ) : (
              <div className="mr-2 flex items-center rounded-full bg-primary-300 px-2 py-0.5 text-xs font-medium text-primary-900">
                <Check size={12} className="mr-1" />
                <span>Resolved: {outcome?.toUpperCase()}</span>
              </div>
            )}
          </div>

          {!market.resolved && isCreator && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleResolve('yes')}
                className="bg-success-500 hover:bg-success-600"
                leftIcon={<Check size={14} />}
              >
                Resolve YES
              </Button>
              <Button
                size="sm"
                onClick={() => handleResolve('no')}
                className="bg-error-500 hover:bg-error-600"
                leftIcon={<X size={14} />}
              >
                Resolve NO
              </Button>
            </div>
          )}
        </div>

        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{question}</h1>

        <div className="overflow-hidden rounded-lg bg-white/10 backdrop-blur">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-1 flex-col border-b border-white/10 p-4 md:border-b-0 md:border-r">
              <div className="mb-1 flex items-center">
                <Check size={18} className="mr-2 text-success-300" />
                <span className="font-medium">YES</span>
                <span className="ml-auto text-sm">{isNaN(yesPercentage) ? '--%' : oddsToPercentage(yesPercentage)}</span>
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-bold">{formatCurrency(totalYesAmount)}</span>
                <span className="ml-1 text-sm text-white/70">SOL</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-1 flex items-center">
                <X size={18} className="mr-2 text-error-300" />
                <span className="font-medium">NO</span>
                <span className="ml-auto text-sm">{isNaN(noPercentage) ? '--%' : oddsToPercentage(noPercentage)}</span>
              </div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-bold">{formatCurrency(totalNoAmount)}</span>
                <span className="ml-1 text-sm text-white/70">SOL</span>
              </div>
            </div>
          </div>

          <div className="flex h-2 w-full">
            <div
              className="bg-success-400 transition-all"
              style={{ width: `${yesPercentage * 100}%` }}
            ></div>
            <div
              className="bg-error-400 transition-all"
              style={{ width: `${noPercentage * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketHeader;