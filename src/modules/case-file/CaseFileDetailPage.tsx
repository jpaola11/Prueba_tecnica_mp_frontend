// src/pages/case-file/CaseFileDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { caseFileService, CaseFileDto } from '../../api/case-file.service';

export const CaseFileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [caseFile, setCaseFile] = useState<CaseFileDto | null>(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (iso?: string | null) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await caseFileService.findOne(Number(id));
        setCaseFile(data);
      } catch (error) {
        console.error('Error cargando detalle de expediente', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return (
    <AppLayout sectionTitle="Detalle de expediente">
      <div className="card">
        <div className="card-header">
          <h1>
            {caseFile
              ? `${caseFile.code} — ${caseFile.title}`
              : 'Expediente'}
          </h1>
          <p className="page-subtitle">
            Información detallada del expediente.
          </p>
        </div>

        <div className="card-body grid grid-2">
          {loading && <div>Cargando…</div>}

          {!loading && (
            <>
              <div>
                <h3>Código</h3>
                <p>{caseFile?.code ?? '—'}</p>
              </div>

              <div>
                <h3>Título</h3>
                <p>{caseFile?.title ?? '—'}</p>
              </div>

              <div className="grid-span-2">
                <h3>Descripción</h3>
                <p>{caseFile?.description || '—'}</p>
              </div>

              <div>
                <h3>Dependencia (ID)</h3>
                <p>{caseFile?.orgUnitId ?? '—'}</p>
              </div>

              <div>
                <h3>Estado (ID)</h3>
                <p>{caseFile?.statusId ?? '—'}</p>
              </div>

              <div>
                <h3>Fiscal asignado (ID)</h3>
                <p>{caseFile?.technicianId ?? '—'}</p>
              </div>

              <div>
                <h3>Fecha de apertura</h3>
                <p>{formatDate(caseFile?.openDate)}</p>
              </div>

              <div>
                <h3>Referencia externa</h3>
                <p>{caseFile?.referenceExternal || '—'}</p>
              </div>

              <div>
                <h3>Estado de registro</h3>
                <p>{caseFile?.isActive ? 'Activo' : 'Inactivo'}</p>
              </div>

              <div>
                <h3>Creado</h3>
                <p>{formatDate(caseFile?.createdAt)}</p>
              </div>

              <div>
                <h3>Última actualización</h3>
                <p>{caseFile?.updatedAt ? formatDate(caseFile.updatedAt) : '—'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
