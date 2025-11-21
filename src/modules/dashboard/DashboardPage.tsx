import React from 'react';
import { AppLayout } from '../../layout/AppLayout';

export const DashboardPage: React.FC = () => {
  return (
    <AppLayout sectionTitle="Dashboard">
      <div className="grid dashboard-grid">
        <section className="grid grid-3">
          <div className="metric-card">
            <h3>Expedientes abiertos</h3>
            <p className="metric-value">128</p>
            <span className="metric-subtitle">En las últimas 24 horas</span>
          </div>
          <div className="metric-card">
            <h3>En trámite</h3>
            <p className="metric-value">342</p>
            <span className="metric-subtitle">Con plazos activos</span>
          </div>
          <div className="metric-card">
            <h3>Cerrados este mes</h3>
            <p className="metric-value">57</p>
            <span className="metric-subtitle">Incluye archivos definitivos</span>
          </div>
        </section>

        <section className="card full-width">
          <div className="card-header">
            <h3>Últimos expedientes creados</h3>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Unidad</th>
                  <th>Estado</th>
                  <th>Fecha apertura</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>EXP-2025-00123</td>
                  <td>Lesiones culposas</td>
                  <td>Fiscalía Metropolitana</td>
                  <td>
                    <span className="badge badge-warning">En trámite</span>
                  </td>
                  <td>20/11/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
