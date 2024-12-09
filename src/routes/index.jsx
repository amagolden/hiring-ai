import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Features from '../Features';
import HiringPlan from '../HiringPlan';
import ProtectedRoute from '../components/protectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Features />} />
        <Route path="/product" element={
          <ProtectedRoute>
            <HiringPlan />
          </ProtectedRoute>
        } />
    </Routes>
  );
};

export default AppRoutes;
