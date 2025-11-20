import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { caseStatusService, CaseStatusDto } from '../api/case-status.service';

export const CaseStatusListPage: React.FC = () => {
  const [rows, setRows] = useState<CaseStatusDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await caseStatusService.list();
        setRows(data);
      } catch (error) {
        console.error(error);
        alert('No fue posible cargar los estados de caso.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => {
    navigate(`/case-status/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/case-status/${id}/editar`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar este estado de caso?')) return;
    try {
      await caseStatusService.remove(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert('No fue posible eliminar el estado de caso.');
    }
  };

  const handleCreate = () => {
    navigate('/case-status/nuevo');
  };

  return (
    <AppLayout sectionTitle="Estados de caso">
      <div className="page-header">
        <div>
          <h1>Estados de caso</h1>
          <p className="page-subtitle">
            Catálogo de estados posibles para los expedientes.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleCreate}>
            Nuevo estado
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
                  <th>Final</th>
                  <th>Predeterminado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.code}</td>
                    <td>{r.name}</td>
                    <td>{r.isFinal ? 'Sí' : 'No'}</td>
                    <td>{r.isDefault ? 'Sí' : 'No'}</td>
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
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No hay estados registrados.
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
