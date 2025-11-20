import React, { useState } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import { reportsService, CaseStatusSummaryRow, ReportsFilter } from '../../api/reports.service';

export const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState<ReportsFilter>({});
  const [rows, setRows] = useState<CaseStatusSummaryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await reportsService.caseStatusSummary(filters);
      setRows(data);
    } catch (error) {
      console.error(error);
      alert('No fue posible generar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    alert('Exportar a Excel (pendiente de implementación).');
  };

  const handleExportPdf = () => {
    alert('Exportar a PDF (pendiente de implementación).');
  };

  return (
    <AppLayout sectionTitle="Reportería">
      <div className="page-header">
        <div>
          <h1>Reportería</h1>
          <p className="page-subtitle">
            Genera reportes consolidados de expedientes por rango de fechas, unidad y estado.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" type="button" onClick={handleExportExcel}>
            Exportar a Excel
          </button>
          <button className="btn btn-secondary" type="button" onClick={handleExportPdf}>
            Exportar a PDF
          </button>
        </div>
      </div>

      <section className="card filters-card">
        <div className="card-header">
          <h3>Filtros del reporte</h3>
        </div>
        <div className="card-body grid-4">
          <div className="form-field">
            <label htmlFor="orgUnitId">Unidad</label>
            <select
              id="orgUnitId"
              name="orgUnitId"
              className="input"
              value={filters.orgUnitId ?? ''}
              onChange={handleChange}
            >
              <option value="">Todas</option>
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
            <label htmlFor="fromDate">Desde</label>
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
            <label htmlFor="toDate">Hasta</label>
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
            <button className="btn btn-primary" type="button" onClick={handleGenerate}>
              Generar reporte
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h3>Resumen</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div>Cargando…</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Unidad</th>
                  <th>Abiertos</th>
                  <th>En trámite</th>
                  <th>Cerrados</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.orgUnitName}>
                    <td>{r.orgUnitName}</td>
                    <td>{r.open}</td>
                    <td>{r.inProgress}</td>
                    <td>{r.closed}</td>
                    <td>{r.total}</td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No hay información para los filtros seleccionados.
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
