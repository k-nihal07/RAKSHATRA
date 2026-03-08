import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase'; // Ensure this path matches your firebase.js location

// Components & Layout
import Layout from './components/Layout';

// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import TravelerDashboard from './pages/TravelerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import TripPlanner from './pages/TripPlanner';
import RouteRecommendation from './pages/RouteRecommendation';
import NearbyTransport from './pages/NearbyTransport';
import Hotels from './pages/Hotels';
import PlacesToExplore from './pages/PlacesToExplore';
import SOS from './pages/SOS';
import VolunteerReg from './pages/VolunteerReg';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import ProviderProfile from './pages/ProviderProfile';
import Feedbacks from './pages/Feedbacks';
import History from './pages/History';

// --- PROTECTED ROUTE COMPONENT ---
// This checks if a user is logged in. If not, it sends them to /login
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Wrapped in ProtectedRoute and Layout */}
        <Route path="/traveler" element={
          <ProtectedRoute>
            <Layout><TravelerDashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/provider" element={
          <ProtectedRoute>
            <Layout><ProviderDashboard /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/planner" element={
          <ProtectedRoute>
            <Layout><TripPlanner /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/routes" element={
          <ProtectedRoute>
            <Layout><RouteRecommendation /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/transport" element={
          <ProtectedRoute>
            <Layout><NearbyTransport /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/hotels" element={
          <ProtectedRoute>
            <Layout><Hotels /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/explore" element={
          <ProtectedRoute>
            <Layout><PlacesToExplore /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/volunteer" element={
          <ProtectedRoute>
            <Layout><VolunteerReg /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/rewards" element={
          <ProtectedRoute>
            <Layout><Rewards /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/provider-profile" element={
          <ProtectedRoute>
            <Layout><ProviderProfile /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/feedbacks" element={
          <ProtectedRoute>
            <Layout><Feedbacks /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <Layout><History /></Layout>
          </ProtectedRoute>
        } />

        {/* SOS Path */}
        <Route path="/sos" element={
          <ProtectedRoute>
            <Layout><SOS /></Layout>
          </ProtectedRoute>
        } />

        {/* Catch-all: Redirect unknown URLs to Splash or Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}