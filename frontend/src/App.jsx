import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home/Home';
import Campaigns from './pages/Campaigns/Campaigns';
import CampaignDetail from './pages/CampaignDetail/CampaignDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import Donate from './pages/Donate/Donate';
import NotFound from './pages/NotFound/NotFound';

// Dashboard Pages
import DashboardDonor from './pages/Dashboard/DashboardDonor';
import DashboardAdmin from './pages/Dashboard/DashboardAdmin';
import DashboardFieldWorker from './pages/Dashboard/DashboardFieldWorker';
import DashboardBeneficiary from './pages/Dashboard/DashboardBeneficiary';

import CreateCampaign from './pages/CreateCampaign/CreateCampaign';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/donate/:id" element={<Donate />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}

        {/* Donor */}
        <Route element={<DashboardLayout role="donor" />}>
          <Route path="/dashboard/donor" element={<DashboardDonor />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route element={<DashboardLayout role="admin" />}>
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
        </Route>

        {/* Field Worker */}
        <Route element={<DashboardLayout role="field_worker" />}>
          <Route path="/dashboard/field_worker" element={<DashboardFieldWorker />} />
        </Route>

        {/* Beneficiary */}
        <Route element={<DashboardLayout role="beneficiary" />}>
          <Route path="/dashboard/beneficiary" element={<DashboardBeneficiary />} />
        </Route>

        {/* Generic Dashboard Redirect -> Donor for demo purposes */}
        <Route element={<DashboardLayout role="donor" />}>
          <Route path="/dashboard" element={<DashboardDonor />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
