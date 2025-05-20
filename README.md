# BetSolana - Solana Prediction Markets Platform

A decentralized prediction market platform built on Solana, enabling users to create and participate in binary outcome markets.

## Video Demo

Check out a quick demo of the main functionality:

[![BetSolana Demo](https://cdn.loom.com/sessions/thumbnails/ca6539388b9947b3a063d3f81312b45c-with-play.gif)](https://www.loom.com/share/ca6539388b9947b3a063d3f81312b45c?sid=261e84fc-3c55-48f8-8f89-a8de97ad9585)

## Project Structure

- `/src` - React frontend application
- `/anchor` - Solana smart contract using the Anchor framework
- `/public` - Static assets

## Features

- Create prediction markets with binary (Yes/No) outcomes
- Place bets on market outcomes
- Market resolution by creators
- Claim winnings after market resolution
- User dashboard to track positions and created markets

## Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Solana Web3.js
- Wallet Adapter for wallet integration

### Backend/Blockchain
- Solana Blockchain
- Anchor Framework
- SPL Token for handling funds

## Smart Contract

The core smart contract supports:

1. Platform initialization with configurable fees
2. Market creation with title, description, and date parameters
3. Betting on market outcomes
4. Market resolution by creators
5. Claiming winnings for successful bets

See the [Anchor README](./anchor/README.md) for details on the smart contract.

## Getting Started

### Prerequisites

- Node.js (v16+)
- Solana CLI and Anchor CLI
- Rust
- Phantom Wallet or other Solana wallet

### Development Setup

```bash
# Install dependencies for frontend
npm install

# Run frontend dev server
npm run dev

# Install dependencies for Anchor program
cd anchor
npm install

# Build the Anchor program
anchor build

# Deploy to localnet
anchor deploy

# Run tests
anchor test
```

## Deployment

The application can be deployed to:

1. Frontend: Any static hosting service (Vercel, Netlify, etc.)
2. Smart Contract: Solana devnet or mainnet

## License

This project is open source and available under the MIT license. 