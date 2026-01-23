/**
 * MainLayout Component - 공통 레이아웃 래퍼
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
