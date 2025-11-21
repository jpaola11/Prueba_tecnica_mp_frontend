import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { userRoleService, UserRoleListResponse } from "../../api/user-role.service";

export const UserRoleListPage: React.FC = () => {
  const [rows, setRows] = useState<UserRoleListResponse>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await userRoleService.list();
        setRows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => navigate(`/user-role/${id}`);
  const handleEdit = (id: number) => navigate(`/user-role/${id}/editar`);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar esta asignación de rol?")) return;
    try {
      await userRoleService.remove(id);
      setRows(prev => ({
        items: prev.items.filter(r => r.id !== id),
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar la asignación.");
    }
  };

  const handleCreate = () => navigate("/user-role/nuevo");

  const handleSaveAll = () => {
    alert("Operación de guardar cambios masivos (pendiente).");
  };

  return (
    <AppLayout sectionTitle="Asignación de Roles">
      <div className="page-header">
        <div>
          <h1>Asignaciones de Roles</h1>
          <p className="page-subtitle">Roles asignados a usuarios del sistema.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleSaveAll}>Guardar cambios</button>
          <button className="btn btn-primary" onClick={handleCreate}>Nueva asignación</button>
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
                  <th>Rol</th>
                  <th>Fecha asignación</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.length ? (
                  rows.items.map(r => (
                    <tr key={r.id}>
                      <td>{r.userId}</td>
                      <td>{r.roleId}</td>
                      <td>{new Date(r.assignedAt).toLocaleString()}</td>
                      <td className="text-right">
                        <button className="btn-table" onClick={() => handleView(r.id)}>Ver</button>
                        <button className="btn-table" onClick={() => handleEdit(r.id)}>Editar</button>
                        <button className="btn-table danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="text-center">No hay asignaciones registradas.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
