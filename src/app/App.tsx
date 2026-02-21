import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ShopPage } from './pages/ShopPage';
import { ReservationPage } from './pages/ReservationPage';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashFading, setIsSplashFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsSplashFading(true);
    }, 1500);

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/boutique" element={<ShopPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
            </Routes>
          </main>

          <Footer />

          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
            }}
          />
        </div>
      </BrowserRouter>

      {showSplash && <SplashScreen isFading={isSplashFading} />}
    </>
  );
}

export default App;
