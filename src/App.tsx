import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MarketPage from './pages/MarketPage';
import CreateMarketPage from './pages/CreateMarketPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { useMarketStore } from './stores/marketStore';

function App() {
  const { fetchMarkets } = useMarketStore();

  useEffect(() => {
    // Load initial data when the app starts
    fetchMarkets();
  }, [fetchMarkets]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="market/:id" element={<MarketPage />} />
        <Route path="create" element={<CreateMarketPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;