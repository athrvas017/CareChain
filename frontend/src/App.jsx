import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home/Home';
import Campaigns from './pages/Campaigns/Campaigns';
import NewCampaigns from './pages/Campaigns/NewCampaigns';
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
import VerificationForm from './pages/Dashboard/VerificationForm';
import CreateRequest from './pages/Request/CreateRequest';

import CreateCampaign from './pages/CreateCampaign/CreateCampaign';
import Profile from './pages/Profile/Profile';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/new-campaigns" element={<NewCampaigns />} />
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

        {/* Dashboard Routes (Shared Layout) */}
        <Route element={<DashboardLayout />}>
          
          {/* Donor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
            <Route path="/dashboard/donor" element={<DashboardDonor />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
          </Route>

          {/* Beneficiary Routes */}
          <Route element={<ProtectedRoute allowedRoles={['beneficiary']} />}>
            <Route path="/dashboard/beneficiary" element={<DashboardBeneficiary />} />
            <Route path="/request-aid" element={<CreateRequest />} />
            {/* Beneficiaries can also create campaigns */}
            <Route path="/create-campaign" element={<CreateCampaign />} />
          </Route>

          {/* Field Worker */}
          <Route element={<ProtectedRoute allowedRoles={['field_worker']} />}>
            <Route path="/dashboard/field_worker" element={<DashboardFieldWorker />} />
            <Route path="/verify/:campaignId" element={<VerificationForm />} />
          </Route>

          {/* Fallback Dashboard Redirect */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
             {/* This route is just an auth check, will be handled by the logic inside ProtectedRoute if it matches no roles */}
          </Route>

          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
