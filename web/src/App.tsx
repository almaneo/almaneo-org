/**
 * AlmaNEO App - Main Router Configuration
 */

import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { WalletProvider } from './components/wallet';
import { KindnessModeProvider } from './contexts';
import { MainLayout } from './components/layout';
import { Home, Dashboard, GAII, GAIIReport, Governance, Staking, Airdrop, Whitepaper, PrivacyPolicy, TermsOfService } from './pages';

// Loading component for i18n
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-neos-blue/30 border-t-neos-blue rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<LoadingFallback />}>
        <KindnessModeProvider>
          <WalletProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/gaii" element={<GAII />} />
                  <Route path="/gaii-report" element={<GAIIReport />} />
                  <Route path="/governance" element={<Governance />} />
                  <Route path="/staking" element={<Staking />} />
                  <Route path="/airdrop" element={<Airdrop />} />
                  <Route path="/whitepaper" element={<Whitepaper />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </WalletProvider>
        </KindnessModeProvider>
      </Suspense>
    </I18nextProvider>
  );
}

export default App;
