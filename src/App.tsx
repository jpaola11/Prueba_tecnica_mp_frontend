import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './modules/auth/LoginPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { RoleListPage } from './modules/roles/RoleListPage';
import { RoleDetailPage } from './modules/roles/RoleDetailPage';
import { RoleFormPage } from './modules/roles/RoleFormPage';
import { CaseFileListPage } from './modules/case-file/CaseFileListPage';
import { ReportsPage } from './modules/reports/ReportsPage';
import { useAuth } from './modules/auth/useAuth';

const PrivateRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoutes>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/roles" element={<RoleListPage />} />
              <Route path="/roles/nuevo" element={<RoleFormPage />} />
              <Route path="/roles/:id" element={<RoleDetailPage />} />
              <Route path="/roles/:id/editar" element={<RoleFormPage />} />
              <Route path="/case-files" element={<CaseFileListPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};
