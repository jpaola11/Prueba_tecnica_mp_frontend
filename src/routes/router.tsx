import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CaseListPage } from '../pages/CaseListPage';
import { CaseDetailPage } from '../pages/CaseDetailPage';
import { ReportsPage } from '../pages/ReportsPage';

export const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<DashboardPage />} />
    <Route path="/cases" element={<CaseListPage />} />
    <Route path="/cases/:id" element={<CaseDetailPage />} />
    <Route path="/reports" element={<ReportsPage />} />
  </Routes>
);
