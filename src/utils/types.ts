import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export type Outcome = 'Undecided' | 'Yes' | 'No';

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