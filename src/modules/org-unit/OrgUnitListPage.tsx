import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { orgUnitService, OrgUnitDto } from '../api/org-unit.service';

export const OrgUnitListPage: React.FC = () => {
  const [rows, setRows] = useState<OrgUnitDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await orgUnitService.list();
        setRows(data);
      } catch (error) {
        console.error(error);
        alert('No fue posible cargar las unidades organizacionales.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => {
    navigate(`/org-units/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/org-units/${id}/editar`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar esta unidad?')) return;
    try {
      await orgUnitService.remove(id);
      setRows((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error(error);
      alert('No fue posible eliminar la unidad.');
    }
  };

  const handleCreate = () => {
    navigate('/org-units/nuevo');
  };

  return (
    <AppLayout sectionTitle="Unidades organizacionales">
      <div className="page-header">
        <div>
          <h1>Unidades organizacionales</h1>
          <p className="page-subtitle">
            Estructura jerárquica institucional.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleCreate}>
            Nueva unidad
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
                  <th>Unidad padre</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>{u.code}</td>
                    <td>{u.name}</td>
                    <td>{u.parentName ?? '—'}</td>
                    <td>
                      <span className={u.isActive ? 'badge badge-success' : 'badge badge-danger'}>
                        {u.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="btn-table" onClick={() => handleView(u.id)}>
                        Ver
                      </button>
                      <button className="btn-table" onClick={() => handleEdit(u.id)}>
                        Editar
                      </button>
                      <button className="btn-table danger" onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No hay unidades registradas.
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
