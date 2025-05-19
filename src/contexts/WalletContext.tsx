import { FC, useMemo, ReactNode } from 'react';
import {
  AnchorWallet,
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Commitment } from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';
import { AnchorProvider } from '@coral-xyz/anchor';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // For demo, we're using devnet. Change to mainnet-beta for production.
  // const endpoint = "http://127.0.0.1:8899";
  const endpoint = "https://api.devnet.solana.com";
  
  const config = {
    commitment: "confirmed" as Commitment,
    confirmTransactionInitialTimeout: 60000
  };
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={config}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Export a custom hook for accessing wallet data
export const useWalletContext = () => {
  const wallet = useWallet();
  return {
    ...wallet,
    isConnected: !!wallet.connected,
    publicKey: wallet.publicKey?.toString(),
    connected: wallet.connected
  };
};

export function useAnchorProvider(){
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
    maxRetries: 3,
    skipPreflight: false
  })
}