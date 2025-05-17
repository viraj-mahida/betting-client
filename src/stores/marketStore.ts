import { create } from 'zustand';
import { Market, MarketWithUserPosition, CreateMarketParams } from '../utils/types';
import { mockMarkets } from '../utils/mockData';
import { getBettingProgram } from '../utils/anchor';
import { useAnchorProvider } from '../contexts/WalletContext';

interface MarketStore {
  markets: MarketWithUserPosition[];
  isLoading: boolean;
  error: string | null;
  fetchMarkets: () => Promise<void>;
  getMarketById: (id: string) => MarketWithUserPosition | undefined;
  createMarket: (params: CreateMarketParams) => Promise<Market>;
  placeBet: (marketId: string, amount: number, outcome: 'yes' | 'no') => Promise<void>;
  resolveMarket: (marketId: string, outcome: 'yes' | 'no') => Promise<void>;
  claimWinnings: (marketId: string) => Promise<void>;
  userCreatedMarkets: (userAddress: string) => MarketWithUserPosition[];
  filteredMarkets: (status?: 'open' | 'closed' | 'resolved') => MarketWithUserPosition[];
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  markets: [],
  isLoading: false,
  error: null,

  fetchMarkets: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/markets');
      // const data = await response.json();
      
      // Using mock data instead
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      set({ markets: mockMarkets, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch markets', 
        isLoading: false 
      });
    }
  },

  getMarketById: (id: string) => {
    return get().markets.find(market => market.id === id);
  },

  createMarket: async (params: CreateMarketParams) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time

      const provider = useAnchorProvider();

      const program = getBettingProgram(provider);

      const marketAccount = program.account.
      
      const newMarket: Market = {
        id: `market-${Date.now()}`,
        creator: 'DEMO_WALLET_ADDRESS', // Would be the connected wallet address
        title: params.title,
        description: params.description,
        closingDate: params.closingDate,
        resolutionDeadline: params.resolutionDeadline,
        yesPool: params.initialLiquidity || 0,
        noPool: params.initialLiquidity || 0,
        totalLiquidity: (params.initialLiquidity || 0) * 2,
        status: 'open',
        createdAt: new Date(),
      };
      
      set(state => ({
        markets: [...state.markets, newMarket as MarketWithUserPosition],
        isLoading: false
      }));
      
      return newMarket;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create market', 
        isLoading: false 
      });
      throw error;
    }
  },

  placeBet: async (marketId: string, amount: number, outcome: 'yes' | 'no') => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transaction time
      
      set(state => {
        const updatedMarkets = state.markets.map(market => {
          if (market.id === marketId) {
            // Update the market pools and user position
            const updatedMarket = { ...market };
            
            if (outcome === 'yes') {
              updatedMarket.yesPool += amount;
            } else {
              updatedMarket.noPool += amount;
            }
            
            updatedMarket.totalLiquidity = updatedMarket.yesPool + updatedMarket.noPool;
            
            // Update or create user position
            if (!updatedMarket.userPosition) {
              updatedMarket.userPosition = {
                yesBets: outcome === 'yes' ? amount : 0,
                noBets: outcome === 'no' ? amount : 0,
                totalStaked: amount,
                potentialPayout: 0, // Calculate this based on odds
              };
            } else {
              if (outcome === 'yes') {
                updatedMarket.userPosition.yesBets += amount;
              } else {
                updatedMarket.userPosition.noBets += amount;
              }
              updatedMarket.userPosition.totalStaked += amount;
            }
            
            // Calculate potential payout (simplified)
            const winPool = outcome === 'yes' ? updatedMarket.yesPool : updatedMarket.noPool;
            const losePool = outcome === 'yes' ? updatedMarket.noPool : updatedMarket.yesPool;
            const userBet = outcome === 'yes' ? updatedMarket.userPosition.yesBets : updatedMarket.userPosition.noBets;
            
            // Payout formula: (User's bet / Total winning pool) * Total losing pool + User's original bet
            // Apply 1% platform fee
            const potentialPayout = (userBet / winPool) * losePool * 0.99 + userBet;
            updatedMarket.userPosition.potentialPayout = potentialPayout;
            
            return updatedMarket;
          }
          return market;
        });
        
        return { markets: updatedMarkets, isLoading: false };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to place bet', 
        isLoading: false 
      });
      throw error;
    }
  },

  resolveMarket: async (marketId: string, outcome: 'yes' | 'no') => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction time
      
      set(state => {
        const updatedMarkets = state.markets.map(market => {
          if (market.id === marketId) {
            return {
              ...market,
              status: 'resolved',
              outcome
            };
          }
          return market;
        });
        
        return { markets: updatedMarkets, isLoading: false };
      });
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
      // In a real app, this would be a blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate transaction time
      
      // In a real implementation, this would transfer tokens to the user's wallet
      // and update their position data on-chain
      
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
    return get().markets.filter(market => market.creator === userAddress);
  },

  filteredMarkets: (status) => {
    const markets = get().markets;
    if (!status) return markets;
    return markets.filter(market => market.status === status);
  }
}));