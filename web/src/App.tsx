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
import {
  Home,
  Dashboard,
  GAII,
  GAIIReport,
  Governance,
  Staking,
  Airdrop,
  Whitepaper,
  PrivacyPolicy,
  TermsOfService,
  Kindness,
  MeetupList,
  MeetupDetail,
  MeetupCreate,
  AIHub,
  Proposal,
  Tokenomics,
} from './pages';
import {
  AdminLayout,
  AdminDashboard,
  AdminPartners,
  AdminMeetups,
  AdminUsers,
} from './pages/admin';

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
                {/* Proposal Viewer (풀스크린, MainLayout 외부) */}
                <Route path="/proposals/:proposalId" element={<Proposal />} />

                {/* Admin Panel (풀스크린, MainLayout 외부) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="partners" element={<AdminPartners />} />
                  <Route path="meetups" element={<AdminMeetups />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>

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
                  {/* Kindness Protocol */}
                  <Route path="/kindness" element={<Kindness />} />
                  <Route path="/meetup" element={<MeetupList />} />
                  <Route path="/meetup/new" element={<MeetupCreate />} />
                  <Route path="/meetup/:id" element={<MeetupDetail />} />
                  {/* AI Hub */}
                  <Route path="/ai-hub" element={<AIHub />} />
                  {/* Tokenomics */}
                  <Route path="/tokenomics" element={<Tokenomics />} />
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
