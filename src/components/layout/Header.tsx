import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LineChart, Home, Plus, Layout } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items with their paths and icons
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Explore', path: '/explore', icon: <LineChart size={18} /> },
    { name: 'Create Market', path: '/create', icon: <Plus size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Layout size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="mr-2 rounded-full bg-primary/10 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
            <span className="text-xl font-bold text-primary">BetSolana</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Wallet Connection */}
        <div className="flex items-center space-x-2">
          <span className='flex items-center space-x-1 text-sm font-medium transition-colors text-slate-700 dark:text-slate-300'>
            Devnet:
          </span>
          <WalletMultiButton />

          {/* Mobile menu button */}
          <button
            className="ml-2 rounded-md p-2 text-slate-700 md:hidden dark:text-slate-300"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white dark:bg-slate-900 md:hidden">
          <nav className="container mx-auto flex flex-col space-y-4 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 rounded-md p-3 text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;