import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './modules/auth/LoginPage';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { RoleListPage } from './modules/roles/RoleListPage';
import { RoleDetailPage } from './modules/roles/RoleDetailPage';
import { RoleFormPage } from './modules/roles/RoleFormPage';
import { UserListPage } from './modules/users/UserListPage';
import { UserDetailPage } from './modules/users/UserDetailPage';
import { UserFormPage } from './modules/users/UserFormPage';
import { OrgUnitListPage } from './modules/org-unit/OrgUnitListPage';
import { OrgUnitDetailPage } from './modules/org-unit/OrgUnitDetailPage';
import { OrgUnitFormPage } from './modules/org-unit/OrgUnitFormPage';
import { EvidenceListPage } from './modules/evidence/EvidenceListPage';
import { EvidenceDetailPage } from './modules/evidence/EvidenceDetailPage';
import { EvidenceFormPage } from './modules/evidence/EvidenceFormPage';
import { CaseFileListPage } from './modules/case-file/CaseFileListPage';
import { CaseFileFormPage } from './modules/case-file/CaseFileFormPage';
import { CaseFileDetailPage } from './modules/case-file/CaseFileDetailPage';
import { CaseStatusListPage } from './modules/case-status/CaseStatusListPage';
import { CaseStatusFormPage } from './modules/case-status/CaseStatusFormPage';
import { CaseStatusDetailPage } from './modules/case-status/CaseStatusDetailPage';
import { CaseFileEvidenceFormPage } from './modules/case-file/EvidenceFormPage';

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
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/nuevo" element={<UserFormPage />} />
              <Route path="/users/:id" element={<UserDetailPage />} />
              <Route path="/users/:id/editar" element={<UserFormPage />} />
              <Route path="/org-unit" element={<OrgUnitListPage />} />
              <Route path="/org-unit/nuevo" element={<OrgUnitFormPage />} />
              <Route path="/org-unit/:id" element={<OrgUnitDetailPage />} />
              <Route path="/org-unit/:id/editar" element={<OrgUnitFormPage />} />
              <Route path="/evidence" element={<EvidenceListPage />} />
              <Route path="/evidence/nuevo" element={<EvidenceFormPage />} />
              <Route path="/evidence/:id" element={<EvidenceDetailPage />} />
              <Route path="/evidence/:id/editar" element={<EvidenceFormPage />} />
              <Route path="/case-files" element={<CaseFileListPage />} />
              <Route path="/case-files/nuevo" element={<CaseFileFormPage />} />
              <Route path="/case-files/:id/editar" element={<CaseFileFormPage />} />
              <Route path="/case-files/:id" element={<CaseFileDetailPage />} />
              <Route path="/case-status" element={<CaseStatusListPage />} />
              <Route path="/case-status/nuevo" element={<CaseStatusFormPage />} />
              <Route path="/case-status/:id/editar" element={<CaseStatusFormPage />} />
              <Route path="/case-status/:id" element={<CaseStatusDetailPage />} />

              <Route path="/case-files/evidence" element={<CaseFileEvidenceFormPage />} />


              
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};
