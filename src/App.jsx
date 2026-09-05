import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Calculators from './pages/Calculators';
import History from './pages/History';
import About from './pages/About';

// Calculator pages — lazy loaded so they don't affect initial bundle
const BasicCalculator     = lazy(() => import('./calculators/BasicCalculator'));
const ScientificCalculator= lazy(() => import('./calculators/ScientificCalculator'));
const GraphingCalculator  = lazy(() => import('./calculators/GraphingCalculator'));
const FinancialCalculator = lazy(() => import('./calculators/FinancialCalculator'));
const ProgrammerCalculator= lazy(() => import('./calculators/ProgrammerCalculator'));
const UnitConverter       = lazy(() => import('./calculators/UnitConverter'));

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Loading…
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 'var(--nav-height)' }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Main pages */}
              <Route path="/"            element={<Home />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/history"     element={<History />} />
              <Route path="/about"       element={<About />} />

              {/* Calculator routes */}
              <Route path="/calculators/basic"         element={<BasicCalculator />} />
              <Route path="/calculators/scientific"    element={<ScientificCalculator />} />
              <Route path="/calculators/graphing"      element={<GraphingCalculator />} />
              <Route path="/calculators/financial"     element={<FinancialCalculator />} />
              <Route path="/calculators/programmer"    element={<ProgrammerCalculator />} />
              <Route path="/calculators/unit-converter"element={<UnitConverter />} />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </HistoryProvider>
    </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '80vh', gap: '1rem', textAlign: 'center', padding: '2rem'
    }}>
      <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Page not found</h1>
      <p style={{ color: 'var(--text-secondary)' }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>Go home →</a>
    </div>
  );
}
