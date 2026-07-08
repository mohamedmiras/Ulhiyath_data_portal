import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';

import { MemberDashboard } from './pages/MemberDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminMembers } from './pages/AdminMembers';
import { AdminVerification } from './pages/AdminVerification';
import { MemberProfile } from './pages/MemberProfile';
import { Settings } from './pages/Settings';
import { MyProfile } from './pages/MyProfile';

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, userData } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  
  if (adminOnly && userData?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function MainApp() {
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={isAdmin ? <AdminDashboard /> : <MemberDashboard />} />
          <Route path="payments" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
          <Route path="admin/members" element={<ProtectedRoute adminOnly><AdminMembers /></ProtectedRoute>} />
          <Route path="admin/members/:id" element={<ProtectedRoute adminOnly><MemberProfile /></ProtectedRoute>} />
          <Route path="admin/verification" element={<ProtectedRoute adminOnly><AdminVerification /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

import { DataProvider } from './contexts/DataContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
