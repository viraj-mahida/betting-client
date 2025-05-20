import { useState } from 'react';
import { Check, X } from 'lucide-react';
import Button from '../common/Button';
import { MarketWithUserPosition } from '../../utils/types';
import { formatCurrency } from '../../utils/format';
import { useMarketStore } from '../../stores/marketStore';
import { useAnchorProvider, useWalletContext } from '../../contexts/WalletContext';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

interface BettingInterfaceProps {
  market: MarketWithUserPosition;
  onBetPlaced?: () => void;
}

const BettingInterface = ({ market, onBetPlaced }: BettingInterfaceProps) => {
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no' | null>("yes");
  const [betAmount, setBetAmount] = useState<number>(0.0001);
  const betLamports = betAmount * LAMPORTS_PER_SOL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { placeBet } = useMarketStore();
  const { isConnected } = useWalletContext();
  const provider = useAnchorProvider();

  // Skip if market is not open
  if (market.resolved) {
    return null;
  }

  const handleOutcomeSelect = (outcome: 'yes' | 'no') => {
    setSelectedOutcome(outcome);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBetAmount(isNaN(value) ? 0 : value);
  };

  const calculatePotentialProfit = () => {
    if (!selectedOutcome || betLamports <= 0) return 0;
    
    // Convert BN values to numbers for calculation
    const totalYesAmount = Number(market.totalYesAmount);
    const totalNoAmount = Number(market.totalNoAmount);
    
    // Safety check to avoid NaN results
    if (isNaN(totalYesAmount) || isNaN(totalNoAmount)) return 0;
    
    const relevantPool = (selectedOutcome === 'yes' ? 
      totalYesAmount : totalNoAmount) + betLamports;
    const otherPool = selectedOutcome === 'yes' ? 
      totalNoAmount : totalYesAmount;
    
    // Safety check for division by zero
    if (relevantPool <= 0) return 0;
    
    return (betLamports * otherPool) / relevantPool;
  };

  const handlePlaceBet = async () => {
    if (!selectedOutcome || betLamports <= 0 || !isConnected) return;
    
    setIsSubmitting(true);
    try {
      await placeBet(
        provider,
        market.publicKey.toString(), 
        new BN(betLamports), 
        selectedOutcome
      );
      setBetAmount(0.0001);
      // setSelectedOutcome("Yes");
      if (onBetPlaced) onBetPlaced();
    } catch (error) {
      console.error('Failed to place bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const potentialProfit = calculatePotentialProfit();
  const estimatedReturn = potentialProfit + betLamports;

  return (
    <div className="card p-4">
      <h3 className="mb-4 text-lg font-medium">Place Your Bet</h3>
      
      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          className={`flex items-center justify-center rounded-md border p-3 transition-colors ${
            selectedOutcome === 'yes'
              ? 'border-primary bg-primary-50 text-primary dark:border-primary-600 dark:bg-primary-900/20'
              : 'border-slate-200 hover:border-primary-200 hover:bg-primary-50 dark:border-slate-700 dark:hover:border-primary-900 dark:hover:bg-primary-900/10'
          }`}
          onClick={() => handleOutcomeSelect('yes')}
        >
          <Check size={18} className="mr-2" />
          <span className="font-medium">Yes</span>
        </button>

        <button
          className={`flex items-center justify-center rounded-md border p-3 transition-colors ${
            selectedOutcome === 'no'
              ? 'border-error-500 bg-error-50 text-error-600 dark:border-error-700 dark:bg-error-900/20'
              : 'border-slate-200 hover:border-error-200 hover:bg-error-50 dark:border-slate-700 dark:hover:border-error-900 dark:hover:bg-error-900/10'
          }`}
          onClick={() => handleOutcomeSelect('no')}
        >
          <X size={18} className="mr-2" />
          <span className="font-medium">No</span>
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="betAmount" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Bet Amount (SOL)
        </label>
        <input
          id="betAmount"
          type="number"
          min="0.0001"
          step="0.0001"
          value={betAmount}
          onChange={handleBetAmountChange}
          className="input w-full"
          placeholder="Enter amount in SOL"
        />
      </div>

      {selectedOutcome && betAmount > 0 && (
        <div className="mb-4 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Estimated return:</span>
            <span className="font-medium">{formatCurrency(estimatedReturn)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Potential profit:</span>
            <span className={`font-medium ${potentialProfit > 0 ? 'text-success-600' : 'text-error-600'}`}>
              {formatCurrency(potentialProfit)}
            </span>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        disabled={!selectedOutcome || betAmount <= 0 || !isConnected}
        onClick={handlePlaceBet}
      >
        {!isConnected
          ? 'Connect Wallet to Bet'
          : !selectedOutcome
          ? 'Select an Outcome'
          : `Place ${betAmount} SOL Bet on ${selectedOutcome.toUpperCase()}`}
      </Button>
    </div>
  );
};

export default BettingInterface;