import { create } from 'zustand';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { BN, web3 } from '@coral-xyz/anchor';
import { getBettingProgram } from '../utils/anchor';
import { useAnchorProvider } from '../contexts/WalletContext';

// Types that align with the Anchor contract
export type Outcome = 'Undecided' | 'Yes' | 'No';

export type Bettor = {
  bettor: PublicKey;
  amount: BN;
}

export type Market = {
  id: BN;
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
  userPosition?: UserPosition;
}

interface MarketStore {
  markets: MarketWithUserPosition[];
  bettingState: { authority: PublicKey; marketCount: BN } | null;
  isLoading: boolean;
  error: string | null;
  fetchMarkets: () => Promise<void>;
  fetchBettingState: () => Promise<void>;
  getMarketById: (id: string) => MarketWithUserPosition | undefined;
  createMarket: (params: CreateMarketParams) => Promise<void>;
  placeBet: (marketId: string, amount: number, outcome: 'Yes' | 'No') => Promise<void>;
  resolveMarket: (marketId: string, outcome: 'Yes' | 'No') => Promise<void>;
  claimWinnings: (marketId: string) => Promise<void>;
  userCreatedMarkets: (userAddress: string) => MarketWithUserPosition[];
  filteredMarkets: (status?: 'open' | 'resolved') => MarketWithUserPosition[];
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  markets: [],
  bettingState: null,
  isLoading: false,
  error: null,

  fetchBettingState: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = useAnchorProvider();
      const program = getBettingProgram(provider);
      
      // Fetch the betting state account
      // In actual implementation, you'd need to know the address of the betting state account
      // This is just a placeholder approach
      const [bettingStatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("betting_state")],
        program.programId
      );
      
      const bettingState = await program.account.bettingState.fetch(bettingStatePda);
      
      set({ 
        bettingState: {
          authority: bettingState.authority,
          marketCount: bettingState.marketCount
        },
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch betting state', 
        isLoading: false 
      });
    }
  },

  fetchMarkets: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = useAnchorProvider();
      const program = getBettingProgram(provider);
      
      // Fetch all market accounts
      const allMarkets = await program.account.market.all();
      const userWallet = provider.wallet.publicKey;
      
      // Transform to our expected format and calculate user positions
      const marketsWithPositions: MarketWithUserPosition[] = allMarkets.map(item => {
        const market = item.account;
        
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
        
        return {
          id: market.id,
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
    return get().markets.find(market => market.id.toString() === id);
  },

  createMarket: async (params: CreateMarketParams) => {
    set({ isLoading: true, error: null });
    try {
      const provider = useAnchorProvider();
      const program = getBettingProgram(provider);
      
      // Get the betting state account
      if (!get().bettingState) {
        await get().fetchBettingState();
      }
      
      const bettingState = get().bettingState;
      if (!bettingState) {
        throw new Error("Betting state not found");
      }
      
      // Get the betting state PDA
      const [bettingStatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("betting_state")],
        program.programId
      );
      
      // Calculate the PDA for the new market
      const [marketPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("market"),
          bettingState.marketCount.toBuffer('le', 8)
        ],
        program.programId
      );
      
      // Send the transaction
      await program.methods
        .createMarket(params.question)
        .accounts({
          bettingState: bettingStatePda,
          // market: marketPda,
          creator: provider.wallet.publicKey,
          // systemProgram: SystemProgram.programId
        })
        .rpc();
      
      // Refresh the markets list
      await get().fetchMarkets();
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create market', 
        isLoading: false 
      });
      throw error;
    }
  },

  placeBet: async (marketId: string, amount: number, outcome: 'Yes' | 'No') => {
    set({ isLoading: true, error: null });
    try {
      const provider = useAnchorProvider();
      const program = getBettingProgram(provider);
      
      const market = get().getMarketById(marketId);
      if (!market) {
        throw new Error("Market not found");
      }
      
      // Convert string outcome to enum value expected by the contract
      // In Anchor, enum variants are typically lowercase 
      const outcomeEnum = { [outcome.toLowerCase()]: {} };
      
      // Send the transaction
      await program.methods
        .placeBet(outcomeEnum, new BN(amount))
        .accounts({
          market: new PublicKey(market.id.toString()),
          bettor: provider.wallet.publicKey,
          // systemProgram: SystemProgram.programId
        })
        .rpc();
      
      // Refresh the markets list
      await get().fetchMarkets();
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to place bet', 
        isLoading: false 
      });
      throw error;
    }
  },

  resolveMarket: async (marketId: string, outcome: 'Yes' | 'No') => {
    set({ isLoading: true, error: null });
    try {
      const provider = useAnchorProvider();
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
          market: new PublicKey(market.id.toString()),
          creator: provider.wallet.publicKey
        })
        .rpc();
      
      // Refresh the markets list
      await get().fetchMarkets();
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to resolve market', 
        isLoading: false 
      });
      throw error;
    }
  },

  claimWinnings: async (marketId: string) => {
    set({ isLoading: true, error: null });
    try {
      const provider = useAnchorProvider();
      const program = getBettingProgram(provider);
      
      const market = get().getMarketById(marketId);
      if (!market) {
        throw new Error("Market not found");
      }
      
      // Send the transaction
      await program.methods
        .claimWinnings()
        .accounts({
          market: new PublicKey(market.id.toString()),
          claimant: provider.wallet.publicKey,
          // systemProgram: SystemProgram.programId
        })
        .rpc();
      
      // Refresh the markets list
      await get().fetchMarkets();
      
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