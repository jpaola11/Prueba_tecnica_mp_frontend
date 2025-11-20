import React, { useState } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import { caseFileService, CaseFileDto, CaseFileQuery } from '../../api/case-file.service';

export const CaseFileListPage: React.FC = () => {
  const [filters, setFilters] = useState<CaseFileQuery>({});
  const [rows, setRows] = useState<CaseFileDto[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleClear = () => {
    setFilters({});
    setRows([]);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await caseFileService.search(filters);
      setRows(data);
    } catch (error) {
      console.error(error);
      alert('No fue posible cargar los expedientes.');
    } finally {
      setLoading(false);
    }
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
          <button className="btn btn-primary">Nuevo expediente</button>
        </div>
      </div>

      <section className="card filters-card">
        <div className="card-header">
          <h3>Filtros</h3>
        </div>
        <div className="card-body grid-4">
          <div className="form-field">
            <label htmlFor="code">Código</label>
            <input
              id="code"
              name="code"
              className="input"
              value={filters.code ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="orgUnitId">Unidad</label>
            <select
              id="orgUnitId"
              name="orgUnitId"
              className="input"
              value={filters.orgUnitId ?? ''}
              onChange={handleChange}
            >
              <option value="">— Todas —</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              className="input"
              value={filters.status ?? ''}
              onChange={handleChange}
            >
              <option value="">Todos</option>
              <option value="OPEN">Abierto</option>
              <option value="IN_PROGRESS">En trámite</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="fromDate">Fecha de apertura (desde)</label>
            <input
              id="fromDate"
              name="fromDate"
              type="date"
              className="input"
              value={filters.fromDate ?? ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="toDate">Fecha de apertura (hasta)</label>
            <input
              id="toDate"
              name="toDate"
              type="date"
              className="input"
              value={filters.toDate ?? ''}
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
                    <td>{r.orgUnitName}</td>
                    <td>
                      <span className="badge badge-warning">{r.status}</span>
                    </td>
                    <td>{r.technicianName ?? '—'}</td>
                    <td>{r.openDate}</td>
                    <td>
                      <button className="btn-table">Ver</button>
                      <button className="btn-table">Editar</button>
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
