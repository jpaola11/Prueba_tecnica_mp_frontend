import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import {
  caseStatusService,
  CaseStatusListResponse,
} from "../../api/case-status.service";

export const CaseStatusListPage: React.FC = () => {
  const [rows, setRows] = useState<CaseStatusListResponse>({
    items: [],
    total: 0,
  });
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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => navigate(`/case-status/${id}`);
  const handleEdit = (id: number) => navigate(`/case-status/${id}/editar`);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar este estado?")) return;

    try {
      await caseStatusService.remove(id);
      setRows((prev) => ({
        items: prev.items.filter((r) => r.id !== id),
        total: Math.max(prev.total - 1, 0),
      }));
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar el estado.");
    }
  };

  const handleCreate = () => navigate("/case-status/nuevo");

  const handleSaveAll = () => {
    alert("Operación de guardar cambios masivos (pendiente).");
  };

  return (
    <AppLayout sectionTitle="Estados de expediente">
      <div className="page-header">
        <div>
          <h1>Estados de expediente</h1>
          <p className="page-subtitle">
            Catálogo de estados del ciclo del expediente.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleSaveAll}>
            Guardar cambios
          </button>
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
                  <th>Descripción</th>
                  <th>Orden</th>
                  <th>Final</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.length ? (
                  rows.items.map((s) => (
                    <tr key={s.id}>
                      <td>{s.code}</td>
                      <td>{s.name}</td>
                      <td>{s.description || "—"}</td>
                      <td>{s.order ?? "—"}</td>
                      <td>{s.isFinal ? "Sí" : "No"}</td>
                      <td className="text-right">
                        <button
                          className="btn-table"
                          onClick={() => handleView(s.id)}
                        >
                          Ver
                        </button>
                        <button
                          className="btn-table"
                          onClick={() => handleEdit(s.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-table danger"
                          onClick={() => handleDelete(s.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
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
