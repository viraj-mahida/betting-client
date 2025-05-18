import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { BN, web3, AnchorProvider } from '@coral-xyz/anchor';
import { getBettingProgram } from '../utils/anchor';

// Types that align with the Anchor contract
export type Outcome = 'Undecided' | 'Yes' | 'No';

export type Bettor = {
  bettor: PublicKey;
  amount: BN;
}

export type Market = {
  creator: PublicKey;
  question: string;
  resolved: boolean;
  outcome: Outcome;
  totalYesAmount: BN;
  totalNoAmount: BN;
  yesBettors: Bettor[];
  noBettors: Bettor[];
}

export type CreateMarketParams = {
  question: string;
}

export type UserPosition = {
  yesBets: BN;
  noBets: BN;
  totalStaked: BN;
}

export type MarketWithUserPosition = Market & {
  publicKey: PublicKey;
  userPosition?: UserPosition;
}

interface MarketStore {
  markets: MarketWithUserPosition[];
  isLoading: boolean;
  error: string | null;
  fetchMarkets: (provider: AnchorProvider) => Promise<void>;
  getMarketById: (marketPublicKeyString: string) => MarketWithUserPosition | undefined;
  createMarket: (provider: AnchorProvider, params: CreateMarketParams) => Promise<void>;
  placeBet: (provider: AnchorProvider, marketPublicKeyString: string, amount: number, outcome: 'Yes' | 'No') => Promise<void>;
  resolveMarket: (provider: AnchorProvider, marketPublicKeyString: string, outcome: 'Yes' | 'No') => Promise<void>;
  claimWinnings: (provider: AnchorProvider, marketPublicKeyString: string) => Promise<void>;
  userCreatedMarkets: (userAddress: string) => MarketWithUserPosition[];
  filteredMarkets: (status?: 'open' | 'resolved') => MarketWithUserPosition[];
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  markets: [],
  isLoading: false,
  error: null,

  fetchMarkets: async (provider: AnchorProvider) => {
    set({ isLoading: true, error: null });
    try {
      const program = getBettingProgram(provider);
      
      // Fetch all market accounts
      const allMarkets = await program.account.market.all();

      console.log({allMarkets});
      
      // Transform program accounts to MarketWithUserPosition format
      const marketsWithPositions: MarketWithUserPosition[] = allMarkets.map(account => {
        // Map the outcome object to the expected Outcome type string
        let outcomeValue: 'Undecided' | 'Yes' | 'No' = 'Undecided';
        if (account.account.outcome.yes) {
          outcomeValue = 'Yes';
        } else if (account.account.outcome.no) {
          outcomeValue = 'No';
        }
        
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
          // userPosition: undefined
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
    console.log({publicKeyString});
    console.log(get().markets);
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

  placeBet: async (provider: AnchorProvider, marketPublicKeyString: string, amount: number, outcome: 'Yes' | 'No') => {
    set({ isLoading: true, error: null });
    try {
      const program = getBettingProgram(provider);
      
      // Convert string outcome to enum value expected by the contract
      const outcomeEnum = { [outcome.toLowerCase()]: {} };
      
      // Send the transaction
      await program.methods
        .placeBet(outcomeEnum, new BN(amount))
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

  resolveMarket: async (provider: AnchorProvider, marketId: string, outcome: 'Yes' | 'No') => {
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