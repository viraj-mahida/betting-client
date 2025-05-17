import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { WalletContextProvider } from './contexts/WalletContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </BrowserRouter>
  </StrictMode>
);