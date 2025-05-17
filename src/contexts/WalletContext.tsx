import { FC, useMemo, ReactNode } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  AnchorWallet,
  ConnectionProvider,
  WalletProvider,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';
import { AnchorProvider } from '@coral-xyz/anchor';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // For demo, we're using devnet. Change to mainnet-beta for production.
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
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
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: "confirmed"
  })
}