import { MarketWithUserPosition } from './types';

// Helper to create dates relative to now
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Mock wallet address for demo
const DEMO_WALLET = 'DEMO_WALLET_ADDRESS';

// Create mock markets data
export const mockMarkets: MarketWithUserPosition[] = [
  {
    id: 'market-1',
    creator: DEMO_WALLET,
    title: 'Will BTC reach $100k in 2025?',
    description: 'This market resolves to YES if the price of Bitcoin reaches or exceeds $100,000 USD at any point during the 2025 calendar year according to Coinbase price.',
    closingDate: daysFromNow(30),
    resolutionDeadline: daysFromNow(365),
    yesPool: 15000,
    noPool: 12000,
    totalLiquidity: 27000,
    status: 'open',
    createdAt: new Date('2024-06-01'),
    userPosition: {
      yesBets: 500,
      noBets: 0,
      totalStaked: 500,
      potentialPayout: 916.67,
    },
  },
  {
    id: 'market-2',
    creator: 'other-creator',
    title: 'Will Ethereum ETFs be approved in 2024?',
    description: 'This market resolves to YES if the SEC approves at least one spot Ethereum ETF before December 31, 2024.',
    closingDate: daysFromNow(45),
    resolutionDeadline: daysFromNow(180),
    yesPool: 8000,
    noPool: 25000,
    totalLiquidity: 33000,
    status: 'open',
    createdAt: new Date('2024-06-15'),
    userPosition: {
      yesBets: 0,
      noBets: 1000,
      totalStaked: 1000,
      potentialPayout: 1320,
    },
  },
  {
    id: 'market-3',
    creator: 'other-creator',
    title: 'Will Solana reach 5,000 TPS sustained in 2024?',
    description: 'This market resolves to YES if Solana achieves and maintains 5,000+ transactions per second for at least 24 consecutive hours in 2024.',
    closingDate: daysFromNow(60),
    resolutionDeadline: daysFromNow(180),
    yesPool: 18000,
    noPool: 7000,
    totalLiquidity: 25000,
    status: 'open',
    createdAt: new Date('2024-05-20'),
  },
  {
    id: 'market-4',
    creator: DEMO_WALLET,
    title: 'Will the Fed cut rates in September 2024?',
    description: 'This market resolves to YES if the Federal Reserve announces a rate cut at their September 2024 FOMC meeting.',
    closingDate: daysFromNow(75),
    resolutionDeadline: daysFromNow(90),
    yesPool: 30000,
    noPool: 18000,
    totalLiquidity: 48000,
    status: 'open',
    createdAt: new Date('2024-05-10'),
  },
  {
    id: 'market-5',
    creator: 'other-creator',
    title: 'Will Biden win the 2024 US Presidential Election?',
    description: 'This market resolves to YES if Joe Biden wins the 2024 US Presidential Election.',
    closingDate: daysFromNow(120),
    resolutionDeadline: daysFromNow(150),
    yesPool: 75000,
    noPool: 85000,
    totalLiquidity: 160000,
    status: 'open',
    createdAt: new Date('2024-04-15'),
  },
  {
    id: 'market-6',
    creator: 'other-creator',
    title: 'Will global crypto market cap exceed $5T in 2024?',
    description: 'This market resolves to YES if the total cryptocurrency market capitalization exceeds $5 trillion USD at any point in 2024 according to CoinMarketCap.',
    closingDate: daysFromNow(90),
    resolutionDeadline: daysFromNow(180),
    yesPool: 22000,
    noPool: 18000,
    totalLiquidity: 40000,
    status: 'open',
    createdAt: new Date('2024-06-05'),
  },
  {
    id: 'market-7',
    creator: DEMO_WALLET,
    title: 'Will Arbitrum TVL surpass $5B in Q3 2024?',
    description: 'This market resolves to YES if Arbitrum total value locked (TVL) exceeds $5 billion at any point during Q3 2024 according to DefiLlama.',
    closingDate: daysFromNow(60),
    resolutionDeadline: daysFromNow(100),
    yesPool: 12000,
    noPool: 8000,
    totalLiquidity: 20000,
    status: 'open',
    createdAt: new Date('2024-06-10'),
  },
  {
    id: 'market-8',
    creator: 'other-creator',
    title: 'Will NVIDIA stock close above $1,200 in 2024?',
    description: 'This market resolves to YES if NVIDIA (NVDA) stock price closes above $1,200 on any trading day in 2024.',
    closingDate: daysFromNow(150),
    resolutionDeadline: daysFromNow(180),
    yesPool: 35000,
    noPool: 25000,
    totalLiquidity: 60000,
    status: 'open',
    createdAt: new Date('2024-05-25'),
  },
  {
    id: 'market-9',
    creator: 'other-creator',
    title: 'Will OpenAI release AGI in 2024?',
    description: 'This market resolves to YES if OpenAI publicly announces the development of Artificial General Intelligence (AGI) in 2024.',
    closingDate: daysFromNow(120),
    resolutionDeadline: daysFromNow(180),
    yesPool: 5000,
    noPool: 45000,
    totalLiquidity: 50000,
    status: 'open',
    createdAt: new Date('2024-04-30'),
  },
  {
    id: 'market-10',
    creator: DEMO_WALLET,
    title: 'Will Meta launch their own AI chip in 2024?',
    description: 'This market resolves to YES if Meta Platforms Inc. launches their own custom AI chip in 2024.',
    closingDate: daysFromNow(40),
    resolutionDeadline: daysFromNow(180),
    yesPool: 15000,
    noPool: 10000,
    totalLiquidity: 25000,
    status: 'open',
    createdAt: new Date('2024-06-08'),
    outcome: 'yes',
  }
];

// Example of a resolved market
export const resolvedMarket: MarketWithUserPosition = {
  id: 'market-resolved-1',
  creator: 'other-creator',
  title: 'Will Bitcoin ETFs be approved in 2023?',
  description: 'This market resolves to YES if the SEC approves at least one spot Bitcoin ETF before December 31, 2023.',
  closingDate: new Date('2023-12-20'),
  resolutionDeadline: new Date('2024-01-10'),
  yesPool: 65000,
  noPool: 25000,
  totalLiquidity: 90000,
  status: 'resolved',
  outcome: 'yes',
  createdAt: new Date('2023-05-15'),
  userPosition: {
    yesBets: 1000,
    noBets: 0,
    totalStaked: 1000,
    potentialPayout: 1384.62,
  },
};

// Add to mock markets
mockMarkets.push(resolvedMarket);