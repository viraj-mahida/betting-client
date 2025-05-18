import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { BN, web3, AnchorProvider } from '@coral-xyz/anchor';
import { getBettingProgram } from '../utils/anchor';

// Types that align with the Anchor contract
export enum Outcome {
  Undecided = 'Undecided',
  Yes = 'Yes',
  No = 'No'
}

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
  getMarketById: (id: string) => MarketWithUserPosition | undefined;
  createMarket: (provider: AnchorProvider, params: CreateMarketParams) => Promise<void>;
  placeBet: (provider: AnchorProvider, marketId: string, amount: number, outcome: 'Yes' | 'No') => Promise<void>;
  resolveMarket: (provider: AnchorProvider, marketId: string, outcome: 'Yes' | 'No') => Promise<void>;
  claimWinnings: (provider: AnchorProvider, marketId: string) => Promise<void>;
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
      const userWallet = provider.wallet.publicKey;
      
      // Transform to our expected format and calculate user positions
      const marketsWithPositions: MarketWithUserPosition[] = allMarkets.map(item => {
        const market = item.account;
        const publicKey = item.publicKey;  // Get the account address
        
        // Check if user has positions
        const userYesBet = market.yesBettors.find(
          bettor => bettor.bettor.equals(userWallet)
        );
        
        const userNoBet = market.noBettors.find(
          bettor => bettor.bettor.equals(userWallet)
        );
        
        let userPosition: UserPosition | undefined;
        
        if (userYesBet || userNoBet) {
          userPosition = {
            yesBets: userYesBet ? userYesBet.amount : new BN(0),
            noBets: userNoBet ? userNoBet.amount : new BN(0),
            totalStaked: new BN(0)
              .add(userYesBet ? userYesBet.amount : new BN(0))
              .add(userNoBet ? userNoBet.amount : new BN(0))
          };
        }

        console.log({allMarkets});
        console.log({marketsWithPositions});
        
        return {
          publicKey,
          creator: market.creator,
          question: market.question,
          resolved: market.resolved,
          outcome: market.outcome,
          totalYesAmount: market.totalYesAmount,
          totalNoAmount: market.totalNoAmount,
          yesBettors: market.yesBettors,
          noBettors: market.noBettors,
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

  getMarketById: (id: string) => {
    return get().markets.find(market => market.publicKey.toString() === id);
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

  placeBet: async (provider: AnchorProvider, marketId: string, amount: number, outcome: 'Yes' | 'No') => {
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
        .placeBet(outcomeEnum, new BN(amount))
        .accounts({
          market: new PublicKey(market.publicKey.toString()),
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