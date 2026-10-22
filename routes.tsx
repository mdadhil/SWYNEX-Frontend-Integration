import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CreateAd from './pages/CreateAd';
import TargetAudience from './pages/TargetAudience';
import BudgetBilling from './pages/BudgetBilling';
import SocialMedia from './pages/SocialMedia';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import { useApp } from './context/AppContext';

function ProtectedLayout({ element }: { element: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  
  // Strict check: must have token in storage OR be authenticated in context
  const hasToken = !!localStorage.getItem('token');
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      {element}
    </Layout>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '/dashboard',
    element: <ProtectedLayout element={<Dashboard />} />,
  },
  {
    path: '/campaigns',
    element: <ProtectedLayout element={<Campaigns />} />,
  },
  {
    path: '/create-ad',
    element: <ProtectedLayout element={<CreateAd />} />,
  },
  {
    path: '/target-audience',
    element: <ProtectedLayout element={<TargetAudience />} />,
  },
  {
    path: '/budget-billing',
    element: <ProtectedLayout element={<BudgetBilling />} />,
  },
  {
    path: '/social-media',
    element: <ProtectedLayout element={<SocialMedia />} />,
  },
  {
    path: '/reports',
    element: <ProtectedLayout element={<Reports />} />,
  },
  {
    path: '/settings',
    element: <ProtectedLayout element={<Settings />} />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
