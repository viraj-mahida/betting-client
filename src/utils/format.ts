import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { format } from 'date-fns';

// Format a number with commas for thousands
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

// Format currency (USDC)
export const formatCurrency = (amount: number): string => {
  // Convert from lamports to SOL (1 SOL = 1,000,000,000 lamports)
  const solAmount = amount / LAMPORTS_PER_SOL;
  
  // Format with 9 decimal places
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    currency: 'SOL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 9,
  }).format(solAmount);
  
  // Remove trailing zeros after the decimal point
  return formatted.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
};

// Format a date to human readable format
export const formatDate = (date: Date | number): string => {
  return format(date, 'MMM d, yyyy');
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// Truncate an address or long string
export const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// Format odds to percentage
export const oddsToPercentage = (odds: number): string => {
  return `${(odds * 100).toFixed(1)}%`;
};

// Calculate potential payout based on bet amount and odds
export const calculatePayout = (betAmount: number, odds: number): number => {
  // For simplicity, treating odds as implied probability
  return betAmount / odds;
};