import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { web3, AnchorProvider, BN } from '@coral-xyz/anchor';
import { getBettingProgram } from '../utils/anchor';
import { 
  MarketWithUserPosition, 
  CreateMarketParams,
  MarketStore,
  UserPosition
} from '../utils/types';

// Helper function to calculate user position
const calculateUserPosition = (
  userPublicKey: PublicKey,
  yesBettors: { bettor: PublicKey; amount: BN }[],
  noBettors: { bettor: PublicKey; amount: BN }[],
  totalYesAmount: BN,
  totalNoAmount: BN,
  resolved: boolean,
  outcome: 'undecided' | 'yes' | 'no'
): UserPosition | undefined => {
  // Find user's bets in both pools
  const yesBet = yesBettors.find(b => b.bettor.equals(userPublicKey))?.amount || new BN(0);
  const noBet = noBettors.find(b => b.bettor.equals(userPublicKey))?.amount || new BN(0);
  
  // If user has no bets, return undefined
  if (yesBet.eq(new BN(0)) && noBet.eq(new BN(0))) {
    return undefined;
  }

  const totalStaked = yesBet.add(noBet);
  
  // Calculate potential payout
  let potentialPayout: BN | undefined;
  
  if (!resolved) {
    // For open markets, calculate potential payout based on current odds
    if (yesBet.gt(new BN(0))) {
      // If user bet YES, potential payout is their share of the NO pool
      potentialPayout = yesBet.mul(totalNoAmount).div(totalYesAmount).add(yesBet);
    } else if (noBet.gt(new BN(0))) {
      // If user bet NO, potential payout is their share of the YES pool
      potentialPayout = noBet.mul(totalYesAmount).div(totalNoAmount).add(noBet);
    }
  } else {
    // For resolved markets, calculate actual winnings
    if ((outcome === 'yes' && yesBet.gt(new BN(0))) || 
        (outcome === 'no' && noBet.gt(new BN(0)))) {
      const winningBet = outcome === 'yes' ? yesBet : noBet;
      const winningPool = outcome === 'yes' ? totalYesAmount : totalNoAmount;
      const losingPool = outcome === 'yes' ? totalNoAmount : totalYesAmount;
      
      potentialPayout = winningBet.mul(losingPool).div(winningPool).add(winningBet);
    }
  }

  return {
    yesBets: yesBet,
    noBets: noBet,
    totalStaked,
    potentialPayout
  };
};

export const useMarketStore = create<MarketStore>((set, get) => ({
  markets: [],
  isLoading: false,
  error: null,

  fetchMarkets: async (provider: AnchorProvider) => {
    set({ isLoading: true, error: null });
    try {
      const program = getBettingProgram(provider);
      const userPublicKey = provider.wallet.publicKey;
      
      // Fetch all market accounts
      const allMarkets = await program.account.market.all();
      
      // Transform program accounts to MarketWithUserPosition format
      const marketsWithPositions: MarketWithUserPosition[] = allMarkets.map(account => {
        // Map the outcome object to the expected Outcome type string
        let outcomeValue: 'undecided' | 'yes' | 'no' = 'undecided';
        if (account.account.outcome.yes) {
          outcomeValue = 'yes';
        } else if (account.account.outcome.no) {
          outcomeValue = 'no';
        }
        
        // Calculate user position if wallet is connected
        const userPosition = userPublicKey ? calculateUserPosition(
          userPublicKey,
          account.account.yesBettors,
          account.account.noBettors,
          account.account.totalYesAmount,
          account.account.totalNoAmount,
          account.account.resolved,
          outcomeValue
        ) : undefined;
        
        return {
          publicKey: account.publicKey,
          creator: account.account.creator,
          question: account.account.question,
          resolved: account.account.resolved,
          outcome: outcomeValue,
          totalYesAmount: account.account.totalYesAmount,
          totalNoAmount: account.account.totalNoAmount,
          yesBettors: account.account.yesBettors,
          noBettors: account.account.noBettors,
          userPosition
        };
      });

      set({ markets: marketsWithPositions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch markets', 
        isLoading: false 
      });
    }
  },

  getMarketById: (publicKeyString: string) => {
    return get().markets.find(market => market.publicKey.toString() === publicKeyString);
  },

  createMarket: async (provider: AnchorProvider, params: CreateMarketParams) => {
    set({ isLoading: true, error: null });
    try {
      const program = getBettingProgram(provider);
      
      // Generate a new keypair for the market account
      const marketKeypair = web3.Keypair.generate();
      
      // Create the market
      await program.methods
        .createMarket(params.question)
        .accounts({
          market: marketKeypair.publicKey,
          creator: provider.wallet.publicKey
        })
        .signers([marketKeypair])
        .rpc();
      
      // Fetch markets after creation
      await get().fetchMarkets(provider);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create market', 
        isLoading: false 
      });
      throw error;
    }
  },

  placeBet: async (provider: AnchorProvider, marketPublicKeyString: string, amount: number, outcome: 'yes' | 'no') => {
    set({ isLoading: true, error: null });
    try {
      const program = getBettingProgram(provider);
      
      // Convert string outcome to enum value expected by the contract
      const outcomeEnum = { [outcome.toLowerCase()]: {} };
      
      // Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
      // const lamports = amount;
      // const lamports = amount * LAMPORTS_PER_SOL;
      
      // Send the transaction
      await program.methods
        .placeBet(outcomeEnum, amount)
        .accounts({
          market: new PublicKey(marketPublicKeyString),
          bettor: provider.wallet.publicKey
        })
        .rpc();
      
      // Refresh the markets list
      await get().fetchMarkets(provider);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to place bet', 
        isLoading: false 
      });
      throw error;
    }
  },

  resolveMarket: async (provider: AnchorProvider, marketId: string, outcome: 'yes' | 'no') => {
    set({ isLoading: true, error: null });
    try {
      const program = getBettingProgram(provider);
      
      const market = get().getMarketById(marketId);
      if (!market) {
        throw new Error("Market not found");
      }
      
      // Convert string outcome to enum value expected by the contract
      const outcomeEnum = { [outcome.toLowerCase()]: {} };
      
      // Send the transaction
      await program.methods
        .resolveMarket(outcomeEnum)
        .accounts({
          market: new PublicKey(market.publicKey.toString()),
          creator: provider.wallet.publicKey
        })
        .rpc();
      
      // Refresh the markets list
      await get().fetchMarkets(provider);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to resolve market', 
        isLoading: false 
      });
      throw error;
    }
  },

  claimWinnings: async (provider: AnchorProvider, marketId: string) => {
    set({ isLoading: true, error: null });
    try {
      const program = getBettingProgram(provider);
      
      const market = get().getMarketById(marketId);
      if (!market) {
        throw new Error("Market not found");
      }
      
      // Send the transaction
      await program.methods
        .claimWinnings()
        .accounts({
          market: new PublicKey(market.publicKey.toString()),
          claimant: provider.wallet.publicKey
        })
        .rpc();
      
      // Refresh the markets list
      await get().fetchMarkets(provider);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to claim winnings', 
        isLoading: false 
      });
      throw error;
    }
  },

  userCreatedMarkets: (userAddress: string) => {
    return get().markets.filter(market => 
      market.creator.toString() === userAddress
    );
  },

  filteredMarkets: (status) => {
    const markets = get().markets;
    if (!status) return markets;
    
    if (status === 'open') {
      return markets.filter(market => !market.resolved);
    } else if (status === 'resolved') {
      return markets.filter(market => market.resolved);
    }
    
    return markets;
  }
}));