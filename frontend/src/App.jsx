import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './layouts/Layout';

// Pages
import Home from './pages/Home';
import WeatherAlerts from './pages/WeatherAlerts';
import EmergencyChecklist from './pages/EmergencyChecklist';
import TravelAdvisory from './pages/TravelAdvisory';
import About from './pages/About';
import NotFound from './pages/NotFound';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<WeatherAlerts />} />
            <Route path="/checklist" element={<EmergencyChecklist />} />
            <Route path="/travel" element={<TravelAdvisory />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
