import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { auditLogService, AuditLogListResponse } from "../../api/audit-log.service";

export const AuditLogListPage: React.FC = () => {
  const [rows, setRows] = useState<AuditLogListResponse>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await auditLogService.list();
        setRows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppLayout sectionTitle="Auditoría del sistema">
      <div className="page-header">
        <div>
          <h1>Registros de Auditoría</h1>
          <p className="page-subtitle">Histórico de acciones del sistema.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Módulo</th>
                  <th>Entidad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.length > 0 ? (
                  rows.items.map((log) => (
                    <tr key={log.id}>
                      <td>{log.userId}</td>
                      <td>{log.action}</td>
                      <td>{log.module}</td>
                      <td>{log.entityId || "—"}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No hay registros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
