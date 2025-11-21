import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { evidenceService, EvidenceListResponse } from "../../api/evidence.service";

export const EvidenceListPage: React.FC = () => {
  const [rows, setRows] = useState<EvidenceListResponse>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await evidenceService.list();
        setRows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => navigate(`/evidence/${id}`);
  const handleEdit = (id: number) => navigate(`/evidence/${id}/editar`);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar esta evidencia?")) return;
    try {
      await evidenceService.remove(id);
      setRows(prev => ({
        items: prev.items.filter(e => e.id !== id),
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar la evidencia.");
    }
  };

  const handleCreate = () => navigate("/evidence/nuevo");

  const handleSaveAll = () => {
    alert("Operación de guardar cambios masivos (pendiente).");
  };

  return (
    <AppLayout sectionTitle="Evidencias">
      <div className="page-header">
        <div>
          <h1>Evidencias</h1>
          <p className="page-subtitle">Archivos y registros asociados a expedientes.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleSaveAll}>Guardar cambios</button>
          <button className="btn btn-primary" onClick={handleCreate}>Nueva evidencia</button>
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
                  <th>Nombre</th>
                  <th>Archivo</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.length ? (
                  rows.items.map(e => (
                    <tr key={e.id}>
                      <td>{e.caseId}</td>
                      <td>{e.description}</td>
                      <td>{e.fileUrl ? "Sí" : "No"}</td>
                      <td className="text-right">
                        <button className="btn-table" onClick={() => handleView(e.id)}>Ver</button>
                        <button className="btn-table" onClick={() => handleEdit(e.id)}>Editar</button>
                        <button className="btn-table danger" onClick={() => handleDelete(e.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="text-center">No hay evidencias registradas.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
