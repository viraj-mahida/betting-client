import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <div className="mr-2 rounded-full bg-primary/10 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"></path>
                  <path d="M8 9v7"></path>
                  <path d="M16 9v7"></path>
                  <path d="M12 12V9"></path>
                  <path d="M12 12v4"></path>
                </svg>
              </div>
              <span className="text-lg font-bold text-primary">BetSolana</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-600 dark:text-slate-400">
              A decentralized prediction market platform built on Solana. Create markets, place
              bets, and win rewards.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Explore Markets
                </Link>
              </li>
              <li>
                <Link
                  to="/create"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Create Market
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Source Code */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Source Code
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/viraj-mahida/betting-client"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                  target="_blank"
                >
                  Client
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/viraj-mahida"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                  target="_blank"
                >
                  Contract
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Connect
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://drive.google.com/file/d/14IplBZob4J2vH1ejRZkxUicjmGqR5Bl-/view"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                  target="_blank"
                >
                  Resume
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/virajmahida"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                  target="_blank"
                >
                  X/Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/viraj-mahida/betting-contract"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                  target="_blank"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/viraj-mahida"
                  className="text-slate-600 transition hover:text-primary dark:text-slate-400"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-xs text-slate-600 dark:text-slate-400">
            &copy; {new Date().getFullYear()} BetSolana. All rights reserved. Built on Solana.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;