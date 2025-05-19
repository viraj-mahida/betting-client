import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { AnchorProvider } from '@coral-xyz/anchor';

export type Outcome = 'undecided' | 'yes' | 'no';

export interface Market {
  creator: PublicKey;
  question: string;
  resolved: boolean;
  outcome: Outcome;
  totalYesAmount: BN;
  totalNoAmount: BN;
  yesBettors: Bettor[];
  noBettors: Bettor[];
}

export interface Bettor {
  bettor: PublicKey;
  amount: BN;
}

export interface UserPosition {
  yesBets: BN;
  noBets: BN;
  totalStaked: BN;
  potentialPayout?: BN;
}

export interface MarketWithUserPosition extends Market {
  publicKey: PublicKey;
  userPosition?: UserPosition;
}

export interface CreateMarketParams {
  question: string;
}

export interface MarketStore {
  markets: MarketWithUserPosition[];
  isLoading: boolean;
  error: string | null;
  fetchMarkets: (provider: AnchorProvider) => Promise<void>;
  getMarketById: (marketPublicKeyString: string) => MarketWithUserPosition | undefined;
  createMarket: (provider: AnchorProvider, params: CreateMarketParams) => Promise<void>;
  placeBet: (provider: AnchorProvider, marketPublicKeyString: string, amount: number, outcome: 'yes' | 'no') => Promise<void>;
  resolveMarket: (provider: AnchorProvider, marketPublicKeyString: string, outcome: 'yes' | 'no') => Promise<void>;
  claimWinnings: (provider: AnchorProvider, marketPublicKeyString: string) => Promise<void>;
  userCreatedMarkets: (userAddress: string) => MarketWithUserPosition[];
  filteredMarkets: (status?: 'open' | 'resolved') => MarketWithUserPosition[];
}

// Event types
export interface BetPlacedEvent {
  market: PublicKey;
  bettor: PublicKey;
  choice: Outcome;
  amount: BN;
}

export interface MarketCreatedEvent {
  market: PublicKey;
  creator: PublicKey;
  question: string;
}

export interface MarketResolvedEvent {
  market: PublicKey;
  outcome: Outcome;
}

export interface WinningsClaimedEvent {
  market: PublicKey;
  claimant: PublicKey;
  amount: BN;
}

export interface UserPosition {
  yesBets: BN;
  noBets: BN;
  totalStaked: BN;
  potentialPayout?: BN;
}

export interface MarketWithUserPosition extends Market {
  publicKey: PublicKey;
  userPosition?: UserPosition;
}

export interface CreateMarketParams {
  question: string;
}
