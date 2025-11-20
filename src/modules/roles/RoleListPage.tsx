import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { roleService, RoleDto } from '../../api/role.service';

export const RoleListPage: React.FC = () => {
  const [rows, setRows] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await roleService.list();
        setRows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => {
    navigate(`/roles/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/roles/${id}/editar`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar este rol?')) return;
    try {
      await roleService.remove(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert('No fue posible eliminar el rol.');
    }
  };

  const handleCreate = () => {
    navigate('/roles/nuevo');
  };

  const handleSaveAll = async () => {
    // Stub para futuras operaciones masivas
    alert('Operación de guardar cambios masivos (pendiente de implementación).');
  };

  return (
    <AppLayout sectionTitle="Roles">
      <div className="page-header">
        <div>
          <h1>Roles</h1>
          <p className="page-subtitle">Administración de roles y permisos del sistema.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleSaveAll}>
            Guardar cambios
          </button>
          <button className="btn btn-primary" onClick={handleCreate}>
            Nuevo rol
          </button>
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
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.code}</td>
                    <td>{r.name}</td>
                    <td>{r.description || '—'}</td>
                    <td className="text-right">
                      <button className="btn-table" onClick={() => handleView(r.id)}>
                        Ver
                      </button>
                      <button className="btn-table" onClick={() => handleEdit(r.id)}>
                        Editar
                      </button>
                      <button className="btn-table danger" onClick={() => handleDelete(r.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No hay roles registrados.
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
