import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { caseFileService, CaseFileDto } from '../../api/case-file.service';
import { caseReviewService } from '../../api/case-review.service';
import { useAuth } from '../auth/useAuth';

const APPROVED_STATUS_ID = 2;
const REJECTED_STATUS_ID = 3;

type StatusModalState =
  | { mode: null; caseFile: null }
  | { mode: 'approve' | 'reject'; caseFile: CaseFileDto };

const getStatusLabel = (statusId?: number | null) => {
  switch (statusId) {
    case 1:
      return 'En trámite';
    case 2:
      return 'Aprobado';
    case 3:
      return 'Rechazado';
    default:
      return '—';
  }
};

export const CaseFileListPage: React.FC = () => {
  const [rows, setRows] = useState<CaseFileDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState<StatusModalState>({
    mode: null,
    caseFile: null,
  });
  const [changingStatus, setChangingStatus] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = () => navigate('/case-files/nuevo');

  const handleView = (id: number) => {
    navigate(`/case-files/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/case-files/${id}/editar`);
  };

  const handleAddEvidence = (caseFile: CaseFileDto) => {
    if (caseFile.statusId !== 1) {
      alert('Solo se puede registrar evidencia cuando el expediente está en estado inicial.');
      return;
    }

    navigate(`/case-files/evidence?caseId=${caseFile.id}`);
  };

  const load = async () => {
    setLoading(true);
    try {
      const response = await caseFileService.list();
      setRows(response.items ?? []);
    } catch (error) {
      console.error('Error cargando expedientes', error);
      alert('No fue posible cargar los expedientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString();
  };

  const openApprove = (caseFile: CaseFileDto) => {
    setStatusModal({ mode: 'approve', caseFile });
    setReviewComments('');
    setReviewError(null);
  };

  const openReject = (caseFile: CaseFileDto) => {
    setStatusModal({ mode: 'reject', caseFile });
    setReviewComments('');
    setReviewError(null);
  };

  const closeStatusModal = () => {
    setStatusModal({ mode: null, caseFile: null });
    setReviewComments('');
    setReviewError(null);
  };

  const handleConfirmApprove = async () => {
    if (!statusModal.caseFile) return;
    setChangingStatus(true);
    try {
      await caseFileService.updatestatus(statusModal.caseFile.id, {
        statusId: APPROVED_STATUS_ID,
      });
      await load();
      closeStatusModal();
    } catch (error) {
      console.error(error);
      alert('No fue posible aprobar el expediente.');
    } finally {
      setChangingStatus(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!statusModal.caseFile) return;

    if (!reviewComments.trim()) {
      setReviewError('La justificación es obligatoria para rechazar.');
      return;
    }

    if (!user?.id) {
      alert('No se pudo identificar al usuario actual para registrar la revisión.');
      return;
    }

    setChangingStatus(true);
    try {
      await caseReviewService.create({
        caseId: statusModal.caseFile.id,
        comment: reviewComments.trim(),
        newStatusId: REJECTED_STATUS_ID,
        previousStatusId: 1,
        reviewerId: user.id,
      });

      await caseFileService.updatestatus(statusModal.caseFile.id, {
        statusId: REJECTED_STATUS_ID,
      });

      await load();
      closeStatusModal();
    } catch (error) {
      console.error(error);
      alert('No fue posible rechazar el expediente.');
    } finally {
      setChangingStatus(false);
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
          <button className="btn btn-primary" onClick={handleCreate}>
            Nuevo expediente
          </button>
        </div>
      </div>

      {statusModal.mode && statusModal.caseFile && (
        <section className="card mb-3">
          <div className="card-header">
            <h3>Cambio de estado del expediente</h3>
          </div>
          <div className="card-body">
            {statusModal.mode === 'approve' && (
              <>
                <p>
                  ¿Deseas aprobar el expediente{' '}
                  <strong>{statusModal.caseFile.code}</strong>?
                </p>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeStatusModal}
                    disabled={changingStatus}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConfirmApprove}
                    disabled={changingStatus}
                  >
                    {changingStatus ? 'Aprobando…' : 'Aprobar'}
                  </button>
                </div>
              </>
            )}

            {statusModal.mode === 'reject' && (
              <>
                <p>
                  ¿Deseas rechazar el expediente{' '}
                  <strong>{statusModal.caseFile.code}</strong>?
                </p>

                <div className="form-field mt-2">
                  <label htmlFor="rejectComments">Justificación del rechazo</label>
                  <textarea
                    id="rejectComments"
                    className={reviewError ? 'textarea error' : 'textarea'}
                    rows={3}
                    value={reviewComments}
                    onChange={(e) => {
                      setReviewComments(e.target.value);
                      setReviewError(null);
                    }}
                  />
                  {reviewError && (
                    <div className="error-bubble">{reviewError}</div>
                  )}
                </div>

                <div className="form-actions mt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeStatusModal}
                    disabled={changingStatus}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleConfirmReject}
                    disabled={changingStatus}
                  >
                    {changingStatus ? 'Rechazando…' : 'Rechazar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}

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
                {rows.map((r) => {
                  const isEnTramite = r.statusId === 1;
                  const isAprobadoORechazado =
                    r.statusId === APPROVED_STATUS_ID || r.statusId === REJECTED_STATUS_ID;

                  return (
                    <tr key={r.id}>
                      <td>{r.code}</td>
                      <td>{r.title}</td>
                      <td>{r.orgUnitId ?? '—'}</td>
                      <td>{getStatusLabel(r.statusId)}</td>
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

                        {isEnTramite && (
                          <>
                            <button
                              type="button"
                              className="btn-table"
                              onClick={() => handleEdit(r.id)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="btn-table"
                              onClick={() => handleAddEvidence(r)}
                              title="Agregar evidencia"
                              style={{ color: '#007bff' }}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              className="btn-table"
                              onClick={() => openApprove(r)}
                              title="Aprobar"
                              style={{ color: 'green' }}
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              className="btn-table"
                              onClick={() => openReject(r)}
                              title="Rechazar"
                              style={{ color: 'red' }}
                            >
                              ✕
                            </button>
                          </>
                        )}

                        {isAprobadoORechazado && null}
                      </td>
                    </tr>
                  );
                })}
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
