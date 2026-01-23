import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Web3Provider } from './contexts/Web3Context';
import { PaymentProvider } from './contexts/PaymentContext';
import { BiconomyProvider } from './contexts/BiconomyContext';
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import Auctions from './pages/Auctions';
import MyNFTs from './pages/MyNFTs';
import NFTDetail from './pages/NFTDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import MintNFT from './pages/admin/MintNFT';
import CollectionManagement from './pages/admin/CollectionManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import MarketplaceManagement from './pages/admin/MarketplaceManagement';
import AdminSettings from './pages/admin/AdminSettings';
import HeroSettings from './pages/admin/HeroSettings';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Web3Provider>
        <BiconomyProvider>
          <PaymentProvider>
            <Router>
          <Routes>
            {/* Public Routes with Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/my-nfts" element={<MyNFTs />} />
              <Route path="/nft/:contractAddress/:tokenId" element={<NFTDetail />} />
              <Route path="/collection/:id" element={<CollectionDetail />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="mint" element={<MintNFT />} />
              <Route path="collections" element={<CollectionManagement />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="marketplace" element={<MarketplaceManagement />} />
              <Route path="hero" element={<HeroSettings />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
          </Router>
          </PaymentProvider>
        </BiconomyProvider>
      </Web3Provider>
    </ThemeProvider>
  );
};

export default App;
