import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { userService, UserListResponse } from "../../api/user.service";

export const UserListPage: React.FC = () => {
  const [rows, setRows] = useState<UserListResponse>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await userService.list();
        setRows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => navigate(`/users/${id}`);
  const handleEdit = (id: number) => navigate(`/users/${id}/editar`);
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar este usuario?")) return;
    try {
      await userService.remove(id);
      setRows(prev => ({
        items: prev.items.filter(u => u.id !== id),
        total: prev.total - 1,
      }));
    } catch {
      alert("No fue posible eliminar el usuario.");
    }
  };

  const handleCreate = () => navigate("/users/nuevo");

  const handleSaveAll = () => {
    alert("Operación de guardar cambios masivos (pendiente).");
  };

  return (
    <AppLayout sectionTitle="Usuarios">
      <div className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p className="page-subtitle">Gestión de cuentas del sistema.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleSaveAll}>Guardar cambios</button>
          <button className="btn btn-primary" onClick={handleCreate}>Nuevo usuario</button>
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
                  <th>Nombre completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Unidad</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.length ? (
                  rows.items.map(u => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.roleId}</td>
                      <td>{u.orgUnitId || "—"}</td>
                      <td className="text-right">
                        <button className="btn-table" onClick={() => handleView(u.id)}>Ver</button>
                        <button className="btn-table" onClick={() => handleEdit(u.id)}>Editar</button>
                        <button className="btn-table danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center">No hay usuarios registrados.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
