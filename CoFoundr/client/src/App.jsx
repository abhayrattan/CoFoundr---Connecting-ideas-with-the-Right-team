import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CommonLayout from './layouts/CommonLayout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Startups from './pages/Startups';
import StartupDetails from './pages/StartupDetails';
import CreateStartup from './pages/CreateStartup';
import EditStartup from './pages/EditStartup';
import MyStartups from './pages/MyStartups';
import MyRequests from './pages/MyRequests';
import StartupRequests from './pages/StartupRequests';
import TeamDetails from './pages/TeamDetails';
import Tasks from './pages/Tasks';
import TaskDetails from './pages/TaskDetails';
import CreateTask from './pages/CreateTask';
import Chat from './pages/Chat';
import ChatSelect from './pages/ChatSelect';
import MyTeams from './pages/MyTeams';
import Onboarding from './pages/Onboarding';
import SavedStartups from './pages/SavedStartups';
import ProtectedRoute from './components/ProtectedRoute';
import api from './services/api';
import AdminDashboard from './pages/AdminDashboard';

// Resource Pages
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CommunityGuidelines from './pages/CommunityGuidelines';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    api.get('/health')
      .then(res => setHealthStatus('Backend OK'))
      .catch(err => setHealthStatus('Backend Error'));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<CommonLayout />}>
        <Route index element={<Home healthStatus={healthStatus} />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="startups" element={<Startups />} />
        <Route path="startups/:id" element={<StartupDetails />} />
        <Route path="startups/:id/team" element={<TeamDetails />} />
        
        {/* Resource Routes */}
        <Route path="help" element={<HelpCenter />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="community" element={<CommunityGuidelines />} />
        <Route path="contact" element={<ContactUs />} />
        
        {/* Protected Routes */}
        <Route path="admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="startups/create" element={<ProtectedRoute><CreateStartup /></ProtectedRoute>} />
        <Route path="startups/:id/edit" element={<ProtectedRoute><EditStartup /></ProtectedRoute>} />
        <Route path="my-startups" element={<ProtectedRoute><MyStartups /></ProtectedRoute>} />
        
        <Route path="applications" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
        <Route path="saved-startups" element={<ProtectedRoute><SavedStartups /></ProtectedRoute>} />
        
        <Route path="startups/:id/requests" element={<ProtectedRoute><StartupRequests /></ProtectedRoute>} />
        <Route path="tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="tasks/create" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
        <Route path="tasks/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
        
        <Route path="teams" element={<ProtectedRoute><MyTeams /></ProtectedRoute>} />
        <Route path="chat" element={<ProtectedRoute><ChatSelect /></ProtectedRoute>} />
        <Route path="teams/:teamId/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        
        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
