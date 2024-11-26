import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Features from '../Features';
import HiringPlan from '../HiringPlan';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Features />} />
        <Route path="/product" element={<HiringPlan />} />
    </Routes>
  );
};

export default AppRoutes;
