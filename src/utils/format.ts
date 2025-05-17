import { format, formatDistance } from 'date-fns';

// Format a number with commas for thousands
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

// Format currency (USDC)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format a date to human readable format
export const formatDate = (date: Date | number): string => {
  return format(date, 'MMM d, yyyy');
};

// Format a date with time
export const formatDateTime = (date: Date | number): string => {
  return format(date, 'MMM d, yyyy h:mm a');
};

// Get time remaining in readable format
export const getTimeRemaining = (targetDate: Date | number): string => {
  return formatDistance(new Date(targetDate), new Date(), { addSuffix: true });
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