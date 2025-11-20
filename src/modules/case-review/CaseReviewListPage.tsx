import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { caseReviewService, CaseReviewListResponse } from "../../api/case-review.service";

export const CaseReviewListPage: React.FC = () => {
  const [rows, setRows] = useState<CaseReviewListResponse>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await caseReviewService.list();
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
    navigate(`/cases-review/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar esta revisión?")) return;
    try {
      await caseReviewService.remove(id);
      setRows((prev) => ({
        items: prev.items.filter((r) => r.id !== id),
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar la revisión.");
    }
  };

  return (
    <AppLayout sectionTitle="Revisiones de expedientes">
      <div className="page-header">
        <div>
          <h1>Revisiones</h1>
          <p className="page-subtitle">Historial de revisiones realizadas.</p>
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
                  <th>Expediente</th>
                  <th>Técnico</th>
                  <th>Estado</th>
                  <th>Comentario</th>
                  <th>Fecha</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.length > 0 ? (
                  rows.items.map((r) => (
                    <tr key={r.id}>
                      <td>{r.caseFileId}</td>
                      <td>{r.reviewerId}</td>
                      <td>{r.statusId}</td>
                      <td>{r.comments}</td>
                      <td>{new Date(r.createdAt).toLocaleString()}</td>
                      <td className="text-right">
                        <button className="btn-table" onClick={() => handleView(r.id)}>
                          Ver
                        </button>

                        <button className="btn-table danger" onClick={() => handleDelete(r.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No hay revisiones registradas.
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
