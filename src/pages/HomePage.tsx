import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Wallet, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import MarketCard from '../components/market/MarketCard';
import { useMarketStore } from '../stores/marketStore';

const HomePage = () => {
  const { markets, isLoading } = useMarketStore();
  
  const topMarkets = [...markets].slice(0, 6);

  return (
    <div className="animate-fadeIn">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-16 md:py-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtMTJ2Nmg2di02aC02em0tMTIgMTJoNnYtNmgtNnY2em0wIDZoNnYtNmgtNnY2em0wLTEyaDZ2LTZoLTZ2NnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Predict. Bet. Win.
            </h1>
            <p className="mb-8 text-xl text-white/80">
              Create and participate in decentralized prediction markets powered by Solana. Place
              bets on binary outcomes and earn rewards for your insights.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:justify-center">
              <Link to="/explore">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-base font-semibold bg-secondary hover:bg-secondary-600"
                  rightIcon={<ArrowRight size={16} />}
                >
                  Explore Markets
                </Button>
              </Link>
              <Link to="/create">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base font-semibold text-white border-white/30 hover:bg-white/10"
                >
                  Create Market
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured markets section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">Featured Markets</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              Explore our most popular prediction markets and put your insights to the test.
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-slate-200 animate-pulse dark:bg-slate-800"></div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topMarkets.map((market) => (
                <MarketCard key={market.publicKey.toString()} market={market} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link to="/explore">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight size={16} />}
              >
                View All Markets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-slate-50 py-16 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              BetSolana makes it easy to participate in prediction markets on the Solana blockchain.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create Markets</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Anyone can create a prediction market by defining a question with a binary outcome
                and setting the timeframe.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900/50 dark:text-secondary-400">
                <Wallet size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Place Bets</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Use USDC to place bets on either "Yes" or "No" outcomes. The odds adjust in
                real-time based on the market's sentiment.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/50 dark:text-accent-400">
                <Zap size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Win Rewards</h3>
              <p className="text-slate-600 dark:text-slate-400">
                When the market resolves, winners receive their proportional share of the losing
                side's pool, plus their original bet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                The Future of Prediction Markets
              </h2>
              <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
                BetSolana leverages the speed and efficiency of Solana to deliver a prediction
                market platform that is transparent, fair, and accessible to everyone.
              </p>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                    <Shield size={14} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium">Secure and Transparent</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      All bets and outcomes are recorded on the Solana blockchain, ensuring
                      complete transparency and security.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                    <Zap size={14} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium">Lightning Fast</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Solana's high-performance blockchain enables near-instant transactions with
                      minimal fees.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400">
                    <Wallet size={14} />
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium">True Ownership</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your funds remain in your control until you place a bet, and winnings are
                      automatically distributed back to your wallet.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 p-1">
              <div className="rounded-md bg-white p-6 dark:bg-slate-900">
                <img
                  src="https://images.pexels.com/photos/7054528/pexels-photo-7054528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Prediction market visualization"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-white">
              Ready to Put Your Predictions to the Test?
            </h2>
            <p className="mb-6 text-lg text-white/80">
              Join BetSolana today and start participating in prediction markets or create your own.
            </p>
            <Link to="/explore">
              <Button
                variant="secondary"
                size="lg"
                className="text-base font-semibold bg-secondary hover:bg-secondary-600"
            >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;