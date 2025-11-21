import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { orgUnitService, OrgUnitListResponse } from "../../api/org-unit.service";

export const OrgUnitListPage: React.FC = () => {
  const [rows, setRows] = useState<OrgUnitListResponse>({ items: [], total: 0 });
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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = (id: number) => navigate(`/org-unit/${id}`);
  const handleEdit = (id: number) => navigate(`/org-unit/${id}/editar`);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Deseas eliminar esta unidad?")) return;
    try {
      await orgUnitService.remove(id);
      setRows(prev => ({
        items: prev.items.filter(u => u.id !== id),
        total: prev.total - 1,
      }));
    } catch (error) {
      console.error(error);
      alert("No fue posible eliminar la unidad.");
    }
  };

  const handleCreate = () => navigate("/org-unit/nuevo");

  const handleSaveAll = () => {
    alert("Operación de guardar cambios masivos (pendiente).");
  };

  return (
    <AppLayout sectionTitle="Dependencias">
      <div className="page-header">
        <div>
          <h1>Dependencias</h1>
          <p className="page-subtitle">Estructura institucional del sistema.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={handleSaveAll}>Guardar cambios</button>
          <button className="btn btn-primary" onClick={handleCreate}>Nueva unidad</button>
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
                  <th>Padre</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.items.length ? (
                  rows.items.map(u => (
                    <tr key={u.id}>
                      <td>{u.code}</td>
                      <td>{u.name}</td>
                      <td>{u.parentId || "—"}</td>
                      <td className="text-right">
                        <button className="btn-table" onClick={() => handleView(u.id)}>Ver</button>
                        <button className="btn-table" onClick={() => handleEdit(u.id)}>Editar</button>
                        <button className="btn-table danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="text-center">No hay unidades registradas.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
