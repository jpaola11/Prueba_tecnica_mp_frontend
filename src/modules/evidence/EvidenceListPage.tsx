import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { evidenceService, EvidenceDto, EvidenceQueryDto } from '../api/evidence.service';

export const EvidenceListPage: React.FC = () => {
  const [filters, setFilters] = useState<EvidenceQueryDto>({});
  const [rows, setRows] = useState<EvidenceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await evidenceService.list(filters);
      setRows(data);
    } catch (error) {
      console.error(error);
      alert('No fue posible cargar la evidencia.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({});
    setRows([]);
  };

  const handleView = (id: number) => {
    navigate(`/evidence/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/evidence/${id}/editar`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar esta evidencia?')) return;
    try {
      await evidenceService.remove(id);
      setRows((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error(error);
      alert('No fue posible eliminar la evidencia.');
    }
  };

  const handleCreate = () => {
    navigate('/evidence/nuevo');
  };

  return (
    <AppLayout sectionTitle="Evidencia">
      <div className="page-header">
        <div>
          <h1>Evidencia</h1>
          <p className="page-subtitle">
            Gestión de evidencia asociada a expedientes.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleCreate}>
            Nueva evidencia
          </button>
        </div>
      </div>

      <section className="card filters-card">
        <div className="card-header">
          <h3>Filtros</h3>
        </div>
        <div className="card-body grid-4">
          <div className="form-field">
            <label htmlFor="caseCode">Código de expediente</label>
            <input
              id="caseCode"
              name="caseCode"
              className="input"
              value={filters.caseCode ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="type">Tipo de evidencia</label>
            <input
              id="type"
              name="type"
              className="input"
              value={filters.type ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="filter-actions grid-span-4">
            <button className="btn btn-secondary" type="button" onClick={handleClear}>
              Limpiar
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSearch}>
              Buscar
            </button>
          </div>
        </div>
      </section>

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
                  <th>Código expediente</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Ubicación</th>
                  <th>Fecha registro</th>
                  <th>Archivo</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td>{e.caseCode}</td>
                    <td>{e.type}</td>
                    <td>{e.description ?? '—'}</td>
                    <td>{e.location ?? '—'}</td>
                    <td>{e.registeredAt}</td>
                    <td>
                      {e.fileUrl ? (
                        <a href={e.fileUrl} target="_blank" rel="noreferrer">
                          Ver archivo
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-right">
                      <button className="btn-table" onClick={() => handleView(e.id)}>
                        Ver
                      </button>
                      <button className="btn-table" onClick={() => handleEdit(e.id)}>
                        Editar
                      </button>
                      <button className="btn-table danger" onClick={() => handleDelete(e.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No hay evidencia para los filtros seleccionados.
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
