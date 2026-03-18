import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import History from './pages/History';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function AppShell() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className={isLanding ? 'w-full' : 'max-w-lg mx-auto relative min-h-screen bg-[#0a0a0a]'}>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/app"      element={<Dashboard />} />
        <Route path="/scanner"  element={<Scanner />} />
        <Route path="/history"  element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy"  element={<Privacy />} />
        <Route path="/terms"    element={<Terms />} />
      </Routes>
      {!isLanding && <Navigation />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
      <Analytics />
    </AppProvider>
  );
}
