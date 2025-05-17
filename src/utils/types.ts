export interface Market {
  id: string;
  creator: string;
  title: string;
  description: string;
  closingDate: Date;
  resolutionDeadline: Date;
  yesPool: number;
  noPool: number;
  totalLiquidity: number;
  status: 'open' | 'closed' | 'resolved';
  outcome?: 'yes' | 'no';
  createdAt: Date;
}

export interface Bet {
  id: string;
  marketId: string;
  user: string;
  amount: number;
  outcome: 'yes' | 'no';
  timestamp: Date;
  claimed: boolean;
  payout?: number;
}

export interface UserPosition {
  marketId: string;
  marketTitle: string;
  bets: Bet[];
  totalStaked: number;
  potentialPayout: number;
}

export interface MarketWithUserPosition extends Market {
  userPosition?: {
    yesBets: number;
    noBets: number;
    totalStaked: number;
    potentialPayout: number;
  };
}

export interface CreateMarketParams {
  title: string;
  description: string;
  closingDate: Date;
  resolutionDeadline: Date;
  initialLiquidity?: number;
}