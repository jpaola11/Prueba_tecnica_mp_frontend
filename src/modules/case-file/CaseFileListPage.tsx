import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { caseFileService, CaseFileDto } from '../../api/case-file.service';

export const CaseFileListPage: React.FC = () => {
  const [rows, setRows] = useState<CaseFileDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => navigate('/case-files/nuevo');

  const handleView = (id: number) => {
    navigate(`/case-files/${id}`); 
  };

  const handleEdit = (id: number) => {
    navigate(`/case-files/${id}/editar`); 
  };

  // Cargar expedientes al montar el componente
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await caseFileService.list(); // { items, total, ... }
        setRows(response.items ?? []);
      } catch (error) {
        console.error('Error cargando expedientes', error);
        alert('No fue posible cargar los expedientes.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Helper para mostrar fecha legible
  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  return (
    <AppLayout sectionTitle="Gestión de expedientes">
      <div className="page-header">
        <div>
          <h1>Gestión de expedientes</h1>
          <p className="page-subtitle">
            Consulta, asigna y actualiza el estado de los expedientes.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleCreate}>
            Nuevo expediente
          </button>
        </div>
      </div>

      <section className="card">
        <div className="card-header">
          <h3>Resultados</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Unidad</th>
                  <th>Estado</th>
                  <th>Fiscal asignado</th>
                  <th>Fecha apertura</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.code}</td>
                    <td>{r.title}</td>
                    <td>{r.orgUnitId ?? '—'}</td>
                    <td>{r.statusId ?? '—'}</td>
                    <td>{r.technicianId ?? '—'}</td>
                    <td>{formatDate(r.openDate)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-table"
                        onClick={() => handleView(r.id)}
                      >
                        Ver
                      </button>
                      <button
                        type="button"
                        className="btn-table"
                        onClick={() => handleEdit(r.id)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No hay expedientes para los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </AppLayout>
  );
};
