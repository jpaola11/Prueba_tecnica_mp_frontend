import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/useAuth';

type AppLayoutProps = {
  sectionTitle: string;
  children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = ({ sectionTitle, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const go = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
        <div className="sidebar-header">
          {!collapsed && <span className="app-name">MP Pao</span>}
          <button type="button" className="icon-button" onClick={toggleSidebar}>
            {collapsed ? '⮞' : '⮜'}
          </button>
        </div>
        <nav className="sidebar-menu">
          <button
            className={isActive('/dashboard') ? 'menu-item active' : 'menu-item'}
            onClick={() => go('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className={isActive('/roles') ? 'menu-item active' : 'menu-item'}
            onClick={() => go('/roles')}
          >
            Roles
          </button>
          <button
            className={isActive('/users') ? 'menu-item active' : 'menu-item'}
            onClick={() => go('/users')}
          >
            Usuarios
          </button>
          <button
            className={isActive('/org-unit') ? 'menu-item active' : 'menu-item'}
            onClick={() => go('/org-unit')}
          >
            Dependencia
          </button>
          <button
            className={isActive('/case-files') ? 'menu-item active' : 'menu-item'}
            onClick={() => go('/case-files')}
          >
            Gestión de expedientes
          </button>
          <button
            className={isActive('/reports') ? 'menu-item active' : 'menu-item'}
            onClick={() => go('/reports')}
          >
            Reportería
          </button>
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
          <div className="topbar-right">
            <div className="user-summary">
              <div className="user-info">
                <span className="user-name">{user?.name ?? 'Usuario'}</span>
                <span className="user-role">{user?.role ?? '—'}</span>
              </div>
              <button className="btn-ghost" type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};
